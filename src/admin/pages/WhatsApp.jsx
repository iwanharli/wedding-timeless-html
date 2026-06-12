import { useState, useEffect, useRef, useCallback } from 'react'
import { authFetch, getToken } from '../auth/authClient'
import { apiUrl } from '../../lib/api'
import { getPath } from '../utils'
import FieldInput from '../fields/FieldInput'
import WhatsAppRichEditor from './WhatsAppRichEditor'
import WhatsAppPreview, { WA_SAMPLE_NAME } from '../components/WhatsAppPreview'
import UserMenu from '../shell/UserMenu'
import './WhatsApp.css'

function SectionLabel({ icon, children }) {
  return (
    <div className="share-section-label">
      <i className={`fas ${icon}`} />
      {children}
    </div>
  )
}

function Field({ label, hint, full, children }) {
  return (
    <label className={`edit-field${full ? ' edit-field--full' : ''}`}>
      <span className="edit-field-label">{label}</span>
      {children}
      {hint && <span className="edit-field-hint">{hint}</span>}
    </label>
  )
}

const STATE_LABEL = {
  disconnected: 'Belum terhubung',
  connecting:   'Menghubungkan…',
  qr:           'Pindai kode QR',
  connected:    'Terhubung',
}

const STATE_ICON = {
  disconnected: 'fa-unlink',
  connecting:   'fa-circle-notch fa-spin',
  qr:           'fa-qrcode',
  connected:    'fa-check-circle',
}

function formatPhone(number) {
  const digits = String(number).replace(/\D/g, '')
  if (!digits.startsWith('62')) return `+${digits}`
  const rest = digits.slice(2)
  return `+62 ${rest.replace(/(\d{4})(?=\d)/g, '$1-')}`
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}d`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}d` : `${m}m`
}

export default function WhatsApp({ config, onMenuOpen, onFieldChange, canSave, saving, status, onSave, onRevert }) {
  const [templateOpen, setTemplateOpen] = useState(false)
  const [waState, setWaState] = useState('disconnected')
  const [account, setAccount] = useState(null)
  const [qr, setQr] = useState(null)
  const [connecting, setConnecting] = useState(false)

  const template = config?.share?.whatsappTemplate || ''
  const [onlyUnsent, setOnlyUnsent] = useState(true)

  const [sending, setSending] = useState(false)
  const [sendTarget, setSendTarget] = useState(null) // null | 'bulk' | guestId
  const [progress, setProgress] = useState(null) // { index, total }
  const [waitSeconds, setWaitSeconds] = useState(null)
  const [rateLimitPause, setRateLimitPause] = useState(null) // { limit, waitSeconds }
  const [results, setResults] = useState(null)   // { sent, failed, skipped }
  const [sendStatus, setSendStatus] = useState({}) // { [guestId]: 'sent' | 'failed' | 'skip' }
  const [log, setLog] = useState([])
  const [error, setError] = useState(null)

  const [guests, setGuests] = useState([])
  const [guestsLoading, setGuestsLoading] = useState(true)

  const countdownRef = useRef(null)
  const rateLimitRef = useRef(null)

  const pushLog = useCallback((entry) => {
    setLog(prev => [entry, ...prev].slice(0, 50))
  }, [])

  const loadGuests = useCallback(async () => {
    try {
      const res = await authFetch('/api/guests')
      if (!res.ok) return
      setGuests(await res.json())
    } catch { /* ignore */ } finally {
      setGuestsLoading(false)
    }
  }, [])

  useEffect(() => { loadGuests() }, [loadGuests])

  // ── SSE: live status / QR / progress ──────────────────────────────────
  useEffect(() => {
    const token = getToken()
    const es = new EventSource(apiUrl(`/api/wa/events?token=${encodeURIComponent(token || '')}`))

    es.addEventListener('status', (e) => {
      const data = JSON.parse(e.data)
      setWaState(data.state)
      if (data.state !== 'qr') setQr(null)
      if (data.state === 'connected' || data.state === 'disconnected') setConnecting(false)
      if (data.state === 'connected') setAccount(data.account || null)
      else setAccount(null)

      // Restore an in-progress (or just-finished) bulk send so reopening/
      // re-logging into the page doesn't lose the progress UI.
      const s = data.send
      if (s) {
        setSending(s.sending)
        setSendTarget(s.sending ? s.sendTarget : null)
        setProgress(s.sending ? s.progress : null)
        setWaitSeconds(s.sending ? s.waitSeconds : null)
        setRateLimitPause(s.sending ? s.rateLimitPause : null)
        setSendStatus(s.sendStatus || {})
        setLog(s.log || [])
        if (!s.sending && s.results) setResults(s.results)
      }
    })

    es.addEventListener('qr', (e) => {
      setQr(JSON.parse(e.data))
    })

    es.addEventListener('progress', (e) => {
      const data = JSON.parse(e.data)
      if (data.type === 'waiting') {
        setWaitSeconds(data.delay)
      } else if (data.type === 'rate_limit_pause') {
        setWaitSeconds(null)
        setRateLimitPause({ limit: data.limit, waitSeconds: data.waitSeconds })
      } else if (data.type === 'done') {
        setSending(false)
        setSendTarget(null)
        setProgress(null)
        setWaitSeconds(null)
        setRateLimitPause(null)
        setResults(data.results)
        loadGuests()
      } else if (data.type === 'error') {
        setSending(false)
        setSendTarget(null)
        setProgress(null)
        setWaitSeconds(null)
        setRateLimitPause(null)
        setError(data.message)
      } else if (data.type === 'ban_warning') {
        setError(data.message)
      } else {
        setWaitSeconds(null)
        setRateLimitPause(null)
        setProgress({ index: data.index, total: data.total })
        if (data.type === 'sent') {
          pushLog({ type: 'sent', name: data.guest.name })
          setSendStatus(s => ({ ...s, [data.guest.id]: 'sent' }))
        } else if (data.type === 'failed') {
          pushLog({ type: 'failed', name: data.guest.name, reason: data.error })
          setSendStatus(s => ({ ...s, [data.guest.id]: 'failed' }))
        } else if (data.type === 'skip') {
          pushLog({ type: 'skip', name: data.guest.name })
          setSendStatus(s => ({ ...s, [data.guest.id]: 'skip' }))
        }
      }
    })

    return () => es.close()
  }, [pushLog, loadGuests])

  // Local 1s countdown so the "menunggu..." display ticks down smoothly
  useEffect(() => {
    if (waitSeconds == null) {
      clearInterval(countdownRef.current)
      return
    }
    countdownRef.current = setInterval(() => {
      setWaitSeconds(s => (s != null && s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(countdownRef.current)
  }, [waitSeconds == null])

  // Local 1s countdown for the hourly rate-limit pause
  useEffect(() => {
    if (rateLimitPause == null) {
      clearInterval(rateLimitRef.current)
      return
    }
    rateLimitRef.current = setInterval(() => {
      setRateLimitPause(p => (p && p.waitSeconds > 0 ? { ...p, waitSeconds: p.waitSeconds - 1 } : p))
    }, 1000)
    return () => clearInterval(rateLimitRef.current)
  }, [rateLimitPause == null])

  async function handleConnect() {
    setConnecting(true)
    setError(null)
    try {
      const res = await authFetch('/api/wa/connect', { method: 'POST' })
      if (!res.ok) throw new Error((await res.json()).error || 'Gagal menghubungkan')
    } catch (e) {
      setError(e.message)
      setConnecting(false)
    }
  }

  async function handleDisconnect() {
    setError(null)
    try {
      const res = await authFetch('/api/wa/disconnect', { method: 'POST' })
      if (!res.ok) throw new Error((await res.json()).error || 'Gagal memutuskan koneksi')
      setQr(null)
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleSend(target, guestIds) {
    if (!template.trim()) {
      setError('Template pesan tidak boleh kosong.')
      return
    }
    setError(null)
    setResults(null)
    setLog([])
    setSendStatus({})
    setSending(true)
    setSendTarget(target)
    setProgress({ index: 0, total: 0 })
    try {
      const res = await authFetch('/api/wa/send-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestIds ? { guestIds, template } : { onlyUnsent, template }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal memulai pengiriman')
      setProgress({ index: 0, total: data.total })
    } catch (e) {
      setError(e.message)
      setSending(false)
      setSendTarget(null)
      setProgress(null)
    }
  }

  async function handleAbort() {
    try {
      await authFetch('/api/wa/abort', { method: 'POST' })
    } catch { /* ignore */ }
  }

  const isConnected = waState === 'connected'
  const pct = progress?.total ? Math.round(((progress.index + (sending ? 1 : 0)) / progress.total) * 100) : 0
  const pendingGuests = guests.filter(g => g.phone && !g.wa_sent)
  const currentGuestId = sending && sendTarget === 'bulk'
    ? pendingGuests.find(g => !sendStatus[g.id])?.id
    : null

  return (
    <div className="wa-wrap">
      {/* ── Page header ── */}
      <div className="gl-header">
        <button type="button" className="edit-hamburger" onClick={onMenuOpen} title="Toggle menu">
          <i className="fas fa-bars" />
        </button>
        <div className="gl-header-left">
          <div className="gl-header-icon"><i className="fab fa-whatsapp" /></div>
          <div>
            <h1 className="gl-header-title">Kirim WhatsApp</h1>
            <p className="gl-header-sub">Kirim undangan ke tamu secara otomatis dengan jeda alami</p>
          </div>
        </div>
        <div className="gl-header-actions">
          <span className={`wa-status-badge wa-status-badge--${waState}`}>
            <i className={`fas ${STATE_ICON[waState]}`} />
            {STATE_LABEL[waState] || waState}
          </span>
          {status && (
            <span className={`edit-status-toast edit-status-toast--${status.type}`}>
              {status.message}
            </span>
          )}
          {canSave && (
            <button type="button" className="edit-revert-btn" onClick={onRevert} disabled={saving} title="Batalkan perubahan">
              <i className="fas fa-undo" /> <span className="edit-save-btn-label">Revert</span>
            </button>
          )}
          <button type="button" className="edit-save-btn" onClick={onSave} disabled={saving || !canSave}>
            {saving
              ? <><i className="fas fa-circle-notch fa-spin" /> <span className="edit-save-btn-label">Saving…</span></>
              : <><i className="fas fa-save" /> <span className="edit-save-btn-label">Save changes</span></>}
          </button>
          <UserMenu />
        </div>
      </div>

      {error && <div className="gl-error"><i className="fas fa-exclamation-circle" /> {error}</div>}

      <div className="wa-grid">
      <div className="wa-main">
      {/* ── Connection card ── */}
      <div className={`gl-card wa-connect-card${isConnected ? ' wa-connect-card--connected' : ''}`}>
        {isConnected ? (
          <div className="wa-connected">
            {account?.profilePic ? (
              <img className="wa-connected-avatar" src={account.profilePic} alt="" />
            ) : (
              <div className="wa-connected-icon"><i className="fas fa-check-circle" /></div>
            )}
            <div className="wa-connected-body">
              <div className="wa-connected-title">{account?.name || 'WhatsApp terhubung'}</div>
              <div className="wa-connected-sub">
                {account?.number && formatPhone(account.number)}
                {account?.number && account?.connectedAt && ' · '}
                {account?.connectedAt && `Terhubung sejak ${formatTime(account.connectedAt)}`}
                {!account?.number && !account?.connectedAt && 'Perangkat siap mengirim pesan secara otomatis.'}
              </div>
            </div>
            <button type="button" className="gl-btn gl-btn--ghost" onClick={handleDisconnect}>
              <i className="fas fa-power-off" /> Putuskan
            </button>
          </div>
        ) : qr ? (
          <div className="wa-qr-box">
            <img src={qr} alt="QR WhatsApp" className="wa-qr-img" />
            <div className="wa-qr-hint">
              Buka WhatsApp di HP &rarr; <strong>Perangkat Tertaut</strong> &rarr; <strong>Tautkan Perangkat</strong>, lalu pindai kode ini.
            </div>
          </div>
        ) : (
          <div className="wa-connected">
            <div className="wa-connected-icon wa-connected-icon--off"><i className="fas fa-unlink" /></div>
            <div className="wa-connected-body">
              <div className="wa-connected-title">WhatsApp belum terhubung</div>
              <div className="wa-connected-sub">Hubungkan untuk menampilkan kode QR.</div>
            </div>
            <button type="button" className="gl-btn gl-btn--primary" onClick={handleConnect} disabled={connecting || waState === 'connecting'}>
              <i className="fas fa-link" /> Hubungkan
            </button>
          </div>
        )}
      </div>

      {/* ── Template & link preview card ── */}
      <div className="gl-card wa-template-card">
        <button
          type="button"
          className="wa-send-header wa-template-toggle"
          aria-expanded={templateOpen}
          onClick={() => setTemplateOpen(open => !open)}
        >
          <h2 className="wa-send-title"><i className="fas fa-comment-dots" /> Template Pesan & Pratinjau Tautan</h2>
          <i className={`fas fa-chevron-down wa-template-toggle-icon${templateOpen ? ' wa-template-toggle-icon--open' : ''}`} />
        </button>

        {templateOpen && (
          <>
            <Field
              label="Teks Pesan WhatsApp"
              hint="{{name}} akan diganti nama tamu, {{link}} akan diganti tautan undangan."
              full
            >
              <WhatsAppRichEditor
                value={template}
                onChange={v => onFieldChange('share.whatsappTemplate', v)}
              />
            </Field>

            <div className="edit-divider" />

            <SectionLabel icon="fa-globe">Pratinjau Tautan</SectionLabel>
            <p className="share-section-desc">
              Tampilan kartu yang muncul saat tautan undangan dibagikan di WhatsApp, iMessage, atau media sosial.
            </p>

            <div className="share-og-layout">
              <label className="edit-field share-og-image-field">
                <span className="edit-field-label">Gambar Pratinjau</span>
                <FieldInput
                  field={{ path: 'share.ogImage', type: 'image', cropAspect: 1.91 }}
                  value={getPath(config, 'share.ogImage')}
                  onChange={v => onFieldChange('share.ogImage', v)}
                />
                <span className="edit-field-hint">Rasio 1.91:1 (mis. 1200×630 px).</span>
              </label>

              <div className="share-og-fields">
                <Field label="Judul" hint="Judul yang tampil di kartu pratinjau saat tautan dibagikan.">
                  <FieldInput
                    field={{ path: 'share.ogTitle', type: 'text' }}
                    value={getPath(config, 'share.ogTitle')}
                    onChange={v => onFieldChange('share.ogTitle', v)}
                  />
                </Field>
                <Field label="Deskripsi" hint="Teks singkat di bawah judul pada kartu pratinjau.">
                  <FieldInput
                    field={{ path: 'share.ogDescription', type: 'textarea' }}
                    value={getPath(config, 'share.ogDescription')}
                    onChange={v => onFieldChange('share.ogDescription', v)}
                  />
                </Field>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Bulk send card ── */}
      <div className="gl-card wa-send-card">
        <div className="wa-send-header">
          <h2 className="wa-send-title"><i className="fas fa-paper-plane" /> Kirim Pesan ke Tamu</h2>
          <label className="wa-checkbox">
            <input
              type="checkbox"
              checked={onlyUnsent}
              onChange={e => setOnlyUnsent(e.target.checked)}
              disabled={sending}
            />
            Hanya kirim ke yang belum "Terkirim"
          </label>
        </div>

        <div className="wa-send-actions">
          {sending ? (
            <button type="button" className="gl-btn gl-btn--danger" onClick={handleAbort}>
              <i className="fas fa-stop" /> Hentikan Pengiriman
            </button>
          ) : (
            <button type="button" className="gl-btn gl-btn--primary" onClick={() => handleSend('bulk')} disabled={!isConnected}>
              <i className="fas fa-paper-plane" /> Kirim Sekarang
            </button>
          )}
          {!isConnected && (
            <span className="wa-send-hint">Hubungkan WhatsApp terlebih dahulu untuk mengirim pesan.</span>
          )}
        </div>

        {/* ── Progress ── */}
        {progress && (
          <div className="wa-progress">
            <div className="wa-progress-bar">
              <div className="wa-progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="wa-progress-meta">
              {progress.total > 0 ? (
                <span>{Math.min(progress.index + (sending ? 1 : 0), progress.total)} / {progress.total} tamu diproses</span>
              ) : (
                <span>Mempersiapkan pengiriman…</span>
              )}
              {waitSeconds != null && waitSeconds > 0 && (
                <span className="wa-progress-wait">
                  <i className="fas fa-hourglass-half" /> Jeda {waitSeconds}s sebelum pesan berikutnya
                </span>
              )}
            </div>
            {rateLimitPause && (
              <div className="wa-progress-pause">
                <i className="fas fa-pause-circle" /> Batas {rateLimitPause.limit} pesan/jam tercapai. Pengiriman dijeda otomatis,
                lanjut dalam {formatDuration(Math.max(rateLimitPause.waitSeconds, 0))}.
              </div>
            )}
          </div>
        )}

        {/* ── Results ── */}
        {results && (
          <div className="wa-results db-stat-grid">
            <div className="db-stat-card">
              <div className="db-stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                <i className="fas fa-check" />
              </div>
              <div className="db-stat-body">
                <div className="db-stat-value">{results.sent.length}</div>
                <div className="db-stat-label">Terkirim</div>
              </div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>
                <i className="fas fa-times" />
              </div>
              <div className="db-stat-body">
                <div className="db-stat-value">{results.failed.length}</div>
                <div className="db-stat-label">Gagal</div>
              </div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-icon" style={{ background: '#f8fafc', color: '#64748b' }}>
                <i className="fas fa-forward" />
              </div>
              <div className="db-stat-body">
                <div className="db-stat-value">{results.skipped.length}</div>
                <div className="db-stat-label">Dilewati</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Activity log ── */}
        {log.length > 0 && (
          <div className="wa-log">
            <div className="wa-log-title">Aktivitas Terbaru</div>
            <ul className="wa-log-list">
              {log.map((l, i) => (
                <li key={i} className={`wa-log-item wa-log-item--${l.type}`}>
                  <i className={`fas ${l.type === 'sent' ? 'fa-check' : l.type === 'failed' ? 'fa-times' : 'fa-forward'}`} />
                  <span className="wa-log-name">{l.name}</span>
                  {l.type === 'sent' && <span className="wa-log-status">terkirim</span>}
                  {l.type === 'skip' && <span className="wa-log-status">dilewati (no. WA kosong)</span>}
                  {l.type === 'failed' && <span className="wa-log-status" title={l.reason}>gagal</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Pending guests ── */}
      <div className="gl-card wa-pending-card">
        <div className="wa-send-header">
          <h2 className="wa-send-title"><i className="fas fa-user-clock" /> Tamu Belum Dikirim Pesan</h2>
          <span className="wa-pending-count">{pendingGuests.length} tamu</span>
        </div>

        {guestsLoading ? (
          <div className="gl-empty"><i className="fas fa-spinner fa-spin" /> Memuat data tamu…</div>
        ) : pendingGuests.length === 0 ? (
          <div className="gl-empty"><i className="fas fa-check-circle" /> Semua tamu dengan no. WhatsApp sudah dikirim pesan.</div>
        ) : (
          <ul className="wa-pending-list">
            {pendingGuests.map(g => (
              <li key={g.id} className="wa-pending-item">
                <div className="wa-pending-info">
                  <span className="wa-pending-name">{g.name}</span>
                  <span className="wa-pending-phone">{g.phone}</span>
                </div>
                {(sendStatus[g.id] || (sending && sendTarget === 'bulk')) && (
                  <span className={`wa-pending-status wa-pending-status--${sendStatus[g.id] || (currentGuestId === g.id ? 'sending' : 'queued')}`}>
                    {sendStatus[g.id] === 'sent' && <><i className="fas fa-check-circle" /> Terkirim</>}
                    {sendStatus[g.id] === 'failed' && <><i className="fas fa-times-circle" /> Gagal</>}
                    {sendStatus[g.id] === 'skip' && <><i className="fas fa-forward" /> Dilewati</>}
                    {!sendStatus[g.id] && currentGuestId === g.id && <><i className="fas fa-circle-notch fa-spin" /> Mengirim…</>}
                    {!sendStatus[g.id] && currentGuestId !== g.id && <><i className="fas fa-clock" /> Menunggu</>}
                  </span>
                )}
                <button
                  type="button"
                  className="gl-btn gl-btn--ghost wa-pending-send"
                  onClick={() => handleSend(g.id, [g.id])}
                  disabled={!isConnected || sending}
                >
                  {sendTarget === g.id ? (
                    <><i className="fas fa-circle-notch fa-spin" /> Mengirim…</>
                  ) : (
                    <><i className="fas fa-paper-plane" /> Kirim</>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>

      {/* ── Preview panel ── */}
      <div className="share-preview-panel">
        <div className="share-preview-panel-label">
          <i className="fas fa-eye" /> Pratinjau Pesan
        </div>
        <WhatsAppPreview
          template={template}
          ogImage={config?.share?.ogImage}
          ogTitle={config?.share?.ogTitle}
          ogDescription={config?.share?.ogDescription}
        />
        <p className="share-preview-panel-note">
          Contoh tampilan dengan nama tamu "<strong>{WA_SAMPLE_NAME}</strong>"
        </p>
      </div>
      </div>
    </div>
  )
}
