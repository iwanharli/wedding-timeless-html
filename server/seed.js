/**
 * seed.js — Seed all tables with production-matching data
 *
 * Seeds data that matches the local db_wedding database exactly.
 * Safe to run multiple times (uses ON CONFLICT / TRUNCATE patterns).
 *
 * Usage:
 *   npm run migrate   # create tables first
 *   npm run seed      # then seed data
 */

import './dotenv-loader.js'
import pg from 'pg'
import bcrypt from 'bcrypt'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

// ─── helpers ─────────────────────────────────────────────────────────────────
const log = (msg) => console.log(`  ✓ ${msg}`)

// ─── 1. Seed admin ──────────────────────────────────────────────────────────
async function seedAdmin(client) {
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin'
  const hash = await bcrypt.hash(password, 12)

  await client.query(`
    INSERT INTO admins (username, "passwordHash")
    VALUES ('admin', $1)
    ON CONFLICT (username) DO UPDATE SET "passwordHash" = $1
  `, [hash])

  log(`admin user seeded (password: ${process.env.SEED_ADMIN_PASSWORD ? '***' : 'admin'})`)
}

// ─── 2. Seed wedding config ─────────────────────────────────────────────────
async function seedWeddingConfig(client) {
  const configPath = join(__dirname, 'data', 'wedding-config.json')
  const data = JSON.parse(readFileSync(configPath, 'utf-8'))

  await client.query(`
    INSERT INTO wedding_config (id, data, "updatedAt")
    VALUES (1, $1, now())
    ON CONFLICT (id) DO UPDATE SET data = $1, "updatedAt" = now()
  `, [data])

  log('wedding_config seeded')
}

// ─── 3. Seed guests ─────────────────────────────────────────────────────────
const GUESTS = [
  { name: 'Iwan & Budi',       phone: '081249442476', category: 'Teman',       table_number: '', notes: '',                                slug: 'ClJM4No' },
  { name: 'Budi Santoso',      phone: '081234567801', category: 'Keluarga',    table_number: '', notes: 'Paman dari pihak pengantin pria',  slug: 'FqERx0Q' },
  { name: 'Dewi Rahayu',       phone: '081234567802', category: 'Keluarga',    table_number: '', notes: 'Bibi dari pihak pengantin wanita', slug: 'Hbc5rJs' },
  { name: 'Andi Wijaya',       phone: '081234567803', category: 'Teman',       table_number: '', notes: '',                                slug: 'uTRrVUQ' },
  { name: 'Sari Putri',        phone: '081234567804', category: 'Teman',       table_number: '', notes: 'Sahabat SMA pengantin wanita',     slug: 'wDQpDUA' },
  { name: 'Reza Firmansyah',   phone: '081234567805', category: 'Teman',       table_number: '', notes: '',                                slug: 'oZ_KQWo' },
  { name: 'Linda Kusuma',      phone: '081234567806', category: 'Rekan Kerja', table_number: '', notes: '',                                slug: 'UTD7i1k' },
  { name: 'Hendra Pratama',    phone: '081234567807', category: 'Rekan Kerja', table_number: '', notes: 'Manager divisi Marketing',         slug: 'dKxRRpc' },
  { name: 'Yuni Astuti',       phone: '081234567808', category: 'Rekan Kerja', table_number: '', notes: '',                                slug: 'W2prO_A' },
  { name: 'Bambang Susilo',    phone: '',             category: 'Keluarga',    table_number: '', notes: 'Kakak pengantin pria',             slug: 'zUzBIb8' },
  { name: 'Mega Lestari',      phone: '081234567810', category: 'Teman',       table_number: '', notes: 'Teman kuliah pengantin pria',      slug: 'Fi1ao1o' },
  { name: 'Fajar Nugroho',     phone: '081234567811', category: 'Teman',       table_number: '', notes: '',                                slug: 'iN2Cb58' },
  { name: 'Rina Marlina',      phone: '081234567812', category: 'Keluarga',    table_number: '', notes: 'Sepupu pengantin wanita',          slug: 'lpsBSiM' },
  { name: 'Doni Saputra',      phone: '081234567813', category: 'Rekan Kerja', table_number: '', notes: '',                                slug: 'kXNd5S4' },
  { name: 'Nita Andriani',     phone: '081234567814', category: 'Lainnya',     table_number: '', notes: 'Tetangga lama',                    slug: '9oxLors' },
  { name: 'Wahyu Kurniawan',   phone: '081234567815', category: 'Lainnya',     table_number: '', notes: '',                                slug: '_lt3oek' },
]

async function seedGuests(client) {
  // Clear existing guests
  await client.query('DELETE FROM guests')

  for (const g of GUESTS) {
    await client.query(
      `INSERT INTO guests (name, phone, category, table_number, notes, slug)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [g.name, g.phone, g.category, g.table_number, g.notes, g.slug]
    )
  }

  // Reset sequence to next available id
  await client.query(`SELECT setval('guests_id_seq', (SELECT COALESCE(MAX(id), 0) FROM guests))`)

  log(`${GUESTS.length} guests seeded`)
}

// ─── 4. Seed RSVP ───────────────────────────────────────────────────────────
const RSVP_ENTRIES = [
  // Linked to guest list (personal slug)
  { name: 'Budi Santoso',    attend: 'EXCITED TO ATTEND', guests: 2, wish: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah mawaddah wa rahmah.', slug: 'FqERx0Q' },
  { name: 'Dewi Rahayu',     attend: 'EXCITED TO ATTEND', guests: 2, wish: 'Bahagia selalu ya, semoga langgeng sampai kakek nenek!',                                slug: 'Hbc5rJs' },
  { name: 'Andi Wijaya',     attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Congrats bro! Akhirnya jadian juga haha. Selamat ya!',                                  slug: 'uTRrVUQ' },
  { name: 'Sari Putri',      attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Semoga rumah tangganya penuh kasih sayang dan keberkahan. Bahagia selalu!',              slug: 'wDQpDUA' },
  { name: 'Reza Firmansyah', attend: 'Mungkin Datang',    guests: 1, wish: '',                                                                                       slug: 'oZ_KQWo' },
  { name: 'Linda Kusuma',    attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Selamat berbahagia, semoga pernikahan kalian menjadi awal dari kehidupan yang lebih indah.', slug: 'UTD7i1k' },
  { name: 'Hendra Pratama',  attend: 'Tidak Hadir',       guests: 1, wish: 'Mohon maaf tidak bisa hadir. Selamat ya, semoga bahagia selalu!',                        slug: 'dKxRRpc' },
  { name: 'Yuni Astuti',     attend: 'EXCITED TO ATTEND', guests: 2, wish: '',                                                                                       slug: 'W2prO_A' },
  { name: 'Mega Lestari',    attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Wah akhirnya! Selamat ya, semoga jadi keluarga yang bahagia dan harmonis.',              slug: 'Fi1ao1o' },
  { name: 'Fajar Nugroho',   attend: 'Mungkin Datang',    guests: 1, wish: 'Insya Allah hadir, selamat menempuh hidup baru!',                                        slug: 'iN2Cb58' },
  { name: 'Rina Marlina',    attend: 'EXCITED TO ATTEND', guests: 3, wish: 'Selamat ya adikku tersayang, semoga Allah memberkahi pernikahanmu.',                     slug: 'lpsBSiM' },
  { name: 'Nita Andriani',   attend: 'Tidak Hadir',       guests: 1, wish: 'Tidak bisa hadir tapi doaku selalu menyertai kalian berdua.',                            slug: '9oxLors' },
  // Public link (no slug)
  { name: 'Ahmad Rizki',     attend: 'EXCITED TO ATTEND', guests: 2, wish: 'Semoga menjadi pasangan yang saling melengkapi dan selalu bersyukur.',                   slug: null },
  { name: 'Sinta Dewi',      attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Cantik banget undangannya! Selamat ya, semoga bahagia dunia akhirat.',                   slug: null },
  { name: 'Tomi Halim',      attend: 'Mungkin Datang',    guests: 1, wish: 'Doaku untuk kalian berdua, semoga selalu rukun dan bahagia.',                            slug: null },
  { name: 'Ratna Sari',      attend: 'EXCITED TO ATTEND', guests: 2, wish: '',                                                                                       slug: null },
  { name: 'Eko Prasetyo',    attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Selamat! Semoga menjadi keluarga yang penuh cinta dan tawa.',                            slug: null },
  { name: 'Test User',       attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Test wish',                                                                              slug: null },
]

async function seedRsvp(client) {
  await client.query('DELETE FROM rsvp')

  for (const r of RSVP_ENTRIES) {
    await client.query(
      `INSERT INTO rsvp (name, attend, guests, wish, slug) VALUES ($1, $2, $3, $4, $5)`,
      [r.name, r.attend, r.guests, r.wish, r.slug]
    )
  }

  await client.query(`SELECT setval('rsvp_id_seq', (SELECT COALESCE(MAX(id), 0) FROM rsvp))`)

  log(`${RSVP_ENTRIES.length} RSVP entries seeded`)
}

// ─── 5. Seed page visits ────────────────────────────────────────────────────
async function seedPageVisits(client) {
  await client.query('DELETE FROM page_visits')

  const guestSlugs = GUESTS.map(g => g.slug)
  const now = new Date()

  const ips = ['114.122.14.55', '180.252.88.109', '36.72.215.12', '125.165.110.4', '110.138.80.22', '103.144.15.19', '182.253.11.90']
  const devices = ['Mobile', 'Mobile', 'Mobile', 'Desktop', 'Tablet']
  const browsers = ['Chrome', 'Safari', 'Chrome', 'Firefox', 'Chrome', 'Safari', 'Edge']
  const osList = {
    'Mobile': ['Android', 'iOS'],
    'Tablet': ['Android', 'iOS'],
    'Desktop': ['Windows', 'macOS', 'Linux']
  }

  // Generate ~5-10 visits per day over 14 days
  for (let day = 13; day >= 0; day--) {
    const visits = Math.floor(Math.random() * 6) + 5
    for (let v = 0; v < visits; v++) {
      const ts = new Date(now)
      ts.setDate(ts.getDate() - day)
      ts.setHours(Math.floor(Math.random() * 14) + 8)
      ts.setMinutes(Math.floor(Math.random() * 60))

      // ~55% chance of having a personal slug
      const useSlug = Math.random() > 0.45
      const slug = useSlug ? guestSlugs[Math.floor(Math.random() * guestSlugs.length)] : null

      const ip = ips[Math.floor(Math.random() * ips.length)]
      const device = devices[Math.floor(Math.random() * devices.length)]
      const possibleOs = osList[device]
      const os = possibleOs[Math.floor(Math.random() * possibleOs.length)]
      const browser = browsers[Math.floor(Math.random() * browsers.length)]
      const userAgent = `Mozilla/5.0 (Dummy; ${device}; ${os}) ${browser}/100.0`

      await client.query(
        `INSERT INTO page_visits (slug, visited_at, ip_address, user_agent, device_type, browser_name, os_name) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [slug, ts.toISOString(), ip, userAgent, device, browser, os]
      )
    }
  }

  const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM page_visits')
  await client.query(`SELECT setval('page_visits_id_seq', (SELECT COALESCE(MAX(id), 0) FROM page_visits))`)

  log(`${rows[0].count} page visits seeded (14 days)`)
}

// ─── Run all seeds ──────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌱 Seeding database...\n')
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    await seedAdmin(client)
    await seedWeddingConfig(client)
    await seedGuests(client)
    await seedRsvp(client)
    await seedPageVisits(client)

    await client.query('COMMIT')
    console.log('\n✅ Seeding completed successfully!\n')
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('\n❌ Seeding failed, rolled back:', e.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()
