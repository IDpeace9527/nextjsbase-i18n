import {Inter} from 'next/font/google';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {ReactNode} from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const inter = Inter({subsets: ['latin']});

type Props = {
  children: ReactNode;
  locale: string;
};

export default async function BaseLayout({children, locale}: Props) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
      <NextIntlClientProvider messages={messages}>
          <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700">
          <Navigation />
          </div>
            
            <div className="flex-grow pt-14">
              <main className="min-h-screen">
                {children}
              </main>
              
            </div>
            <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
