import { useState, useEffect, useCallback } from 'react'
import { authFetch } from './authClient'
import './WishesList.css'

const RSVP_CONFIG = {
  'EXCITED TO ATTEND': { label: 'Hadir',      cls: 'green' },
  'Mungkin Datang':    { label: 'Mungkin',     cls: 'amber' },
  'Tidak Hadir':       { label: 'Tidak Hadir', cls: 'red'   },
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 2)  return 'baru saja'
  if (mins  < 60) return `${mins} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  if (days  < 30) return `${days} hari lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function initials(name) {
  return (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

const AVATAR_COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#f43f5e','#14b8a6',
]
function avatarColor(name) {
  let h = 0
  for (let i = 0; i < (name || '').length; i++) h = ((h << 5) - h) + name.charCodeAt(i)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function VisibilityBtn({ visible, toggling, onToggle }) {
  return (
    <button
      type="button"
      className={`gl-icon-btn wl-vis-btn${!visible ? ' wl-vis-btn--hidden' : ''}`}
      onClick={onToggle}
      disabled={toggling}
      title={visible ? 'Sembunyikan dari publik' : 'Tampilkan ke publik'}
    >
      <i className={`fas ${toggling ? 'fa-circle-notch fa-spin' : visible ? 'fa-eye' : 'fa-eye-slash'}`} />
    </button>
  )
}

export default function WishesList({ onMenuOpen }) {
  const [entries, setEntries]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [search, setSearch]         = useState('')
  const [filterRsvp, setFilterRsvp] = useState('')
  const [filterVis, setFilterVis]   = useState('all') // 'all' | 'visible' | 'hidden'
  const [view, setView]             = useState('cards')
  const [toggling, setToggling]     = useState(new Set())

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await authFetch('/api/rsvp')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setEntries(await res.json())
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleVisibility(id, currentVisible) {
    setToggling(s => new Set(s).add(id))
    try {
      const res = await authFetch(`/api/rsvp/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisible }),
      })
      if (!res.ok) throw new Error('Gagal mengubah visibilitas')
      setEntries(prev => prev.map(e => e.id === id ? { ...e, visible: !currentVisible } : e))
    } catch (e) { setError(e.message) }
    finally { setToggling(s => { const n = new Set(s); n.delete(id); return n }) }
  }

  const filtered = entries.filter(e => {
    const matchSearch = !search ||
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.wish?.toLowerCase().includes(search.toLowerCase())
    const matchRsvp = !filterRsvp || e.attend === filterRsvp
    const matchVis  = filterVis === 'all' ||
      (filterVis === 'visible' && e.visible !== false) ||
      (filterVis === 'hidden'  && e.visible === false)
    return matchSearch && matchRsvp && matchVis
  })

  const withWish    = filtered.filter(e => e.wish?.trim())
  const withoutWish = filtered.filter(e => !e.wish?.trim())

  const attending    = entries.filter(e => e.attend === 'EXCITED TO ATTEND').length
  const maybe        = entries.filter(e => e.attend === 'Mungkin Datang').length
  const notAttending = entries.filter(e => e.attend === 'Tidak Hadir').length
  const visibleCount = entries.filter(e => e.wish?.trim() && e.visible !== false).length
  const hiddenCount  = entries.filter(e => e.wish?.trim() && e.visible === false).length

  function exportCsv() {
    const header = 'Nama,RSVP,Jumlah Tamu,Ucapan,Visibilitas,Tanggal'
    const rows = entries.map(e => [
      e.name, RSVP_CONFIG[e.attend]?.label || e.attend || '',
      e.guests || 1, e.wish || '',
      e.visible !== false ? 'Publik' : 'Tersembunyi',
      e.createdAt ? new Date(e.createdAt).toLocaleString('id-ID') : '',
    ].map(v => `"${String(v).replace(/"/g, '""')}"`)
     .join(','))
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'daftar-ucapan.csv'
    a.click()
  }

  return (
    <div className="wl-wrap">

      {/* ── Page header ── */}
      <div className="gl-header">
        <button type="button" className="edit-hamburger" onClick={onMenuOpen} title="Toggle menu">
          <i className="fas fa-bars" />
        </button>
        <div className="gl-header-left">
          <div className="gl-header-icon"><i className="fas fa-comment-dots" /></div>
          <div>
            <h1 className="gl-header-title">Daftar Ucapan</h1>
            <p className="gl-header-sub">
              <span className="gl-header-count">{entries.length}</span> respons masuk
            </p>
          </div>
        </div>
        <div className="gl-header-actions">
          <div className="wl-view-toggle">
            <button type="button" className={`wl-view-btn${view === 'cards' ? ' active' : ''}`}
              onClick={() => setView('cards')} title="Tampilan kartu">
              <i className="fas fa-th-large" />
            </button>
            <button type="button" className={`wl-view-btn${view === 'table' ? ' active' : ''}`}
              onClick={() => setView('table')} title="Tampilan tabel">
              <i className="fas fa-list" />
            </button>
          </div>
          <button type="button" className="gl-btn gl-btn--ghost" onClick={exportCsv}>
            <i className="fas fa-download" /> Export CSV
          </button>
          <button type="button" className="gl-btn gl-btn--ghost" onClick={load}>
            <i className="fas fa-sync-alt" /> Refresh
          </button>
        </div>
      </div>

      {/* ── Stat strip ── */}
      <div className="wl-stats">
        <div className="wl-stat">
          <span className="wl-stat-num wl-stat-num--blue">{attending}</span>
          <span className="wl-stat-label">Hadir</span>
        </div>
        <div className="wl-stat-divider" />
        <div className="wl-stat">
          <span className="wl-stat-num wl-stat-num--amber">{maybe}</span>
          <span className="wl-stat-label">Mungkin</span>
        </div>
        <div className="wl-stat-divider" />
        <div className="wl-stat">
          <span className="wl-stat-num wl-stat-num--red">{notAttending}</span>
          <span className="wl-stat-label">Tidak Hadir</span>
        </div>
        <div className="wl-stat-divider" />
        <div className="wl-stat">
          <span className="wl-stat-num wl-stat-num--green">{visibleCount}</span>
          <span className="wl-stat-label">Tampil Publik</span>
        </div>
        <div className="wl-stat-divider" />
        <div className="wl-stat">
          <span className="wl-stat-num wl-stat-num--grey">{hiddenCount}</span>
          <span className="wl-stat-label">Tersembunyi</span>
        </div>
      </div>

      {error && <div className="gl-error"><i className="fas fa-exclamation-circle" /> {error}</div>}

      {/* ── Toolbar ── */}
      <div className="gl-card">
        <div className="gl-toolbar">
          <div className="gl-search-wrap">
            <i className="fas fa-search gl-search-icon" />
            <input type="text" className="gl-input gl-search"
              placeholder="Cari nama atau ucapan…"
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <button type="button" className="gl-search-clear" onClick={() => setSearch('')}>
                <i className="fas fa-times" />
              </button>
            )}
          </div>
          <select className="gl-input gl-select" style={{ width: 154, flexShrink: 0 }}
            value={filterRsvp} onChange={e => setFilterRsvp(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="EXCITED TO ATTEND">Hadir</option>
            <option value="Mungkin Datang">Mungkin</option>
            <option value="Tidak Hadir">Tidak Hadir</option>
          </select>
          <select className="gl-input gl-select" style={{ width: 140, flexShrink: 0 }}
            value={filterVis} onChange={e => setFilterVis(e.target.value)}>
            <option value="all">Semua Ucapan</option>
            <option value="visible">Tampil Publik</option>
            <option value="hidden">Tersembunyi</option>
          </select>
        </div>

        {loading ? (
          <div className="gl-empty"><i className="fas fa-circle-notch fa-spin" /><span>Memuat data…</span></div>
        ) : filtered.length === 0 ? (
          <div className="gl-empty">
            <i className="fas fa-inbox" />
            <span>{search || filterRsvp || filterVis !== 'all' ? 'Tidak ada hasil untuk filter ini.' : 'Belum ada ucapan masuk.'}</span>
          </div>
        ) : view === 'table' ? (

          /* ── Table view ── */
          <table className="gl-table">
            <thead>
              <tr>
                <th className="gl-th gl-th--num">#</th>
                <th className="gl-th">Nama</th>
                <th className="gl-th gl-th--hide-sm">RSVP</th>
                <th className="gl-th gl-th--hide-sm">Tamu</th>
                <th className="gl-th">Ucapan</th>
                <th className="gl-th gl-th--hide-sm">Waktu</th>
                <th className="gl-th gl-th--action" title="Visibilitas publik"><i className="fas fa-eye" /></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.id} className={`gl-tr${e.visible === false ? ' wl-tr--hidden' : ''}`}>
                  <td className="gl-td gl-td--num">
                    <span className="gl-num-cell"><span className="gl-num-label">{i + 1}</span></span>
                  </td>
                  <td className="gl-td gl-td--name">
                    <div className="wl-name-cell">
                      <div className="wl-avatar" style={{ background: avatarColor(e.name) }}>
                        {initials(e.name)}
                      </div>
                      <span>{e.name}</span>
                    </div>
                  </td>
                  <td className="gl-td gl-td--hide-sm">
                    {e.attend
                      ? <span className={`gl-rsvp-badge gl-rsvp-badge--${RSVP_CONFIG[e.attend]?.cls || 'grey'}`}>
                          {RSVP_CONFIG[e.attend]?.label || e.attend}
                        </span>
                      : <span className="gl-empty-cell">—</span>}
                  </td>
                  <td className="gl-td gl-td--hide-sm" style={{ textAlign: 'center' }}>
                    {e.guests || 1}
                  </td>
                  <td className="gl-td wl-td--wish">
                    {e.wish?.trim()
                      ? <span className="wl-wish-text">{e.wish}</span>
                      : <span className="gl-empty-cell">—</span>}
                  </td>
                  <td className="gl-td gl-td--hide-sm wl-td--time">{timeAgo(e.createdAt)}</td>
                  <td className="gl-td gl-td--action">
                    {e.wish?.trim() && (
                      <VisibilityBtn
                        visible={e.visible !== false}
                        toggling={toggling.has(e.id)}
                        onToggle={() => toggleVisibility(e.id, e.visible !== false)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        ) : (

          /* ── Card view ── */
          <div className="wl-cards">
            {withWish.length > 0 && (
              <>
                <div className="wl-section-label">
                  <i className="fas fa-comment-dots" /> Ucapan ({withWish.length})
                </div>
                <div className="wl-card-grid">
                  {withWish.map(e => (
                    <div key={e.id} className={`wl-card${e.visible === false ? ' wl-card--hidden' : ''}`}>
                      <div className="wl-card-top">
                        <div className="wl-avatar" style={{ background: avatarColor(e.name) }}>
                          {initials(e.name)}
                        </div>
                        <div className="wl-card-meta">
                          <span className="wl-card-name">{e.name}</span>
                          <span className="wl-card-time">{timeAgo(e.createdAt)}</span>
                        </div>
                        {e.attend && (
                          <span className={`gl-rsvp-badge gl-rsvp-badge--${RSVP_CONFIG[e.attend]?.cls || 'grey'}`}>
                            {RSVP_CONFIG[e.attend]?.label || e.attend}
                          </span>
                        )}
                        <VisibilityBtn
                          visible={e.visible !== false}
                          toggling={toggling.has(e.id)}
                          onToggle={() => toggleVisibility(e.id, e.visible !== false)}
                        />
                      </div>
                      <p className="wl-card-wish">{e.wish}</p>
                      {e.guests > 1 && (
                        <span className="wl-card-pax"><i className="fas fa-users" /> {e.guests} tamu</span>
                      )}
                      {e.visible === false && (
                        <span className="wl-hidden-badge"><i className="fas fa-eye-slash" /> Tersembunyi dari publik</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {withoutWish.length > 0 && (
              <>
                <div className="wl-section-label" style={{ marginTop: withWish.length ? 24 : 0 }}>
                  <i className="fas fa-check-circle" style={{ color: '#10b981' }} /> Konfirmasi tanpa ucapan ({withoutWish.length})
                </div>
                <div className="wl-rsvp-only-list">
                  {withoutWish.map(e => (
                    <div key={e.id} className="wl-rsvp-only-item">
                      <div className="wl-avatar wl-avatar--sm" style={{ background: avatarColor(e.name) }}>
                        {initials(e.name)}
                      </div>
                      <span className="wl-rsvp-only-name">{e.name}</span>
                      {e.attend && (
                        <span className={`gl-rsvp-badge gl-rsvp-badge--${RSVP_CONFIG[e.attend]?.cls || 'grey'}`}>
                          {RSVP_CONFIG[e.attend]?.label || e.attend}
                        </span>
                      )}
                      <span className="wl-rsvp-only-time">{timeAgo(e.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="gl-table-footer">
            <span>Menampilkan {filtered.length} dari {entries.length} respons</span>
          </div>
        )}
      </div>
    </div>
  )
}
