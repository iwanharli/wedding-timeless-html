import { Router } from 'express'
import { pool } from './db.js'
import { requireAuth } from './auth.js'

export const configRouter = Router()

configRouter.get('/', async (req, res) => {
  const result = await pool.query('SELECT data FROM wedding_config WHERE id = 1')
  if (!result.rows[0]) {
    return res.status(404).json({ error: 'No wedding config found — run the seed script first' })
  }
  res.json(result.rows[0].data)
})

configRouter.put('/', requireAuth, async (req, res) => {
  const data = req.body
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({ error: 'Request body must be a JSON object' })
  }

  await pool.query(
    `INSERT INTO wedding_config (id, data, "updatedAt")
     VALUES (1, $1, now())
     ON CONFLICT (id) DO UPDATE SET data = $1, "updatedAt" = now()`,
    [data]
  )
  res.json({ ok: true })
})
