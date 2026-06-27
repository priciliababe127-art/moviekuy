'use client';
import { useState } from 'react';

interface TVPlayerProps {
  id: string;
  seasons: any[];
}

export default function TVPlayer({ id, seasons }: TVPlayerProps) {
  const [selectedServer, setSelectedServer] = useState("Server 1");
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // 1. Logika Cerdas: Mencari total episode di Season yang aktif
  const currentSeasonData = seasons?.find((s) => s.season_number === selectedSeason);
  const maxEpisodes = currentSeasonData?.episode_count || 1;

  // URL subtitle vtt (Ganti dengan CDN VTT kamu)
  const subUrl = "https://example.com/subtitles.vtt";
  const encodedSub = encodeURIComponent(subUrl);

  // 2. Multi-Server Terintegrasi Subtitle Eksternal
  const providers = {
    "Server 1": `https://vidlink.pro/tv/${id}/${selectedSeason}/${selectedEpisode}?sub_file=${encodedSub}`,
    "Server 2": `https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode}?sub_file=${encodedSub}`,
    "Server 3": `https://www.2embed.cc/embed/tv?tmdb=${id}&s=${selectedSeason}&e=${selectedEpisode}&sub_file=${encodedSub}`,
  };

  const handlePrev = () => {
    if (selectedEpisode > 1) setSelectedEpisode((prev) => prev - 1);
  };

  const handleNext = () => {
    if (selectedEpisode < maxEpisodes) setSelectedEpisode((prev) => prev + 1);
  };

  const handleSeasonChange = (newSeason: number) => {
    setSelectedSeason(newSeason);
    setSelectedEpisode(1);
  };

  return (
    <div className="space-y-3.5">
      
      {/* --- EFEK GLOWING AMBIENT (THEATER MODE BACKDROP) --- */}
      {isTheaterMode && (
        <div 
          onClick={() => setIsTheaterMode(false)}
          className="fixed inset-0 bg-black/95 z-40 transition-opacity duration-500 cursor-pointer backdrop-blur-sm"
          title="Klik di mana saja untuk mematikan mode bioskop"
        />
      )}

      {/* --- KESATUAN UNIT PUTAR (VIDEO + NAVIGASI EPISODE) --- */}
      {/* Jika mode bioskop aktif, seluruh grup ini terangkat ke z-50 di atas background hitam */}
      <div className={`transition-all duration-500 space-y-3.5 ${isTheaterMode ? 'relative z-50 scale-[1.01]' : ''}`}>

        {/* 1. KOTAK VIDEO UTAMA */}
        <div className={`w-full bg-slate-950 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-slate-800/80 relative ring-1 ring-slate-800/50 ${isTheaterMode ? 'ring-2 ring-sky-500/60 shadow-[0_0_70px_rgba(14,165,233,0.22)]' : ''}`}>
          
          {/* Header Controls (Server Switcher + Theater Toggle) */}
          <div className="flex items-center justify-between p-2.5 bg-gradient-to-b from-slate-900 via-slate-950/90 to-slate-950 border-b border-slate-800/80 gap-4">
            
            {/* Server List (Swipeable di HP) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 pr-2 select-none">
              <div className="flex items-center gap-1 bg-slate-900/60 p-0.5 rounded-lg border border-slate-800/60 shrink-0">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 px-2 uppercase hidden sm:inline">
                  SERVER
                </span>
              </div>

              {Object.keys(providers).map((name) => {
                const isActive = selectedServer === name;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedServer(name)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 shrink-0 flex items-center gap-1.5 active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-500/20 ring-1 ring-sky-400/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <svg className={`w-2.5 h-2.5 fill-current ${isActive ? 'text-white' : 'text-slate-500'}`} viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    {name}
                  </button>
                );
              })}
            </div>

            {/* Tombol Mode Bioskop (Desktop) */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-800 transition duration-300 shrink-0 ${
                isTheaterMode
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-mono text-[11px]">
                {isTheaterMode ? 'Lampu Menyala' : 'Mode Bioskop'}
              </span>
            </button>

          </div>

          {/* Area Iframe 16:9 */}
          <div className="relative w-full pb-[56.25%] bg-black">
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950 pointer-events-none z-0">
              <div className="w-8 h-8 border-4 border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
            </div>
            <iframe
              src={providers[selectedServer as keyof typeof providers]}
              className="absolute top-0 left-0 w-full h-full border-0 z-10"
              allowFullScreen
              scrolling="no"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              title="TV Series Player"
            ></iframe>
          </div>

        </div>

        {/* 2. SMART NAVIGATION BAR (SEASON & EPISODE) */}
        <div className={`bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 p-3 sm:p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg ${isTheaterMode ? 'border-sky-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.9)]' : ''}`}>
          
          {/* Kiri: Dropdown Season */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-[11px] font-mono font-bold text-sky-400">SEASON</span>
            </div>
            <select
              value={selectedSeason}
              onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
              className="bg-slate-900 border border-slate-700 hover:border-slate-600 text-white font-bold text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500 cursor-pointer flex-1 sm:flex-none shadow-inner transition"
            >
              {seasons?.map((s: any) => (
                <option key={s.season_number} value={s.season_number} className="bg-slate-900 text-slate-200 py-1">
                  Season {s.season_number} ({s.episode_count} Episode)
                </option>
              ))}
            </select>
          </div>

          {/* Kanan: Grup Tombol Prev / Indicator / Next */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80 w-full sm:w-auto shadow-inner">
            
            <button
              onClick={handlePrev}
              disabled={selectedEpisode <= 1}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none text-xs font-bold text-slate-200 transition flex items-center gap-1.5 border border-slate-800/60 active:scale-95 shrink-0"
              title="Episode Sebelumnya"
            >
              <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              <span className="hidden xs:inline">Prev</span>
            </button>

            <div className="px-4 py-1 text-xs font-mono text-slate-400 text-center select-none min-w-[90px]">
              EP <span className="text-sky-400 font-black text-sm sm:text-base">{selectedEpisode}</span> <span className="text-slate-600">/</span> {maxEpisodes}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedEpisode >= maxEpisodes}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-20 disabled:pointer-events-none text-xs font-bold text-white transition shadow-md shadow-sky-600/20 flex items-center gap-1.5 active:scale-95 shrink-0"
              title="Episode Selanjutnya"
            >
              <span className="hidden xs:inline">Next</span>
              <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>

          </div>

        </div>

      </div>

      {/* CSS Helper pemotong scrollbar horizontal */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

    </div>
  );
}