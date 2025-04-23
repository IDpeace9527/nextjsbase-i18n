import { siteConfig } from '@/config/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary py-4">
      <div className="container mx-auto px-4 text-black flex justify-start">
        <p>Copyright &copy; {currentYear} {siteConfig.domain}</p>
      </div>
    </footer>
  );
}
