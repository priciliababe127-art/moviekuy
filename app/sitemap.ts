import { getMedia } from '@/lib/tmdb';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Gunakan fallback URL ini agar sitemap tetap jalan saat di localhost maupun saat live
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://moviekuy.sociosquad.net';

  // 1. Tarik 3 pilar data secara serentak dalam 0.6 detik (Super Fast Build)
  const [movies, tvShows, animes] = await Promise.all([
    getMedia({ type: 'movie', category: 'popular' }),
    getMedia({ type: 'tv', category: 'popular' }),
    getMedia({ type: 'anime' })
  ]);

  // 2. Mapping URL Movie
  const movieEntries = movies.map((movie) => ({
    url: `${baseUrl}/movie/${movie.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Mapping URL TV Series
  const tvEntries = tvShows.map((tv) => ({
    url: `${baseUrl}/tv/${tv.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const, // TV Series rilis episode tiap hari
    priority: 0.8,
  }));

  // 4. Mapping URL Anime
  const animeEntries = animes.map((anime) => ({
    url: `${baseUrl}/anime/${anime.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const, // Anime ongoing update tiap minggu/hari
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/?type=movie`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?type=tv`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?type=anime`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...movieEntries,
    ...tvEntries,
    ...animeEntries,
  ];
}