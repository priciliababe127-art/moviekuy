import { getMedia, MediaItem } from '@/lib/tmdb';
import Link from 'next/link';

export default async function Home({ searchParams }: { searchParams: Promise<{ type?: string; page?: string; q?: string }> }) {
  const sp = await searchParams;
  
  // Baca parameter dari URL, beri fallback nilai default jika kosong
  const typeParam = sp.type;
  const type: 'movie' | 'tv' | 'anime' = (typeParam === 'tv' ? 'tv' : typeParam === 'anime' ? 'anime' : 'movie');
  const currentPage = parseInt(sp.page || '1', 10);
  const searchQuery = sp.q || '';

  // Tarik data berdasarkan filter dan halaman aktif
  const mediaItems = await getMedia({ type, page: currentPage, query: searchQuery });

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 sm:p-6 md:p-8 max-w-7xl mx-auto pb-24">
      
      {/* --- PREMIUM NAVBAR HEADER --- */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-900 pb-6 mb-8">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0 select-none">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.15)] group-hover:border-sky-500/50 group-hover:scale-105 transition duration-300">
            <svg className="w-6 h-6 transform transition duration-500 group-hover:rotate-3" viewBox="0 0 512 512" fill="none">
              <defs>
                <linearGradient id="nav_m" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="nav_k" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <path d="M 124 364 L 124 148 L 204 248 L 284 148 L 284 364" stroke="url(#nav_m)" strokeWidth="56" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 388 148 L 284 256 L 388 364" stroke="url(#nav_k)" strokeWidth="56" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider text-white font-mono">MOVIE<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-amber-400">KUY</span></span>
            <span className="text-[9px] tracking-widest text-sky-400/80 font-bold -mt-1 uppercase font-mono">Ultimate Stream</span>
          </div>
        </Link>

        {/* Search Bar Baris Atas */}
        <form action="/" method="GET" className="w-full sm:w-80 relative">
          <input type="hidden" name="type" value={type} />
          <input 
            type="text" 
            name="q" 
            defaultValue={searchQuery}
            placeholder={`Cari ${type === 'movie' ? 'film' : type === 'tv' ? 'series' : 'anime'}...`}
            className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/60 rounded-xl px-4 py-2.5 text-xs font-semibold placeholder-slate-600 outline-none transition text-slate-200"
          />
        </form>
      </header>

      {/* --- BARIS UTAMA FILTER TAB & ADVANCED EXPLORE --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Tab Switcher Konten */}
        <div className="flex bg-slate-950/60 p-1 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto no-scrollbar w-fit">
          <Link href={`/?type=movie`} className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${type === 'movie' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>🎬 Movies</Link>
          <Link href={`/?type=tv`} className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${type === 'tv' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>📺 TV Series</Link>
          <Link href={`/?type=anime`} className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${type === 'anime' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>⛩️ Anime</Link>
        </div>

        {/* Akses Cepat ke Advanced Search */}
        <Link href="/explore" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900/60 hover:bg-slate-900 text-xs font-bold text-sky-400 hover:text-sky-300 rounded-xl border border-slate-800/80 hover:border-sky-500/30 transition shadow-md w-full sm:w-auto">
          🔍 Advanced Search Engine
        </Link>
      </div>

      {/* SUB-TITLE DINAMIS KATEGORI */}
      <div className="mb-6 flex items-center gap-2 select-none">
        <span className="w-1.5 h-3.5 bg-sky-500 rounded-sm"></span>
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
          {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : type === 'movie' ? '🔥 Rilisan Bioskop Terbaru (Now Playing)' : type === 'tv' ? '🔥 TV Series Populer' : '⛩️ Top Anime List'}
        </h2>
      </div>
      {/* --- PESAN ERROR JIKA KONTEN KOSONG --- */}
{mediaItems.length === 0 && (
  <div className="w-full flex flex-col items-center justify-center py-24 bg-slate-900/30 border border-slate-800/80 rounded-2xl border-dashed">
    <span className="text-5xl mb-4 animate-bounce">🎬</span>
    <h3 className="text-lg font-bold text-slate-300 font-mono">Yahh, Tidak Ada Konten Ditemukan.</h3>
    <p className="text-sm text-slate-500 mt-2 text-center max-w-sm">
      Coba cari dengan kata kunci lain atau pilih halaman sebelumnya. Pastikan koneksi internet stabil.
    </p>
  </div>
)}
      {/* --- GRID POSTER MOVIE (RESPONSIVE: 2 MOBILE, 3 TABLET, 4 DESKTOP KE SAMPING) --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
        {mediaItems.map((item: MediaItem) => {
          const title = item.title || item.name;
          const poster = item.poster_path 
            ? (item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w500${item.poster_path}`)
            : 'https://via.placeholder.com/500x750?text=No+Poster';
          
          const releaseYear = (item.release_date || item.first_air_date || 'N/A').split('-')[0];
          const itemRoute = type === 'anime' ? `/anime/${item.id}` : type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;

          return (
            <Link 
              key={item.id} 
              href={itemRoute} 
              className="group bg-slate-900/20 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-sky-500/40 hover:shadow-[0_10px_30px_rgba(14,165,233,0.08)] transition-all duration-300 flex flex-col relative"
            >
              {/* Wadah Gambar Poster */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                <img 
                  src={poster} 
                  alt={title} 
                  loading="lazy" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge Rating Bintang */}
                <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-amber-400 border border-slate-800/60 shadow">
                  ★ {item.vote_average?.toFixed(1)}
                </div>

                {/* Badge Penanda Rilisan Baru khusus untuk jenis Movie di halaman pertama */}
                {type === 'movie' && currentPage === 1 && !searchQuery && (
                  <div className="absolute top-2.5 left-2.5 bg-sky-600/90 text-white font-mono font-black text-[9px] px-2 py-0.5 rounded-md shadow-sm tracking-wider uppercase animate-pulse">
                    NEW
                  </div>
                )}
              </div>

              {/* Teks Keterangan Bawah */}
              <div className="p-3.5 flex-1 flex flex-col justify-between gap-1">
                <h3 className="text-xs font-bold text-slate-200 group-hover:text-sky-400 truncate transition duration-200">
                  {title}
                </h3>
                <span className="text-[10px] font-mono font-semibold text-slate-500 block">
                  {releaseYear} • {type.toUpperCase()}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* --- INTERAKTIF SMART PAGINASI MENU (NEXT PAGE) --- */}
      <div className="mt-12 pt-6 border-t border-slate-900 flex items-center justify-center gap-2 font-mono text-xs">
        
        {/* Tombol Halaman Sebelumnya (Sembunyikan jika di hal 1) */}
        {currentPage > 1 && (
          <Link 
            href={`/?type=${type}${searchQuery ? `&q=${searchQuery}` : ''}&page=${currentPage - 1}`}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition active:scale-95 shadow-md font-bold"
          >
            ← Prev Page
          </Link>
        )}

        {/* Indikator Halaman Aktif */}
        <div className="px-5 py-2 bg-slate-950 rounded-xl border border-slate-900 font-bold text-slate-400 min-w-[110px] text-center select-none shadow-inner">
          PAGE <span className="text-sky-400 text-sm font-black">{currentPage}</span>
        </div>

        {/* Tombol Halaman Selanjutnya */}
        {mediaItems.length >= 20 && (
          <Link 
            href={`/?type=${type}${searchQuery ? `&q=${searchQuery}` : ''}&page=${currentPage + 1}`}
            className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl shadow-md shadow-sky-500/10 transition active:scale-95 font-bold"
          >
            Next Page →
          </Link>
        )}

      </div>

    </div>
  );
}