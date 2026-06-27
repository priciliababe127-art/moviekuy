import Link from 'next/link';
import { getMedia, MediaItem } from '@/lib/tmdb';
import AdBanner from '@/components/AdBanner';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await Promise.resolve(searchParams);

  const query = resolvedParams.query || '';
  const category = resolvedParams.category || 'popular';
  const year = resolvedParams.year || '';
  const country = resolvedParams.country || '';
  const typeParam = resolvedParams.type;
// Izinkan 'anime' masuk ke dalam sistem validasi
const type: 'movie' | 'tv' | 'anime' = 
  (typeParam === 'tv' ? 'tv' : typeParam === 'anime' ? 'anime' : 'movie');

  // Fetch data dengan tipe yang dipilih
  const mediaItems = await getMedia({ query, category, year, country, type });

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 12 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-sky-500 selection:text-white pb-16">
      
      {/* --- NAVBAR & LOGO --- */}
      <header className="sticky top-0 z-50 bg-[#070b14]/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Logo MovieKuy Premium MK Monogram */}
<Link href="/" className="flex items-center gap-2.5 group shrink-0 select-none">
  
  {/* Kotak Monogram MK (Squircle Ambient Glow) */}
  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.15)] group-hover:border-sky-500/50 group-hover:scale-105 transition duration-300 relative overflow-hidden">
    
    {/* Vektor Ligatur MK (M=Sky Blue, K=Cinema Gold) */}
    <svg className="w-6 h-6 transform transition duration-500 group-hover:rotate-3" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nav_m" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="nav_k" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      
      {/* Tulang Punggung Huruf M */}
      <path 
        d="M 124 364 L 124 148 L 204 248 L 284 148 L 284 364" 
        stroke="url(#nav_m)" 
        strokeWidth="56" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Sayap Proyektor Huruf K */}
      <path 
        d="M 388 148 L 284 256 L 388 364" 
        stroke="url(#nav_k)" 
        strokeWidth="56" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>

  </div>

  {/* Teks Identitas Brand */}
  <div className="flex flex-col">
    <span className="text-xl font-black tracking-wider text-white font-mono">
      MOVIE<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-amber-400">KUY</span>
    </span>
    <span className="text-[9px] tracking-widest text-sky-400/80 font-bold -mt-1 uppercase font-mono">Ultimate Stream</span>
  </div>

</Link>

          {/* Kotak Pencarian */}
          <form method="GET" action="/" className="flex-1 max-w-md relative hidden sm:block">
            <input type="hidden" name="type" value={type} />
            <input
              type="text"
              name="query"
              defaultValue={query}
              placeholder="Cari..."
              className="w-full bg-slate-900/90 border border-slate-700/60 rounded-full px-5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
            />
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* --- TAB SWITCHER (MOVIE/TV) --- */}
        <div className="flex bg-slate-900/50 p-1 rounded-2xl mb-8 w-fit border border-slate-800 shadow-xl">
          <Link 
            href={`/?type=movie&category=${category}`}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition ${type === 'movie' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Movies
          </Link>
          <Link 
            href={`/?type=tv&category=${category}`}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition ${type === 'tv' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            TV Series
          </Link>
          {/* TOMBOL BARU */}
          <Link href={`/?type=anime`} className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${type === 'anime' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>⛩️ Anime</Link>
          
        </div>

        <AdBanner />

        {/* --- FILTER BAR --- */}
        <form method="GET" action="/" className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl mb-10 flex flex-wrap gap-3 items-center justify-between">
          <input type="hidden" name="type" value={type} />
          <div className="flex flex-wrap gap-3 items-center">
            <select name="category" defaultValue={category} className="bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 outline-none">
              <option value="popular">🔥 Populer</option>
              <option value="now_playing">✨ Terbaru</option>
              <option value="top_rated">⭐ Rating Tinggi</option>
            </select>
            <select name="country" defaultValue={country} className="bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 outline-none">
              <option value="">🌐 Semua Negara</option>
              <option value="US">🇺🇸 US</option>
              <option value="KR">🇰🇷 Korea</option>
              <option value="JP">🇯🇵 Jepang</option>
              <option value="ID">🇮🇩 Indonesia</option>
            </select>
          </div>
          <button type="submit" className="px-6 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold">Terapkan</button>
        </form>

        {/* --- MEDIA GRID --- */}
        {mediaItems.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
            <p className="text-slate-500">Tidak ada konten ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
            {/* PERBAIKAN 2: Menambahkan tipe 'MediaItem' pada parameter map */}
            {mediaItems.map((item: MediaItem) => {
              const poster = item.poster_path 
  ? (item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w500${item.poster_path}`)
  : 'https://via.placeholder.com/500x750?text=No+Poster';

              return (
                <Link 
                  key={item.id} 
                  href={`/${type}/${item.id}`}
                  className="group relative bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-sky-500/50 transition duration-500 flex flex-col hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-10px_rgba(14,165,233,0.3)]"
                >
                  <div className="aspect-[2/3] w-full bg-slate-800 relative overflow-hidden">
                    <img
                      src={poster}
                      alt={item.title || item.name || 'Media'}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[11px] font-bold text-amber-400 border border-white/10 flex items-center gap-1">
                      <span>★</span> {item.vote_average?.toFixed(1) || 'N/A'}
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col flex-1 justify-between bg-gradient-to-b from-transparent to-slate-950/80">
                    <h2 className="text-sm font-bold text-slate-100 group-hover:text-sky-400 transition line-clamp-1" title={item.title || item.name}>
                      {item.title || item.name}
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium font-mono">
                      {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'Ukn'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}