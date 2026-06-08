import 'dotenv/config'
import pg from 'pg'
import { randomBytes } from 'crypto'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const slug = () => randomBytes(5).toString('base64url').slice(0, 8)

const GUESTS = [
  { name: 'Budi Santoso',       phone: '081234567801', category: 'Keluarga',    notes: 'Paman dari pihak pengantin pria' },
  { name: 'Dewi Rahayu',        phone: '081234567802', category: 'Keluarga',    notes: 'Bibi dari pihak pengantin wanita' },
  { name: 'Andi Wijaya',        phone: '081234567803', category: 'Teman',       notes: '' },
  { name: 'Sari Putri',         phone: '081234567804', category: 'Teman',       notes: 'Sahabat SMA pengantin wanita' },
  { name: 'Reza Firmansyah',    phone: '081234567805', category: 'Teman',       notes: '' },
  { name: 'Linda Kusuma',       phone: '081234567806', category: 'Rekan Kerja', notes: '' },
  { name: 'Hendra Pratama',     phone: '081234567807', category: 'Rekan Kerja', notes: 'Manager divisi Marketing' },
  { name: 'Yuni Astuti',        phone: '081234567808', category: 'Rekan Kerja', notes: '' },
  { name: 'Bambang Susilo',     phone: '',             category: 'Keluarga',    notes: 'Kakak pengantin pria' },
  { name: 'Mega Lestari',       phone: '081234567810', category: 'Teman',       notes: 'Teman kuliah pengantin pria' },
  { name: 'Fajar Nugroho',      phone: '081234567811', category: 'Teman',       notes: '' },
  { name: 'Rina Marlina',       phone: '081234567812', category: 'Keluarga',    notes: 'Sepupu pengantin wanita' },
  { name: 'Doni Saputra',       phone: '081234567813', category: 'Rekan Kerja', notes: '' },
  { name: 'Nita Andriani',      phone: '081234567814', category: 'Lainnya',     notes: 'Tetangga lama' },
  { name: 'Wahyu Kurniawan',    phone: '081234567815', category: 'Lainnya',     notes: '' },
]

const RSVP_ENTRIES = [
  // linked to personal guests (will use their slugs)
  { guestIdx: 0,  attend: 'EXCITED TO ATTEND', guests: 2, wish: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah mawaddah wa rahmah.' },
  { guestIdx: 1,  attend: 'EXCITED TO ATTEND', guests: 2, wish: 'Bahagia selalu ya, semoga langgeng sampai kakek nenek!' },
  { guestIdx: 2,  attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Congrats bro! Akhirnya jadian juga haha. Selamat ya!' },
  { guestIdx: 3,  attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Semoga rumah tangganya penuh kasih sayang dan keberkahan. Bahagia selalu!' },
  { guestIdx: 4,  attend: 'Mungkin Datang',    guests: 1, wish: '' },
  { guestIdx: 5,  attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Selamat berbahagia, semoga pernikahan kalian menjadi awal dari kehidupan yang lebih indah.' },
  { guestIdx: 6,  attend: 'Tidak Hadir',       guests: 1, wish: 'Mohon maaf tidak bisa hadir. Selamat ya, semoga bahagia selalu!' },
  { guestIdx: 7,  attend: 'EXCITED TO ATTEND', guests: 2, wish: '' },
  { guestIdx: 9,  attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Wah akhirnya! Selamat ya, semoga jadi keluarga yang bahagia dan harmonis.' },
  { guestIdx: 10, attend: 'Mungkin Datang',    guests: 1, wish: 'Insya Allah hadir, selamat menempuh hidup baru!' },
  { guestIdx: 11, attend: 'EXCITED TO ATTEND', guests: 3, wish: 'Selamat ya adikku tersayang, semoga Allah memberkahi pernikahanmu.' },
  { guestIdx: 13, attend: 'Tidak Hadir',       guests: 1, wish: 'Tidak bisa hadir tapi doaku selalu menyertai kalian berdua.' },
  // public link (no slug)
  { guestIdx: null, name: 'Ahmad Rizki',    attend: 'EXCITED TO ATTEND', guests: 2, wish: 'Semoga menjadi pasangan yang saling melengkapi dan selalu bersyukur.' },
  { guestIdx: null, name: 'Sinta Dewi',     attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Cantik banget undangannya! Selamat ya, semoga bahagia dunia akhirat.' },
  { guestIdx: null, name: 'Tomi Halim',     attend: 'Mungkin Datang',    guests: 1, wish: 'Doaku untuk kalian berdua, semoga selalu rukun dan bahagia.' },
  { guestIdx: null, name: 'Ratna Sari',     attend: 'EXCITED TO ATTEND', guests: 2, wish: '' },
  { guestIdx: null, name: 'Eko Prasetyo',   attend: 'EXCITED TO ATTEND', guests: 1, wish: 'Selamat! Semoga menjadi keluarga yang penuh cinta dan tawa.' },
]

async function run() {
  const client = await pool.connect()
  try {
    // Insert guests and collect their slugs
    const insertedSlugs = []
    for (const g of GUESTS) {
      const s = slug()
      const { rows } = await client.query(
        `INSERT INTO guests (name, phone, category, notes, slug)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (slug) DO NOTHING
         RETURNING slug`,
        [g.name, g.phone, g.category, g.notes, s]
      )
      insertedSlugs.push(rows[0]?.slug ?? s)
      process.stdout.write('.')
    }
    console.log(`\n✓ ${GUESTS.length} tamu ditambahkan`)

    // Insert RSVP / wishes
    let count = 0
    for (const r of RSVP_ENTRIES) {
      const guestSlug = r.guestIdx !== null ? insertedSlugs[r.guestIdx] : null
      const name      = r.guestIdx !== null ? GUESTS[r.guestIdx].name : r.name
      await client.query(
        `INSERT INTO rsvp (name, attend, guests, wish, slug) VALUES ($1,$2,$3,$4,$5)`,
        [name, r.attend, r.guests, r.wish || '', guestSlug]
      )
      count++
      process.stdout.write('.')
    }
    console.log(`\n✓ ${count} ucapan/RSVP ditambahkan`)

    // Insert some dummy visit records spread over 14 days
    const now = new Date()
    const ips = ['114.122.14.55', '180.252.88.109', '36.72.215.12', '125.165.110.4', '110.138.80.22', '103.144.15.19', '182.253.11.90']
    const devices = ['Mobile', 'Mobile', 'Mobile', 'Desktop', 'Tablet']
    const browsers = ['Chrome', 'Safari', 'Chrome', 'Firefox', 'Chrome', 'Safari', 'Edge']
    const osList = {
      'Mobile': ['Android', 'iOS'],
      'Tablet': ['Android', 'iOS'],
      'Desktop': ['Windows', 'macOS', 'Linux']
    }

    for (let day = 13; day >= 0; day--) {
      const visits = Math.floor(Math.random() * 8) + 2
      for (let v = 0; v < visits; v++) {
        const ts = new Date(now)
        ts.setDate(ts.getDate() - day)
        ts.setHours(Math.floor(Math.random() * 14) + 8)
        ts.setMinutes(Math.floor(Math.random() * 60))
        const useSlug = Math.random() > 0.45 && insertedSlugs.length
        const s = useSlug ? insertedSlugs[Math.floor(Math.random() * insertedSlugs.length)] : null

        const ip = ips[Math.floor(Math.random() * ips.length)]
        const device = devices[Math.floor(Math.random() * devices.length)]
        const possibleOs = osList[device]
        const os = possibleOs[Math.floor(Math.random() * possibleOs.length)]
        const browser = browsers[Math.floor(Math.random() * browsers.length)]
        const userAgent = `Mozilla/5.0 (Dummy; ${device}; ${os}) ${browser}/100.0`

        await client.query(
          `INSERT INTO page_visits (slug, visited_at, ip_address, user_agent, device_type, browser_name, os_name) 
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [s, ts.toISOString(), ip, userAgent, device, browser, os]
        )
      }
      process.stdout.write('.')
    }
    console.log('\n✓ Data traffic kunjungan ditambahkan')
    console.log('\nSelesai!')
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch(err => { console.error(err); process.exit(1) })
