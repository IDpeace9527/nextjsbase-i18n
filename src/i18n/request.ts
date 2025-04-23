import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import { siteConfig } from '@/config/site';

export default getRequestConfig(async ({requestLocale}) => {
  // 检查多语言是否启用
  const isI18nEnabled = siteConfig.i18n.enabled === 1;
  
  // 确定使用的语言
  let locale = isI18nEnabled ? await requestLocale : siteConfig.i18n.defaultLocale;

  // 确保传入的 `locale` 是有效的
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // 加载通用翻译文件
  const common = (await import(`../../messages/${locale}/common.json`)).default;

  return {
    locale,
    messages: {
      Home: (await import(`../../messages/${locale}/home.json`)).default, 
      Demo: (await import(`../../messages/${locale}/demo.json`)).default,
      ...common
    }
  };
});
