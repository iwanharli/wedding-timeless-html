# Wedding Timeless HTML

Sebuah halaman undangan pernikahan statis yang tampaknya diekspor dari WordPress / Elementor dan dilengkapi dengan aset lokal, video background, serta beberapa skrip kustom.

## Ringkasan

- Halaman utama: `index.html`
- Style kustom: `app.css`
- Script kustom: `app.js`
- Aset pendukung: `assets/`

## Fitur

- Undangan pernikahan one-page responsif
- Background video pada bagian full-screen
- Panel konten kanan yang scrollable dan panel kiri tetap (desktop)
- Galeri lightbox kustom dengan navigasi keyboard dan swipe mobile
- Dukungan audio toggle (sound on/off)
- Aset Elementor dan library pendukung tersimpan secara lokal di folder `assets/`

## Konten Utama

- `index.html` - halaman HTML statis lengkap
- `app.css` - custom style untuk layout desktop/mobile, video background, dan tipografi
- `app.js` - custom JavaScript untuk lightbox gallery, audio toggle, dan fungsionalitas interaktif lainnya
- `assets/` - folder berisi CSS dan JS library, font, gambar, media, dan vendor pendukung

## Cara Menjalankan

1. Buka `index.html` secara langsung di browser
2. Atau jalankan server lokal jika diperlukan:
   - Python 3:
     ```bash
     python3 -m http.server 8000
     ```
   - Kemudian akses `http://localhost:8000`

## Kustomisasi

- Ubah konten undangan di `index.html`
- Sesuaikan tampilan dengan memodifikasi `app.css`
- Tambahkan atau ubah perilaku JavaScript di `app.js`
- Ganti aset gambar dan video di `assets/images/` dan `assets/media/`

## Catatan

- Proyek ini berisi banyak file `assets/` yang berasal dari Elementor dan plugin WordPress, jadi map `assets/` adalah bagian penting dari halaman.
- Jika ingin membersihkan atau memperkecil proyek, periksa file CSS/JS yang tidak terpakai di `assets/css/` dan `assets/js/`.
