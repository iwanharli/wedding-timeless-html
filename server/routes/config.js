import { Router } from 'express'
import { pool } from '../db/db.js'
import { requireAuth } from './auth.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const configRouter = Router()

function updateHtmlMetadata(share) {
  if (!share) return
  
  const title = share.ogTitle || 'WE INVITE YOU TO CELEBRATE'
  const description = share.ogDescription || 'Undangan pernikahan digital.'
  const image = share.ogImage || '/assets/images/Timeless-00036.jpg'

  const paths = [
    path.join(__dirname, '../../index.html'),
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

      // Replace <title>
      html = html.replace(
        /(<title>)[^<]*(<\/title>)/gi,
        `$1${title.replace(/</g, '&lt;')}$2`
      )

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

  // Automatically sync metadata changes to index.html on disk
  updateHtmlMetadata(data.share)

  res.json({ ok: true })
})
