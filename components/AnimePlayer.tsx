'use client';
import { useState } from 'react';

export default function AnimePlayer({ malId, totalEpisodes }: { malId: string; totalEpisodes: number }) {
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [mode, setMode] = useState<'sub' | 'dub'>('sub');
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const maxEp = totalEpisodes || 12; // Fallback jika anime ongoing
  const videoUrl = `https://vidlink.pro/anime/${malId}/${selectedEpisode}/${mode}`;

  // PERBAIKAN SINTAKS: Menggunakan kurung kurawal yang benar agar tidak merusak interpretasi return JSX
  const handlePrev = () => {
    if (selectedEpisode > 1) {
      setSelectedEpisode((p) => p - 1);
    }
  };

  const handleNext = () => {
    if (selectedEpisode < maxEp) {
      setSelectedEpisode((p) => p + 1);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* --- EFEK BIOSKOP --- */}
      {isTheaterMode && (
        <div 
          onClick={() => setIsTheaterMode(false)} 
          className="fixed inset-0 bg-black/95 z-40 backdrop-blur-sm cursor-pointer"
        />
      )}

      <div className={`transition-all duration-500 space-y-3.5 ${isTheaterMode ? 'relative z-50 scale-[1.01]' : ''}`}>
        
        {/* --- PLAYER BOX --- */}
        <div className="w-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative">
          
          {/* BAR KONTROL ANIME (SUB vs DUB + THEATER) */}
          <div className="flex items-center justify-between p-2.5 bg-slate-900 border-b border-slate-800 text-xs font-bold gap-4">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-slate-500 px-2 font-mono shrink-0">AUDIO:</span>
              <button 
                onClick={() => setMode('sub')} 
                className={`px-3 py-1 rounded transition shrink-0 ${mode === 'sub' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                🇯🇵 Sub (Jepang)
              </button>
              <button 
                onClick={() => setMode('dub')} 
                className={`px-3 py-1 rounded transition shrink-0 ${mode === 'dub' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                🇺🇸 Dub (Inggris)
              </button>
            </div>

            <button 
              onClick={() => setIsTheaterMode(!isTheaterMode)} 
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 text-slate-300 rounded-lg border border-slate-800 hover:border-slate-700 transition shrink-0"
            >
              💡 {isTheaterMode ? 'Lampu On' : 'Mode Bioskop'}
            </button>
          </div>

          {/* AREA IFRAME 16:9 */}
          <div className="relative w-full pb-[56.25%] bg-black">
            <iframe 
              src={videoUrl} 
              className="absolute inset-0 w-full h-full border-0" 
              allowFullScreen 
              scrolling="no" 
              title="Anime Player Engine"
            />
          </div>
        </div>

        {/* --- NAVIGASI EPISODE --- */}
        <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-xl flex items-center justify-between gap-3 shadow-lg font-mono">
          <div className="text-xs text-orange-400 font-bold hidden sm:block">⚡ VIDLINK ANIME ENGINE</div>
          
          <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-between sm:justify-end">
            <button 
              onClick={handlePrev} 
              disabled={selectedEpisode <= 1} 
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-20 rounded-lg text-xs font-bold text-white transition active:scale-95"
            >
              ← Prev
            </button>
            <span className="text-xs text-slate-300 px-4 select-none">
              EP <b className="text-orange-500 text-sm sm:text-base">{selectedEpisode}</b> / {maxEp}
            </span>
            <button 
              onClick={handleNext} 
              disabled={selectedEpisode >= maxEp} 
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-20 rounded-lg text-xs font-bold text-white transition shadow-md shadow-orange-600/20 active:scale-95"
            >
              Next →
            </button>
          </div>
        </div>

      </div>

      {/* CSS Helper pemotong scrollbar horizontal audio mobile */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}