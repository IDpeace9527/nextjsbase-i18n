"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Google登录按钮组件
 * 点击后弹出Google登录弹窗
 */
export function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const popupRef = useRef<Window | null>(null);
  const checkPopupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 检查用户会话状态
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.user) {
            setIsLoggedIn(true);
            setUser(data.user);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('获取会话失败:', error);
      }
    };
    
    checkSession();
    
    // 监听授权成功事件
    const handleAuthSuccess = () => {
      checkSession();
    };
    
    window.addEventListener('auth-success', handleAuthSuccess);
    
    return () => {
      window.removeEventListener('auth-success', handleAuthSuccess);
    };
  }, []);

  // 在组件加载时检查 URL 参数，判断是否是从授权回调返回
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    
    if (authSuccess === 'true') {
      // 清除 URL 参数
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // 检查会话状态
      fetch('/api/auth/session')
        .then(response => response.json())
        .then(data => {
          setIsLoading(false);
          if (data.user) {
            setIsLoggedIn(true);
            setUser(data.user);
            // 触发授权成功事件
            window.dispatchEvent(new Event('auth-success'));
          }
        })
        .catch(error => {
          setIsLoading(false);
          console.error('获取会话失败:', error);
        });
    }
  }, []);
  
  // 处理登录点击事件
  const handleGoogleLogin = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // 使用重定向方式而不是弹窗
    // 构建Google OAuth URL
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/google`);
    const scope = encodeURIComponent("openid email profile");
    const responseType = "code";
    const accessType = "offline";
    const prompt = "consent";
    const state = encodeURIComponent(window.location.pathname); // 保存当前路径，以便登录后返回
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=${accessType}&prompt=${prompt}&state=${state}`;
    
    // 直接跳转到 Google 授权页面
    window.location.href = googleAuthUrl;
  };
  
  // 处理登出
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 根据登录状态显示不同的内容
  if (isLoggedIn && user) {
    return (
      <div className="flex items-center gap-2">
        {user.image && (
          <img 
            src={user.image} 
            alt={user.name || "用户头像"} 
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user.name}</span>
          <button 
            onClick={handleLogout}
            disabled={isLoading}
            className="text-xs text-blue-500 hover:underline"
          >
            {isLoading ? "退出中..." : "退出登录"}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {/* Google 图标 */}
      <svg viewBox="0 0 24 24" width="16" height="16" className="w-5 h-5">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {isLoading ? "登录中..." : "使用Google登录"}
    </button>
  );
}
