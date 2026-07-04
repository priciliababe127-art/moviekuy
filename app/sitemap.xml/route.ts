import { getMedia } from '@/lib/tmdb';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://moviekuy.sociosquad.net';

  // --- HELPER UNTUK MEMBUAT SLUG (Contoh: "The Flash" -> "the-flash") ---
  const slugify = (text: string) => {
    return (text || 'item')
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-') // Ganti karakter non-alfanumerik dengan dash
      .replace(/(^-|-$)+/g, '');   // Hapus dash di awal/akhir
  };

  // 1. KEPALA XML SUPER KAKU (Inilah mantra gaib yang dituntut Yandex)
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  // Helper format tanggal murni YYYY-MM-DD
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
      const slug = slugify(m.title || 'movie');
      dynamicXml += `
  <url>
    <loc>${baseUrl}/movie/${m.id}-${slug}</loc>
    <lastmod>${cleanDate(m.release_date)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    (tvShows || []).forEach((t) => {
      const slug = slugify(t.name || 'series');
      dynamicXml += `
  <url>
    <loc>${baseUrl}/tv/${t.id}-${slug}</loc>
    <lastmod>${cleanDate(t.first_air_date)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    (animes || []).forEach((a) => {
      const slug = slugify(a.title || 'anime');
      dynamicXml += `
  <url>
    <loc>${baseUrl}/anime/${a.id}-${slug}</loc>
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

  return new Response(finalXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}