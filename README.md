# Wedding Timeless HTML

Sebuah halaman undangan pernikahan statis yang tampaknya diekspor dari WordPress / Elementor dan dilengkapi dengan aset lokal, video background, serta beberapa skrip kustom.

## Ringkasan

- Halaman utama: `index.html`
- Style kustom: `app.css`
- Script kustom: `app.js`
- Content loader: `assets/js/content-loader.js`
- Data konten: `assets/data/content.json`
- Aset pendukung: `assets/`

## Fitur

- Undangan pernikahan one-page responsif
- Background video pada bagian full-screen
- Panel konten kanan yang scrollable dan panel kiri tetap (desktop)
- Galeri lightbox kustom dengan navigasi keyboard dan swipe mobile
- Dukungan audio toggle (sound on/off)
- Aset Elementor dan library pendukung tersimpan secara lokal di folder `assets/`
- **JSON-driven content binding**: Teks, gambar, video, dan audio dapat diatur dari file JSON tanpa memodifikasi HTML

## Content Binding (JSON-driven)

Halaman mendukung content binding berbasis JSON melalui data attributes:

### File Konfigurasi

- `assets/data/content.json` - Menyimpan semua nilai konten (teks, path aset)
- `assets/js/content-loader.js` - Script yang memuat JSON dan mengisi elemen HTML

### Data Attributes yang Didukung

- `data-text-key="path.to.value"` - Isi text content dari JSON
- `data-src-key="path.to.value"` - Set attribute `src` dari JSON
- `data-video-src-key="path.to.value"` - Set video `src` dari JSON
- `data-audio-src-key="path.to.value"` - Set audio `src` dari JSON
- `data-bg-key="path.to.value"` - Set background image dari JSON
- `data-href-key="path.to.value"` - Set link `href` dari JSON

### Contoh `assets/data/content.json`

```json
{
  "hero": {
    "name1": "Handon",
    "connector": "and",
    "name2": "Cathrine",
    "inviteTitle": "WE INVITE YOU TO CELEBRATE",
    "openButton": "LET'S OPEN",
    "backgroundVideo": "assets/media/Hanson-Catherine-CoupleSession.mp4",
    "previewImage": "assets/images/Timeless-00025-1.jpg"
  },
  "audio": {
    "track": "assets/media/YOU-by-Morgan-Saint.mp3"
  }
}
```

### Cara Menggunakan

1. Tambahkan data attribute ke elemen HTML:
   ```html
   <h2 data-text-key="hero.name1">Handon</h2>
   <video data-video-src-key="hero.backgroundVideo" src="" autoplay muted></video>
   ```

2. Update nilai di `assets/data/content.json`

3. Script `content-loader.js` otomatis memuat dan mengisi elemen saat halaman dimuat

### Keuntungan

- Mudah mengubah konten tanpa mengedit HTML
- Centralized content management
- Cocok untuk template dinamis atau multi-bahasa

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
