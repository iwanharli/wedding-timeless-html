import { useState, useEffect } from 'react'
import { authFetch } from './authClient'
import './edit.css'

export default function TrafficDetail() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [limit, setLimit] = useState(50)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    fetchData()
  }, [limit, offset])

  async function fetchData() {
    setLoading(true)
    try {
      const res = await authFetch(`/api/visits/details?limit=${limit}&offset=${offset}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
      setError(null)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  if (loading && !data) {
    return (
      <div className="db-loading"><i className="fas fa-circle-notch fa-spin" /> Memuat detail traffic…</div>
    )
  }

  if (error) {
    return (
      <div className="db-error"><i className="fas fa-exclamation-circle" /> {error}</div>
    )
  }

  const { visits, total, stats } = data || { visits: [], total: 0, stats: { devices: [], browsers: [], os: [] } }

  // Count unique IPs in the current visits view or simple calculation
  const uniqueIps = Array.from(new Set(visits.map(v => v.ip_address))).length

  const getDeviceIcon = (device) => {
    switch (device?.toLowerCase()) {
      case 'mobile': return 'fa-mobile-alt'
      case 'tablet': return 'fa-tablet-alt'
      case 'desktop': return 'fa-laptop'
      default: return 'fa-question-circle'
    }
  }

  const getOsIcon = (os) => {
    switch (os?.toLowerCase()) {
      case 'windows': return 'fa-windows'
      case 'android': return 'fa-android'
      case 'ios': return 'fa-apple'
      case 'macos': return 'fa-apple'
      case 'linux': return 'fa-linux'
      default: return 'fa-compact-disc'
    }
  }

  const getBrowserIcon = (browser) => {
    switch (browser?.toLowerCase()) {
      case 'chrome': return 'fa-chrome'
      case 'safari': return 'fa-safari'
      case 'firefox': return 'fa-firefox'
      case 'edge': return 'fa-edge'
      case 'opera': return 'fa-opera'
      case 'internet explorer': return 'fa-internet-explorer'
      default: return 'fa-globe'
    }
  }

  const formatTime = (timeStr) => {
    const d = new Date(timeStr)
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="db-wrap">
      {/* Header */}
      <div className="gl-header">
        <div className="gl-header-left">
          <div className="gl-header-icon" style={{ background: 'rgba(201, 168, 124, 0.12)', color: 'var(--accent-dark)' }}>
            <i className="fas fa-chart-line" />
          </div>
          <div>
            <h1 className="gl-header-title">Analisis Detail Traffic</h1>
            <p className="gl-header-sub"><span className="gl-header-count">{total} total kunjungan</span></p>
          </div>
        </div>
        <div className="gl-header-actions">
          <button type="button" className="gl-btn gl-btn--ghost" onClick={fetchData} disabled={loading}>
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Overview stats cards */}
      <div className="db-stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="db-stat-card">
          <div className="db-stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <i className="fas fa-chart-bar" />
          </div>
          <div className="db-stat-body">
            <div className="db-stat-value">{total}</div>
            <div className="db-stat-label">Total Kunjungan</div>
            <div className="db-stat-sub">Semua perangkat & link</div>
          </div>
        </div>
        <div className="db-stat-card">
          <div className="db-stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <i className="fas fa-fingerprint" />
          </div>
          <div className="db-stat-body">
            <div className="db-stat-value">{uniqueIps}</div>
            <div className="db-stat-label">IP Unik Halaman Ini</div>
            <div className="db-stat-sub">Dari {visits.length} data terakhir</div>
          </div>
        </div>
      </div>

      {/* Grid of breakdown stats */}
      <div className="db-mid-grid">
        {/* Device breakdown */}
        <div className="db-card">
          <div className="db-card-header">
            <i className="fas fa-laptop-house" />
            <span>Perangkat (Device)</span>
          </div>
          <div className="db-card-body">
            {stats.devices.length === 0 ? (
              <p className="db-empty-text">Belum ada data perangkat.</p>
            ) : (
              <div className="db-bars">
                {stats.devices.map(({ label, count }) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={label} className="db-bar-row">
                      <div className="db-bar-meta">
                        <span className="db-bar-label">
                          <i className={`fas ${getDeviceIcon(label)}`} style={{ marginRight: '8px', color: 'var(--accent-dark)' }} />
                          {label}
                        </span>
                        <span className="db-bar-count">{count}</span>
                        <span className="db-bar-pct">{pct}%</span>
                      </div>
                      <div className="db-bar-track">
                        <div className="db-bar-fill" style={{ width: `${pct}%`, background: 'var(--accent-dark)', opacity: 0.85 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* OS breakdown */}
        <div className="db-card">
          <div className="db-card-header">
            <i className="fas fa-microchip" />
            <span>Sistem Operasi (OS)</span>
          </div>
          <div className="db-card-body">
            {stats.os.length === 0 ? (
              <p className="db-empty-text">Belum ada data OS.</p>
            ) : (
              <div className="db-bars">
                {stats.os.map(({ label, count }) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={label} className="db-bar-row">
                      <div className="db-bar-meta">
                        <span className="db-bar-label">
                          <i className={`fab ${getOsIcon(label)}`} style={{ marginRight: '8px', color: '#3b82f6' }} />
                          {label}
                        </span>
                        <span className="db-bar-count">{count}</span>
                        <span className="db-bar-pct">{pct}%</span>
                      </div>
                      <div className="db-bar-track">
                        <div className="db-bar-fill" style={{ width: `${pct}%`, background: '#3b82f6', opacity: 0.85 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Browser breakdown */}
        <div className="db-card" style={{ gridColumn: 'span 2' }}>
          <div className="db-card-header">
            <i className="fas fa-compass" />
            <span>Browser</span>
          </div>
          <div className="db-card-body">
            {stats.browsers.length === 0 ? (
              <p className="db-empty-text">Belum ada data browser.</p>
            ) : (
              <div className="db-bars font-sans" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {stats.browsers.map(({ label, count }) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={label} className="db-bar-row">
                      <div className="db-bar-meta">
                        <span className="db-bar-label">
                          <i className={`fab ${getBrowserIcon(label)}`} style={{ marginRight: '8px', color: '#10b981' }} />
                          {label}
                        </span>
                        <span className="db-bar-count">{count}</span>
                        <span className="db-bar-pct">{pct}%</span>
                      </div>
                      <div className="db-bar-track">
                        <div className="db-bar-fill" style={{ width: `${pct}%`, background: '#10b981', opacity: 0.85 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log list table */}
      <div className="db-card" style={{ marginTop: '24px' }}>
        <div className="db-card-header">
          <i className="fas fa-list-ul" />
          <span>Log Kunjungan Terbaru</span>
        </div>
        <div className="db-card-body db-card-body--flush">
          {visits.length === 0 ? (
            <p className="db-empty-text" style={{ padding: '40px' }}>Belum ada data log kunjungan.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="gl-table">
                <thead>
                  <tr>
                    <th>Waktu Kunjungan</th>
                    <th>Tipe Link / Nama Tamu</th>
                    <th>Alamat IP</th>
                    <th>Perangkat</th>
                    <th>Sistem Operasi</th>
                    <th>Browser</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((v) => (
                    <tr key={v.id}>
                      <td style={{ whiteSpace: 'nowrap', fontWeight: '500' }}>
                        {formatTime(v.visited_at)}
                      </td>
                      <td>
                        {v.slug ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600', color: 'var(--accent-dark)' }}>
                              {v.guest_name || 'Tamu Terdaftar'}
                            </span>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                              Slug: {v.slug}
                            </span>
                          </div>
                        ) : (
                          <span className="db-card-header-badge" style={{ background: '#f1f5f9', color: '#475569', marginLeft: '0' }}>
                            Link Umum
                          </span>
                        )}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '12.5px', color: '#475569' }}>
                        {v.ip_address || '—'}
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <i className={`fas ${getDeviceIcon(v.device_type)}`} style={{ color: '#64748b' }} />
                          {v.device_type || '—'}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <i className={`fab ${getOsIcon(v.os_name)}`} style={{ color: '#3b82f6' }} />
                          {v.os_name || '—'}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <i className={`fab ${getBrowserIcon(v.browser_name)}`} style={{ color: '#10b981' }} />
                          {v.browser_name || '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination/Load more */}
          {total > limit && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
              <button 
                type="button" 
                className="gl-btn gl-btn--ghost" 
                onClick={() => setLimit(prev => prev + 50)}
                style={{ fontSize: '13px' }}
              >
                Tampilkan 50 Lagi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
