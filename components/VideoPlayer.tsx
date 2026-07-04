'use client';
import { useState } from 'react';

export default function VideoPlayer({ tmdbId, title }: { tmdbId: string; title: string }) {
  const [selectedServer, setSelectedServer] = useState("Server 1");
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // URL subtitle vtt (Ganti dengan CDN subtitle VTT kamu)
  const subUrl = "https://example.com/subtitles.vtt";
  const encodedSub = encodeURIComponent(subUrl);

  // Konfigurasi Server Multi-Source Terintegrasi Subtitle
  const providers = {
    "Server 1": `https://vidlink.pro/movie/${tmdbId}?sub_file=${encodedSub}`,
    "Server 2": `https://www.2embed.online/embed/movie/${tmdbId}`,
    "Server 3": `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
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

      {/* --- KESATUAN UNIT PUTAR (VIDEO + CINEMA DASHBOARD) --- */}
      <div className={`transition-all duration-500 space-y-3.5 ${isTheaterMode ? 'relative z-50 scale-[1.01]' : ''}`}>

        {/* 1. KOTAK VIDEO UTAMA */}
        <div className={`w-full bg-slate-950 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-slate-800/80 relative ring-1 ring-slate-800/50 ${isTheaterMode ? 'ring-2 ring-sky-500/60 shadow-[0_0_70px_rgba(14,165,233,0.22)]' : ''}`}>
          
          {/* Header Controls (Server Switcher + Theater Toggle) */}
          <div className="flex items-center justify-between p-2.5 bg-gradient-to-b from-slate-900 via-slate-950/90 to-slate-950 border-b border-slate-800/80 gap-4">
            
            {/* Server List (Swipeable di Mobile) */}
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

          {/* Area Iframe 16:9 dengan Watermark Logo */}
          <div className="relative w-full pb-[56.25%] bg-black group">
            
            {/* --- [BARU] WATERMARK LOGO MOVIEKUY DI ATAS TENGAH --- */}
            {/* pointer-events-none sangat PENTING agar logo tidak memblokir klik penonton ke layar iframe */}
            <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none transition-opacity duration-300 opacity-80 group-hover:opacity-100">
              <div className="bg-slate-950/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]"></span>
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-white font-mono">
                  MOVIE<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-amber-400">KUY</span>
                </span>
                <span className="text-[8px] font-mono text-slate-400 border-l border-slate-700 pl-1.5 uppercase hidden sm:inline">
                  HD Stream
                </span>
              </div>
            </div>

            {/* Spinner Loading Latar Belakang */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950 pointer-events-none z-0">
              <div className="w-8 h-8 border-4 border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
            </div>

            {/* Iframe Pemutar Video */}
            <iframe
              src={providers[selectedServer as keyof typeof providers]}
              className="absolute top-0 left-0 w-full h-full border-0 z-10"
              allowFullScreen
              scrolling="no"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              title={`Streaming ${title}`}
            ></iframe>
          </div>

        </div>

        {/* 2. CINEMA STREAM DASHBOARD BAR */}
        <div className={`bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 p-3 sm:p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg ${isTheaterMode ? 'border-sky-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.9)]' : ''}`}>
          
          {/* Kiri: Indikator Status & Judul Film */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1.5 rounded-lg shrink-0">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"/>
              <span className="text-[10px] font-mono font-bold text-sky-400 tracking-wider">ONLINE</span>
            </div>
            <span className="text-xs font-bold text-slate-200 truncate select-none">
              {title}
            </span>
          </div>

          {/* Kanan: Spesifikasi Teknis Pemutar */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0 select-none">
            <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800/80 text-[10px] font-mono font-bold text-slate-400">
              1080P HD
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800/80 text-[10px] font-mono font-bold text-amber-400 hidden xs:inline">
              ★ DOLBY AUDIO
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800/80 text-[10px] font-mono font-bold text-sky-400">
              SUB INDO
            </span>
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