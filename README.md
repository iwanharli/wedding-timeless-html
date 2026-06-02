# Wedding Timeless HTML

Sebuah halaman undangan pernikahan statis yang tampaknya diekspor dari WordPress / Elementor dan dilengkapi dengan aset lokal, video background, serta beberapa skrip kustom.

## Ringkasan

- Halaman utama: `index.html`
- Style kustom: `app.css`
- Script kustom: `app.js`
- Content loader: `assets/js/content-loader.js`
- Data konten: `assets/data/content-data.js` (JS variable, kompatibel `file://`)
- Referensi konten: `assets/data/content.json` (source of truth, tidak diload browser)
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

Halaman mendukung content binding berbasis data attributes. Konten dikelola melalui satu file tanpa perlu mengedit HTML.

### File Konfigurasi

- `assets/data/content-data.js` - Data konten sebagai `window.CONTENT_DATA` (diload via `<script>` tag, bekerja di `file://` maupun HTTP)
- `assets/data/content.json` - Source of truth JSON untuk referensi/editing manual
- `assets/js/content-loader.js` - Script yang membaca `window.CONTENT_DATA` dan mengisi elemen HTML

### Cara Edit Konten

1. Edit nilai di `assets/data/content.json`
2. Salin isi JSON ke `assets/data/content-data.js`, wrap dengan `window.CONTENT_DATA = { ... };`

> **Catatan:** `content.json` tidak diload langsung oleh browser. Browser memblokir request XHR ke `file://` (CORS policy). Solusinya menggunakan `content-data.js` yang di-include sebagai script biasa.

### Data Attributes yang Didukung

- `data-text-key="path.to.value"` - Isi text content dari JSON
- `data-src-key="path.to.value"` - Set attribute `src` dari JSON
- `data-video-src-key="path.to.value"` - Set video `src` dari JSON
- `data-audio-src-key="path.to.value"` - Set audio `src` dari JSON
- `data-bg-key="path.to.value"` - Set background image dari JSON
- `data-href-key="path.to.value"` - Set link `href` dari JSON

### Contoh `assets/data/content-data.js`

```js
window.CONTENT_DATA = {
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
};
```

### Cara Menggunakan

1. Tambahkan data attribute ke elemen HTML:
   ```html
   <h2 data-text-key="hero.name1">Handon</h2>
   <video data-video-src-key="hero.backgroundVideo" src="" autoplay muted></video>
   ```

2. Update nilai di `assets/data/content-data.js`

3. Script `content-loader.js` otomatis membaca `window.CONTENT_DATA` dan mengisi elemen saat halaman dimuat

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

1. Buka `index.html` secara langsung di browser (tanpa server)
2. Atau jalankan server lokal untuk akses via HTTP:
   - Python 3:
     ```bash
     python3 -m http.server 8000
     ```
   - Kemudian akses `http://localhost:8000`
   - VS Code: klik kanan `index.html` → **Open with Live Server**

## Kustomisasi

- Ubah konten undangan di `index.html`
- Sesuaikan tampilan dengan memodifikasi `app.css`
- Tambahkan atau ubah perilaku JavaScript di `app.js`
- Ganti aset gambar dan video di `assets/images/` dan `assets/media/`

## Catatan

- Proyek ini berisi banyak file `assets/` yang berasal dari Elementor dan plugin WordPress, jadi map `assets/` adalah bagian penting dari halaman.
- Jika ingin membersihkan atau memperkecil proyek, periksa file CSS/JS yang tidak terpakai di `assets/css/` dan `assets/js/`.
