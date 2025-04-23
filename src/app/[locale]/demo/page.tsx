import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';

type Props = {
  params: {locale: string};
};

export default function DemoPage({params: {locale}}: Props) {
  // Enable static rendering
  setRequestLocale(locale);
  
  // 获取翻译文本
  const t = useTranslations('Demo');

  return (
    <main className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md font-mono text-sm text-gray-800">
        <h1 className="text-xl font-bold mb-4">{t('content')}</h1>
      </div>
    </main>
  );
}
