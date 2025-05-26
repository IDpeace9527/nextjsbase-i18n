import { NextRequest, NextResponse } from 'next/server';

/**
 * 处理用户登出
 */
export async function POST(request: NextRequest) {
  try {
    // 创建响应对象
    const response = NextResponse.json({ success: true });
    
    // 清除会话 Cookie
    response.cookies.set({
      name: 'user-session',
      value: '',
      expires: new Date(0),
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('登出处理失败:', error);
    return NextResponse.json(
      { error: '登出处理失败' },
      { status: 500 }
    );
  }
}
