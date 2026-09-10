import type { Metadata, Viewport } from 'next';
import './globals.css';
import { I18nProvider } from '@/i18n/context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingHelpButton } from '@/components/FloatingHelpButton';
import { NetworkStatus } from '@/components/NetworkStatus';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://periyakottai.vercel.app'),
  title: 'பெரியகோட்டை டிஜிட்டல் சேவை | Periyakottai Digital Seva',
  description:
    'பெரியகோட்டை கிராம மக்களுக்கான அரசு சேவைகள், விவசாய உதவிகள், நலத்திட்டங்கள் மற்றும் நால்ரோடு மக்கள் இ-சேவை மையத்தின் (முருகேசன்) நேரடி உதவி தளம். ஒட்டன்சத்திரம் தாலுகா, திண்டுக்கல் மாவட்டம் - 624614.',
  keywords: [
    'Periyakottai',
    'பெரியகோட்டை',
    'Oddanchatram',
    'ஒட்டன்சத்திரம்',
    'Dindigul',
    'திண்டுக்கல்',
    '624614',
    'e-Seva',
    'CSC Centre',
    'Nalroad',
    'நால்ரோடு',
    'Murugesan K',
    'முருகேசன்',
    'Patta transfer',
    'பட்டா மாறுதல்',
    'PM Kisan',
    'கிசான்',
    'Magalir Urimai',
    'மகளிர் உரிமைத் தொகை',
    'Drip irrigation subsidy'
  ],
  authors: [{ name: 'Nalroad Makkal e-Seva Maiyam - Murugesan K' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', sizes: '64x64', type: 'image/png' },
      { url: '/images/logo.png', sizes: '256x256', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    title: 'பெரியகோட்டை டிஜிட்டல் சேவை - Periyakottai Digital Seva (624614)',
    description: 'அரசு சான்றிதழ்கள், விவசாய மானியங்கள் மற்றும் இ-சேவை மைய உதவி தளம்.',
    type: 'website',
    locale: 'ta_IN',
    images: [
      {
        url: '/images/logo.png',
        width: 256,
        height: 256,
        alt: 'பெரியகோட்டை டிஜிட்டல் சேவை இலச்சினை',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#15803d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <I18nProvider>
          <NetworkStatus />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingHelpButton />
        </I18nProvider>

        {/* Service worker registration & localhost cleanup script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                if (isLocal) {
                  // On localhost: unregister any lingering service workers and clear cache storage
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var i = 0; i < registrations.length; i++) {
                      registrations[i].unregister();
                    }
                  });
                  if ('caches' in window) {
                    caches.keys().then(function(names) {
                      for (var j = 0; j < names.length; j++) {
                        caches.delete(names[j]);
                      }
                    });
                  }
                } else {
                  // In production: register PWA service worker
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                  });
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
