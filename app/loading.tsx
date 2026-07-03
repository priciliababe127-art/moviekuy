export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-4 z-50">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-sky-500 border-t-transparent animate-spin"></div>
      </div>
      <span className="text-xs font-mono font-bold tracking-widest text-sky-400 animate-pulse uppercase">
        Loading...
      </span>
    </div>
  );
}