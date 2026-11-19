/* EduPedia - Penampil media layar penuh. */
/* ---------- Viewer media ---------- */


/* ---------- Google Drive Preview ---------- */

function getDrivePreviewUrl(url) {
  if (!url) return '';

  const match = url.match(
    /\/file\/d\/([a-zA-Z0-9_-]+)|[?&]id=([a-zA-Z0-9_-]+)/
  );

  if (match) {
    const fileId = match[1] || match[2];

    return 'https://drive.google.com/file/d/' +
      fileId +
      '/preview';
  }

  return url;
}


/* ---------- Viewer Media ---------- */

async function openMedia(id) {

  const m = media.find(x => x.id === id);

  if (!m) {
    toast('Media tidak ditemukan', 'er');
    return;
  }

  const v = document.createElement('div');

  v.className = 'viewer';
  v.id = 'viewer';
  v.dataset.id = m.id;

  addRecent(m.id);

  store.set('lastMedia', m.id);

  v.innerHTML = `
    <header>
      <button class="btn g s" data-back>
        ← Kembali
      </button>

      <button class="btn g s" data-home>
        Dashboard
      </button>

      <b style="margin-left:6px">
        ${esc(m.name)}
      </b>

      <span class="mut" style="flex:1">
        ${esc(subj(m.subject)?.name || '')}
      </span>

      <button class="btn g s" data-vp aria-label="Sebelumnya">
        ‹
      </button>

      <button class="btn g s" data-vn aria-label="Berikutnya">
        ›
      </button>

      <button class="btn g s" data-vf>
        ${favs.includes(m.id) ? '★' : '☆'} Favorit
      </button>

      <button class="btn g s" data-vz>
        ⛶ Layar penuh
      </button>
    </header>

    <iframe
      title="${esc(m.name)}"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
      allowfullscreen>
    </iframe>
  `;

  document.body.append(v);

history.pushState(
  { edupediaViewer: true, timestamp: Date.now() },
  '',
  location.href
);

  const f = $('iframe', v);


  /* ---------- File Dokumen ---------- */

  if (m.docId) {

    try {

      await docDB.init();

      const doc = await docDB.get(m.docId);


      /* ---------- File Lokal ---------- */

      if (doc && doc.blob) {

        const fileUrl = URL.createObjectURL(doc.blob);

        v.dataset.objectUrl = fileUrl;

        const fileName =
          doc.name ||
          m.fileName ||
          m.name ||
          'dokumen';

        const extension = fileName
          .split('.')
          .pop()
          .toLowerCase();


        /* ---------- PDF Lokal ---------- */

        if (extension === 'pdf') {

          f.removeAttribute('sandbox');

          f.src = fileUrl;

        }


        /* ---------- DOCX Lokal ---------- */

        else if (extension === 'docx') {

          f.removeAttribute('sandbox');

          f.srcdoc = `
            <!DOCTYPE html>

            <html>
            <head>
              <meta charset="UTF-8">

              <script src="https://unpkg.com/jszip/dist/jszip.min.js"><\/script>

              <script src="https://unpkg.com/docx-preview/dist/docx-preview.min.js"><\/script>

              <style>
                body {
                  background: #eee;
                  padding: 20px;
                  font-family: Arial;
                }

                #docx-container {
                  max-width: 900px;
                  margin: auto;
                  background: white;
                }
              </style>
            </head>

            <body>

              <div id="docx-container">
                Memuat dokumen...
              </div>

              <script>
                window.onload = async () => {

                  try {

                    const response = await fetch("${fileUrl}");

                    const blob = await response.blob();

                    await docx.renderAsync(
                      blob,
                      document.getElementById('docx-container')
                    );

                  } catch (error) {

                    document.getElementById('docx-container').textContent =
                      'Gagal menampilkan dokumen: ' + error.message;

                    console.error(error);
                  }
                };
              <\/script>

            </body>
            </html>
          `;

        }


        /* ---------- PPTX Lokal ---------- */

        else if (extension === 'pptx') {

          f.removeAttribute('sandbox');

          f.srcdoc = `
            <!DOCTYPE html>

            <html>
            <head>
              <meta charset="UTF-8">

              <style>
                * {
                  box-sizing: border-box;
                }

                html, body {
                  margin: 0;
                  width: 100%;
                  min-height: 100%;
                }

                body {
                  padding: 15px;
                  background: #eee;
                  font-family: Arial, sans-serif;
                }

                #pptx-container {
                  width: 100%;
                  min-height: 75vh;
                  display: flex;
                  justify-content: center;
                  align-items: flex-start;
                  overflow: auto;
                }
              </style>
            </head>

            <body tabindex="0">

              <div id="pptx-container"></div>

              <script type="module">

                import {
                  PptxViewer,
                  RECOMMENDED_ZIP_LIMITS
                } from './js/aiden0z-pptx-renderer.browser.es.js';

                try {

                  const response = await fetch("${fileUrl}");

                  if (!response.ok) {
                    throw new Error('File PPTX gagal dimuat');
                  }

                  const buffer = await response.arrayBuffer();

                  const container =
                    document.getElementById('pptx-container');

                  const viewer = await PptxViewer.open(
                    buffer,
                    container,
                    {
                      renderMode: 'slide',
                      fitMode: 'contain',
                      zipLimits: RECOMMENDED_ZIP_LIMITS
                    }
                  );

                  document.body.focus();

                  document.addEventListener('keydown', async (e) => {

                    if (e.key === 'ArrowRight') {

                      e.preventDefault();

                      if (
                        viewer.currentSlideIndex <
                        viewer.slideCount - 1
                      ) {

                        await viewer.goToSlide(
                          viewer.currentSlideIndex + 1
                        );
                      }
                    }

                    if (e.key === 'ArrowLeft') {

                      e.preventDefault();

                      if (viewer.currentSlideIndex > 0) {

                        await viewer.goToSlide(
                          viewer.currentSlideIndex - 1
                        );
                      }
                    }

                  });

                } catch (error) {

                  console.error(error);

                  document.getElementById('pptx-container').textContent =
                    'Gagal membuka PPTX: ' + error.message;
                }

              <\/script>

            </body>
            </html>
          `;

        }


        /* ---------- Format Lain ---------- */

        else {

          f.srcdoc = `
            <body style="
              font-family:Arial;
              text-align:center;
              padding:40px
            ">

              <h2>${esc(fileName)}</h2>

              <p>
                Dokumen ini perlu diunduh untuk dibuka.
              </p>

              <a href="${fileUrl}" download="${esc(fileName)}">
                Unduh Dokumen
              </a>

            </body>
          `;
        }

        return;
      }


      /* ---------- File Lokal Tidak Ditemukan ---------- */

      console.log(
        'File lokal tidak ditemukan. Menggunakan Google Drive:',
        m.name
      );

    } catch (error) {

      console.error(
        'Gagal membaca dokumen lokal:',
        error
      );

      console.log(
        'Mencoba membuka dokumen dari Google Drive.'
      );

    }

  }


  /* ---------- File Online / Google Drive ---------- */

if (m.url) {
  f.removeAttribute('sandbox');

if (m.category === 'PPT') {
  let downloadUrl = m.downloadUrl || '';

  if (!downloadUrl && m.url) {
    const match = m.url.match(
      /\/(?:file\/d|presentation\/d)\/([a-zA-Z0-9_-]+)|[?&]id=([a-zA-Z0-9_-]+)/
    );

    if (match) {
      const fileId = match[1] || match[2];

      downloadUrl = m.url.includes('docs.google.com/presentation')
        ? `https://docs.google.com/presentation/d/${fileId}/export/pptx`
        : `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }

  if (downloadUrl) {
    window.location.href = downloadUrl;
    return;
  }
}

  const previewUrl = getDrivePreviewUrl(m.url);
  f.src = previewUrl;
  return;
}


  /* ---------- HTML Media ---------- */

  if (m.html) {

    f.srcdoc = htmlOf(m);

    return;
  }


  /* ---------- Media Tidak Tersedia ---------- */

  f.srcdoc = `
    <body style="
      font-family:Arial;
      text-align:center;
      padding:40px
    ">

      <h2>Media tidak tersedia</h2>

      <p>
        File media tidak ditemukan di penyimpanan lokal
        maupun Google Drive.
      </p>

    </body>
  `;

}


/* ---------- Tutup Viewer ---------- */

const closeViewer = (fromHistory = false) => {
  const v = $('#viewer');

  if (v) {
    if (v.dataset.objectUrl) {
      URL.revokeObjectURL(v.dataset.objectUrl);
    }

    store.set('lastMedia', null);
    v.remove();
    render();

    if (!fromHistory && history.state?.edupediaViewer) {
      history.back();
    }
  }
};
window.addEventListener('popstate', () => {
  alert('POPSTATE TERPANGGIL');

  if ($('#viewer')) {
    closeViewer(true);
  }
});