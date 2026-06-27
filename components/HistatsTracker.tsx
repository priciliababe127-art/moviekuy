'use client';
import Script from 'next/script';

export default function HistatsTracker() {
  // GANTI KODE DI BAWAH DENGAN ID HISTATS KAMU
  // Kamu bisa lihat ID ini di kode asli Histats kamu (bagian yang ada angkanya)
  const HISTATS_ID = "4946765"; 

  return (
    <>
      {/* Script Utama Histats */}
      <Script id="histats-async" strategy="afterInteractive">
        {`
          var _Hasync= _Hasync|| [];
          _Hasync.push(['Histats.start', '1,${HISTATS_ID},4,0,0,0,00010000']);
          _Hasync.push(['Histats.fasi', '1']);
          _Hasync.push(['Histats.track_hits', '']);
          (function() {
            var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
            hs.src = ('//s10.histats.com/js15_as.js');
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
          })();
        `}
      </Script>

      {/* NoScript Pixel (Cadangan jika JS dimatikan user) */}
      <noscript>
<a href="/" target="_blank">
    <img 
      src={`//sstatic1.histats.com/0.gif?${HISTATS_ID}&101`} 
      alt="histats" 
      style={{ border: 'none' }} // Menggunakan style objek untuk menggantikan border="0"
    />
        </a>
      </noscript>
    </>
  );
}