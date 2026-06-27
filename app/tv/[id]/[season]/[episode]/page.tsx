import { getTVDetail } from '@/lib/tmdb'; // Import dengan cara yang benar
import { notFound } from 'next/navigation';
import AdBanner from '@/components/AdBanner';
import VideoPlayer from '@/components/VideoPlayer';
import BookmarkButton from '@/components/BookmarkButton';
import { Metadata } from 'next';

export default async function TVDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Panggil fungsinya langsung
  const tv = await getTVDetail(id);

  if (!tv) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-6">
      <h1 className="text-4xl font-bold">{tv.name}</h1>
      <p className="text-slate-400 mt-2">{tv.overview}</p>

      {/* Daftar Musim */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Pilih Musim</h2>
        {tv.seasons.map((s: any) => (
          <div key={s.id} className="mb-4">
            <h3 className="text-lg text-sky-400 font-semibold">{s.name} ({s.episode_count} Episode)</h3>
            {/* ... tombol episode ... */}
          </div>
        ))}
      </div>
    </div>
  );
}