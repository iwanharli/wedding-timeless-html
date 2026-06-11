import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { authFetch } from '../auth/authClient'
import './Dashboard.css'

const CATEGORY_COLOR = {
  'Keluarga':    '#2563eb',
  'Teman':       '#10b981',
  'Rekan Kerja': '#8b5cf6',
  'Lainnya':     '#64748b',
}
const CATEGORY_BG = {
  'Keluarga':    '#eff6ff',
  'Teman':       '#f0fdf4',
  'Rekan Kerja': '#faf5ff',
  'Lainnya':     '#f8fafc',
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

function TrafficChart({ daily, days = 7 }) {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    const filled = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const found = daily.find(r => r.date === dateStr)
      filled.push({
        date: dateStr,
        total: found ? found.total : 0,
        personal: found ? found.personal : 0,
        public: found ? (found.total - found.personal) : 0,
      })
    }

    const xData = filled.map(d => {
      const dt = new Date(d.date + 'T12:00:00')
      return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    })
    const personalData = filled.map(d => d.personal)
    const publicData = filled.map(d => d.public)

    let cancelled = false
    let chart
    let resizeObserver

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#111827',
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: 12
        },
        extraCssText: 'box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border-radius: 8px;'
      },
      grid: {
        top: '12%',
        left: '2%',
        right: '2%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif'
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLine: {
          show: false
        },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif'
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6'
          }
        }
      },
      series: [
        {
          name: 'Link personal',
          type: 'bar',
          stack: 'visits',
          data: personalData,
          itemStyle: {
            color: '#c9a87c'
          },
          emphasis: {
            itemStyle: {
              color: '#b8935f'
            }
          }
        },
        {
          name: 'Link umum',
          type: 'bar',
          stack: 'visits',
          data: publicData,
          itemStyle: {
            color: '#ebdcc7',
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: '#dfccb3'
            }
          }
        }
      ]
    }

    import('echarts').then((echarts) => {
      if (cancelled || !chartRef.current) return
      chart = echarts.init(chartRef.current)
      chart.setOption(option)
      resizeObserver = new ResizeObserver(() => chart.resize())
      resizeObserver.observe(chartRef.current)
    })

    return () => {
      cancelled = true
      chart?.dispose()
      resizeObserver?.disconnect()
    }
  }, [daily, days])

  return (
    <div ref={chartRef} style={{ width: '100%', height: '240px' }} />
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

export default function Dashboard({ onMenuOpen }) {
  const [data, setData]       = useState(null)
  const [traffic, setTraffic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [days, setDays]       = useState(7)

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
      <div className="gl-header">
        <button type="button" className="edit-hamburger" onClick={onMenuOpen} title="Toggle menu">
          <i className="fas fa-bars" />
        </button>
        <div className="gl-header-left">
          <div className="gl-header-icon"><i className="fas fa-tachometer-alt" /></div>
          <div>
            <h1 className="gl-header-title">Dashboard</h1>
            <p className="gl-header-sub">Ringkasan RSVP, kunjungan, dan ucapan tamu</p>
          </div>
        </div>
      </div>

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
          label="Konfirmasi Hadir"
          value={rsvp.attending}
          sub={rsvp.totalPax > 0 ? `${rsvp.totalPax} estimasi tamu datang` : 'Belum ada estimasi hadir'}
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
          sub={`dari ${rsvp.total} respons RSVP`}
        />
      </div>

      {/* ── Traffic chart ── */}
      {traffic && (
        <div className="db-card">
          <div className="db-card-header db-card-header--traffic">
            <div className="db-card-header-left">
              <i className="fas fa-chart-line" />
              <span>Traffic Kunjungan</span>
              <span className="db-card-header-badge">{traffic.allTime} total</span>
              <Link to="/admin/traffic-detail" className="db-card-header-link" style={{ marginLeft: '10px', fontSize: '12.5px', color: 'var(--accent-dark)', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0' }} />
              </Link>
            </div>
            <div className="db-card-header-right">
              <div className="db-traffic-legend">
                <span className="db-traffic-dot db-traffic-dot--personal" /> Link personal
                <span className="db-traffic-dot db-traffic-dot--public"   /> Link umum
              </div>
              <select className="db-range-select" value={days} onChange={e => setDays(Number(e.target.value))}>
                <option value={7}>7 Hari Terakhir</option>
                <option value={14}>14 Hari Terakhir</option>
                <option value={30}>30 Hari Terakhir</option>
              </select>
            </div>
          </div>
          <div className="db-card-body db-card-body--chart db-card-body--empty">
            {traffic.allTime === 0 ? (
              <p className="db-empty-text">Belum ada data kunjungan.</p>
            ) : (
              <TrafficChart daily={traffic.daily} days={days} />
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
          <div className={`db-card-body${guests.byCategory.length === 0 ? ' db-card-body--empty' : ''}`}>
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
        <div className={`db-card-body db-card-body--flush${wishes.recent.length === 0 ? ' db-card-body--empty' : ''}`}>
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
