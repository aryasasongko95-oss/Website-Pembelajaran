
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
].map(([id,name,icon,desc]) => ({id,name,icon,desc}));

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
  id,name,subject,desc
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


const persist = () => {
  store.set('subjects', subjects);
  store.set('materials', materials);
  store.set('media', media);
  store.set('favs', favs);
};

