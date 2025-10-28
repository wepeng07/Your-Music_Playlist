import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlayerProvider } from '@/contexts/PlayerContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YourMusic - AI音乐推荐平台',
  description: '基于AI的智能音乐推荐平台，发现你喜欢的音乐',
  keywords: '音乐,推荐,AI,播放器,YouTube',
  authors: [{ name: 'YourMusic Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AuthProvider>
          <PlayerProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 2000,
                },
                error: {
                  duration: 4000,
                },
              }}
            />
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

