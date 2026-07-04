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

export interface FetchParams {
  query?: string;
  category?: string;
  year?: string;
  country?: string;
  type?: 'movie' | 'tv' | 'anime';
  page?: number;
  sort?: string;
  language?: string;
}

// 1. MESIN UTAMA BERANDA
export async function getMedia(params: FetchParams = {}): Promise<MediaItem[]> {
  const { query, category, year, country, type = 'movie', page = 1, sort = 'popular', language = 'en-US' } = params;

  try {
    // --- JALUR KHUSUS ANIME (JIKAN API) ---
    if (type === 'anime') {
      // Jika filter 'new', tampilkan anime yang sedang tayang musim ini (airing)
      const jikanFilter = sort === 'new' ? 'airing' : 'bypopularity';
      let jikanUrl = `https://api.jikan.moe/v4/top/anime?filter=${jikanFilter}&page=${page}`;
      
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

    // --- JALUR TMDB (MOVIES & TV SERIES) ---
    let url = '';

    // A. Jika sedang mencari judul spesifik lewat Search Bar
    if (query && query.trim() !== '') {
      url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}&page=${page}`;
    } 
    // B. Jika ada filter Urutan (New Release), Tahun, atau Negara -> Gunakan endpoint Discover
    else if (sort === 'new' || year || country) {
      const q = new URLSearchParams({ api_key: API_KEY, language: language, page: page.toString() });
      
      if (year) q.append(type === 'movie' ? 'primary_release_year' : 'first_air_date_year', year);
      if (country) q.append('with_origin_country', country);
      
      // Aturan urutan: Terpopuler vs Tanggal Rilis Terbaru
      const sortBy = sort === 'new' 
        ? (type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc')
        : 'popularity.desc';
      q.append('sort_by', sortBy);

      url = `${BASE_URL}/discover/${type}?${q.toString()}`;
    } 
    // C. Default fallback ke endpoint kategori standar
    else {
      const defaultCategory = type === 'movie' ? 'now_playing' : 'popular';
      let apiCategory = category || defaultCategory;
      if (type === 'tv' && apiCategory === 'now_playing') apiCategory = 'on_the_air';

      url = `${BASE_URL}/${type}/${apiCategory}?api_key=${API_KEY}&language=${language}&page=${page}`;
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

// Default bahasa untuk halaman detail disamakan ke 'en-US' (Bisa diubah ke 'id-ID' jika dibutuhkan)
export async function getMovieDetail(id: string, language = 'en-US') {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${language}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getTVDetail(id: string, language = 'en-US') {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=${language}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getAnimeDetail(id: string) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export async function getSimilarMovies(id: string, language = 'en-US') {
  const res = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=${language}&page=1`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ? data.results.slice(0, 10) : [];
}

export async function getGenres(type: 'movie' | 'tv' = 'movie', language = 'en-US') {
  const res = await fetch(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}&language=${language}`, { next: { revalidate: 86400 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.genres || [];
}

export async function getDiscover(params: { type?: string; genre?: string; year?: string; sort?: string; page?: number; language?: string }) {
  const { type = 'movie', genre, year, sort = 'popularity.desc', page = 1, language = 'en-US' } = params;
  const q = new URLSearchParams({ api_key: API_KEY, language: language, page: page.toString(), sort_by: sort });
  
  if (genre && genre !== '') q.append('with_genres', genre);
  if (year && year !== '') q.append(type === 'movie' ? 'primary_release_year' : 'first_air_date_year', year);

  const res = await fetch(`${BASE_URL}/discover/${type}?${q.toString()}`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}