import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { requireAuth } from './auth.js'
import { pool } from '../db/db.js'
import {
  connectWA, disconnectWA,
  getWaStatus, getLastQr, isConnected, isBusy, abortSend,
  waEvents, sendBulk,
} from '../lib/waClient.js'

export const whatsappRouter = Router()

const ORIGIN = process.env.SITE_URL || ''
const inviteLink = (slug) => `${ORIGIN}/?g=${slug}`

function buildMessage(template, guest) {
  return template
    .replace(/\{\{name\}\}/g, guest.name)
    .replace(/\{\{link\}\}/g, inviteLink(guest.slug))
}

// ── GET /api/wa/status ─────────────────────────────────────────────────────
whatsappRouter.get('/status', requireAuth, (req, res) => {
  res.json(getWaStatus())
})

// ── GET /api/wa/qr ─────────────────────────────────────────────────────────
whatsappRouter.get('/qr', requireAuth, (req, res) => {
  const qr = getLastQr()
  if (!qr) return res.status(404).json({ error: 'QR not available' })
  res.json({ qr })
})

// ── POST /api/wa/connect ───────────────────────────────────────────────────
whatsappRouter.post('/connect', requireAuth, async (req, res) => {
  try {
    await connectWA()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── POST /api/wa/disconnect ────────────────────────────────────────────────
whatsappRouter.post('/disconnect', requireAuth, async (req, res) => {
  try {
    await disconnectWA()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── GET /api/wa/events — SSE stream for QR + status + send progress ────────
// EventSource cannot send Authorization headers, so accept the JWT via ?token=
whatsappRouter.get('/events', (req, res, next) => {
  if (req.query.token) {
    try {
      req.user = jwt.verify(req.query.token, process.env.JWT_SECRET)
      return next()
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
  }
  return requireAuth(req, res, next)
}, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)

  // Send current state immediately
  send('status', getWaStatus())
  const qr = getLastQr()
  if (qr) send('qr', qr)

  const onStatus = (d) => send('status', d)
  const onQr    = (d) => send('qr', d)
  const onProg  = (d) => send('progress', d)

  waEvents.on('status',   onStatus)
  waEvents.on('qr',       onQr)
  waEvents.on('progress', onProg)

  const heartbeat = setInterval(() => res.write(': ping\n\n'), 20000)

  req.on('close', () => {
    clearInterval(heartbeat)
    waEvents.off('status',   onStatus)
    waEvents.off('qr',       onQr)
    waEvents.off('progress', onProg)
  })
})

// ── POST /api/wa/send-bulk ─────────────────────────────────────────────────
whatsappRouter.post('/send-bulk', requireAuth, async (req, res) => {
  if (!isConnected()) return res.status(400).json({ error: 'WhatsApp belum terhubung' })
  if (isBusy())       return res.status(400).json({ error: 'Pengiriman sedang berjalan' })

  const { onlyUnsent = true, guestIds, template } = req.body
  if (!template) return res.status(400).json({ error: 'template wajib diisi' })

  // Fetch guests
  let query, params
  if (guestIds?.length) {
    query  = 'SELECT * FROM guests WHERE id = ANY($1) ORDER BY id'
    params = [guestIds]
  } else if (onlyUnsent) {
    query  = "SELECT * FROM guests WHERE (wa_sent = false OR wa_sent IS NULL) AND phone IS NOT NULL AND phone <> '' ORDER BY id"
    params = []
  } else {
    query  = "SELECT * FROM guests WHERE phone IS NOT NULL AND phone <> '' ORDER BY id"
    params = []
  }

  const { rows: guests } = await pool.query(query, params)
  if (!guests.length) return res.status(400).json({ error: 'Tidak ada tamu yang memenuhi kriteria' })

  res.json({ ok: true, total: guests.length })

  // Run async — progress pushed via SSE
  sendBulk(
    guests,
    (g) => buildMessage(template, g),
    async (event) => {
      waEvents.emit('progress', event)
      if (event.type === 'sent') {
        await pool.query('UPDATE guests SET wa_sent=true WHERE id=$1', [event.guest.id])
      }
    }
  ).then(results => {
    waEvents.emit('progress', { type: 'done', results })
  }).catch(err => {
    waEvents.emit('progress', { type: 'error', message: err.message })
  })
})

// ── POST /api/wa/abort ─────────────────────────────────────────────────────
whatsappRouter.post('/abort', requireAuth, (req, res) => {
  abortSend()
  res.json({ ok: true })
})
