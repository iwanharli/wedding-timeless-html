import { Router } from 'express'
import { randomBytes } from 'crypto'
import { pool } from './db.js'
import { requireAuth } from './auth.js'

export const guestsRouter = Router()

const generateSlug = () => randomBytes(5).toString('base64url').slice(0, 8)

// Auto-create / migrate table
const migrate = (async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS guests (
      id          SERIAL PRIMARY KEY,
      name        TEXT        NOT NULL,
      phone       TEXT        DEFAULT '',
      category    TEXT        DEFAULT '',
      notes       TEXT        DEFAULT '',
      slug        TEXT        UNIQUE,
      created_at  TIMESTAMPTZ DEFAULT now()
    )
  `)
  // Add columns for existing installs that don't have them yet
  await pool.query(`ALTER TABLE guests ADD COLUMN IF NOT EXISTS table_number TEXT DEFAULT ''`)
  await pool.query(`ALTER TABLE guests ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE`)
  // Backfill slugs for any rows that don't have one
  const { rows } = await pool.query(`SELECT id FROM guests WHERE slug IS NULL OR slug = ''`)
  for (const row of rows) {
    let slug
    for (let i = 0; i < 10; i++) {
      slug = generateSlug()
      const exists = await pool.query('SELECT 1 FROM guests WHERE slug=$1', [slug])
      if (!exists.rows.length) break
    }
    await pool.query('UPDATE guests SET slug=$1 WHERE id=$2', [slug, row.id])
  }
})().catch(err => console.error('guests migrate error:', err))

// ── Public endpoint — no auth required ──────────────────────────────────────
// GET /api/guests/by-slug?g=<slug> — resolve slug → guest name
guestsRouter.get('/by-slug', async (req, res) => {
  await migrate
  const { g } = req.query
  if (!g) return res.status(400).json({ error: 'slug required' })
  const result = await pool.query('SELECT name FROM guests WHERE slug=$1', [g])
  if (!result.rows.length) return res.status(404).json({ error: 'not found' })
  res.json({ name: result.rows[0].name })
})

// GET /api/guests — list all, with latest RSVP status joined
guestsRouter.get('/', requireAuth, async (req, res) => {
  await migrate
  const { search, category } = req.query
  const params = []
  const conditions = []
  if (search) {
    params.push(`%${search}%`)
    const idx = params.length
    conditions.push(`(g.name ILIKE $${idx} OR g.phone ILIKE $${idx} OR g.notes ILIKE $${idx})`)
  }
  if (category) {
    params.push(category)
    conditions.push(`g.category = $${params.length}`)
  }
  const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''
  const q = `
    SELECT g.*,
           r.attend    AS rsvp_status,
           r.guests    AS rsvp_pax,
           r."createdAt" AS rsvp_at
    FROM guests g
    LEFT JOIN LATERAL (
      SELECT attend, guests, "createdAt"
      FROM rsvp
      WHERE slug = g.slug
      ORDER BY "createdAt" DESC
      LIMIT 1
    ) r ON true
    ${where}
    ORDER BY g.id ASC
  `
  const result = await pool.query(q, params)
  res.json(result.rows)
})

// POST /api/guests — add one
guestsRouter.post('/', requireAuth, async (req, res) => {
  await migrate
  const { name, phone = '', category = '', table_number = '', notes = '' } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'name is required' })
  let slug = generateSlug()
  // Retry on collision (extremely rare)
  for (let i = 0; i < 5; i++) {
    const exists = await pool.query('SELECT 1 FROM guests WHERE slug=$1', [slug])
    if (!exists.rows.length) break
    slug = generateSlug()
  }
  const result = await pool.query(
    'INSERT INTO guests (name, phone, category, table_number, notes, slug) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [name.trim(), phone, category, table_number, notes, slug]
  )
  res.status(201).json(result.rows[0])
})

// PUT /api/guests/:id — update
guestsRouter.put('/:id', requireAuth, async (req, res) => {
  const { name, phone = '', category = '', table_number = '', notes = '' } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'name is required' })
  const result = await pool.query(
    'UPDATE guests SET name=$1, phone=$2, category=$3, table_number=$4, notes=$5 WHERE id=$6 RETURNING *',
    [name.trim(), phone, category, table_number, notes, req.params.id]
  )
  if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(result.rows[0])
})

// DELETE /api/guests/:id
guestsRouter.delete('/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM guests WHERE id=$1', [req.params.id])
  res.status(204).end()
})

// DELETE /api/guests — bulk delete by ids[]
guestsRouter.delete('/', requireAuth, async (req, res) => {
  const ids = req.body?.ids
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'ids array required' })
  await pool.query('DELETE FROM guests WHERE id = ANY($1)', [ids])
  res.status(204).end()
})
