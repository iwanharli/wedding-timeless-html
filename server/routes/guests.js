import { Router } from 'express'
import { randomBytes } from 'crypto'
import { pool } from '../db/db.js'
import { requireAuth } from './auth.js'

export const guestsRouter = Router()

const generateSlug = () => randomBytes(5).toString('base64url').slice(0, 8)

// ── Public endpoint — no auth required ──────────────────────────────────────
// GET /api/guests/by-slug?g=<slug> — resolve slug → guest name
guestsRouter.get('/by-slug', async (req, res) => {
  const { g } = req.query
  if (!g) return res.status(400).json({ error: 'slug required' })
  const result = await pool.query('SELECT name FROM guests WHERE slug=$1', [g])
  if (!result.rows.length) return res.status(404).json({ error: 'not found' })
  res.json({ name: result.rows[0].name })
})

// GET /api/guests — list all, with latest RSVP status joined
guestsRouter.get('/', requireAuth, async (req, res) => {
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
  const { name, phone = '', category = '', notes = '' } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'name is required' })
  let slug = generateSlug()
  // Retry on collision (extremely rare)
  for (let i = 0; i < 5; i++) {
    const exists = await pool.query('SELECT 1 FROM guests WHERE slug=$1', [slug])
    if (!exists.rows.length) break
    slug = generateSlug()
  }
  const result = await pool.query(
    'INSERT INTO guests (name, phone, category, notes, slug) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [name.trim(), phone, category, notes, slug]
  )
  res.status(201).json(result.rows[0])
})

// PUT /api/guests/:id — update
guestsRouter.put('/:id', requireAuth, async (req, res) => {
  const { name, phone = '', category = '', notes = '' } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'name is required' })
  const result = await pool.query(
    'UPDATE guests SET name=$1, phone=$2, category=$3, notes=$4 WHERE id=$5 RETURNING *',
    [name.trim(), phone, category, notes, req.params.id]
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

// POST /api/guests/bulk — import CSV rows, skip duplicates by phone
guestsRouter.post('/bulk', requireAuth, async (req, res) => {
  const rows = req.body?.guests
  if (!Array.isArray(rows) || !rows.length) return res.status(400).json({ error: 'guests array required' })

  // Fetch all existing phones in one query
  const existing = await pool.query('SELECT phone FROM guests WHERE phone IS NOT NULL AND phone <> \'\'')
  const existingPhones = new Set(existing.rows.map(r => r.phone.replace(/\D/g, '')))

  const added = []
  const skipped = []

  for (const row of rows) {
    const name = row.name?.trim()
    const phone = row.phone?.trim() || ''
    const category = row.category?.trim() || ''
    const notes = row.notes?.trim() || ''

    if (!name || !phone) continue

    const normalizedPhone = phone.replace(/\D/g, '')
    if (existingPhones.has(normalizedPhone)) {
      skipped.push({ name, phone })
      continue
    }

    let slug = generateSlug()
    for (let i = 0; i < 5; i++) {
      const exists = await pool.query('SELECT 1 FROM guests WHERE slug=$1', [slug])
      if (!exists.rows.length) break
      slug = generateSlug()
    }

    const result = await pool.query(
      'INSERT INTO guests (name, phone, category, notes, slug) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, phone, category, notes, slug]
    )
    added.push(result.rows[0])
    existingPhones.add(normalizedPhone)
  }

  res.status(201).json({ added, skipped })
})
