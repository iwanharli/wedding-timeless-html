# Timeless Wedding Invitation

Undangan pernikahan digital berbasis **React + Vite** (frontend) dan **Express + PostgreSQL** (backend API), dilengkapi dengan CMS editor untuk mengelola konten, daftar tamu, RSVP, dan statistik kunjungan.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19, Vite 8, React Router 7, Swiper, AOS |
| Backend | Express 5, PostgreSQL, JWT Auth, Multer |
| Production | Nginx (reverse proxy + static), PM2 (process manager) |

## Struktur Proyek

```
timeless-wedding/
├── public/                 # Static assets (images, media, uploads)
│   └── assets/
├── src/                    # React frontend source
│   ├── components/         # Reusable components
│   ├── data/               # Content defaults & section configs
│   └── pages/              # Route pages (PublicSite, CMS Editor)
├── server/                 # Express backend
│   ├── index.js            # Server entrypoint
│   ├── db.js               # PostgreSQL pool
│   ├── migrate.js          # Database migrations (all tables)
│   ├── seed.js             # Database seeder (production data)
│   ├── data/               # Seed data files
│   │   └── wedding-config.json
│   ├── auth.js             # JWT login & middleware
│   ├── config.js           # Wedding config CRUD
│   ├── guests.js           # Guest list management
│   ├── rsvp.js             # RSVP & wishes
│   ├── dashboard.js        # Dashboard statistics
│   ├── visits.js           # Page visit tracking
│   └── upload.js           # Media upload handler
├── dist/                   # Vite build output
├── .env                    # Environment variables (local)
├── .env.example            # Template env
├── package.json
└── vite.config.js
```

## Database

### Tabel

| Tabel | Deskripsi |
|-------|-----------|
| `admins` | Admin users (username + bcrypt password hash) |
| `wedding_config` | Singleton JSONB config (semua konten undangan) |
| `guests` | Daftar tamu dengan personal slug untuk link undangan |
| `rsvp` | Response RSVP + ucapan/wishes dari tamu |
| `page_visits` | Tracking kunjungan halaman undangan |
| `wishes` | Standalone wishes (legacy) |

### ERD Singkat

```
admins (1 row: admin user)
wedding_config (1 row: semua konten)
guests ──┐ slug
         ├──── rsvp (linked via slug)
         └──── page_visits (linked via slug)
wishes (standalone)
```

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
```

### 3. Buat Database

```bash
createdb db_wedding
```

### 4. Migration & Seed

```bash
# Buat semua tabel
npm run migrate

# Seed data (admin, config, guests, rsvp, visits)
npm run seed
```

### 5. Jalankan Development Server

```bash
# Frontend (Vite) + Backend (Express) bersamaan
npm start

# Atau jalankan terpisah:
npm run dev          # Frontend di http://localhost:5173
npm run dev:server   # Backend di http://localhost:4000
```

Vite otomatis proxy `/api/*` ke backend (port 4000).

### NPM Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm start` | Jalankan frontend + backend bersamaan |
| `npm run dev` | Vite dev server saja |
| `npm run dev:server` | Express dev server saja (auto-reload) |
| `npm run build` | Build production frontend ke `dist/` |
| `npm run migrate` | Jalankan database migration |
| `npm run seed` | Seed database dengan data production |
| `npm run lint` | ESLint check |

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

Bisa juga dijadikan script `deploy.sh`:

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

```bash
chmod +x deploy.sh
./deploy.sh
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
| `SEED_ADMIN_PASSWORD` | ❌ | Password admin saat seed (default: admin) |

## Login CMS

Setelah seed, akses CMS editor di `/edit` dengan:

- **Username:** `admin`
- **Password:** sesuai `SEED_ADMIN_PASSWORD` (default: `admin`)
