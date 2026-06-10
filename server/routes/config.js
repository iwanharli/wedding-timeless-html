import { Router } from 'express'
import { pool } from '../db/db.js'
import { requireAuth } from './auth.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SITE_URL = (process.env.SITE_URL || '').replace(/\/+$/, '')

export const configRouter = Router()

function toAbsoluteUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return SITE_URL + (url.startsWith('/') ? url : '/' + url)
}

// Accepts the full wedding config object
function updateHtmlMetadata(config) {
  if (!config) return
  const share = config.share || config  // backward compat if only share is passed
  const heroImageUrl = config.hero?.background?.value || ''

  const title = share.ogTitle || 'WE INVITE YOU TO CELEBRATE'
  const description = share.ogDescription || 'Undangan pernikahan digital.'
  const image = toAbsoluteUrl(share.ogImage || '')

  // Only rewrite the built dist/index.html — the template index.html is
  // managed by git and must not be modified at runtime (would block git pull on deploy)
  const paths = [
    path.join(__dirname, '../../dist/index.html')
  ]

  for (const htmlPath of paths) {
    if (!fs.existsSync(htmlPath)) continue
    try {
      let html = fs.readFileSync(htmlPath, 'utf8')

      // Replace og:title
      html = html.replace(
        /(<meta\s+property="og:title"\s+content=")[^"]*("\s*\/?>)/gi,
        `$1${title.replace(/"/g, '&quot;')}$2`
      )
      // Replace twitter:title
      html = html.replace(
        /(<meta\s+name="twitter:title"\s+content=")[^"]*("\s*\/?>)/gi,
        `$1${title.replace(/"/g, '&quot;')}$2`
      )

      // Replace og:description
      html = html.replace(
        /(<meta\s+property="og:description"\s+content=")[^"]*("\s*\/?>)/gi,
        `$1${description.replace(/"/g, '&quot;')}$2`
      )
      // Replace twitter:description
      html = html.replace(
        /(<meta\s+name="twitter:description"\s+content=")[^"]*("\s*\/?>)/gi,
        `$1${description.replace(/"/g, '&quot;')}$2`
      )

      // Replace og:image
      html = html.replace(
        /(<meta\s+property="og:image"\s+content=")[^"]*("\s*\/?>)/gi,
        `$1${image}$2`
      )
      // Replace twitter:image
      html = html.replace(
        /(<meta\s+name="twitter:image"\s+content=")[^"]*("\s*\/?>)/gi,
        `$1${image}$2`
      )

      // Replace og:url (if present)
      if (SITE_URL) {
        html = html.replace(
          /(<meta\s+property="og:url"\s+content=")[^"]*("\s*\/?>)/gi,
          `$1${SITE_URL}/$2`
        )
      }

      // Replace <title>
      html = html.replace(
        /(<title>)[^<]*(<\/title>)/gi,
        `$1${title.replace(/</g, '&lt;')}$2`
      )

      // Write LCP preload tag for hero background image so browser discovers it early
      if (heroImageUrl) {
        const absHeroUrl = toAbsoluteUrl(heroImageUrl)
        const preloadTag = `<link rel="preload" as="image" fetchpriority="high" href="${absHeroUrl}">`
        if (html.includes('<!--LCP_PRELOAD-->')) {
          html = html.replace('<!--LCP_PRELOAD-->', preloadTag)
        } else {
          html = html.replace(/<link[^>]*fetchpriority="high"[^>]*>/gi, preloadTag)
        }
      }

      fs.writeFileSync(htmlPath, html, 'utf8')
      console.log(`Updated HTML metadata in: ${htmlPath}`)
    } catch (e) {
      console.error(`Error updating HTML metadata in ${htmlPath}:`, e.message)
    }
  }
}

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

  updateHtmlMetadata(data)

  res.json({ ok: true })
})

// Called once on server startup so HTML metadata is up-to-date with DB + env SITE_URL
export async function initHtmlMetadata() {
  try {
    const result = await pool.query('SELECT data FROM wedding_config WHERE id = 1')
    if (result.rows[0]) updateHtmlMetadata(result.rows[0].data)
  } catch (e) {
    console.error('initHtmlMetadata failed:', e.message)
  }
}
