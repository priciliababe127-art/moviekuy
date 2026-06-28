import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://moviekuy.sociosquad.net';

  return {
    rules: {
      userAgent: '*', // Mengizinkan SEMUA bot mesin pencari (Googlebot, Bingbot, YandexBot, dll)
      allow: '/',
      disallow: ['/api/'], // Sembunyikan jalur API agar tidak memberatkan server
    },
    sitemap: `${siteUrl}/sitemap.xml`, // Menunjuk lokasi peta jalan ke mesin pencari
  };
}