import { getMedia } from '@/lib/tmdb';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://moviekuy.sociosquad.net';

  // 1. DAFTAR RUTE STATIS UTAMA (Bersih dari URL Parameter "?")
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`, // Mesin pencari wajib tahu kamu punya filter canggih
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dmca`, // Syarat wajib Yandex & Google agar webmu dianggap aman (Trust Signal)
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  try {
    // 2. Tarik 3 Pilar Data secara serentak (Super Fast Build)
    const [movies, tvShows, animes] = await Promise.all([
      getMedia({ type: 'movie', category: 'now_playing' }), // Pakai 'now_playing' agar film bioskop baru langsung terindeks
      getMedia({ type: 'tv', category: 'popular' }),
      getMedia({ type: 'anime' })
    ]);

    // Helper: Validasi tanggal agar tidak merusak format standar XML ISO 8601
    const parseDate = (dateStr?: string) => {
      if (!dateStr || dateStr === 'N/A') return new Date();
      const parsed = new Date(dateStr);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    };

    // 3. Mapping Movie (Gunakan tanggal rilis asli filmnya!)
    const movieEntries: MetadataRoute.Sitemap = (movies || []).map((movie) => ({
      url: `${baseUrl}/movie/${movie.id}`,
      lastModified: parseDate(movie.release_date), 
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 4. Mapping TV Series
    const tvEntries: MetadataRoute.Sitemap = (tvShows || []).map((tv) => ({
      url: `${baseUrl}/tv/${tv.id}`,
      lastModified: parseDate(tv.first_air_date),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // 5. Mapping Anime
    const animeEntries: MetadataRoute.Sitemap = (animes || []).map((anime) => ({
      url: `${baseUrl}/anime/${anime.id}`,
      lastModified: parseDate(anime.first_air_date),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    return [...staticEntries, ...movieEntries, ...tvEntries, ...animeEntries];

  } catch (error) {
    // FAILSAFE TINGKAT DEWA: Jika API TMDB/Jikan down, sitemap utama tetap hidup!
    console.error("Sitemap Generation Error:", error);
    return staticEntries;
  }
}