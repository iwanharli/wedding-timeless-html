import { useState, useEffect, useCallback } from 'react'
import { authFetch } from './authClient'

const inviteLink = (slug) => `${window.location.origin}/?g=${slug}`

const composeWhatsappMessage = (config, guest) => {
  const template = config?.share?.whatsappTemplate?.trim()
  const defaultText = `Kepada ${guest.name},\n\nBerikut link undangan pernikahan kami:\n${inviteLink(guest.slug)}`
  const text = template
    ? template
        .replace(/\{\{name\}\}/g, guest.name || '')
        .replace(/\{\{link\}\}/g, inviteLink(guest.slug))
    : defaultText
  return text
}

const CATEGORY_COLOR = {
  'Keluarga':    'blue',
  'Teman':       'green',
  'Rekan Kerja': 'purple',
  'Lainnya':     'grey',
}

const RSVP_CONFIG = {
  'EXCITED TO ATTEND': { label: 'Hadir',          cls: 'green'  },
  'Mungkin Datang':    { label: 'Mungkin',         cls: 'amber'  },
  'Tidak Hadir':       { label: 'Tidak Hadir',     cls: 'red'    },
}

function RsvpBadge({ status }) {
  if (!status) return <span className="gl-rsvp-badge gl-rsvp-badge--none">Belum RSVP</span>
  const cfg = RSVP_CONFIG[status] || { label: status, cls: 'grey' }
  return <span className={`gl-rsvp-badge gl-rsvp-badge--${cfg.cls}`}>{cfg.label}</span>
}

function CopyLinkBtn({ slug }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(inviteLink(slug)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      type="button"
      className={`gl-icon-btn${copied ? ' gl-icon-btn--success' : ''}`}
      onClick={handleCopy}
      title={copied ? 'Tersalin!' : 'Salin link undangan'}
    >
      <i className={`fas ${copied ? 'fa-check' : 'fa-link'}`} />
    </button>
  )
}

function SortTh({ col, label, sortKey, sortDir, onSort, className }) {
  const active = sortKey === col
  return (
    <th
      className={`gl-th gl-th--sort${active ? ' gl-th--sorted' : ''} ${className || ''}`}
      onClick={() => onSort(col)}
    >
      <span className="gl-th-inner">
        {label}
        <span className="gl-sort-icon">
          {active
            ? <i className={`fas fa-caret-${sortDir === 'asc' ? 'up' : 'down'}`} />
            : <i className="fas fa-sort" />}
        </span>
      </span>
    </th>
  )
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const range = (s, e) => Array.from({ length: e - s + 1 }, (_, i) => s + i)
  let pages
  if (totalPages <= 7)          pages = range(1, totalPages)
  else if (page <= 4)           pages = [...range(1, 5), '…', totalPages]
  else if (page >= totalPages - 3) pages = [1, '…', ...range(totalPages - 4, totalPages)]
  else                          pages = [1, '…', page - 1, page, page + 1, '…', totalPages]

  return (
    <div className="gl-pagination">
      <button type="button" className="gl-page-btn gl-page-btn--nav"
        disabled={page === 1} onClick={() => onChange(page - 1)}>
        <i className="fas fa-chevron-left" />
      </button>
      {pages.map((p, idx) =>
        p === '…'
          ? <span key={`e${idx}`} className="gl-page-ellipsis">…</span>
          : <button key={p} type="button"
              className={`gl-page-btn${p === page ? ' gl-page-btn--active' : ''}`}
              onClick={() => onChange(p)}>{p}</button>
      )}
      <button type="button" className="gl-page-btn gl-page-btn--nav"
        disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  )
}

const EMPTY = { name: '', phone: '', category: '', notes: '' }
const CATEGORIES = ['Keluarga', 'Teman', 'Rekan Kerja', 'Lainnya']

function GuestForm({ initial = EMPTY, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="gl-form">
      <div className="gl-form-grid">
        <label className="gl-form-field">
          <span className="gl-form-label">Nama <span className="gl-required">*</span></span>
          <input type="text" className="gl-input" value={form.name}
            onChange={e => set('name', e.target.value)} placeholder="Nama tamu" autoFocus />
        </label>
        <label className="gl-form-field">
          <span className="gl-form-label">No. WhatsApp</span>
          <input type="text" className="gl-input" value={form.phone}
            onChange={e => set('phone', e.target.value)} placeholder="08xxxxxxxxxx" />
        </label>
        <label className="gl-form-field">
          <span className="gl-form-label">Kategori</span>
          <select className="gl-input gl-select" value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="">— Pilih —</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="gl-form-field gl-form-field--full">
          <span className="gl-form-label">Catatan</span>
          <input type="text" className="gl-input" value={form.notes}
            onChange={e => set('notes', e.target.value)} placeholder="Catatan tambahan (opsional)" />
        </label>
      </div>
      <div className="gl-form-actions">
        <button type="button" className="gl-btn gl-btn--ghost" onClick={onCancel} disabled={saving}>Batal</button>
        <button type="button" className="gl-btn gl-btn--primary" onClick={() => onSave(form)}
          disabled={saving || !form.name.trim()}>
          {saving ? <><i className="fas fa-circle-notch fa-spin" /> Menyimpan…</> : <><i className="fas fa-check" /> Simpan</>}
        </button>
      </div>
    </div>
  )
}

export default function GuestList({ config }) {
  const [guests, setGuests]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [adding, setAdding]       = useState(false)
  const [editId, setEditId]       = useState(null)
  const [saving, setSaving]       = useState(false)
  const [selected, setSelected]   = useState(new Set())
  const [deleting, setDeleting]   = useState(false)
  const [sortKey, setSortKey]     = useState('id')
  const [sortDir, setSortDir]     = useState('asc')
  const [page, setPage]           = useState(1)
  const [perPage, setPerPage]     = useState(10)

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  // Reset to page 1 when filter or search changes
  useEffect(() => { setPage(1) }, [search, filterCat])

  const sorted = [...guests].sort((a, b) => {
    let av = a[sortKey] ?? '', bv = b[sortKey] ?? ''
    if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av
    av = String(av).toLowerCase(); bv = String(bv).toLowerCase()
    return sortDir === 'asc' ? av.localeCompare(bv, 'id') : bv.localeCompare(av, 'id')
  })

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams()
      if (search)    params.set('search', search)
      if (filterCat) params.set('category', filterCat)
      const res = await authFetch(`/api/guests?${params}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setGuests(await res.json())
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [search, filterCat])

  useEffect(() => { load() }, [load])

  async function handleAdd(form) {
    setSaving(true)
    try {
      const res = await authFetch('/api/guests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error((await res.json()).error)
      const guest = await res.json()
      setGuests(g => [...g, guest])
      setAdding(false)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function handleEdit(form) {
    setSaving(true)
    try {
      const res = await authFetch(`/api/guests/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error((await res.json()).error)
      const updated = await res.json()
      setGuests(g => g.map(x => x.id === editId ? updated : x))
      setEditId(null)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus tamu ini?')) return
    await authFetch(`/api/guests/${id}`, { method: 'DELETE' })
    setGuests(g => g.filter(x => x.id !== id))
    setSelected(s => { const n = new Set(s); n.delete(id); return n })
  }

  async function handleBulkDelete() {
    if (!selected.size || !confirm(`Hapus ${selected.size} tamu?`)) return
    setDeleting(true)
    try {
      await authFetch('/api/guests', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: [...selected] }) })
      setGuests(g => g.filter(x => !selected.has(x.id)))
      setSelected(new Set())
    } finally { setDeleting(false) }
  }

  function exportCsv() {
    const header = 'No,Nama,WhatsApp,Kategori,Catatan,RSVP,Link Undangan'
    const rows = sorted.map((g, i) =>
      [i + 1, g.name, g.phone, g.category, g.notes, RSVP_CONFIG[g.rsvp_status]?.label || (g.rsvp_status || 'Belum RSVP'), g.slug ? inviteLink(g.slug) : '']
        .map(v => `"${String(v || '').replace(/"/g, '""')}"`)
        .join(',')
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'daftar-tamu.csv'
    a.click()
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage))
  const safePage   = Math.min(page, totalPages)
  const paginated  = sorted.slice((safePage - 1) * perPage, safePage * perPage)

  const allChecked = paginated.length > 0 && paginated.every(g => selected.has(g.id))
  const toggleAll  = () => setSelected(s => {
    const n = new Set(s)
    allChecked ? paginated.forEach(g => n.delete(g.id)) : paginated.forEach(g => n.add(g.id))
    return n
  })
  const toggleOne  = id => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  const totalGuests = guests.reduce((sum, g) => sum + (Number(g.rsvp_pax) || 0), 0)
  const categories = [...new Set(guests.map(g => g.category).filter(Boolean))]
  const sortProps  = { sortKey, sortDir, onSort: toggleSort }

  return (
    <div className="gl-wrap">

      {/* ── Page header ── */}
      <div className="gl-header">
        <div className="gl-header-left">
          <div className="gl-header-icon"><i className="fas fa-users" /></div>
          <div>
            <h1 className="gl-header-title">Daftar Tamu</h1>
            <p className="gl-header-sub">
              <span className="gl-header-count">{guests.length}</span> tamu terdaftar
              <span className="gl-header-total"> · total {totalGuests} tamu</span>
              {selected.size > 0 && <span className="gl-header-selected"> · {selected.size} dipilih</span>}
            </p>
          </div>
        </div>
        <div className="gl-header-actions">
          {selected.size > 0 && (
            <button type="button" className="gl-btn gl-btn--danger" onClick={handleBulkDelete} disabled={deleting}>
              <i className="fas fa-trash-alt" /> Hapus {selected.size}
            </button>
          )}
          <button type="button" className="gl-btn gl-btn--ghost" onClick={exportCsv}>
            <i className="fas fa-download" /> Export CSV
          </button>
          <button type="button" className="gl-btn gl-btn--primary" onClick={() => { setAdding(true); setEditId(null) }}>
            <i className="fas fa-plus" /> Tambah Tamu
          </button>
        </div>
      </div>

      {/* ── Add form ── */}
      {adding && (
        <div className="gl-card gl-card--form">
          <div className="gl-card-header">
            <i className="fas fa-user-plus" />
            <span>Tambah Tamu Baru</span>
          </div>
          <GuestForm onSave={handleAdd} onCancel={() => setAdding(false)} saving={saving} />
        </div>
      )}

      {error && <div className="gl-error"><i className="fas fa-exclamation-circle" /> {error}</div>}

      {/* ── Table card ── */}
      <div className="gl-card gl-card--table">

        {/* Toolbar */}
        <div className="gl-toolbar">
          <div className="gl-search-wrap">
            <i className="fas fa-search gl-search-icon" />
            <input
              type="text" className="gl-input gl-search"
              placeholder="Cari nama, nomor, catatan…"
              value={search} onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" className="gl-search-clear" onClick={() => setSearch('')}>
                <i className="fas fa-times" />
              </button>
            )}
          </div>
          <select className="gl-input gl-select gl-filter-cat" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">Semua Kategori</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="gl-input gl-select gl-per-page" value={perPage}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }}>
            <option value={10}>10 / hal</option>
            <option value={25}>25 / hal</option>
            <option value={50}>50 / hal</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="gl-empty"><i className="fas fa-circle-notch fa-spin" /><span>Memuat data…</span></div>
        ) : sorted.length === 0 ? (
          <div className="gl-empty">
            <i className="fas fa-inbox" />
            <span>{search || filterCat ? 'Tidak ada tamu yang cocok dengan filter.' : 'Belum ada tamu. Klik "+ Tambah Tamu" untuk mulai.'}</span>
          </div>
        ) : (
          <table className="gl-table">
            <thead>
              <tr>
                <th className="gl-th gl-th--num" onClick={toggleAll} title={allChecked ? 'Batal pilih semua' : 'Pilih semua'}>
                  <span className="gl-num-cell">
                    <span className="gl-num-label">#</span>
                    <input type="checkbox" className="gl-checkbox gl-num-check" checked={allChecked} onChange={toggleAll} onClick={e => e.stopPropagation()} />
                  </span>
                </th>
                <SortTh col="name"     label="Nama"     {...sortProps} />
                <SortTh col="phone"    label="WhatsApp" {...sortProps} className="gl-th--hide-sm" />
                <SortTh col="category" label="Kategori" {...sortProps} className="gl-th--hide-sm" />
                <SortTh col="notes"       label="Catatan"  {...sortProps} className="gl-th--hide-sm" />
                <SortTh col="rsvp_status" label="RSVP"      {...sortProps} className="gl-th--hide-sm" />
                <SortTh col="rsvp_pax"    label="Jml. Tamu" {...sortProps} className="gl-th--hide-sm gl-th--pax" />
                <th className="gl-th gl-th--hide-sm gl-th--link">Link</th>
                <th className="gl-th gl-th--action" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((g, i) => {
                const rowNum = (safePage - 1) * perPage + i + 1
                return (
                editId === g.id ? (
                  <tr key={g.id} className="gl-tr gl-tr--editing">
                    <td colSpan={9} className="gl-td gl-td--form">
                      <GuestForm initial={g} onSave={handleEdit} onCancel={() => setEditId(null)} saving={saving} />
                    </td>
                  </tr>
                ) : (
                  <tr key={g.id} className={`gl-tr${selected.has(g.id) ? ' gl-tr--selected' : ''}`}>
                    <td className="gl-td gl-td--num" onClick={() => toggleOne(g.id)}>
                      <span className="gl-num-cell">
                        <span className="gl-num-label">{rowNum}</span>
                        <input type="checkbox" className="gl-checkbox gl-num-check" checked={selected.has(g.id)} onChange={() => toggleOne(g.id)} onClick={e => e.stopPropagation()} />
                      </span>
                    </td>
                    <td className="gl-td gl-td--name">{g.name}</td>
                    <td className="gl-td gl-td--hide-sm">
                      {g.phone
                        ? <a href={`https://wa.me/${g.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="gl-phone">{g.phone}</a>
                        : <span className="gl-empty-cell">—</span>}
                    </td>
                    <td className="gl-td gl-td--hide-sm">
                      {g.category
                        ? <span className={`gl-badge gl-badge--${CATEGORY_COLOR[g.category] || 'grey'}`}>{g.category}</span>
                        : <span className="gl-empty-cell">—</span>}
                    </td>
                    <td className="gl-td gl-td--hide-sm gl-td--notes">
                      <span className="gl-notes-text">{g.notes || <span className="gl-empty-cell">—</span>}</span>
                    </td>
                    <td className="gl-td gl-td--hide-sm">
                      <RsvpBadge status={g.rsvp_status} />
                    </td>
                    <td className="gl-td gl-td--hide-sm gl-td--pax">
                      {g.rsvp_pax
                        ? <span className="gl-pax-val"><i className="fas fa-user-friends" /> {g.rsvp_pax}</span>
                        : <span className="gl-empty-cell">—</span>}
                    </td>
                    <td className="gl-td gl-td--hide-sm gl-td--link">
                      {g.slug ? (
                        <div className="gl-invite-btns">
                          <CopyLinkBtn slug={g.slug} />
                          <a
                            href={g.phone ? `https://wa.me/${g.phone.replace(/\D/g,'')}?text=${encodeURIComponent(composeWhatsappMessage(config, g))}` : '#'}
                            target="_blank" rel="noreferrer"
                            className={`gl-icon-btn gl-icon-btn--wa${!g.phone ? ' gl-icon-btn--disabled' : ''}`}
                            title={g.phone ? 'Kirim via WhatsApp' : 'Nomor WA belum diisi'}
                            onClick={e => { if (!g.phone) e.preventDefault() }}
                          >
                            <i className="fab fa-whatsapp" />
                          </a>
                        </div>
                      ) : <span className="gl-empty-cell">—</span>}
                    </td>
                    <td className="gl-td gl-td--action">
                      <div className="gl-row-actions">
                        <button type="button" className="gl-icon-btn" onClick={() => { setEditId(g.id); setAdding(false) }} title="Edit">
                          <i className="fas fa-pencil-alt" />
                        </button>
                        <button type="button" className="gl-icon-btn gl-icon-btn--danger" onClick={() => handleDelete(g.id)} title="Hapus">
                          <i className="fas fa-trash-alt" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            })}
            </tbody>
          </table>
        )}

        {/* Footer */}
        {!loading && sorted.length > 0 && (
          <div className="gl-table-footer">
            <span>
              {(safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, sorted.length)} dari {sorted.length} tamu
              {sorted.length !== guests.length && <> (filter aktif)</>}
              {selected.size > 0 && <> · <strong>{selected.size} dipilih</strong></>}
            </span>
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}
