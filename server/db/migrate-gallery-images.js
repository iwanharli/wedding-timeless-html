import { pool } from './db.js'

const { rows } = await pool.query(`SELECT data FROM wedding_config WHERE id = 1`)
if (!rows[0]) { console.log('No config found'); await pool.end(); process.exit(1) }

const data = rows[0].data
const g = data.gallery || {}

if (Array.isArray(g.images)) {
  console.log(`gallery.images already exists (${g.images.length} items) — nothing to do`)
} else {
  const flat = [
    ...(g.columns?.[0]?.images || []),
    ...(g.columns?.[1]?.images || []),
    ...(g.columns?.[2]?.images || []),
  ]
  data.gallery = { ...g, images: flat }
  await pool.query(
    `UPDATE wedding_config SET data = $1, "updatedAt" = now() WHERE id = 1`,
    [data]
  )
  console.log(`Migrated ${flat.length} photos into gallery.images`)
}

await pool.end()
