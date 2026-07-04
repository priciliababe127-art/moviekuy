import { getMovieDetail, getMedia } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';
import type { Metadata } from 'next'; // <--- [1] IMPORT METADATA

// --- [2] FITUR SAKTI: GENERATE METADATA OTOMATIS UNTUK TAB & SEO ---
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const numericId = id.split('-')[0]; // Ambil angka ID saja jika URL berupa slug
  const movie = await getMovieDetail(numericId);

  if (!movie) return { title: 'Film Tidak Ditemukan | MovieKuy' };

  const releaseYear = movie.release_date ? ` (${movie.release_date.split('-')[0]})` : '';
  const pageTitle = `${movie.title}${releaseYear} — MovieKuy`;

  return {
    title: pageTitle,
    description: movie.overview || `Nonton streaming film ${movie.title} subtitle Indonesia kualitas HD 1080p gratis tanpa iklan mengganggu di MovieKuy.`,
    openGraph: {
      title: pageTitle,
      description: movie.overview || `Streaming HD ${movie.title} Sub Indo.`,
      images: [
        movie.backdrop_path 
          ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
          : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      ],
    },
  };
}

// --- [3] HALAMAN UTAMA ---
export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = id.split('-')[0]; // Pisahkan ID dari judul slug di URL
  
  // Ambil data film menggunakan ID numerik bersih
  const [movie, popularMovies] = await Promise.all([
    getMovieDetail(numericId),
    getMedia({ type: 'movie', category: 'popular' })
  ]);

  if (!movie) notFound();

  const sidebarMovies = popularMovies
    .filter((item: any) => item.id.toString() !== numericId)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 sm:p-6 pt-6 max-w-7xl mx-auto selection:bg-sky-500 selection:text-white pb-20">
      
      {/* --- TOP NAV BAR --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-slate-800/80 pb-5">
        <div className="w-full sm:w-1/3 flex justify-start">
          <Link 
            href="/?type=movie" 
            className="group inline-flex items-center justify-center gap-2 text-slate-300 hover:text-sky-400 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/60 hover:border-sky-500/50 shadow-lg transition-all duration-300 font-semibold text-xs sm:text-sm w-full sm:w-fit backdrop-blur-sm"
          >
            ← Kembali ke Beranda
          </Link>
        </div>

        <div className="w-full sm:w-1/3 flex justify-center order-first sm:order-none">
          <Link href="/" className="group flex items-center gap-2 bg-slate-950/90 border border-slate-800 px-4 py-2 rounded-2xl shadow-md">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span className="text-base sm:text-lg font-black tracking-widest text-white font-mono">
              MOVIE<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-amber-400">KUY</span>
            </span>
            <span className="text-[9px] font-mono font-bold text-sky-400/80 bg-sky-950/60 border border-sky-800/60 px-1.5 py-0.5 rounded uppercase ml-0.5">
              CINEMA
            </span>
          </Link>
        </div>

        <div className="w-full sm:w-1/3 hidden sm:flex justify-end">
          <Link href="/explore" className="text-xs font-mono font-bold text-slate-500 hover:text-sky-400 bg-slate-950/40 px-3.5 py-2 rounded-xl border border-slate-900">
            🔍 Cari Judul Lain
          </Link>
        </div>
      </div>

      {/* --- KONTEN VIDEO & DETAIL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          {/* Kirim numericId bersih ke VideoPlayer */}
          <VideoPlayer tmdbId={numericId} title={movie.title} />
          
          <div className="w-full"><AdBanner /></div>
          
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 sm:p-8 rounded-2xl">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-4">{movie.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((g: any) => (
                <span key={g.id} className="bg-slate-800 border border-slate-700/80 px-3 py-1 rounded-full text-[11px] font-semibold text-slate-300">
                  {g.name}
                </span>
              ))}
            </div>
            <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest font-mono">Sinopsis Film</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{movie.overview || 'Sinopsis tidak tersedia.'}</p>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 shadow-xl font-mono text-xs space-y-3.5">
            <h3 className="font-bold text-sm font-sans text-white border-b border-slate-800 pb-2.5 mb-3">📊 DETAIL INFO</h3>
            <div className="flex justify-between"><span className="text-slate-500">RILIS</span><span className="text-white font-bold">{movie.release_date}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">DURASI</span><span className="text-white font-bold">{movie.runtime} Menit</span></div>
            <div className="flex justify-between"><span className="text-slate-500">RATING</span><span className="text-amber-400 font-bold">★ {movie.vote_average?.toFixed(1)} / 10</span></div>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <span className="text-base animate-bounce">🔥</span>
              <h3 className="font-bold text-xs font-mono uppercase text-slate-200">Film Populer Lainnya</h3>
            </div>
            <div className="space-y-3">
              {sidebarMovies.map((item: any) => {
                const thumb = item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : 'https://via.placeholder.com/100x150';
                
                // --- MEMBUAT SLUG AGAR URL DI ADDRESS BAR ADA JUDULNYA ---
                const slugTitle = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                
                return (
                  <Link
                    key={item.id}
                    href={`/movie/${item.id}-${slugTitle}`}
                    className="group flex items-center gap-3.5 p-2 rounded-xl bg-slate-950/40 hover:bg-slate-800/80 transition border border-slate-800/50 hover:border-sky-500/40"
                  >
                    <img src={thumb} alt={item.title} className="w-12 h-16 rounded-lg object-cover bg-slate-800 shrink-0 group-hover:scale-105 transition" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-sky-400 truncate">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1.5 font-mono text-[10px] text-slate-500">
                        <span className="text-amber-400 font-bold">★ {item.vote_average?.toFixed(1)}</span>
                        <span>•</span>
                        <span>{item.release_date?.split('-')[0] || 'N/A'}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}