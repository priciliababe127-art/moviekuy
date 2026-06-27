export default function AdBanner() {
  // Kita bungkus script iklanmu ke dalam dokumen HTML mini murni
  const adHTML = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : 'dfd8c3ba0c7d710ead4cfc8eeae3617d',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://expulsiondatabaseinnocent.com/dfd8c3ba0c7d710ead4cfc8eeae3617d/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center items-center overflow-hidden py-2 bg-slate-900/40 rounded-2xl border border-slate-800/60 min-h-[80px]">
      <iframe
        title=""
        srcDoc={adHTML}
        width="468"
        height="60"
        className="border-0 overflow-hidden max-w-full"
        scrolling="no"
      />
    </div>
  );
}