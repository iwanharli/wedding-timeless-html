import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  getUrlInfo,
  extractUrlFromText,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { EventEmitter } from 'events'
import { toDataURL } from 'qrcode'
import pino from 'pino'
import { useDbAuthState, clearAuthState } from './dbAuthState.js'

export const waEvents = new EventEmitter()
waEvents.setMaxListeners(50)

let sock = null
let connectionState = 'disconnected' // disconnected | connecting | qr | connected
let lastQrDataUrl = null
let isSending = false
let sendAbort = false
let manualDisconnect = false
let accountInfo = null // { name, number, profilePic, connectedAt }

export function getWaStatus() {
  return { state: connectionState, hasQr: !!lastQrDataUrl, account: accountInfo }
}

export function getLastQr() { return lastQrDataUrl }
export function isConnected() { return connectionState === 'connected' }
export function isBusy() { return isSending }
export function abortSend() { sendAbort = true }

// Snapshot of the in-progress (or last completed) bulk send, so a freshly
// (re)connected admin page can restore the progress UI instead of showing
// nothing while a send is still running on the server.
let sendState = {
  sendTarget: null,
  progress: null,
  waitSeconds: null,
  rateLimitPause: null,
  sendStatus: {},
  log: [],
  results: null,
}

export function getSendState() {
  return { sending: isSending, ...sendState }
}

export function resetSendState() {
  isSending = false
  sendState = { ...sendState, sendTarget: null, progress: null, waitSeconds: null, rateLimitPause: null }
}

export async function connectWA() {
  if (sock && connectionState === 'connected') return
  manualDisconnect = false
  connectionState = 'connecting'
  waEvents.emit('status', { state: 'connecting' })

  const { state, saveCreds } = await useDbAuthState()
  const { version } = await fetchLatestBaileysVersion()

  const logger = pino({ level: 'silent' })

  sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    logger,
    printQRInTerminal: false,
    generateHighQualityLinkPreview: false,
    syncFullHistory: false,
    markOnlineOnConnect: false,
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      lastQrDataUrl = await toDataURL(qr, { width: 300 })
      connectionState = 'qr'
      waEvents.emit('qr', lastQrDataUrl)
      waEvents.emit('status', { state: 'qr' })
    }

    if (connection === 'open') {
      lastQrDataUrl = null
      connectionState = 'connected'

      const jid = sock.user?.id || ''
      const number = jid.split(/[:@]/)[0] || ''
      let profilePic = null
      try {
        profilePic = await sock.profilePictureUrl(jid, 'image')
      } catch {
        // user has no profile picture or it's not accessible
      }

      accountInfo = {
        name: sock.user?.name || sock.user?.notify || '',
        number,
        profilePic,
        connectedAt: new Date().toISOString(),
      }

      waEvents.emit('status', { state: 'connected', account: accountInfo })
    }

    if (connection === 'close') {
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode
      const loggedOut = code === DisconnectReason.loggedOut
      const shouldReconnect = !manualDisconnect && !loggedOut
      connectionState = shouldReconnect ? 'connecting' : 'disconnected'
      lastQrDataUrl = null
      accountInfo = null
      sock = null

      // Stale/invalid session — remove it so the next "Hubungkan" generates a fresh QR
      if (loggedOut && !manualDisconnect) {
        await clearAuthState()
      }

      // Connection dropped mid-send — could be a ban/restriction signal, stop immediately
      if (isSending) {
        sendAbort = true
        waEvents.emit('progress', {
          type: 'ban_warning',
          code,
          message: `Koneksi WhatsApp terputus saat pengiriman (kode ${code ?? '?'}). Pengiriman dihentikan otomatis untuk mengurangi risiko pemblokiran.`,
        })
      }

      waEvents.emit('status', { state: connectionState })
      if (shouldReconnect) {
        setTimeout(connectWA, 3000)
      }
    }
  })
}

export async function disconnectWA() {
  manualDisconnect = true
  if (sock) {
    await sock.logout().catch(() => {})
    sock = null
  }
  connectionState = 'disconnected'
  lastQrDataUrl = null
  accountInfo = null
  waEvents.emit('status', { state: 'disconnected' })

  await clearAuthState()
}

// Human-like delay: 5–12s base, 15% chance of 20–40s pause
function humanDelay() {
  const base = 5000 + Math.random() * 7000
  const longPause = Math.random() < 0.15 ? 20000 + Math.random() * 20000 : 0
  return base + longPause
}

// Status codes that signal WhatsApp is rate-limiting/restricting this account
const BAN_SIGNAL_CODES = [403, 429, 463]

// Self-imposed cap on messages sent per rolling hour to mimic human usage
const HOURLY_SEND_LIMIT = 40
const HOUR_MS = 60 * 60 * 1000

// Sleep in 1s steps so an abort request takes effect quickly
async function sleepWithAbort(ms) {
  let remaining = ms
  while (remaining > 0 && !sendAbort) {
    const step = Math.min(1000, remaining)
    await new Promise(r => setTimeout(r, step))
    remaining -= step
  }
}

// Format phone → WA JID
function toJid(phone) {
  const digits = String(phone).replace(/\D/g, '')
  let normalized = digits
  if (digits.startsWith('0')) normalized = '62' + digits.slice(1)
  else if (digits.startsWith('8')) normalized = '62' + digits
  return normalized + '@s.whatsapp.net'
}

export async function sendBulk(guests, templateFn, onProgress, target = 'bulk') {
  if (!sock || connectionState !== 'connected') throw new Error('WhatsApp belum terhubung')
  if (isSending) throw new Error('Pengiriman sedang berjalan')

  isSending = true
  sendAbort = false
  const results = { sent: [], failed: [], skipped: [] }
  let cachedPreview = null
  let sentThisHour = 0
  let windowStart = Date.now()

  sendState = {
    sendTarget: target,
    progress: { index: 0, total: guests.length },
    waitSeconds: null,
    rateLimitPause: null,
    sendStatus: {},
    log: [],
    results: null,
  }

  // Mirrors each progress event into sendState so it can be restored later,
  // then forwards it to the route's own onProgress (SSE emit + DB update).
  const emit = (event) => {
    if (event.type === 'waiting') {
      sendState.waitSeconds = event.delay
    } else if (event.type === 'rate_limit_pause') {
      sendState.waitSeconds = null
      sendState.rateLimitPause = { limit: event.limit, waitSeconds: event.waitSeconds }
    } else if (event.type === 'sent' || event.type === 'failed' || event.type === 'skip') {
      sendState.waitSeconds = null
      sendState.rateLimitPause = null
      sendState.progress = { index: event.index, total: event.total }
      sendState.log = [{ type: event.type, name: event.guest.name, reason: event.error }, ...sendState.log].slice(0, 50)
      sendState.sendStatus = { ...sendState.sendStatus, [event.guest.id]: event.type }
    }
    onProgress(event)
  }

  for (let i = 0; i < guests.length; i++) {
    if (sendAbort) break

    const guest = guests[i]
    if (!guest.phone) {
      results.skipped.push({ id: guest.id, name: guest.name, reason: 'no_phone' })
      emit({ type: 'skip', index: i, total: guests.length, guest })
      continue
    }

    // Hourly send cap reached — pause until the rolling window resets
    if (sentThisHour >= HOURLY_SEND_LIMIT) {
      const waitMs = windowStart + HOUR_MS - Date.now()
      if (waitMs > 0) {
        emit({
          type: 'rate_limit_pause',
          limit: HOURLY_SEND_LIMIT,
          waitSeconds: Math.ceil(waitMs / 1000),
        })
        await sleepWithAbort(waitMs)
      }
      sentThisHour = 0
      windowStart = Date.now()
      if (sendAbort) break
    }

    const jid = toJid(guest.phone)
    const message = templateFn(guest)

    try {
      // Simulate typing presence (1–3 seconds)
      await sock.sendPresenceUpdate('composing', jid)
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000))
      await sock.sendPresenceUpdate('paused', jid)

      let linkPreview
      const url = extractUrlFromText(message)
      if (url) {
        try {
          if (!cachedPreview) cachedPreview = await getUrlInfo(url)
          linkPreview = { ...cachedPreview, 'canonical-url': url, 'matched-text': url }
        } catch {
          // ignore — send without preview if it can't be fetched
        }
      }

      await sock.sendMessage(jid, { text: message, linkPreview })
      results.sent.push({ id: guest.id, name: guest.name })
      emit({ type: 'sent', index: i, total: guests.length, guest })
      sentThisHour++
    } catch (err) {
      results.failed.push({ id: guest.id, name: guest.name, reason: err.message })
      emit({ type: 'failed', index: i, total: guests.length, guest, error: err.message })
      sentThisHour++

      // Ban/restriction signal from WhatsApp — stop immediately
      const code = new Boom(err)?.output?.statusCode
      if (BAN_SIGNAL_CODES.includes(code)) {
        sendAbort = true
        onProgress({
          type: 'ban_warning',
          code,
          message: `WhatsApp menolak pengiriman dengan kode ${code}, kemungkinan tanda pembatasan. Pengiriman dihentikan otomatis.`,
        })
      }
    }

    // Human-like delay before next message (skip after last)
    if (i < guests.length - 1 && !sendAbort) {
      const delay = humanDelay()
      emit({ type: 'waiting', index: i, total: guests.length, delay: Math.round(delay / 1000) })
      await new Promise(r => setTimeout(r, delay))
    }
  }

  isSending = false
  sendState = { ...sendState, sendTarget: null, progress: null, waitSeconds: null, rateLimitPause: null, results }
  return results
}
