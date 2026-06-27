// lib/tmdb.ts

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

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
}

// 1. MESIN UTAMA BERANDA (HYBRID TMDB & MYANIMELIST)
export async function getMedia(params: FetchParams = {}): Promise<MediaItem[]> {
  const { query, category = 'popular', year, country, type = 'movie' } = params;

  // [JALUR KHUSUS ANIME - VIA JIKAN API / MYANIMELIST]
  if (type === 'anime') {
    let jikanUrl = `https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=1`;
    
    if (query && query.trim() !== '') {
      jikanUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&sfw=true`;
    }

    const res = await fetch(jikanUrl, { next: { revalidate: 3600 } });
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

  // [JALUR STANDAR MOVIE & TV - VIA TMDB]
  let apiCategory = category;
  if (type === 'tv' && category === 'now_playing') apiCategory = 'on_the_air';

  let url = `${BASE_URL}/${type}/${apiCategory}?api_key=${API_KEY}&language=id-ID&page=1`;

  if (query && query.trim() !== '') {
    url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&language=id-ID&query=${encodeURIComponent(query)}&page=1`;
  } else if (year || country) {
    const q = new URLSearchParams({ api_key: API_KEY || '', language: 'id-ID', page: '1' });
    if (year) q.append(type === 'movie' ? 'primary_release_year' : 'first_air_date_year', year);
    if (country) q.append('with_origin_country', country);
    url = `${BASE_URL}/discover/${type}?${q.toString()}`;
  }

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

// 2. DETAIL MOVIE
export async function getMovieDetail(id: string) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=id-ID`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

// 3. DETAIL TV SERIES
export async function getTVDetail(id: string) {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=id-ID`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

// 4. DETAIL ANIME (JIKAN API)
export async function getAnimeDetail(id: string) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

// 5. FILM SERUPA / REKOMENDASI (Untuk Halaman Movie)
export async function getSimilarMovies(id: string) {
  const res = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=id-ID&page=1`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ? data.results.slice(0, 10) : [];
}