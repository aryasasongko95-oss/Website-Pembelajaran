/* EduPedia - Data mata pelajaran, materi, dan media */

/* ---------- Mata Pelajaran ---------- */
const seedSubjects = [
  ['ekonomi','Ekonomi','💹','Konsep produksi, konsumsi, distribusi, dan perilaku pasar.'],
  ['matematika','Matematika','📐','Aljabar, geometri, kalkulus, dan statistika.'],
  ['biologi','Biologi','🧬','Makhluk hidup, sel, genetika, dan ekosistem.'],
  ['fisika','Fisika','⚛️','Gerak, energi, gelombang, dan kelistrikan.'],
  ['kimia','Kimia','🧪','Struktur materi, reaksi, dan larutan.'],
  ['sejarah','Sejarah','🏛️','Peristiwa dan tokoh penting dari masa ke masa.'],
  ['geografi','Geografi','🌏','Bumi, wilayah, iklim, dan sebaran penduduk.'],
  ['bahasa-indonesia','Bahasa Indonesia','📖','Membaca, menulis, dan berbahasa yang baik.'],
  ['bahasa-inggris','Bahasa Inggris','🔤','Grammar, vocabulary, dan komunikasi.'],
  ['sosiologi','Sosiologi','👥','Masyarakat, interaksi sosial, dan perubahan sosial.']
].map(([id,name,icon,desc]) => ({
  id,
  name,
  icon,
  desc
}));

/* ---------- Materi ---------- */
const seedMaterials = [
  ['p1','Perilaku Produsen','ekonomi','Biaya, produksi, dan keuntungan produsen.'],
  ['p2','Permintaan dan Penawaran','ekonomi','Kurva dan keseimbangan pasar.'],
  ['p3','Teori Konsumen','ekonomi','Utilitas dan pilihan konsumen.'],
  ['p4','Pasar','ekonomi','Jenis dan struktur pasar.'],
  ['p5','Pendapatan Nasional','ekonomi','PDB, PNB, dan cara menghitungnya.'],
  ['p6','Fungsi Kuadrat','matematika','Grafik dan akar persamaan kuadrat.'],
  ['p7','Sel dan Organel','biologi','Struktur dan fungsi bagian sel.']
].map(([id,name,subject,desc]) => ({
  id,
  name,
  subject,
  desc
}));

/* ---------- Data Media ---------- */
const sampleHtml = t => `<!doctype html>
<meta charset="utf-8">
<body style="font-family:system-ui;padding:32px;max-width:640px;margin:auto">
<h1>${t}</h1>
<p>Ini media contoh EduPedia.</p>
</body>`;

/* ---------- Penyimpanan ---------- */
let subjects = store.get('subjects', seedSubjects);
let materials = store.get('materials', seedMaterials);
let media = store.get('media', []);
let favs = store.get('favs', []);
let isAdmin = store.get('admin', false);

const htmlOf = m => m.html || sampleHtml(m.name);

/* ---------- Persist Data ---------- */
const persist = () => {
  store.set('subjects', subjects);
  store.set('materials', materials);
  store.set('media', media);
  store.set('favs', favs);
};

/* ---------- Database Online ---------- */

window.loadOnlineMedia = function() {
  return new Promise(resolve => {
    const callbackName = 'eduPediaCallback_' + Date.now();
    const script = document.createElement('script');

    script.src =
      'https://script.google.com/macros/s/AKfycbwcvSbavl3tjOuzfrhEYBB5WPwOceEz9Q3Uvp65HYVNe5A-0fZSAyZ1IT3MwgruPoPh7Q/exec' +
      '?action=list&callback=' + callbackName;

    window[callbackName] = function(result) {
      try {
        if (result && result.status === 'success') {
          console.log('DATA DARI GOOGLE SHEETS:', result.media);

          const onlineMedia = (result.media || []).map(item => ({
            id: item.id,
            name: item.name,
            subject: item.subject,
            material: item.material,
            category: item.category,
            desc: item.desc || '',
            url: item.url || '',
            downloadUrl: item.downloadUrl || '',
            date: item.date,
            html: '',
            docId: '',
            fileName: '',
            upload: false
          }));

          // Hapus dokumen lokal yang sudah tidak menjadi sumber utama.
          const localMedia = media.filter(item => {
            const category = String(item.category || '').toUpperCase();

            const isLocalDocument =
              String(item.id).startsWith('m') &&
              ['PDF', 'PPT', 'PPTX', 'DOKUMEN'].includes(category) &&
              !item.url;

            return !isLocalDocument;
          });

          // Gabungkan media lokal dan online.
          const mediaMap = new Map();

          localMedia.forEach(item => {
            mediaMap.set(item.id, item);
          });

          onlineMedia.forEach(item => {
            const localItem = mediaMap.get(item.id);

            mediaMap.set(item.id, {
              ...localItem,
              ...item
            });
          });

          // Simpan hasil sinkronisasi.
          media = Array.from(mediaMap.values());

          store.set('media', media);

          console.log('MEDIA SETELAH SINKRONISASI:', media);

          console.table(media.map(item => ({
            id: item.id,
            nama: item.name,
            kategori: item.category
          })));

          if (typeof render === 'function') {
            render();
          }
        } else {
          console.error('Database online gagal:', result);
        }
      } catch (error) {
        console.error('Sinkronisasi media gagal:', error);
      }

      delete window[callbackName];
      script.remove();
      resolve();
    };

    script.onerror = function() {
      delete window[callbackName];
      script.remove();

      console.error('Gagal memuat database online');
      resolve();
    };

    document.body.appendChild(script);
  });
};

/* ---------- Muat Database Saat Aplikasi Dibuka ---------- */

window.loadOnlineMedia();