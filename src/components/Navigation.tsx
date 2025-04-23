import {useTranslations} from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';
import NavigationLink from './NavigationLink';
import { siteConfig } from '@/config/site';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const isI18nEnabled = siteConfig.i18n.enabled === 1;

  return (
    <div className="bg-primary">
      <nav className="container flex justify-between p-2 text-black">
        <div className="flex space-x-4">
          <NavigationLink href="/">{t('home')}</NavigationLink>
          <NavigationLink href="/demo">{t('demo')}</NavigationLink>
        </div>
        {isI18nEnabled && <LocaleSwitcher />}
      </nav>
    </div>
  );
}
