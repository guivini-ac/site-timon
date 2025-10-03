import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prefeitura Municipal de Timon - MA',
  description: 'Portal oficial da Prefeitura Municipal de Timon, Maranhão',
  keywords: ['Timon', 'Prefeitura', 'Maranhão', 'Governo Municipal', 'Serviços Públicos'],
  authors: [{ name: 'Prefeitura de Timon' }],
  creator: 'Prefeitura Municipal de Timon',
  publisher: 'Prefeitura Municipal de Timon',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://timon.ma.gov.br',
    title: 'Prefeitura Municipal de Timon - MA',
    description: 'Portal oficial da Prefeitura Municipal de Timon, Maranhão',
    siteName: 'Prefeitura de Timon',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prefeitura Municipal de Timon - MA',
    description: 'Portal oficial da Prefeitura Municipal de Timon, Maranhão',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Roboto+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}