import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css'; // Pastikan path css bawaanmu ini benar

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
        url: '/opengraph-image.png', // Akan otomatis diterjemahkan jadi: https://moviekuy.../opengraph-image.png
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
      </head>
      
      {/* Menggunakan teknik Sticky Footer (flex-col min-h-screen) */}
      <body className="bg-[#070b14] text-slate-100 antialiased selection:bg-sky-500 selection:text-white flex flex-col min-h-screen">
        
        {/* Area Konten Utama */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Global Footer (Meresap otomatis ke seluruh halaman) */}
        <footer className="w-full bg-slate-950 border-t border-slate-900/80 py-8 px-4 text-center mt-auto z-10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              <span className="font-bold text-slate-300 tracking-wider">MOVIEKUY NETWORK</span>
            </div>

            <div className="flex gap-6">
              <Link href="/explore" className="hover:text-sky-400 transition">Advanced Search</Link>
              <Link href="/dmca" className="hover:text-sky-400 transition underline decoration-slate-800">DMCA Privacy</Link>
            </div>

            <p>© {new Date().getFullYear()} MovieKuy. All rights reserved.</p>
          </div>
        </footer>

      </body>
    </html>
  );
}