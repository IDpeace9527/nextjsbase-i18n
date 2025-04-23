import {redirect} from 'next/navigation';
import { siteConfig } from '@/config/site';

// 此页面仅在应用静态构建时渲染 (output: 'export')
export default function RootPage() {
  // 使用配置中的默认语言
  const defaultPath = siteConfig.i18n.enabled === 1 
    ? `/${siteConfig.i18n.defaultLocale}` 
    : '/';
  
  redirect(defaultPath);
}
