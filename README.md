2025-05-27 项目更新 Google Auth 登录和 Supabase数据库连接，并将Google授权信息存储到数据库中
----

# 一、Demo演示地址

[Demo](https://nextjsbase-i18n.vercel.app/)

## 自己部署

自己部署到 [Vercel](https://vercel.com)上

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/IDpeace9527/nextjsbase-i18n)


# 二、功能包含：

1、NextJS项目一键部署到vercel使用<br>
2、多语言框架（用的是NextJS自带的多语言框架）<br>
3、多语言框架翻译文件可以分成多个文件，方便管理并且加载性能更好<br>
3、Google-Analytics 配置ID即可使用<br>
4、canonical 一键配置即可使用<br>
5、网站Title一键配置
6、Google Auth 登录
7、Supabase数据库支持


# 三、好处： 
1、减少NextJS多语言学习成本、框架调研成本，开箱即用<br>
2、节省安装基础包和一些配置的时间。<br>


# 四、使用方式： 
1、在 src\config\site.ts 中修改好相关配置<br>
2、在 public 目录下，修改网站图标和 sitemap.xml 文件<br>
3、添加新的翻译文件。
<1>、在messages里写好对应的翻译文件后，在src\i18n\request.ts文件里添加：<br>
Demo: (await import(../../messages/${locale}/demo.json)).default,<br>
添加新的翻译文件<br>
<2>、然后在对应页面（一般是page.tsx）加入<br>
const t = useTranslations('Home');<br>
获取翻译对象

# 五、赞赏或者交个朋友
<div style="display: flex; gap: 10px;">
  <img src="https://raw.githubusercontent.com/IDpeace9527/nextjsbase-i18n/main/public/images/xuejuzanshang.jpg" width="300" alt="WeChat" />
  <img src="https://raw.githubusercontent.com/IDpeace9527/nextjsbase-i18n/main/public/images/xuejuweixin.jpg" width="300" alt="WeChat" />
</div>

# 六、特别感谢
感谢哥飞教我Google SEO,微信搜索框输入[哥飞],即可找到相关微信公众号，微信公众号里面有大量 Google SEO 干货，值得关注<br>
