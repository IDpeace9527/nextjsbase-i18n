import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import Image from 'next/image';

type Props = {
  params: {locale: string};
};

export default function IndexPage({params: {locale}}: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  // 获取翻译对象
  const t = useTranslations('Home');
  // 确保 readme 对象存在
  const readme = t.raw('readme') as any;

  return (
    <main className="min-h-screen bg-white p-4 sm:p-8"> {/* 调整间距 */}
      <div className="max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md font-mono text-sm text-gray-800">
        {/* 一、Demo演示地址 */}
        <h2 className="text-xl font-bold mb-4">{readme.title1}</h2>
        <p className="mb-4">
          <a 
            href={readme.demoUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline"
          >
            {readme.demoLink}
          </a>
        </p>
        
        {/* 自己部署 */}
        <h3 className="text-lg font-bold mb-2">{readme.deployTitle}</h3>
        
        <p className="mb-6">
          <a 
            href={readme.deployButtonUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="https://vercel.com/button" 
              alt="Deploy with Vercel" 
              className="inline-block max-w-full h-auto my-2 border rounded"
            />
          </a>
        </p>
        
        {/* 二、功能包含 */}
        <h2 className="text-xl font-bold mb-4">{readme.title2}</h2>
        <ol className="list-decimal pl-6 mb-6">
          {readme.features.map((feature: string, index: number) => (
            <li key={index} className="mb-1">{feature}</li>
          ))}
        </ol>
        
        {/* 三、好处 */}
        <h2 className="text-xl font-bold mb-4">{readme.title3}</h2>
        <ol className="list-decimal pl-6 mb-6">
          {readme.benefits.map((benefit: string, index: number) => (
            <li key={index} className="mb-1">{benefit}</li>
          ))}
        </ol>
        
        {/* 四、使用方式 */}
        <h2 className="text-xl font-bold mb-4">{readme.title4}</h2>
        <ol className="list-decimal pl-6 mb-6">
          {readme.usage.map((usage: string, index: number) => (
            <li key={index} className="mb-1">{
              usage.includes('site.ts') || usage.includes('sitemap.xml') ? (
                <>
                  {usage.split(/\b(src\\config\\site\.ts|public|sitemap\.xml)\b/).map((part, i) => {
                    if (part === 'src\\config\\site.ts' || part === 'sitemap.xml') {
                      return <code key={i} className="bg-gray-200 px-1 rounded">{part}</code>;
                    } else if (part === 'public') {
                      return <code key={i} className="bg-gray-200 px-1 rounded">{part}</code>;
                    }
                    return part;
                  })}
                </>
              ) : usage
            }</li>
          ))}
        </ol>
        
        {/* 翻译文件使用说明 */}
        <div className="mb-6">
          <p className="mb-2">{readme.translationStep1}</p>
          <pre className="bg-gray-200 p-2 rounded mb-1 overflow-x-auto">
            <code>{readme.translationCode1}</code>
          </pre>
          <p className="text-sm text-gray-600 mb-4">{readme.translationNote1}</p>
          
          <p className="mb-2">{readme.translationStep2}</p>
          <pre className="bg-gray-200 p-2 rounded mb-1 overflow-x-auto">
            <code>{readme.translationCode2}</code>
          </pre>
          <p className="text-sm text-gray-600 mb-4">{readme.translationNote2}</p>
        </div>
        
        {/* 五、赞赏或者交个朋友 */}
        <h2 className="text-xl font-bold mb-4">{readme.title5}</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <img 
            src={readme.donationImage} 
            alt="Donation QR" 
            className="w-[300px] max-w-full h-auto my-2 border rounded" 
          />
          <img 
            src={readme.wechatImage} 
            alt="WeChat QR" 
            className="w-[300px] max-w-full h-auto my-2 border rounded" 
          />
        </div>
        
        {/* 六、特别感谢 */}
        <h2 className="text-xl font-bold mb-4">{readme.title6}</h2>
        <p className="mb-4">
          {readme.thanksText.replace('[哥飞]', '')}
          <span className="text-blue-600">[哥飞]</span>
          {readme.thanksText.split('[哥飞]')[1]}
        </p>
      </div>
    </main>
  );
}
