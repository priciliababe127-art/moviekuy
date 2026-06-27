import { getAnimeDetail, getMedia } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import AnimePlayer from '@/components/AnimePlayer';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';

export default async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [anime, popAnime] = await Promise.all([
    getAnimeDetail(id),
    getMedia({ type: 'anime' })
  ]);

  if (!anime) notFound();

  const sidebarList = popAnime.filter((x: any) => x.id.toString() !== id).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 sm:p-6 pt-8 max-w-7xl mx-auto pb-20">
      <Link href="/?type=anime" className="inline-block text-xs font-semibold text-slate-400 hover:text-orange-400 mb-6 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">← Kembali ke Daftar Anime</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimePlayer malId={id} totalEpisodes={anime.episodes || 24} />
          <AdBanner />
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <h1 className="text-2xl sm:text-3xl font-black">{anime.title}</h1>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">{anime.synopsis}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-3">
            <h3 className="font-bold text-orange-400 border-b border-slate-800 pb-2">⛩️ MAL DATA</h3>
            <div className="flex justify-between"><span>SCORE</span><b className="text-amber-400">★ {anime.score}</b></div>
            <div className="flex justify-between"><span>STATUS</span><b>{anime.status}</b></div>
            <div className="flex justify-between"><span>EPISODES</span><b>{anime.episodes || '?'} Ep</b></div>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold font-mono text-slate-400 mb-2">🔥 ANIME POPULER LAINNYA</h3>
            {sidebarList.map((item: any) => (
              <Link key={item.id} href={`/anime/${item.id}`} className="flex gap-3 p-2 rounded-xl hover:bg-slate-800 transition">
                <img src={item.poster_path} alt="" className="w-12 h-16 rounded object-cover shrink-0" />
                <div className="min-w-0 text-xs"><b className="truncate block text-slate-200">{item.title}</b><span className="text-amber-400 text-[10px] block mt-1">★ {item.vote_average}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}