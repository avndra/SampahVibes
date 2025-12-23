import { Inter, Satisfy, Shadows_Into_Light } from 'next/font/google';
import './globals.css';
import ClientProviders from './ClientProviders';

// Font configuration
const inter = Inter({ subsets: ['latin'] });
const satisfy = Satisfy({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-satisfy',
});
const shadows = Shadows_Into_Light({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-shadows',
});

export const metadata = {
  title: 'E-Recycle - Ubah Sampah Jadi Barang 🌱',
  description: 'Platform daur ulang gamifikasi untuk Indonesia. Pindai sampah, dapatkan poin, dan raih barang menarik!',
  keywords: 'recycle, indonesia, barang, poin, ramah lingkungan, keberlanjutan, botol, plastik, poin, ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${satisfy.variable} ${shadows.variable} bg-background text-foreground antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}