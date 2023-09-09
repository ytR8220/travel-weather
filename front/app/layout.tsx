import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Travel Weather',
  description: '旅行者のための天気予報サイト',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <div
          className={"bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat"}
          style={{ backgroundPositionY: '40%' }}
        >
          <div
            className={
              'p-10 min-h-screen h-full flex justify-center items-center max-md:p-5'
            }
          >
            <div
              className={
                'container xl max-w-7xl rounded-xl bg-white/40 backdrop-blur-md px-5 py-20 max-md:py-10 max-md:px-3'
              }
            >
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
