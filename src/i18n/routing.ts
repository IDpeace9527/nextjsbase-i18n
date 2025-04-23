import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';
import { siteConfig } from '@/config/site';

// 根据配置决定是否启用多语言
const isI18nEnabled = siteConfig.i18n.enabled === 1;
const locales = isI18nEnabled ? siteConfig.i18n.locales : [siteConfig.i18n.defaultLocale];
const defaultLocale = siteConfig.i18n.defaultLocale;

export const routing = defineRouting({
  locales: locales,
  defaultLocale: defaultLocale,
  // 禁用自动语言检测
  localeDetection: false,
  // 设置路径匹配规则
  localePrefix: isI18nEnabled ? 'as-needed' : 'never'
});

export type Locale = (typeof routing.locales)[number];

export const {Link, getPathname, redirect, usePathname, useRouter} =
  createNavigation(routing);
