import { useState, useCallback, useEffect } from 'react'
import { authFetch } from '../auth/authClient'
import './GiftConfirmations.css'

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

function formatRupiah(val) {
  if (!val) return '—'
  const raw = String(val).replace(/\D/g, '')
  if (!raw) return '—'
  return 'Rp ' + raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
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

export default function GiftConfirmations({ onMenuOpen }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [search, setSearch]   = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await authFetch('/api/gifts')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setEntries(await res.json())
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = search
    ? entries.filter(e =>
        e.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.bank?.toLowerCase().includes(search.toLowerCase()) ||
        e.note?.toLowerCase().includes(search.toLowerCase())
      )
    : entries

  const totalAmount = entries.reduce((sum, e) => {
    const raw = String(e.amount || '').replace(/\D/g, '')
    return sum + (parseInt(raw, 10) || 0)
  }, 0)

  function exportCsv() {
    const header = 'Nama,Bank Tujuan,Jumlah,Catatan,Tanggal'
    const rows = entries.map(e => [
      e.name,
      e.bank,
      e.amount || '',
      e.note || '',
      e.createdAt ? new Date(e.createdAt).toLocaleString('id-ID') : '',
    ].map(v => `"${String(v).replace(/"/g, '""')}"`)
     .join(','))
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'konfirmasi-hadiah.csv'
    a.click()
  }

  return (
    <div className="gc-wrap">

      {/* ── Page header ── */}
      <div className="gl-header">
        <button type="button" className="edit-hamburger" onClick={onMenuOpen} title="Toggle menu">
          <i className="fas fa-bars" />
        </button>
        <div className="gl-header-left">
          <div className="gl-header-icon"><i className="fas fa-gift" /></div>
          <div>
            <h1 className="gl-header-title">Daftar Hadiah</h1>
            <p className="gl-header-sub">
              <span className="gl-header-count">{entries.length}</span> konfirmasi masuk
            </p>
          </div>
        </div>
        <div className="gl-header-actions">
          <button type="button" className="gl-btn gl-btn--ghost" onClick={exportCsv} disabled={!entries.length}>
            <i className="fas fa-download" /> Export CSV
          </button>
          <button type="button" className="gl-btn gl-btn--ghost" onClick={load}>
            <i className="fas fa-sync-alt" /> Refresh
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="db-stat-grid">
        <div className="db-stat-card">
          <div className="db-stat-icon" style={{ background: '#fdf2f8', color: '#db2777' }}>
            <i className="fas fa-gift" />
          </div>
          <div className="db-stat-body">
            <div className="db-stat-value">{entries.length}</div>
            <div className="db-stat-label">Total Konfirmasi</div>
            <div className="db-stat-sub">dari tamu undangan</div>
          </div>
        </div>
        <div className="db-stat-card">
          <div className="db-stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <i className="fas fa-money-bill-wave" />
          </div>
          <div className="db-stat-body">
            <div className="db-stat-value gc-total-amount">{totalAmount > 0 ? formatRupiah(String(totalAmount)) : '—'}</div>
            <div className="db-stat-label">Total Estimasi</div>
            <div className="db-stat-sub">jumlah yang dilaporkan</div>
          </div>
        </div>
        <div className="db-stat-card">
          <div className="db-stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <i className="fas fa-university" />
          </div>
          <div className="db-stat-body">
            <div className="db-stat-value">
              {[...new Set(entries.map(e => e.bank?.split('—')[0]?.trim()).filter(Boolean))].length || '—'}
            </div>
            <div className="db-stat-label">Bank Tujuan</div>
            <div className="db-stat-sub">rekening berbeda</div>
          </div>
        </div>
        <div className="db-stat-card">
          <div className="db-stat-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
            <i className="fas fa-sticky-note" />
          </div>
          <div className="db-stat-body">
            <div className="db-stat-value">{entries.filter(e => e.note?.trim()).length}</div>
            <div className="db-stat-label">Ada Catatan</div>
            <div className="db-stat-sub">konfirmasi berisi pesan</div>
          </div>
        </div>
      </div>

      {error && <div className="gl-error"><i className="fas fa-exclamation-circle" /> {error}</div>}

      {/* ── Toolbar ── */}
      <div className="gl-card">
        <div className="gl-toolbar">
          <div className="gl-search-wrap">
            <i className="fas fa-search gl-search-icon" />
            <input
              className="gl-input gl-search"
              placeholder="Cari nama, bank, atau catatan…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="gc-loading"><i className="fas fa-circle-notch fa-spin" /> Memuat…</div>
        ) : filtered.length === 0 ? (
          <div className="gc-empty">
            <i className="fas fa-gift" />
            <p>{search ? 'Tidak ada konfirmasi yang sesuai pencarian.' : 'Belum ada konfirmasi hadiah masuk.'}</p>
          </div>
        ) : (
          <div className="gl-table-wrap">
            <table className="gl-table">
              <thead>
                <tr>
                  <th className="gl-th">#</th>
                  <th className="gl-th">Pengirim</th>
                  <th className="gl-th">Bank Tujuan</th>
                  <th className="gl-th">Jumlah</th>
                  <th className="gl-th gl-th--hide-sm">Catatan</th>
                  <th className="gl-th gl-th--hide-sm">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, idx) => (
                  <tr key={e.id} className="gl-tr">
                    <td className="gl-td gc-td-num">{idx + 1}</td>
                    <td className="gl-td">
                      <div className="gc-name-cell">
                        <div
                          className="gc-avatar"
                          style={{ background: avatarColor(e.name) }}
                        >
                          {initials(e.name)}
                        </div>
                        <span className="gc-name">{e.name}</span>
                      </div>
                    </td>
                    <td className="gl-td">
                      <span className="gc-bank-badge">{e.bank}</span>
                    </td>
                    <td className="gl-td">
                      <span className="gc-amount">{formatRupiah(e.amount)}</span>
                    </td>
                    <td className="gl-td gl-td--hide-sm">
                      <span className="gc-note">{e.note || <span className="gc-empty-cell">—</span>}</span>
                    </td>
                    <td className="gl-td gl-td--hide-sm gc-td-time">
                      {timeAgo(e.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
