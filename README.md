# EduPedia

Portal media pembelajaran digital (HTML, CSS, JavaScript murni, tanpa build tool).

## Menjalankan
Buka `index.html` di browser. Tidak perlu server karena skrip dimuat sebagai file biasa (bukan ES module).
Font Google butuh internet; tanpa internet tampilan memakai font sistem.

## Struktur
```
index.html          kerangka halaman (navbar, sidebar, area utama) dan urutan muat skrip
css/style.css       semua gaya, tema gelap/terang lewat variabel di :root
js/store.js         utilitas ($, esc) dan penyimpanan preferensi/data (localStorage)
js/data.js          data awal mata pelajaran dan media, persist()
js/state.js         state aplikasi, go() untuk pindah halaman, loading()
js/components.js    sidebar, kartu mata pelajaran, bar informasi, hero, helper UI
js/pages.js         halaman: dashboard, mata pelajaran, media, favorit, tentang, admin
js/viewer.js        penampil media layar penuh
js/render.js        render() dan liveRender()
js/events.js        event klik/input/submit, pintasan keyboard, inisialisasi
```
Urutan muat di `index.html` penting: store, data, state, components, pages, viewer, render, events.

## Mengembangkan
- Tambah halaman: buat fungsi `pgNama()` di `pages.js`, daftarkan di objek `pages` dan `titles`, lalu tambahkan tombol dengan `data-go="nama"`.
- Pindah ke backend: ganti `store.get/set` di `store.js` dan `persist()` di `data.js` dengan panggilan API. Bagian lain tidak perlu diubah.
- Mode admin saat ini hanya sakelar di browser (menu profil). Pasang login sungguhan sebelum dipakai publik.
- Media dari folder yang diunggah lewat admin hanya tersimpan selama sesi. Untuk permanen, taruh folder media di `media/<mapel>/<nama>/` lalu isi kolom "Alamat media" (lihat bagian di bawah).

## Menambah media baru
1. Taruh folder media (index.html, CSS, JS, gambar) di `media/<mapel>/<nama>/`, contoh `media/ekonomi/permintaan/`. Contoh jadi ada di `media/ekonomi/contoh/`.
2. Buka EduPedia, menu profil > Masuk mode admin, lalu Kelola Admin > Media Pembelajaran.
3. Isi nama, pilih mata pelajaran, isi deskripsi, dan isi Alamat media: `media/ekonomi/permintaan/index.html`.
4. Klik Tambah media. Media langsung muncul di mata pelajaran dan Semua Media. Gunakan jalur relatif di dalam media (`style.css`, `img/a.png`) supaya CSS, JS, dan gambar tetap berfungsi.
