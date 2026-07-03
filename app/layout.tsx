import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css'; // Pastikan path css bawaanmu ini benar
import HistatsTracker from '@/components/HistatsTracker'; // <--- [BARU] Import komponen Histats kamu
// Failsafe Domain agar bekerja di localhost maupun saat Live di Vercel
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://moviekuy.sociosquad.net';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MovieKuy — Streaming Film, TV Series & Anime Sub Indo Gratis',
    template: '%s | MovieKuy',
  },
  description: 'Platform streaming film Hollywood, serial TV Asia, dan Anime Jepang subtitle Indonesia terlengkap dengan kualitas HD tanpa iklan mengganggu.',
  keywords: ['nonton film gratis', 'streaming anime sub indo', 'lk21 terbaru', 'rebahin', 'moviekuy'],
  authors: [{ name: 'MovieKuy Network' }],
  creator: 'MovieKuy',

  // --- MESIN PENYELAMAT FACEBOOK, TWITTER, WA ---
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    title: 'MovieKuy — Nonton Film & Anime Sub Indo Gratis',
    description: 'Streaming film Hollywood terbaru, Drakor, hingga Anime Jepang kualitas HD 1080p gratis tanpa pop-up iklan.',
    siteName: 'MovieKuy',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'MovieKuy Cinema Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MovieKuy — Nonton Film & Anime Sub Indo Gratis',
    description: 'Streaming film Hollywood terbaru, Drakor, hingga Anime Jepang kualitas HD 1080p gratis.',
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://cdn.myanimelist.net" />
        <link rel="dns-prefetch" href="https://vidlink.pro" />

        {/* --- PANGGIL FILE IKLAN STATIS (100% AMAN DARI ERROR KOMPILER JSX) --- */}
        <script src="/admanager.js" data-cfasync="false" async></script>
      </head>
      
      <body className="bg-[#070b14] text-slate-100 antialiased selection:bg-sky-500 selection:text-white flex flex-col min-h-screen">
        
        {/* Area Konten Utama */}
        <div className="flex-grow">
          {children}
        </div>

        {/* --- MESIN PELACAK HISTATS TETAP BERJALAN DI SINI --- */}
        <HistatsTracker />

        {/* Global Footer */}
        <footer className="w-full bg-slate-950 border-t border-slate-900/80 py-8 px-4 text-center mt-auto z-10">
          {/* ... isi footer ... */}
        </footer>

      </body>
    </html>
  );
}