import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'CMS Timon',
    template: '%s | CMS Timon'
  },
  description: 'Sistema de Gerenciamento de Conteúdo da Prefeitura Municipal de Timon - MA',
  keywords: ['CMS', 'Prefeitura', 'Timon', 'Maranhão', 'Gestão de Conteúdo'],
  authors: [{ name: 'Prefeitura de Timon' }],
  creator: 'Prefeitura Municipal de Timon',
  robots: {
    index: false,
    follow: false
  },
  metadataBase: new URL(process.env.APP_BASE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1B4B8C" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              classNames: {
                error: 'border-destructive',
                success: 'border-success',
                warning: 'border-warning',
                info: 'border-primary',
              }
            }}
          />
        </Providers>
      </body>
    </html>
  );
}