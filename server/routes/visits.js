import { Router } from 'express'
import { pool } from '../db/db.js'
import { requireAuth, requireAdmin } from './auth.js'

export const visitsRouter = Router()

function parseUserAgent(uaString = '') {
  const ua = uaString.toLowerCase()
  
  // 1. Device Type
  let deviceType = 'Desktop'
  if (ua.includes('mobi') || ua.includes('phone') || ua.includes('iphone') || ua.includes('ipod')) {
    deviceType = 'Mobile'
  } else if (ua.includes('tablet') || ua.includes('ipad') || (ua.includes('android') && !ua.includes('mobi'))) {
    deviceType = 'Tablet'
  }
  
  // 2. OS Name
  let osName = 'Lainnya'
  if (ua.includes('windows')) osName = 'Windows'
  else if (ua.includes('android')) osName = 'Android'
  else if (ua.includes('ipad') || ua.includes('iphone') || ua.includes('ipod')) osName = 'iOS'
  else if (ua.includes('macintosh') || ua.includes('mac os')) osName = 'macOS'
  else if (ua.includes('linux')) osName = 'Linux'
  
  // 3. Browser Name
  let browserName = 'Lainnya'
  if (ua.includes('edg/')) browserName = 'Edge'
  else if (ua.includes('chrome') || ua.includes('crios')) {
    if (ua.includes('opr/') || ua.includes('opera')) browserName = 'Opera'
    else browserName = 'Chrome'
  } else if (ua.includes('safari')) {
    browserName = 'Safari'
  } else if (ua.includes('firefox') || ua.includes('fxios')) {
    browserName = 'Firefox'
  } else if (ua.includes('msie') || ua.includes('trident')) {
    browserName = 'Internet Explorer'
  }
  
  return { deviceType, osName, browserName }
}

// POST /api/visits — public, fire-and-forget from PublicSite
visitsRouter.post('/', async (req, res) => {
  const { slug = null } = req.body
  
  const rawIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket.remoteAddress || ''
  // Standardize ipv6 localhost to ipv4
  const ip = rawIp === '::1' || rawIp === '::ffff:127.0.0.1' ? '127.0.0.1' : rawIp

  const userAgent = req.headers['user-agent'] || ''
  const { deviceType, osName, browserName } = parseUserAgent(userAgent)

  await pool.query(
    `INSERT INTO page_visits (slug, ip_address, user_agent, device_type, browser_name, os_name) 
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [slug || null, ip, userAgent, deviceType, browserName, osName]
  )
  res.status(201).end()
})

// GET /api/visits/stats — admin only, last 30 days grouped by date
visitsRouter.get('/stats', requireAuth, requireAdmin, async (req, res) => {
  const { rows } = await pool.query(`
    SELECT
      TO_CHAR(DATE(visited_at AT TIME ZONE 'Asia/Jakarta'), 'YYYY-MM-DD') AS date,
      COUNT(*)::int    AS total,
      COUNT(slug)::int AS personal
    FROM page_visits
    WHERE visited_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(visited_at AT TIME ZONE 'Asia/Jakarta')
    ORDER BY date ASC
  `)

  const allTime = await pool.query(`SELECT COUNT(*)::int AS total FROM page_visits`)
  res.json({ daily: rows, allTime: allTime.rows[0].total })
})

// GET /api/visits/details — admin only, detailed list of page visits with charts stats
visitsRouter.get('/details', requireAuth, requireAdmin, async (req, res) => {
  const limit = parseInt(req.query.limit) || 100
  const offset = parseInt(req.query.offset) || 0
  
  const { rows } = await pool.query(`
    SELECT 
      v.id,
      v.slug,
      g.name AS guest_name,
      v.ip_address,
      v.device_type,
      v.browser_name,
      v.os_name,
      v.visited_at
    FROM page_visits v
    LEFT JOIN guests g ON v.slug = g.slug
    ORDER BY v.visited_at DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset])

  const totalRes = await pool.query('SELECT COUNT(*)::int AS count FROM page_visits')
  
  const deviceStats = await pool.query(`
    SELECT COALESCE(device_type, 'Unknown') AS label, COUNT(*)::int AS count 
    FROM page_visits 
    GROUP BY device_type 
    ORDER BY count DESC
  `)
  
  const browserStats = await pool.query(`
    SELECT COALESCE(browser_name, 'Unknown') AS label, COUNT(*)::int AS count 
    FROM page_visits 
    GROUP BY browser_name 
    ORDER BY count DESC
  `)
  
  const osStats = await pool.query(`
    SELECT COALESCE(os_name, 'Unknown') AS label, COUNT(*)::int AS count 
    FROM page_visits 
    GROUP BY os_name 
    ORDER BY count DESC
  `)

  res.json({
    visits: rows,
    total: totalRes.rows[0].count,
    stats: {
      devices: deviceStats.rows,
      browsers: browserStats.rows,
      os: osStats.rows
    }
  })
})
