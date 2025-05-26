import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // 导入 Supabase 客户端
import { v4 as uuidv4 } from 'uuid'; // 导入 UUID 生成器

/**
 * 处理 Google 授权回调
 * 接收授权码并交换访问令牌
 */
export async function GET(request: NextRequest) {
  try {
    // 从 URL 中获取授权码
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json(
        { error: '未提供授权码' },
        { status: 400 }
      );
    }
    
    // 交换访问令牌
    const tokenResponse = await exchangeCodeForToken(code);
    
    if (!tokenResponse.access_token) {
      return NextResponse.json(
        { error: '获取访问令牌失败' },
        { status: 400 }
      );
    }
    
    // 获取用户信息
    const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);
    
    // 创建或更新用户到 Supabase
    // saveUserToDatabase 现在会返回包含所有数据库列的用户对象，包括 internal_app_id
    // 或者在出错时抛出异常
    const dbUser = await saveUserToDatabase(userInfo);

    // 为了保持会话结构与之前类似，我们从 dbUser 中提取信息
    // 注意：您的 users 表中没有直接的 'id' 字段对应 Google 的 'id' (sub)，而是 'google_id'
    // 您的 users 表主键是 'id' (BIGSERIAL)，这里我们用 dbUser.internal_app_id 作为应用内的唯一标识符
    // 或者，如果会话中需要的是 Supabase 的自增 ID，可以用 dbUser.id
    const userForSession = {
      id: dbUser.internal_app_id, // 使用 internal_app_id 作为会话中的用户标识符
      // id: dbUser.id, // 或者使用 Supabase 的自增 ID
      name: dbUser.full_name,
      email: dbUser.email,
      image: dbUser.profile_picture_url
    };
    
    // 创建会话
    const session = {
      user: userForSession, // 使用从数据库获取并格式化后的用户信息
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7天后过期
    };
    
    // 设置会话 Cookie
    const sessionCookie = Buffer.from(JSON.stringify(session)).toString('base64');
    
    // 从 URL 中获取状态参数（原始页面路径）
    const state = searchParams.get('state') || '/';
    
    // 构建重定向 URL，将会话信息作为查询参数
    const redirectUrl = new URL(state, request.nextUrl.origin);
    redirectUrl.searchParams.set('auth_success', 'true');
    
    // 返回重定向响应，并设置会话 Cookie
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set({
      name: 'user-session',
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7天
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Google 授权回调处理错误:', error);
    return NextResponse.json(
      { error: '处理授权回调时出错' },
      { status: 500 }
    );
  }
}

/**
 * 交换授权码获取访问令牌
 */
async function exchangeCodeForToken(code: string) {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  // 使用当前请求的源域名构建重定向 URI，而不是使用环境变量
  const redirectUri = `${process.env.NODE_ENV === 'production' ? 'https://buzzcut.page' : 'http://localhost:3000'}/api/auth/callback/google`;
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  
  return await response.json();
}

/**
 * 获取 Google 用户信息
 */
async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  return await response.json();
}

/**
 * 将用户信息保存到数据库（模拟）
 * 后续可以替换为实际的数据库操作
 */
async function saveUserToDatabase(googleUserInfo: any) {
  console.log('Raw googleUserInfo received:', JSON.stringify(googleUserInfo, null, 2)); // 打印原始用户信息
  const { id: google_id, email, name: full_name, picture: profile_picture_url, verified_email } = googleUserInfo; // 使用 Google 返回的 verified_email
  const email_verified = verified_email; // 将其赋值给 email_verified 变量以兼容后续逻辑

  if (!google_id) {
    throw new Error('Google User ID (sub) is missing from userInfo');
  }

  try {
    // 1. 尝试根据 google_id 查询用户
    let { data: existingUser, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('google_id', google_id)
      .single();

    if (queryError && queryError.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine for new users
      console.error('Supabase query user error:', queryError);
      throw new Error(`Error querying user: ${queryError.message}`);
    }

    const now = new Date().toISOString();

    if (existingUser) {
      // 2. 用户已存在，更新信息
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          full_name: full_name || existingUser.full_name, // 如果 Google 未提供，则保留旧值
          profile_picture_url: profile_picture_url || existingUser.profile_picture_url,
          email: email || existingUser.email, // 通常 email 不会变，但以防万一
          email_verified: email_verified !== undefined ? email_verified : existingUser.email_verified,
          last_login_at: now,
        })
        .eq('google_id', google_id)
        .select()
        .single();

      if (updateError) {
        console.error('Supabase update user error:', updateError);
        throw new Error(`Error updating user: ${updateError.message}`);
      }
      console.log('用户信息已更新:', updatedUser);
      return updatedUser; // 返回更新后的用户信息 (包含所有列)
    } else {
      // 3. 用户不存在，插入新用户
      const internal_app_id = uuidv4();
      const newUserPayload = {
        internal_app_id,
        google_id,
        email,
        email_verified: email_verified !== undefined ? email_verified : false, // 默认为 false 如果 Google 未提供
        full_name,
        profile_picture_url,
        created_at: now,
        last_login_at: now,
      };

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert(newUserPayload)
        .select()
        .single();

      if (insertError) {
        console.error('Supabase insert user error:', insertError);
        throw new Error(`Error inserting new user: ${insertError.message}`);
      }
      console.log('新用户已创建:', newUser);
      return newUser; // 返回新创建的用户信息 (包含所有列)
    }
  } catch (error) {
    console.error('Error in saveUserToDatabase:', error);
    // 根据您的错误处理策略，可以决定是向上抛出错误，还是返回一个错误对象或 null
    // 为了让 GET 函数中的 try...catch 捕获，这里向上抛出
    throw error;
  }
}
