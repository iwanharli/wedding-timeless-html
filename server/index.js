import './dotenv-loader.js'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { authRouter } from './auth.js'
import { configRouter } from './config.js'
import { uploadRouter } from './upload.js'
import { guestsRouter } from './guests.js'
import { dashboardRouter } from './dashboard.js'
import { rsvpRouter } from './rsvp.js'
import { visitsRouter } from './visits.js'
import { mediaRouter } from './media.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.resolve(__dirname, '../public/assets/uploads')

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

// Serve uploaded files directly from Express so they're available
// regardless of when they were uploaded relative to the last build
app.use('/assets/uploads', express.static(UPLOADS_DIR))

app.use('/api/auth', authRouter)
app.use('/api/config', configRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/guests', guestsRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/rsvp', rsvpRouter)
app.use('/api/visits', visitsRouter)
app.use('/api/media', mediaRouter)

app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})
