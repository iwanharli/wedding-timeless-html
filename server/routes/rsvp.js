import { Router } from 'express'
import { pool } from '../db/db.js'
import { requireAuth } from './auth.js'

export const rsvpRouter = Router()

// POST /api/rsvp — public, submitted by guests
rsvpRouter.post('/', async (req, res) => {
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
  const result = await pool.query(`SELECT * FROM rsvp ORDER BY "createdAt" DESC`)
  res.json(result.rows)
})

// PATCH /api/rsvp/:id — toggle visibility (admin)
rsvpRouter.patch('/:id', requireAuth, async (req, res) => {
  const { visible } = req.body
  if (typeof visible !== 'boolean') return res.status(400).json({ error: 'visible must be boolean' })
  const result = await pool.query(
    `UPDATE rsvp SET visible=$1 WHERE id=$2 RETURNING *`,
    [visible, req.params.id]
  )
  if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(result.rows[0])
})

// DELETE /api/rsvp/:id — remove a response (admin)
rsvpRouter.delete('/:id', requireAuth, async (req, res) => {
  const result = await pool.query(`DELETE FROM rsvp WHERE id=$1 RETURNING id`, [req.params.id])
  if (!result.rows.length) return res.status(404).json({ error: 'Not found' })
  res.status(204).end()
})
