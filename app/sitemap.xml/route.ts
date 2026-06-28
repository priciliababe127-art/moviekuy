import { getMedia } from '@/lib/tmdb';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://moviekuy.sociosquad.net';

  // 1. KEPALA XML SUPER KAKU (Inilah mantra gaib yang dituntut Yandex di Line 2 Column 61)
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  // Helper format tanggal murni YYYY-MM-DD (Yandex sangat membenci format jam bertanda milidetik)
  const cleanDate = (dateStr?: string) => {
    if (!dateStr || dateStr === 'N/A') return new Date().toISOString().split('T')[0];
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
  };

  // 2. Mapping Rute Statis
  const staticPages = ['', '/explore', '/dmca'];
  let staticXml = '';
  
  staticPages.forEach((page) => {
    staticXml += `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${cleanDate()}</lastmod>
    <changefreq>${page === '' ? 'hourly' : 'daily'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  });

  let dynamicXml = '';

  try {
    // 3. Tarik Data Serentak
    const [movies, tvShows, animes] = await Promise.all([
      getMedia({ type: 'movie', category: 'now_playing' }),
      getMedia({ type: 'tv', category: 'popular' }),
      getMedia({ type: 'anime' })
    ]);

    (movies || []).forEach((m) => {
      dynamicXml += `
  <url>
    <loc>${baseUrl}/movie/${m.id}</loc>
    <lastmod>${cleanDate(m.release_date)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    (tvShows || []).forEach((t) => {
      dynamicXml += `
  <url>
    <loc>${baseUrl}/tv/${t.id}</loc>
    <lastmod>${cleanDate(t.first_air_date)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    (animes || []).forEach((a) => {
      dynamicXml += `
  <url>
    <loc>${baseUrl}/anime/${a.id}</loc>
    <lastmod>${cleanDate(a.first_air_date)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

  } catch (e) {
    console.error("Sitemap Manual Fetch Error:", e);
  }

  // 4. Tutup bungkus XML
  const finalXml = `${xmlHeader}${staticXml}${dynamicXml}
</urlset>`;

  // Kembalikan sebagai wujud file XML murni
  return new Response(finalXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}