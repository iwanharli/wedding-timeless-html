import { Router } from 'express'
import { pool } from './db.js'
import { requireAuth } from './auth.js'

export const rsvpRouter = Router()

// Add slug column to link RSVP to guest list entry
const migrate = (async () => {
  await pool.query(`ALTER TABLE rsvp ADD COLUMN IF NOT EXISTS slug TEXT`)
  await pool.query(`ALTER TABLE rsvp ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true`)
})().catch(err => console.error('rsvp migrate:', err))

// POST /api/rsvp — public, submitted by guests
rsvpRouter.post('/', async (req, res) => {
  await migrate
  const { name, attend, guests: pax = 1, wish = '', slug = null } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'name is required' })
  if (!attend)       return res.status(400).json({ error: 'attend is required' })

  const result = await pool.query(
    `INSERT INTO rsvp (name, attend, guests, wish, slug) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name.trim(), attend, pax, wish, slug || null]
  )
  res.status(201).json(result.rows[0])
})

// GET /api/rsvp/public — no auth, visible wishes only (for public site)
rsvpRouter.get('/public', async (req, res) => {
  await migrate
  const result = await pool.query(`
    SELECT name, wish AS message, "createdAt"
    FROM rsvp
    WHERE wish IS NOT NULL AND wish <> '' AND visible = true
    ORDER BY "createdAt" DESC
  `)
  res.json(result.rows)
})

// GET /api/rsvp — admin only, all responses
rsvpRouter.get('/', requireAuth, async (req, res) => {
  await migrate
  const result = await pool.query(`SELECT * FROM rsvp ORDER BY "createdAt" DESC`)
  res.json(result.rows)
})

// PATCH /api/rsvp/:id — toggle visibility (admin)
rsvpRouter.patch('/:id', requireAuth, async (req, res) => {
  await migrate
  const { visible } = req.body
  if (typeof visible !== 'boolean') return res.status(400).json({ error: 'visible must be boolean' })
  const result = await pool.query(
    `UPDATE rsvp SET visible=$1 WHERE id=$2 RETURNING *`,
    [visible, req.params.id]
  )
  if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(result.rows[0])
})
