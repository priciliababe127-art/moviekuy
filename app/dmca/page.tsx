export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 p-6 sm:p-12 max-w-4xl mx-auto pb-24 leading-relaxed text-sm sm:text-base">
      <h1 className="text-2xl sm:text-4xl font-black text-white font-mono mb-6 border-b border-slate-800 pb-4">🛡️ DMCA COPYRIGHT DISCLAIMER</h1>
      
      <div className="space-y-6 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800 text-slate-300">
        <p className="font-semibold text-white">
          MovieKuy (moviekuy.sociosquad.net) mematuhi penuh Digital Millennium Copyright Act (17 U.S.C. § 512) dan seluruh hukum hak cipta internasional yang berlaku.
        </p>

        <h3 className="text-white font-bold pt-2">1. Pernyataan Kepemilikan Server</h3>
        <p>
          MovieKuy **TIDAK** mengunggah, menyimpan, atau menampung file video, audio, media, atau dokumen apa pun di dalam server atau infrastruktur hosting kami. Seluruh konten pemutar video yang tampil di situs ini disematkan langsung via kode *Embed/Iframe* dari pihak ketiga yang tersedia secara bebas di internet (seperti VidLink, 2Embed, VidSrc, dan YouTube).
        </p>

        <h3 className="text-white font-bold pt-2">2. Batasan Tanggung Jawab</h3>
        <p>
          Kami bertindak murni sebagai mesin pencari pengindeks (*indexing engine*) otomatis. Kami tidak memiliki kontrol atas konten yang diunggah ke penyedia host eksternal tersebut. Kami tidak bertanggung jawab atas legalitas, keakuratan, kepatuhan, atau hak cipta dari tautan pihak ketiga tersebut.
        </p>

        <h3 className="text-white font-bold pt-2">3. Prosedur Pengajuan Takedown (Penghapusan)</h3>
        <p>
          Jika Anda adalah pemilik hak cipta resmi dan merasa ada konten di situs kami yang melanggar hak Anda, **mengirimkan surat tuntutan kepada kami tidak akan menghapus video tersebut dari internet**, karena video fisiknya tidak ada di server kami. 
        </p>
        <p>
          Silakan ajukan laporan penghapusan (*DMCA Takedown Request*) langsung kepada penyedia server video bersangkutan (VidLink.pro / 2Embed.cc). Begitu mereka menghapus file tersebut dari server mereka, sistem otomatis MovieKuy akan langsung merender pemutar video tersebut menjadi kosong (*404 Not Found*).
        </p>
      </div>

    </div>
  );
}