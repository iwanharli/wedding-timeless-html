import { Router } from 'express'
import { pool } from './db.js'
import { requireAuth } from './auth.js'

export const visitsRouter = Router()

const migrate = (async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS page_visits (
      id         SERIAL PRIMARY KEY,
      slug       TEXT,
      visited_at TIMESTAMPTZ DEFAULT now()
    )
  `)
})().catch(err => console.error('visits migrate error:', err))

// POST /api/visits — public, fire-and-forget from PublicSite
visitsRouter.post('/', async (req, res) => {
  await migrate
  const { slug = null } = req.body
  await pool.query('INSERT INTO page_visits (slug) VALUES ($1)', [slug || null])
  res.status(201).end()
})

// GET /api/visits/stats — admin only, last 14 days grouped by date
visitsRouter.get('/stats', requireAuth, async (req, res) => {
  await migrate
  const { rows } = await pool.query(`
    SELECT
      TO_CHAR(DATE(visited_at AT TIME ZONE 'Asia/Jakarta'), 'YYYY-MM-DD') AS date,
      COUNT(*)::int    AS total,
      COUNT(slug)::int AS personal
    FROM page_visits
    WHERE visited_at >= NOW() - INTERVAL '14 days'
    GROUP BY DATE(visited_at AT TIME ZONE 'Asia/Jakarta')
    ORDER BY date ASC
  `)

  const allTime = await pool.query(`SELECT COUNT(*)::int AS total FROM page_visits`)
  res.json({ daily: rows, allTime: allTime.rows[0].total })
})
