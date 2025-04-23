/**
 * 网站配置文件
 * 集中管理网站的各种配置参数
 */

export const siteConfig = {
  // 网站基本信息
  url: "https://example.com", // 替换为您的实际网站URL
  domain: "example.com", // 网站域名，用于页脚显示 ->Copyright © 2025 example.com
  
  // SEO相关
  canonical: "https://example.com", // 规范URL
  
  // 分析工具
  analytics: {
    googleAnalyticsId: "G-SB1234567" // Google Analytics ID
  },

  // 多语言设置
  i18n: {
    enabled: 1, // 0: 关闭多语言, 1: 启用多语言
    defaultLocale: "en", // 默认语言
    locales: ["zh", "en"] // 支持的语言列表
  }
};
