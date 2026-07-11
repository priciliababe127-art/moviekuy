import { getMedia, MediaItem } from '@/lib/tmdb';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner'; // <--- [1] IMPORT BANNER IKLAN DI SINI

export default async function Home({ searchParams }: { searchParams: Promise<{ type?: string; page?: string; q?: string; country?: string; sort?: string; year?: string; lang?: string }> }) {
  const sp = await searchParams;
  
  const typeParam = sp.type;
  const type: 'movie' | 'tv' | 'anime' = (typeParam === 'tv' ? 'tv' : typeParam === 'anime' ? 'anime' : 'movie');
  const currentPage = parseInt(sp.page || '1', 10);
  const searchQuery = sp.q || '';
  const selectedCountry = sp.country || '';
  const selectedSort = sp.sort || 'popular';
  const selectedYear = sp.year || '';
  const selectedLang = sp.lang || 'en-US'; // <--- [DEFAULT BAHASA: INGGRIS en-US]

  // Menarik data dengan kombinasi lengkap: Tipe + Halaman + Query + Negara + Sort + Tahun + Bahasa
  const mediaItems = await getMedia({ 
    type, 
    page: currentPage, 
    query: searchQuery, 
    country: selectedCountry, 
    sort: selectedSort,
    year: selectedYear,
    language: selectedLang 
  });

  // Daftar Pilihan Filter
  const countries = [
    { code: '', label: '🌍 Semua' },
    { code: 'US', label: '🇺🇸 Barat / US' },
    { code: 'KR', label: '🇰🇷 Korea' },
    { code: 'JP', label: '🇯🇵 Jepang' },
    { code: 'CN', label: '🇨🇳 China' },
    { code: 'ID', label: '🇮🇩 Indo' },
    { code: 'TH', label: '🇹🇭 Thailand' },
  ];

  const years = ['', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

  const languages = [
    { code: 'en-US', label: '🇬🇧 EN' },
    { code: 'id-ID', label: '🇮🇩 ID' },
  ];

  // Helper Pintar untuk Menjaga Sinkronisasi Parameter URL Saat Klik Filter
  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const t = overrides.type !== undefined ? overrides.type : type;
    if (t && t !== 'movie') params.set('type', t);
    
    const c = overrides.country !== undefined ? overrides.country : selectedCountry;
    if (c) params.set('country', c);
    
    const s = overrides.sort !== undefined ? overrides.sort : selectedSort;
    if (s && s !== 'popular') params.set('sort', s);
    
    const y = overrides.year !== undefined ? overrides.year : selectedYear;
    if (y) params.set('year', y);
    
    const l = overrides.lang !== undefined ? overrides.lang : selectedLang;
    if (l && l !== 'en-US') params.set('lang', l);
    
    const q = overrides.q !== undefined ? overrides.q : searchQuery;
    if (q) params.set('q', q);
    
    const p = overrides.page !== undefined ? overrides.page : currentPage.toString();
    if (p && p !== '1') params.set('page', p);

    const queryString = params.toString();
    return `/${queryString ? `?${queryString}` : ''}`;
  };

  // Penentu Judul Sub-Header
  const getSectionTitle = () => {
    if (searchQuery) return `Search Results: "${searchQuery}"`;
    const sortText = selectedSort === 'new' ? '✨ New Releases' : '🔥 Popular';
    const yearText = selectedYear ? ` (${selectedYear})` : '';
    
    if (selectedCountry) {
      const cName = countries.find(c => c.code === selectedCountry)?.label || selectedCountry;
      return `${sortText}${yearText} — ${cName}`;
    }
    if (type === 'movie') return `${sortText}${yearText} — Movies`;
    if (type === 'tv') return `${sortText}${yearText} — TV Series`;
    return '⛩️ Top Anime List';
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 sm:p-6 md:p-8 max-w-7xl mx-auto pb-24">
      {/* --- [SEO] H1 RAHASIA KHUSUS MESIN PENCARI (BING & GOOGLE) --- */}
    <h1 className="sr-only">
      MovieKuy — Streaming Film HD, Serial TV, dan Anime Subtitle Indonesia Gratis
    </h1>
      {/* --- PREMIUM NAVBAR HEADER --- */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-900 pb-6 mb-8">
        
        {/* Logo Kiri */}
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

        {/* --- [POJOK KANAN ATAS] SWITCHER BAHASA + SEARCH BAR --- */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          
          {/* Tombol Pemilih Bahasa (Pojok Kanan Atas) */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 shrink-0 select-none shadow-sm">
            {languages.map((l) => (
              <Link
                key={l.code}
                href={buildUrl({ lang: l.code, page: '1' })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
                  selectedLang === l.code
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title={l.code === 'en-US' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <form action="/" method="GET" className="w-full sm:w-64 md:w-72 relative">
            <input type="hidden" name="type" value={type} />
            {selectedCountry && <input type="hidden" name="country" value={selectedCountry} />}
            {selectedSort && <input type="hidden" name="sort" value={selectedSort} />}
            {selectedYear && <input type="hidden" name="year" value={selectedYear} />}
            {selectedLang !== 'en-US' && <input type="hidden" name="lang" value={selectedLang} />}
            <input 
              type="text" 
              name="q" 
              defaultValue={searchQuery}
              placeholder={`Search ${type === 'movie' ? 'movies' : type === 'tv' ? 'series' : 'anime'}...`}
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/60 rounded-xl px-4 py-2.5 text-xs font-semibold placeholder-slate-600 outline-none transition text-slate-200"
            />
          </form>

        </div>

      </header>

      {/* --- KONTROL TAB & ADVANCED SEARCH --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex bg-slate-950/60 p-1 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto no-scrollbar w-fit">
          <Link href={buildUrl({ type: 'movie', page: '1' })} className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${type === 'movie' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>🎬 Movies</Link>
          <Link href={buildUrl({ type: 'tv', page: '1' })} className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${type === 'tv' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>📺 TV Series</Link>
          <Link href={buildUrl({ type: 'anime', page: '1' })} className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${type === 'anime' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>⛩️ Anime</Link>
        </div>

        <Link href="/explore" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900/60 hover:bg-slate-900 text-xs font-bold text-sky-400 hover:text-sky-300 rounded-xl border border-slate-800/80 hover:border-sky-500/30 transition shadow-md w-full sm:w-auto">
          🔍 Advanced Search Engine
        </Link>
      </div>

      {/* --- FILTER KOMPREHENSIF (URUTAN, TAHUN, NEGARA) --- */}
      {type !== 'anime' && !searchQuery && (
        <div className="flex flex-col gap-3 mb-6 bg-slate-900/30 p-3.5 rounded-2xl border border-slate-800/80 select-none">
          
          {/* Baris 1: Filter Urutan (Tanpa pengubah bahasa karena sudah pindah ke atas) */}
          <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider shrink-0 mr-1">
              SORT BY:
            </span>
            <Link
              href={buildUrl({ sort: 'popular', page: '1' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
                selectedSort === 'popular'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🔥 Popular
            </Link>
            <Link
              href={buildUrl({ sort: 'new', page: '1' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
                selectedSort === 'new'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ✨ New Release
            </Link>
          </div>

          {/* Baris 2: Filter Tahun */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-800/60 pb-3">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider shrink-0 mr-1 hidden md:inline">
              YEAR:
            </span>
            {years.map((y) => {
              const isActive = selectedYear === y;
              return (
                <Link
                  key={y || 'all'}
                  href={buildUrl({ year: y, page: '1' })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition border ${
                    isActive
                      ? 'bg-sky-600/30 border-sky-400 text-white shadow-sm'
                      : 'bg-slate-950/80 border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {y === '' ? '📅 All Years' : y}
                </Link>
              );
            })}
          </div>

          {/* Baris 3: Filter Negara */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider shrink-0 mr-1 hidden md:inline">
              COUNTRY:
            </span>
            {countries.map((c) => {
              const isActive = selectedCountry === c.code;
              return (
                <Link
                  key={c.code}
                  href={buildUrl({ country: c.code, page: '1' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition active:scale-95 border ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-600 to-blue-600 border-sky-400/40 text-white shadow-md shadow-sky-900/20'
                      : 'bg-slate-950/80 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>

        </div>
      )}

      {/* --- AREA IKLAN BANNER ADSTERRA --- */}
      <AdBanner />

      {/* SUB-TITLE SECTION */}
      <div className="mb-5 mt-4 flex items-center gap-2 select-none">
        <span className="w-1.5 h-3.5 bg-sky-500 rounded-sm"></span>
        <h2 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
          {getSectionTitle()}
        </h2>
      </div>

      {/* --- AREA HASIL ATAU KOSONG --- */}
      {mediaItems.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-24 bg-slate-900/20 border border-slate-800/80 rounded-2xl border-dashed my-6">
          <span className="text-5xl mb-4 animate-bounce">🎬</span>
          <h3 className="text-base sm:text-lg font-bold text-slate-300 font-mono">No Media Found.</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 text-center max-w-sm px-4">
            Try resetting some filters or selecting &quot;All Years&quot;.
          </p>
        </div>
      ) : (
        /* --- GRID POSTER COMPACT --- */
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {mediaItems.map((item: MediaItem) => {
            const title = item.title || item.name;
            const poster = item.poster_path 
              ? (item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w500${item.poster_path}`)
              : 'https://via.placeholder.com/500x750?text=No+Poster';
            
            const releaseYear = (item.release_date || item.first_air_date || 'N/A').split('-')[0];
            
            // --- [FITUR BARU] PEMBUAT SLUG RAMAH SEO ---
            const slugTitle = (title || 'video')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '');

            const itemRoute = type === 'anime' 
              ? `/anime/${item.id}-${slugTitle}` 
              : type === 'tv' 
              ? `/tv/${item.id}-${slugTitle}` 
              : `/movie/${item.id}-${slugTitle}`;

            return (
              <Link 
                key={item.id} 
                href={itemRoute} 
                className="group bg-slate-900/20 border border-slate-800/80 rounded-xl overflow-hidden hover:border-sky-500/50 transition-all duration-300 flex flex-col relative"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                  <img src={poster} alt={title} loading="lazy" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"/>
                  
                  <div className="absolute top-1.5 right-1.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-amber-400 border border-slate-800">
                    ★ {item.vote_average?.toFixed(1)}
                  </div>

                  {type === 'movie' && currentPage === 1 && !selectedCountry && !searchQuery && selectedSort === 'new' && (
                    <div className="absolute top-1.5 left-1.5 bg-sky-600 text-white font-mono font-black text-[8px] px-1.5 py-0.5 rounded tracking-wider uppercase">
                      NEW
                    </div>
                  )}
                </div>

                <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between gap-0.5">
                  <h3 className="text-[11px] sm:text-xs font-bold text-slate-200 group-hover:text-sky-400 truncate transition duration-200">
                    {title}
                  </h3>
                  <span className="text-[9px] font-mono font-semibold text-slate-500 block">
                    {releaseYear}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* --- SMART PAGINASI MENU --- */}
      {mediaItems.length > 0 && (
        <div className="mt-10 pt-6 border-t border-slate-900 flex items-center justify-center gap-2 font-mono text-xs">
          {currentPage > 1 && (
            <Link 
              href={buildUrl({ page: (currentPage - 1).toString() })}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition font-bold"
            >
              ← Prev
            </Link>
          )}

          <div className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-900 font-bold text-slate-400 text-center select-none shadow-inner">
            PAGE <span className="text-sky-400 text-sm font-black">{currentPage}</span>
          </div>

          {mediaItems.length >= 18 && (
            <Link 
              href={buildUrl({ page: (currentPage + 1).toString() })}
              className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl shadow-md transition font-bold"
            >
              Next →
            </Link>
          )}
        </div>
      )}

    </div>
  );
}