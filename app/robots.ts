import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Ganti alamat ini dengan domain aslimu nanti saat live
  const baseUrl = 'https://moviekuy.sociosquad.net'; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'], // Mengunci API kita agar tidak dicuri bot lain
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}