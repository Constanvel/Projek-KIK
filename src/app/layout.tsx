import type { Metadata, Viewport } from 'next';
import '@fontsource/plus-jakarta-sans/latin-400.css';
import '@fontsource/plus-jakarta-sans/latin-500.css';
import '@fontsource/plus-jakarta-sans/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import './globals.css';
import { DemoProvider } from '@/features/demo/demo-provider';

export const metadata: Metadata = {
  title: { default: 'HyTrack — Berobat lebih tenang', template: '%s | HyTrack' },
  description: 'Demonstrasi frontend HyTrack: panduan kunjungan dan antrean rawat jalan.',
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#f8f7f1' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <a className="skip-link" href="#main">
          Lewati ke konten
        </a>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
