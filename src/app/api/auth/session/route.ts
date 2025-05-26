import { NextRequest, NextResponse } from 'next/server';

/**
 * 获取用户会话信息
 */
export async function GET(request: NextRequest) {
  try {
    // 从 Cookie 中获取会话信息
    const sessionCookie = request.cookies.get('user-session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }
    
    // 解析会话信息
    const sessionData = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());
    
    // 检查会话是否过期
    if (new Date(sessionData.expires) < new Date()) {
      // 会话已过期，返回空用户
      const response = NextResponse.json({ user: null });
      
      // 清除过期的会话 Cookie
      response.cookies.set({
        name: 'user-session',
        value: '',
        expires: new Date(0),
        path: '/'
      });
      
      return response;
    }
    
    // 返回用户信息
    return NextResponse.json({ user: sessionData.user });
  } catch (error) {
    console.error('获取会话信息失败:', error);
    return NextResponse.json({ user: null });
  }
}
