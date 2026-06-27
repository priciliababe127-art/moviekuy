import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import HistatsTracker from '@/components/HistatsTracker';

export const metadata: Metadata = {
  metadataBase: new URL('https://moviekuy.sociosquad.net'), // Base domain untuk semua SEO
  title: {
    default: 'MovieKuy — Streaming Film, TV Series & Anime Sub Indo Gratis',
    template: '%s | MovieKuy'
  },
  description: 'Platform streaming film Hollywood, serial TV Asia, dan Anime Jepang subtitle Indonesia terlengkap dengan kualitas HD tanpa iklan mengganggu.',
  keywords: ['nonton film gratis', 'streaming anime sub indo', 'lk21 terbaru', 'rebahin tv series', 'vidlink anime', 'moviekuy'],
  authors: [{ name: 'MovieKuy Admin' }],
  creator: 'MovieKuy',
  publisher: 'MovieKuy Network',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'MovieKuy',
  },
  // KUNCI RAHASIA MENAKLUKKAN YANDEX & BING:
  verification: {
    google: 'google-site-verification=rTcCJIPqveKEsPeeWUkh8_Zu5KgoUD9GcB41ye4SCPs',
    yandex: 'masukkan-kode-verifikasi-yandex-webmaster-nanti',
    other: {
      'msvalidate.01': 'masukkan-kode-verifikasi-bing-webmaster-nanti', 
    },
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Memberi tahu browser: "Siapkan koneksi ke server ini sekarang!" */}
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://cdn.myanimelist.net" />
        <link rel="dns-prefetch" href="https://vidlink.pro" />
      </head>
      <body className="min-h-full flex flex-col">{children} 
        {/* Panggil Histats di sini */}
        <HistatsTracker />
        {/* --- NINJA POP-UNDER IKLAN --- */}
        <Script
          id="Adstera-popunder"
          src="https://expulsiondatabaseinnocent.com/d4/1e/ec/d41eec995d21d55bcc35a752a969fee0.js"
          strategy="lazyOnload" 
        />
        </body>
      
    </html>
  );
}
