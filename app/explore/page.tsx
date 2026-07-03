import { getDiscover, getGenres } from '@/lib/tmdb';
import Link from 'next/link';

// PENTING: Di Next.js 15/16, searchParams wajib di-await!
export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ type?: string; genre?: string; year?: string; sort?: string }> }) {
  const sp = await searchParams;
  
  const currentType = (sp.type === 'tv' ? 'tv' : 'movie') as 'movie' | 'tv';
  const selectedGenre = sp.genre || '';
  const selectedYear = sp.year || '';
  const selectedSort = sp.sort || 'popularity.desc';

  // Tarik data genre dan hasil filter secara serentak
  const [genres, results] = await Promise.all([
    getGenres(currentType),
    getDiscover({ type: currentType, genre: selectedGenre, year: selectedYear, sort: selectedSort })
  ]);

  // Generate daftar tahun dari 2026 mundur ke 1990
  const years = Array.from({ length: 37 }, (_, i) => (2026 - i).toString());

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 sm:p-8 max-w-7xl mx-auto pb-24">
      
      {/* --- HEADER DENGAN TOMBOL KEMBALI --- */}
      <div className="border-b border-slate-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-wide font-mono">🔍 ADVANCED EXPLORE</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Filter ribuan database film dan serial TV secara spesifik.</p>
        </div>

        {/* Tombol Kembali ke Beranda */}
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 transition shadow-sm shrink-0 w-fit group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span> Kembali ke Beranda
        </Link>
      </div>

      {/* --- FORM FILTER UTAMA --- */}
      <form method="GET" action="/explore" className="bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-10 shadow-xl">
        
        {/* 1. Pilih Tipe */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-[10px] font-mono font-bold text-sky-400">KATEGORI</label>
          <select name="type" defaultValue={currentType} className="bg-slate-950 border border-slate-800 text-xs font-bold rounded-xl p-3 outline-none focus:border-sky-500 text-white">
            <option value="movie">🎬 Film (Movie)</option>
            <option value="tv">📺 TV Series</option>
          </select>
        </div>

        {/* 2. Pilih Genre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-bold text-slate-400">GENRE</label>
          <select name="genre" defaultValue={selectedGenre} className="bg-slate-950 border border-slate-800 text-xs font-bold rounded-xl p-3 outline-none focus:border-sky-500 text-slate-200">
            <option value="">Semua Genre</option>
            {genres.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>

        {/* 3. Pilih Tahun */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-bold text-slate-400">TAHUN RILIS</label>
          <select name="year" defaultValue={selectedYear} className="bg-slate-950 border border-slate-800 text-xs font-bold rounded-xl p-3 outline-none focus:border-sky-500 text-slate-200">
            <option value="">Semua Tahun</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* 4. Urutkan Berdasarkan */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-bold text-slate-400">URUTKAN</label>
          <select name="sort" defaultValue={selectedSort} className="bg-slate-950 border border-slate-800 text-xs font-bold rounded-xl p-3 outline-none focus:border-sky-500 text-slate-200">
            <option value="popularity.desc">🔥 Terpopuler</option>
            <option value="vote_average.desc">⭐ Rating Tertinggi</option>
            <option value="primary_release_date.desc">✨ Terbaru Keluar</option>
          </select>
        </div>

        {/* 5. Tombol Submit */}
        <div className="col-span-2 sm:col-span-1 flex items-end">
          <button type="submit" className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs p-3.5 rounded-xl shadow-lg shadow-sky-900/30 transition active:scale-95">
            Terapkan Filter
          </button>
        </div>

      </form>

      {/* --- HASIL PENCARIAN GRID --- */}
      {results.length === 0 ? (
        <div className="text-center py-20 text-slate-500 font-mono text-sm">Tidak ditemukan judul yang cocok dengan kombinasi filter ini.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {results.map((item: any) => {
            const title = item.title || item.name;
            const thumb = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750';
            
            return (
              <Link key={item.id} href={`/${currentType === 'tv' ? 'tv' : 'movie'}/${item.id}`} className="group bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-sky-500/50 transition duration-300 flex flex-col">
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                  <img src={thumb} alt={title} loading="lazy" className="object-cover w-full h-full group-hover:scale-105 transition duration-500"/>
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-mono font-bold text-amber-400 border border-slate-800">
                    ★ {item.vote_average?.toFixed(1)}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-sky-400 truncate">{title}</h3>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">{(item.release_date || item.first_air_date || 'N/A').split('-')[0]}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}