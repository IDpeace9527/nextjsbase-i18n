import {useLocale, useTranslations} from 'next-intl';
import {routing} from '@/i18n/routing';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import { siteConfig } from '@/config/site';

export default function LocaleSwitcher() {
  // 检查多语言是否启用
  const isI18nEnabled = siteConfig.i18n.enabled === 1;
  
  // 如果多语言未启用，则不渲染任何内容
  if (!isI18nEnabled) return null;
  
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
      {routing.locales.map((cur) => (
        <option key={cur} value={cur}>
          {t('locale', {locale: cur})}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
