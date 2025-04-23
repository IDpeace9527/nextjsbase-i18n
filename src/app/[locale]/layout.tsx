import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ReactNode} from 'react';
import BaseLayout from '@/components/BaseLayout';
import {routing} from '@/i18n/routing';
import { GoogleAnalytics } from '@next/third-parties/google';
import { siteConfig } from '@/config/site';

type Props = {
  children: ReactNode;
  params: {locale: string};
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params: {locale}
}: Omit<Props, 'children'>) {
  const t = await getTranslations({locale, namespace: 'Home'});

  return {
    title: t('title'),
    description: t('description'), // 使用翻译字段
    alternates: {
      canonical: siteConfig.canonical
    },
    icons: {
      icon: "/favicon.ico",       // 标准 favicon 图标
      shortcut: "/favicon.ico",   // 快捷图标
      // 如果需要不同尺寸或类型的图标，还可以额外配置：
      // apple: "/apple-touch-icon.png",
    }
  };
}

export default async function LocaleLayout({
  children,
  params: {locale}
}: Props) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return <BaseLayout locale={locale}>{children}<GoogleAnalytics gaId={siteConfig.analytics.googleAnalyticsId} /></BaseLayout>;
}
