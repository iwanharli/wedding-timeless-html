import bcrypt from 'bcrypt'
import content from '../src/data/content.js'
import { DEFAULT_SECTIONS } from '../src/data/sectionDefaults.js'
import { pool } from './db.js'

const GALLERY = {
  title: 'Unveiling\nOur Prewedding Story',
  quote: 'Every love story is beautiful, but ours is my favorite. Through the highs and lows, our love grows stronger and deeper with each passing day.',
  videoFile: '',
  videoThumb: '/assets/images/Timeless-00028.jpg',
  images: [
    '/assets/images/Timeless-00028.jpg',
    '/assets/images/Timeless-00013.jpg',
    '/assets/images/Timeless-00024.jpg',
    '/assets/images/Timeless-00002-1.jpg',
    '/assets/images/Timeless-00042.jpg',
    '/assets/images/Timeless-00001.jpg',
    '/assets/images/Timeless-00043-1.jpg',
    '/assets/images/Timeless-00045.jpg',
    '/assets/images/Timeless-00019.jpg',
    '/assets/images/Timeless-00003-1.jpg',
    '/assets/images/Timeless-00030-1.jpg',
    '/assets/images/Timeless-00033.jpg',
  ],
}

const DRESS_CODE = {
  title: 'Dress Code',
  text: 'WE KINDLY ENCOURAGE OUR GUESTS TO\nWEAR THESE COLORS FOR OUR SPECIAL DAY',
  colors: [
    { hex: '#dbd6d3', label: 'Warm White' },
    { hex: '#2a211c', label: 'Dark Espresso' },
    { hex: '#806f5f', label: 'Warm Taupe' },
    { hex: '#bca8a0', label: 'Dusty Rose' },
  ],
}

const GIFT_ACCOUNTS = [
  { bankName: 'Groove Public', bankType: 'Bank BCA', accountNumber: '00008888123' },
  { bankName: 'Groove Public Invitation', bankType: 'Bank BCA', accountNumber: '00008888123' },
  { bankName: 'Groove Public Invitation', bankType: 'Bank Mandiri', accountNumber: '00008888123' },
]

const COUNTDOWN_TARGET_ISO = '2024-10-19T04:00:00.000Z'

async function seedConfig() {
  const data = {
    ...content,
    sections: DEFAULT_SECTIONS.map(s => ({ ...s, visible: true })),
    gallery: GALLERY,
    dressCode: DRESS_CODE,
    countdown: { ...content.countdown, date: COUNTDOWN_TARGET_ISO },
    gift: { ...content.gift, accounts: GIFT_ACCOUNTS },
    livestream: { ...content.livestream, url: '' },
    rsvp: {
      ...content.rsvp,
      guestLabel: 'No of Guest',
      maxGuests: 2,
    },
  }

  await pool.query(
    `INSERT INTO wedding_config (id, data, "updatedAt")
     VALUES (1, $1, now())
     ON CONFLICT (id) DO UPDATE SET data = $1, "updatedAt" = now()`,
    [data]
  )
  console.log('wedding_config seeded (id=1)')
}

async function seedAdminPassword() {
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!password) {
    console.log('SEED_ADMIN_PASSWORD not set — skipping admin password update')
    return
  }
  const hash = await bcrypt.hash(password, 12)
  const result = await pool.query(
    `UPDATE admins SET "passwordHash" = $1 WHERE username = 'admin'`,
    [hash]
  )
  console.log(`admin password updated (rows affected: ${result.rowCount})`)
}

await seedConfig()
await seedAdminPassword()
await pool.end()
