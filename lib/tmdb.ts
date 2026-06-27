// lib/tmdb.ts

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
// Trik Failsafe: Jika Vercel gagal baca env, dia akan otomatis pakai key di bawah ini
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'af84930b5f98fcbebe460f39dc580bef';

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

interface FetchParams {
  query?: string;
  category?: string;
  year?: string;
  country?: string;
  type?: 'movie' | 'tv' | 'anime';
  page?: number;
}

// 1. MESIN UTAMA BERANDA
export async function getMedia(params: FetchParams = {}): Promise<MediaItem[]> {
  const { query, category, year, country, type = 'movie', page = 1 } = params;

  try {
    if (type === 'anime') {
      let jikanUrl = `https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=${page}`;
      if (query && query.trim() !== '') {
        jikanUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&sfw=true&page=${page}`;
      }

      // Gunakan revalidate 60 detik agar jika error tidak tersimpan lama di cache
      const res = await fetch(jikanUrl, { next: { revalidate: 60 } });
      if (!res.ok) return [];
      const data = await res.json();

      return (data.data || []).map((item: any) => ({
        id: item.mal_id,
        title: item.title,
        name: item.title,
        poster_path: item.images?.jpg?.large_image_url || '',
        first_air_date: item.aired?.from ? item.aired.from.split('T')[0] : 'N/A',
        vote_average: item.score || 0
      }));
    }

    const defaultCategory = type === 'movie' ? 'now_playing' : 'popular';
    let apiCategory = category || defaultCategory;
    if (type === 'tv' && apiCategory === 'now_playing') apiCategory = 'on_the_air';

    let url = `${BASE_URL}/${type}/${apiCategory}?api_key=${API_KEY}&language=id-ID&page=${page}`;

    if (query && query.trim() !== '') {
      url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&language=id-ID&query=${encodeURIComponent(query)}&page=${page}`;
    } else if (year || country) {
      const q = new URLSearchParams({ api_key: API_KEY, language: 'id-ID', page: page.toString() });
      if (year) q.append(type === 'movie' ? 'primary_release_year' : 'first_air_date_year', year);
      if (country) q.append('with_origin_country', country);
      url = `${BASE_URL}/discover/${type}?${q.toString()}`;
    }

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Gagal mengambil data TMDB:", error);
    return [];
  }
}

export async function getMovieDetail(id: string) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=id-ID`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getTVDetail(id: string) {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=id-ID`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getAnimeDetail(id: string) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export async function getSimilarMovies(id: string) {
  const res = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=id-ID&page=1`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ? data.results.slice(0, 10) : [];
}

export async function getGenres(type: 'movie' | 'tv' = 'movie') {
  const res = await fetch(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}&language=id-ID`, { next: { revalidate: 86400 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.genres || [];
}

export async function getDiscover(params: { type?: string; genre?: string; year?: string; sort?: string; page?: number }) {
  const { type = 'movie', genre, year, sort = 'popularity.desc', page = 1 } = params;
  const q = new URLSearchParams({ api_key: API_KEY, language: 'id-ID', page: page.toString(), sort_by: sort });
  
  if (genre && genre !== '') q.append('with_genres', genre);
  if (year && year !== '') q.append(type === 'movie' ? 'primary_release_year' : 'first_air_date_year', year);

  const res = await fetch(`${BASE_URL}/discover/${type}?${q.toString()}`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}