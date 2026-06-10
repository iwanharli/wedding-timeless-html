import './dotenv-loader.js'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { authRouter } from './routes/auth.js'
import { configRouter, initHtmlMetadata } from './routes/config.js'
import { uploadRouter } from './routes/upload.js'
import { guestsRouter } from './routes/guests.js'
import { dashboardRouter } from './routes/dashboard.js'
import { rsvpRouter } from './routes/rsvp.js'
import { visitsRouter } from './routes/visits.js'
import { mediaRouter } from './routes/media.js'
import { giftsRouter } from './routes/gifts.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.resolve(__dirname, '../public/assets/uploads')
const DIST_DIR = path.resolve(__dirname, '../dist')
const PUBLIC_DIR = path.resolve(__dirname, '../public')

const ONE_YEAR = 60 * 60 * 24 * 365

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

// Uploads: timestamp-named files, safe to cache 1 year
app.use('/assets/uploads', express.static(UPLOADS_DIR, { maxAge: ONE_YEAR * 1000, immutable: true }))

// Public vendor assets (fonts, FA CSS — all content-addressed): 1 year
app.use(express.static(PUBLIC_DIR, {
  setHeaders(res, filePath) {
    if (filePath.includes('/assets/')) {
      res.setHeader('Cache-Control', `public, max-age=${ONE_YEAR}, immutable`)
    }
  }
}))

// Dist: hashed JS/CSS → 1 year; index.html → no-cache (rewritten dynamically)
app.use(express.static(DIST_DIR, {
  setHeaders(res, filePath) {
    if (filePath.includes('/assets/')) {
      res.setHeader('Cache-Control', `public, max-age=${ONE_YEAR}, immutable`)
    } else {
      res.setHeader('Cache-Control', 'no-cache')
    }
  }
}))

app.use('/api/auth', authRouter)
app.use('/api/config', configRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/guests', guestsRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/rsvp', rsvpRouter)
app.use('/api/visits', visitsRouter)
app.use('/api/media', mediaRouter)
app.use('/api/gifts', giftsRouter)

// Unknown API routes → JSON 404
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` })
})

// All other routes → SPA fallback (React Router handles 404 in-app)
// Use regex-based fallback for Express 5 compatible routing
app.use(/.*/, (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'))
})

app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const port = process.env.PORT || 4000
app.listen(port, async () => {
  console.log(`API server listening on http://localhost:${port}`)
  await initHtmlMetadata()
})
