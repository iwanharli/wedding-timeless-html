# Timeless Wedding Invitation

Undangan pernikahan digital berbasis **React + Vite** (frontend) dan **Express + PostgreSQL** (backend API), dilengkapi dengan CMS editor (`/admin`) untuk mengelola seluruh konten, urutan/visibilitas section, daftar tamu (dengan link undangan personal), RSVP & ucapan, media library, serta statistik kunjungan.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19, Vite 8, React Router 7, Swiper, AOS, ECharts, Lottie |
| Backend | Express 5, PostgreSQL (`pg`), JWT Auth, bcrypt, Multer |
| Tooling | ESLint 10 (flat config), Playwright (smoke test) |
| Production | Nginx (reverse proxy + static), PM2 (process manager) |

## Struktur Proyek

```
timeless-wedding/
├── public/                      # Static assets yang disajikan apa adanya
│   └── assets/
│       ├── uploads/              # File hasil upload via Media Library (runtime)
│       └── ...                   # Font, vendor lib, gambar/video bawaan
│
├── src/                          # React frontend source
│   ├── main.jsx                  # Entry point (mount <App/>, import global CSS)
│   ├── App.jsx                   # Router: "/", "/login", "/admin", "/admin/:section",
│   │                              #   "/admin/section/:sectionId", "*" (404)
│   │
│   ├── components/                # Komponen shared di public site
│   │   ├── PublicSite.jsx          # Orkestrator halaman publik (preloader, section list, side nav)
│   │   ├── Preloader.jsx
│   │   ├── SideNav.jsx
│   │   ├── QROverlay.jsx
│   │   └── GiftPopup.jsx
│   │
│   ├── sections/                  # Setiap section publik = folder berisi JSX + CSS co-located
│   │   ├── Hero/                   #   SectionHero.jsx + hero.css
│   │   ├── Intro/
│   │   ├── ProfileIntro/
│   │   ├── GroomBride/             #   SectionGroom.jsx, SectionBride.jsx + groom-bride.css
│   │   ├── LoveStory/
│   │   ├── Countdown/
│   │   ├── Event/
│   │   ├── Livestream/
│   │   ├── DressCode/
│   │   ├── RSVP/
│   │   ├── Wishes/
│   │   ├── Gift/
│   │   ├── Gallery/
│   │   └── ThankYou/
│   │   # 14 section + Hero (selalu tampil sebagai cover) — urutan & visibilitas
│   │   # diatur lewat field `sections` di wedding_config (bisa diubah dari /admin/layout)
│   │
│   ├── pages/                     # Halaman route-level di luar admin & section publik
│   │   └── NotFound/                # NotFound.jsx + NotFound.css (404 page)
│   │
│   ├── admin/                     # CMS editor ("/admin") — terproteksi JWT
│   │   ├── auth/                    # Login.jsx, RequireAuth.jsx (route guard), authClient.js
│   │   ├── shell/                   # Kerangka editor: Editor.jsx (root + routing internal),
│   │   │                            #   EditorSidebar, EditorToolbar, PreviewPanel, NavGuardModal,
│   │   │                            #   usePreviewSync (sinkron live-preview via postMessage)
│   │   ├── fields/                  # Form field generik: SectionForm, FieldInput, ArrayEditor,
│   │   │                            #   ImageListEditor, AudioTrimField, contentSchemas.js
│   │   │                            #   (skema field per section)
│   │   ├── pages/                   # Halaman admin non-section: Dashboard, GuestList,
│   │   │                            #   WishesList, MediaLibrary, LayoutPanel, ShareSetup,
│   │   │                            #   TrafficDetail (+ CSS masing-masing co-located)
│   │   ├── styles/                  # admin.css (aggregator @import) + 15 file CSS modular
│   │   │                            #   (tokens, shell, toolbar, form-fields, dll — flat,
│   │   │                            #    sengaja tidak dipecah lagi karena class lintas file)
│   │   └── utils.js                 # Helper khusus admin (mis. setPath untuk update nested config)
│   │
│   ├── data/                       # Default content & data hooks
│   │   ├── content.js                # Default/fallback content (dipakai saat API gagal)
│   │   ├── sectionDefaults.js        # Default urutan & visibilitas section + hero background
│   │   └── useWeddingConfig.js       # Hook fetch GET /api/config (dipakai PublicSite)
│   │
│   ├── lib/                         # Helper murni, dipakai lintas frontend
│   │   ├── api.js                     # apiUrl() — resolve base URL backend (VITE_API_BE_URL)
│   │   └── color.js                   # hexToRgba() — konversi warna untuk overlay section
│   │
│   ├── styles/                     # Global styles untuk public site
│   │   ├── app.css                   # Aggregator (@import seluruh file di base/, urutan penting)
│   │   └── base/                     # 12 file CSS per concern: reset, fonts (x2), section-layout,
│   │                                  #   scroll-snap, scroll-guestbook, side-nav, side-menu-toggle,
│   │                                  #   preloader, popup-misc, gallery-qr, gift-popup
│   │
│   └── assets/                     # Aset yang di-bundle Vite (bukan static public/)
│       └── preloader-anim.json       # Lottie animation untuk Preloader
│
├── server/                       # Express backend (ESM)
│   ├── index.js                    # Entry point: middleware, mount routes, static serving, SPA fallback
│   ├── dotenv-loader.js            # Load .env.development (dev) lalu .env (selalu)
│   │
│   ├── db/                         # Database layer
│   │   ├── db.js                     # PostgreSQL connection pool (pg.Pool)
│   │   ├── migrate.js                # Migration: buat/perbarui semua tabel + index (idempotent)
│   │   ├── seed.js                   # Seed data production (admin, config, guests, rsvp, visits)
│   │   ├── seed-dummy.js             # Seed data dummy/sample untuk development
│   │   ├── migrate-gallery-images.js # Skrip migrasi one-off (riwayat, tidak dijalankan otomatis)
│   │   └── data/
│   │       └── wedding-config.json   # Sumber data untuk seed.js
│   │
│   └── routes/                     # Express route modules (semua di-mount di index.js)
│       ├── auth.js                   # JWT login & middleware requireAuth
│       ├── config.js                 # GET/PUT wedding_config + update meta tag di index.html
│       ├── guests.js                 # CRUD daftar tamu + resolve slug → nama (publik)
│       ├── rsvp.js                   # Submit RSVP (publik) + list/toggle visibility (admin)
│       ├── dashboard.js              # Statistik ringkasan untuk halaman Dashboard
│       ├── visits.js                 # Tracking & statistik kunjungan halaman
│       ├── media.js                  # List & hapus file di Media Library
│       └── upload.js                 # Upload file (Multer) ke public/assets/uploads
│
├── dist/                          # Hasil build Vite (production, di-gitignore)
├── .env                           # Environment variables (lokal, di-gitignore)
├── .env.example                   # Template environment variables
├── .gitignore
├── deploy.sh                      # Script redeploy (pull, install, migrate, build, restart PM2)
├── eslint.config.js               # ESLint flat config (browser globals utk src/, node globals utk server/)
├── package.json
└── vite.config.js                 # Vite config + proxy /api → http://localhost:4000
```

### Routing Frontend (`src/App.jsx`)

| Path | Komponen | Akses |
|------|----------|-------|
| `/` | `PublicSite` | Publik |
| `/login` | `Login` | Publik |
| `/admin`, `/admin/:section` | `Editor` | Login (JWT) |
| `/admin/section/:sectionId` | `Editor` (form section spesifik) | Login (JWT) |
| `*` | `NotFound` | Publik (404) |

`Editor.jsx` sendiri menangani sub-halaman admin secara internal: Dashboard, Layout (urutan/visibilitas section), per-section form (Hero, Intro, Love Story, dst.), Guest List, Wishes List, Media Library, Share Setup, dan Traffic Detail.

## API Endpoints (`server/routes/`)

| Method & Path | Auth | Fungsi |
|---------------|------|--------|
| `POST /api/auth/login` | - | Login admin (username + password → JWT) |
| `GET /api/auth/me` | ✅ | Cek validitas token aktif |
| `GET /api/config` | - | Ambil seluruh konten undangan (`wedding_config`) |
| `PUT /api/config` | ✅ | Simpan perubahan konten + update meta tag share di `index.html`/`dist/index.html` |
| `GET /api/guests/by-slug?g=` | - | Resolve slug tamu → nama (untuk halaman undangan personal) |
| `GET /api/guests` | ✅ | List tamu (search & filter kategori) + status RSVP terakhir |
| `POST /api/guests` | ✅ | Tambah tamu (auto-generate slug unik) |
| `PUT /api/guests/:id` | ✅ | Update data tamu |
| `DELETE /api/guests/:id` | ✅ | Hapus satu tamu |
| `DELETE /api/guests` | ✅ | Hapus banyak tamu sekaligus (`{ ids: [] }`) |
| `POST /api/rsvp` | - | Submit RSVP + ucapan (publik) |
| `GET /api/rsvp/public` | - | Daftar ucapan yang `visible = true` (untuk section Wishes) |
| `GET /api/rsvp` | ✅ | List semua RSVP (admin) |
| `PATCH /api/rsvp/:id` | ✅ | Toggle visibilitas ucapan |
| `GET /api/dashboard` | ✅ | Statistik ringkasan (jumlah tamu, RSVP, kunjungan, dll.) |
| `POST /api/visits` | - | Catat kunjungan halaman (slug, IP, user-agent → device/browser/OS) |
| `GET /api/visits/stats` | ✅ | Statistik kunjungan 30 hari terakhir |
| `GET /api/visits/details` | ✅ | Detail kunjungan + breakdown device/browser/OS |
| `GET /api/media` | ✅ | List file di Media Library |
| `DELETE /api/media` | ✅ | Hapus file media |
| `POST /api/upload` | ✅ | Upload file (gambar/video/audio, max 80MB) |

Endpoint API yang tidak dikenali (`/api/...` lainnya) mengembalikan `404 JSON`. Semua route non-API di-fallback ke `dist/index.html` (SPA routing).

## Database

### Tabel

| Tabel | Deskripsi |
|-------|-----------|
| `admins` | Admin users (username + bcrypt password hash) |
| `wedding_config` | Singleton JSONB config (semua konten undangan, termasuk `sections` order/visibility) |
| `guests` | Daftar tamu dengan personal slug (unik) untuk link undangan |
| `rsvp` | Response RSVP + ucapan/wishes dari tamu, terhubung ke `guests` via `slug` |
| `page_visits` | Tracking kunjungan halaman undangan (IP, device, browser, OS) |
| `wishes` | Standalone wishes (legacy) |

### ERD Singkat

```
admins (1 row: admin user)
wedding_config (1 row: semua konten + urutan/visibilitas section)
guests ──┐ slug
         ├──── rsvp (linked via slug)
         └──── page_visits (linked via slug)
wishes (standalone, legacy)
```

`server/db/migrate.js` membuat seluruh tabel + index di atas secara idempotent (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`) — aman dijalankan berulang kali, termasuk saat redeploy untuk mengaplikasikan perubahan schema baru.

---

## Development (Lokal)

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm

### 1. Clone & Install

```bash
git clone <repo-url>
cd timeless-wedding
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://localhost:5432/db_wedding
JWT_SECRET=change-me-to-a-long-random-string
PORT=4000
VITE_API_BE_URL=http://localhost:4000
```

### 3. Buat Database

```bash
createdb db_wedding
```

### 4. Migration & Seed

```bash
# Buat semua tabel
npm run migrate

# Seed data production
npm run seed

# Atau seed data dummy untuk development
npm run seed:dummy
```

### 5. Jalankan Development Server

```bash
# Frontend (Vite) + Backend (Express) bersamaan
npm start

# Atau jalankan terpisah:
npm run dev          # Frontend di http://localhost:5173
npm run dev:server   # Backend di http://localhost:4000
```

Vite otomatis proxy `/api/*` ke backend (port 4000), lihat `vite.config.js`.

### NPM Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm start` | Jalankan frontend + backend bersamaan (`concurrently`) |
| `npm run dev` | Vite dev server saja |
| `npm run dev:server` | Express dev server saja (`--watch`, auto-reload) |
| `npm run build` | Build production frontend ke `dist/` |
| `npm run migrate` | Jalankan database migration (`server/db/migrate.js`) |
| `npm run seed` | Seed database dengan data production (`server/db/seed.js`) |
| `npm run seed:dummy` | Seed database dengan data dummy (`server/db/seed-dummy.js`) |
| `npm run lint` | ESLint check (frontend + backend) |
| `npm run preview` | Preview hasil build Vite secara lokal |

---

## Deployment ke Server (Nginx + PM2)

### Prerequisites Server

- Ubuntu/Debian server
- Node.js >= 18 (via nvm atau nodesource)
- PostgreSQL >= 14
- Nginx
- PM2 (`npm install -g pm2`)

### 1. Setup PostgreSQL

```bash
# Install PostgreSQL (jika belum)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Buat user dan database
sudo -u postgres psql
```

```sql
CREATE USER wedding_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE db_wedding OWNER wedding_user;
GRANT ALL PRIVILEGES ON DATABASE db_wedding TO wedding_user;
\q
```

### 2. Clone & Setup Project

```bash
# Clone ke server
cd /var/www
git clone <repo-url> timeless-wedding
cd timeless-wedding

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env
```

Edit `.env` untuk production:

```env
DATABASE_URL=postgresql://wedding_user:your_secure_password@localhost:5432/db_wedding
JWT_SECRET=generate-random-64-char-string-here
PORT=4000
SEED_ADMIN_PASSWORD=your_admin_password
```

> **Tip:** Generate JWT secret: `openssl rand -hex 32`

### 3. Migration & Seed

```bash
# Buat semua tabel
npm run migrate

# Seed data
npm run seed
```

Output yang diharapkan:

```
🔧 Running database migrations...

  ✓ admins table ready
  ✓ default admin user ensured
  ✓ wedding_config table ready
  ✓ guests table ready
  ✓ rsvp table ready
  ✓ page_visits table ready
  ✓ wishes table ready

✅ All migrations completed successfully!
```

### 4. Build Frontend

```bash
npm run build
```

Hasil build ada di folder `dist/`.

### 5. Setup PM2

```bash
# Jalankan backend API dengan PM2
pm2 start server/index.js --name "wedding-api" --env production

# Pastikan berjalan
pm2 status

# Auto-start saat server reboot
pm2 save
pm2 startup
```

Perintah PM2 yang berguna:

```bash
pm2 logs wedding-api       # Lihat log
pm2 restart wedding-api    # Restart
pm2 stop wedding-api       # Stop
pm2 delete wedding-api     # Hapus dari PM2
pm2 monit                  # Monitor real-time
```

### 6. Setup Nginx

Buat konfigurasi Nginx:

```bash
sudo nano /etc/nginx/sites-available/wedding
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend — serve Vite build output
    root /var/www/timeless-wedding/dist;
    index index.html;

    # Static assets dari public/ (images, media, uploads)
    location /assets/ {
        alias /var/www/timeless-wedding/public/assets/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Proxy API ke Express backend
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Untuk upload file besar (max 80MB sesuai multer config)
        client_max_body_size 80M;
    }

    # SPA fallback — semua route lain ke index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 256;
}
```

Aktifkan site:

```bash
sudo ln -s /etc/nginx/sites-available/wedding /etc/nginx/sites-enabled/
sudo nginx -t          # Test konfigurasi
sudo systemctl reload nginx
```

### 7. Setup SSL (HTTPS) dengan Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Certbot otomatis mengupdate konfigurasi Nginx untuk HTTPS dan auto-renew.

---

## Update / Redeploy

Setelah push perubahan ke repository, jalankan di server:

```bash
cd /var/www/timeless-wedding

# Pull perubahan terbaru
git pull origin react-v1

# Install dependency baru (jika ada)
npm install

# Jalankan migration (jika ada perubahan schema)
npm run migrate

# Rebuild frontend
npm run build

# Restart backend
pm2 restart wedding-api
```

Atau jalankan langsung script `deploy.sh` yang sudah disediakan di root proyek:

```bash
./deploy.sh
```

Isi `deploy.sh`:

```bash
#!/bin/bash
set -e

cd /var/www/timeless-wedding
echo "📥 Pulling latest changes..."
git pull origin react-v1

echo "📦 Installing dependencies..."
npm install

echo "🔧 Running migrations..."
npm run migrate

echo "🏗️  Building frontend..."
npm run build

echo "🔄 Restarting backend..."
pm2 restart wedding-api

echo "✅ Deploy complete!"
```

---

## Troubleshooting

### Database connection error

```bash
# Cek PostgreSQL status
sudo systemctl status postgresql

# Cek koneksi
psql $DATABASE_URL -c "SELECT 1"
```

### PM2 tidak berjalan

```bash
pm2 logs wedding-api --lines 50   # Lihat error log
pm2 restart wedding-api            # Restart
```

### Nginx 502 Bad Gateway

Backend belum berjalan atau port salah:

```bash
pm2 status                          # Cek apakah wedding-api running
curl http://localhost:4000/api/config  # Test backend langsung
sudo nginx -t                        # Test config nginx
```

### Permission error pada uploads

```bash
# Pastikan folder uploads writable
sudo chown -R www-data:www-data /var/www/timeless-wedding/public/assets/uploads
chmod 755 /var/www/timeless-wedding/public/assets/uploads
```

### Reset database

```bash
# Drop dan buat ulang database
sudo -u postgres dropdb db_wedding
sudo -u postgres createdb db_wedding -O wedding_user

# Jalankan ulang migration + seed
npm run migrate
npm run seed
```

---

## Environment Variables

| Variable | Wajib | Deskripsi |
|----------|-------|-----------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key untuk JWT token |
| `PORT` | ❌ | Port backend API (default: 4000) |
| `SEED_ADMIN_PASSWORD` | ❌ | Password admin saat seed (default: `admin`) |
| `VITE_API_BE_URL` | ❌ | Base URL backend untuk frontend (kosongkan jika frontend & backend satu domain) |

## Login CMS

Setelah seed, akses CMS editor di `/admin` dengan:

- **Username:** `admin`
- **Password:** sesuai `SEED_ADMIN_PASSWORD` (default: `admin`)
