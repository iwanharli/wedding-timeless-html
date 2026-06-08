import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './auth.js'
import { configRouter } from './config.js'
import { uploadRouter } from './upload.js'
import { guestsRouter } from './guests.js'
import { dashboardRouter } from './dashboard.js'
import { rsvpRouter } from './rsvp.js'
import { visitsRouter } from './visits.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

app.use('/api/auth', authRouter)
app.use('/api/config', configRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/guests', guestsRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/rsvp', rsvpRouter)
app.use('/api/visits', visitsRouter)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})
