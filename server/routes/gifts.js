import { Router } from 'express'
import { pool } from '../db/db.js'
import { requireAuth } from './auth.js'

export const giftsRouter = Router()

// POST /api/gifts — public, submitted by guests
giftsRouter.post('/', async (req, res) => {
  const { name, bank, amount = '', note = '', slug = null } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'name is required' })
  if (!bank?.trim()) return res.status(400).json({ error: 'bank is required' })

  const result = await pool.query(
    `INSERT INTO gift_confirmations (name, bank, amount, note, slug)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name.trim(), bank.trim(), amount, note, slug || null]
  )
  res.status(201).json(result.rows[0])
})

// GET /api/gifts — admin only
giftsRouter.get('/', requireAuth, async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM gift_confirmations ORDER BY "createdAt" DESC`
  )
  res.json(result.rows)
})
