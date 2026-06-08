import { useState, useEffect } from 'react'
import { authFetch } from './authClient'

const CATEGORY_COLOR = {
  'Keluarga':    '#3b82f6',
  'Teman':       '#22c55e',
  'Rekan Kerja': '#a855f7',
  'Lainnya':     '#9ca3af',
}
const CATEGORY_BG = {
  'Keluarga':    '#eff6ff',
  'Teman':       '#f0fdf4',
  'Rekan Kerja': '#faf5ff',
  'Lainnya':     '#f3f4f6',
}

function StatCard({ icon, iconBg, iconColor, label, value, sub, subColor }) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-icon" style={{ background: iconBg, color: iconColor }}>
        <i className={`fas ${icon}`} />
      </div>
      <div className="db-stat-body">
        <div className="db-stat-value">{value ?? '—'}</div>
        <div className="db-stat-label">{label}</div>
        {sub && <div className="db-stat-sub" style={subColor ? { color: subColor } : {}}>{sub}</div>}
      </div>
    </div>
  )
}

function BarSegment({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="db-bar-row">
      <div className="db-bar-meta">
        <span className="db-bar-dot" style={{ background: color }} />
        <span className="db-bar-label">{label}</span>
        <span className="db-bar-count">{count}</span>
        <span className="db-bar-pct">{pct}%</span>
      </div>
      <div className="db-bar-track">
        <div className="db-bar-fill" style={{ width: `${pct}%`, background: color, opacity: .85 }} />
      </div>
    </div>
  )
}

function TrafficChart({ daily, days = 14 }) {
  const filled = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const found = daily.find(r => r.date === dateStr)
    filled.push({
      date:     dateStr,
      total:    found ? found.total    : 0,
      personal: found ? found.personal : 0,
    })
  }

  const maxVal  = Math.max(...filled.map(d => d.total), 4)
  const niceMax = Math.ceil(maxVal / 4) * 4

  const W = 560, H = 160
  const PAD = { top: 16, right: 12, bottom: 28, left: 32 }
  const cW = W - PAD.left - PAD.right
  const cH = H - PAD.top  - PAD.bottom
  const bW  = cW / days
  const barW = Math.max(bW - 6, 4)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const y   = PAD.top + cH * (1 - t)
        const val = Math.round(niceMax * t)
        return (
          <g key={t}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={PAD.left - 5} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{val}</text>
          </g>
        )
      })}
      {filled.map((d, i) => {
        const x        = PAD.left + i * bW + (bW - barW) / 2
        const pubCount = d.total - d.personal
        const persH    = (d.personal / niceMax) * cH
        const pubH     = (pubCount   / niceMax) * cH
        const showLbl  = days <= 7 || i % 2 === 0
        const dt       = new Date(d.date + 'T12:00:00')
        const lbl      = dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        return (
          <g key={d.date}>
            {pubH > 0 && (
              <rect x={x} y={PAD.top + cH - persH - pubH} width={barW} height={pubH} fill="#bfdbfe" rx="2" />
            )}
            {persH > 0 && (
              <rect x={x} y={PAD.top + cH - persH} width={barW} height={persH} fill="#3b82f6" rx="2" />
            )}
            {d.total === 0 && (
              <rect x={x} y={PAD.top + cH - 2} width={barW} height={2} fill="#f3f4f6" rx="1" />
            )}
            {showLbl && (
              <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize="8.5" fill="#9ca3af">{lbl}</text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60)    return 'baru saja'
  if (diff < 3600)  return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
  return `${Math.floor(diff / 86400)} hari lalu`
}

function initials(name) {
  return (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

const AVATAR_COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#f43f5e','#14b8a6']
function avatarColor(name) {
  let h = 0
  for (let i = 0; i < (name || '').length; i++) h = ((h << 5) - h) + name.charCodeAt(i)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

export default function Dashboard() {
  const [data, setData]       = useState(null)
  const [traffic, setTraffic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      authFetch('/api/dashboard').then(r => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`)),
      authFetch('/api/visits/stats').then(r => r.ok ? r.json() : { daily: [], allTime: 0 }),
    ])
      .then(([dash, visits]) => { setData(dash); setTraffic(visits); setLoading(false) })
      .catch(e => { setError(String(e)); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="db-loading"><i className="fas fa-circle-notch fa-spin" /> Memuat statistik…</div>
  )
  if (error) return (
    <div className="db-error"><i className="fas fa-exclamation-circle" /> {error}</div>
  )

  const { guests, rsvp, wishes } = data

  // Response rate based on guests-in-list only
  const responseRate = guests.total > 0 ? Math.round((guests.responded / guests.total) * 100) : 0
  const waRate       = guests.total > 0 ? Math.round((guests.withPhone / guests.total) * 100) : 0

  // Rate bar: uses linked counts so segments sum to guests.total (100%)
  const pctOf = n => guests.total > 0 ? (n / guests.total) * 100 : 0

  return (
    <div className="db-wrap">

      {/* ── Stat cards ── */}
      <div className="db-stat-grid">
        <StatCard
          icon="fa-users" iconBg="#f0fdf4" iconColor="#16a34a"
          label="Total Tamu" value={guests.total}
          sub={guests.recentWeek > 0 ? `+${guests.recentWeek} minggu ini` : 'Belum ada tamu baru'}
          subColor={guests.recentWeek > 0 ? '#16a34a' : undefined}
        />
        <StatCard
          icon="fa-calendar-check" iconBg="#eff6ff" iconColor="#2563eb"
          label="RSVP Hadir" value={rsvp.attending}
          sub={`${rsvp.totalPax} estimasi tamu datang`}
        />
        <StatCard
          icon="fa-clock" iconBg="#fffbeb" iconColor="#d97706"
          label="Belum RSVP" value={rsvp.pending}
          sub={`${responseRate}% tamu sudah merespons`}
          subColor={responseRate >= 80 ? '#16a34a' : responseRate >= 50 ? '#d97706' : '#dc2626'}
        />
        <StatCard
          icon="fa-heart" iconBg="#fdf2f8" iconColor="#db2777"
          label="Ucapan Masuk" value={wishes.total}
          sub={`dari ${rsvp.total} total RSVP`}
        />
      </div>

      {/* ── Traffic chart ── */}
      {traffic && (
        <div className="db-card">
          <div className="db-card-header">
            <i className="fas fa-chart-line" />
            <span>Traffic Kunjungan</span>
            <span className="db-card-header-badge">{traffic.allTime} total</span>
            <div className="db-traffic-legend">
              <span className="db-traffic-dot db-traffic-dot--personal" /> Link personal
              <span className="db-traffic-dot db-traffic-dot--public"   /> Link umum
            </div>
          </div>
          <div className="db-card-body db-card-body--chart">
            {traffic.allTime === 0 ? (
              <p className="db-empty-text">Belum ada data kunjungan.</p>
            ) : (
              <TrafficChart daily={traffic.daily} days={14} />
            )}
          </div>
        </div>
      )}

      {/* ── Middle row ── */}
      <div className="db-mid-grid">

        {/* Kategori tamu */}
        <div className="db-card">
          <div className="db-card-header">
            <i className="fas fa-chart-bar" />
            <span>Kategori Tamu</span>
          </div>
          <div className="db-card-body">
            {guests.byCategory.length === 0 ? (
              <p className="db-empty-text">Belum ada data tamu.</p>
            ) : (
              <div className="db-bars">
                {guests.byCategory.map(({ category, count }) => (
                  <BarSegment
                    key={category}
                    label={category} count={count} total={guests.total}
                    color={CATEGORY_COLOR[category] || '#9ca3af'}
                    bg={CATEGORY_BG[category] || '#f3f4f6'}
                  />
                ))}
              </div>
            )}
            <div className="db-bar-summary">
              <div className="db-summary-item">
                <span className="db-summary-num" style={{ color: '#16a34a' }}>{guests.withPhone}</span>
                <span className="db-summary-label">Punya WA ({waRate}%)</span>
              </div>
              <div className="db-summary-divider" />
              <div className="db-summary-item">
                <span className="db-summary-num" style={{ color: '#9ca3af' }}>{guests.total - guests.withPhone}</span>
                <span className="db-summary-label">Tanpa WA</span>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP breakdown */}
        <div className="db-card">
          <div className="db-card-header">
            <i className="fas fa-envelope-open-text" />
            <span>Status RSVP</span>
            <span className="db-card-header-badge">{rsvp.total} respons</span>
          </div>
          <div className="db-card-body">
            <div className="db-rsvp-grid">
              <div className="db-rsvp-item db-rsvp-item--attend">
                <div className="db-rsvp-num">{rsvp.attending}</div>
                <div className="db-rsvp-label">Hadir</div>
                <div className="db-rsvp-pax">{rsvp.totalPax} orang</div>
              </div>
              <div className="db-rsvp-item db-rsvp-item--maybe">
                <div className="db-rsvp-num">{rsvp.maybe}</div>
                <div className="db-rsvp-label">Mungkin</div>
              </div>
              <div className="db-rsvp-item db-rsvp-item--no">
                <div className="db-rsvp-num">{rsvp.notAttending}</div>
                <div className="db-rsvp-label">Tidak Hadir</div>
              </div>
              <div className="db-rsvp-item db-rsvp-item--pending">
                <div className="db-rsvp-num">{rsvp.pending}</div>
                <div className="db-rsvp-label">Belum RSVP</div>
              </div>
            </div>

            {/* Rate bar — linked counts only, always sums to 100% of guests.total */}
            <div className="db-rate-wrap">
              <div className="db-rate-label">
                <span>Respons tamu undangan</span>
                <strong>{responseRate}%</strong>
              </div>
              <div className="db-rate-track">
                <div className="db-rate-fill db-rate-fill--attend" style={{ width: `${pctOf(rsvp.linkedAttending)}%` }} />
                <div className="db-rate-fill db-rate-fill--maybe"  style={{ width: `${pctOf(rsvp.linkedMaybe)}%` }} />
                <div className="db-rate-fill db-rate-fill--no"     style={{ width: `${pctOf(rsvp.linkedNotAttending)}%` }} />
              </div>
              <div className="db-rate-legend">
                <span className="db-rate-dot" style={{ background: '#22c55e' }} /> Hadir ({rsvp.linkedAttending})
                <span className="db-rate-dot" style={{ background: '#f59e0b', marginLeft: 10 }} /> Mungkin ({rsvp.linkedMaybe})
                <span className="db-rate-dot" style={{ background: '#f87171', marginLeft: 10 }} /> Tidak ({rsvp.linkedNotAttending})
                <span className="db-rate-dot" style={{ background: '#e5e7eb', marginLeft: 10 }} /> Belum ({rsvp.pending})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent wishes ── */}
      <div className="db-card">
        <div className="db-card-header">
          <i className="fas fa-comment-alt" />
          <span>Ucapan Terbaru</span>
          <span className="db-card-header-badge">{wishes.total} ucapan</span>
        </div>
        <div className="db-card-body db-card-body--flush">
          {wishes.recent.length === 0 ? (
            <p className="db-empty-text" style={{ padding: '20px' }}>Belum ada ucapan masuk.</p>
          ) : (
            <ul className="db-wish-list">
              {wishes.recent.map((w, i) => (
                <li key={i} className="db-wish-item">
                  <div className="db-wish-avatar" style={{ background: avatarColor(w.name) }}>
                    {initials(w.name)}
                  </div>
                  <div className="db-wish-body">
                    <div className="db-wish-name">{w.name}</div>
                    <div className="db-wish-message">"{w.message}"</div>
                  </div>
                  <div className="db-wish-time">{timeAgo(w.createdAt)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    </div>
  )
}
