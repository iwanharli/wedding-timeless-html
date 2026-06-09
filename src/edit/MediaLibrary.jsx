import { useState, useEffect, useRef, useCallback } from 'react'
import { authFetch } from './authClient'
import './MediaLibrary.css'

function Lightbox({ file, allPreviewable, onClose, onPrev, onNext }) {
  const videoRef = useRef(null)
  const idx = allPreviewable.findIndex(f => f.url === file.url)
  const hasPrev = idx > 0
  const hasNext = idx < allPreviewable.length - 1

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft'  && hasPrev) onPrev()
      if (e.key === 'ArrowRight' && hasNext) onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hasPrev, hasNext])

  // Pause video when switching
  useEffect(() => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.load() }
  }, [file.url])

  return (
    <div className="ml-lb-backdrop" onClick={onClose}>
      <div className="ml-lb-box" onClick={e => e.stopPropagation()}>

        {/* Top bar */}
        <div className="ml-lb-topbar">
          <div className="ml-lb-topbar-info">
            <i className={`fas ${file.type === 'video' ? 'fa-film' : 'fa-image'}`} />
            <span className="ml-lb-filename">{file.filename}</span>
            <span className={`ml-folder-badge ml-folder-badge--${file.folder}`}>{file.folder}</span>
          </div>
          <div className="ml-lb-topbar-actions">
            <a href={file.url} download={file.filename} className="ml-lb-action-btn" title="Download" onClick={e => e.stopPropagation()}>
              <i className="fas fa-download" />
            </a>
            <button type="button" className="ml-lb-close" onClick={onClose} title="Tutup (Esc)">
              <i className="fas fa-times" />
            </button>
          </div>
        </div>

        {/* Media */}
        <div className="ml-lb-media">
          {file.type === 'image' ? (
            <img src={file.url} alt={file.filename} className="ml-lb-img" draggable={false} />
          ) : (
            <video ref={videoRef} src={file.url} className="ml-lb-video" controls autoPlay />
          )}
        </div>

        {/* Nav arrows */}
        {hasPrev && (
          <button type="button" className="ml-lb-nav ml-lb-nav--prev" onClick={onPrev} title="Sebelumnya (←)">
            <i className="fas fa-chevron-left" />
          </button>
        )}
        {hasNext && (
          <button type="button" className="ml-lb-nav ml-lb-nav--next" onClick={onNext} title="Berikutnya (→)">
            <i className="fas fa-chevron-right" />
          </button>
        )}

        {/* Counter */}
        <div className="ml-lb-counter">{idx + 1} / {allPreviewable.length}</div>
      </div>
    </div>
  )
}

const TYPE_ICON = {
  image: 'fa-image',
  video: 'fa-film',
  audio: 'fa-music',
  other: 'fa-file',
}

const SIZE_LABELS = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}


function MediaCard({ file, onDelete, onPreview }) {
  const isUploads = file.folder === 'uploads'
  const canPreview = file.type === 'image' || file.type === 'video'
  const [delConfirm, setDelConfirm] = useState(false)

  return (
    <div className="ml-card">
      <div
        className={`ml-card-thumb${canPreview ? ' ml-card-thumb--clickable' : ''}`}
        onClick={canPreview ? onPreview : undefined}
      >
        {file.type === 'image' ? (
          <img src={file.url} alt={file.filename} loading="lazy" />
        ) : file.type === 'video' ? (
          <div className="ml-card-thumb-icon ml-card-thumb-icon--video">
            <i className="fas fa-play-circle" />
          </div>
        ) : file.type === 'audio' ? (
          <div className="ml-card-thumb-icon"><i className="fas fa-music" /></div>
        ) : (
          <div className="ml-card-thumb-icon"><i className="fas fa-file" /></div>
        )}
        {canPreview && (
          <div className="ml-card-preview-hint"><i className="fas fa-expand-alt" /></div>
        )}
        <div className="ml-card-overlay">
          {isUploads && (
            delConfirm ? (
              <div className="ml-del-confirm" onClick={e => e.stopPropagation()}>
                <span>Hapus?</span>
                <button type="button" className="ml-del-yes" onClick={() => onDelete(file.filename)}>Ya</button>
                <button type="button" className="ml-del-no" onClick={() => setDelConfirm(false)}>Tidak</button>
              </div>
            ) : (
              <button type="button" className="ml-del-btn" onClick={e => { e.stopPropagation(); setDelConfirm(true) }} title="Hapus file">
                <i className="fas fa-trash-alt" />
              </button>
            )
          )}
        </div>
      </div>
      <div className="ml-card-info">
        <span className="ml-card-name" title={file.filename}>{file.filename}</span>
        <div className="ml-card-meta">
          <span className={`ml-folder-badge ml-folder-badge--${file.folder}`}>{file.folder}</span>
          <span className="ml-card-size">{SIZE_LABELS(file.size)}</span>
        </div>
      </div>
    </div>
  )
}

export default function MediaLibrary() {
  const [files, setFiles]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [search, setSearch]       = useState('')
  const [filterFolder, setFilterFolder] = useState('')
  const [filterType, setFilterType]     = useState('')
  const [uploading, setUploading]       = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [lightbox, setLightbox]         = useState(null) // file object or null
  const fileInputRef = useRef(null)
  const dropRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams()
      if (filterFolder) params.set('folder', filterFolder)
      if (filterType)   params.set('type', filterType)
      const res = await authFetch(`/api/media?${params}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setFiles(await res.json())
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [filterFolder, filterType])

  useEffect(() => { load() }, [load])

  async function uploadFile(file) {
    setUploading(true)
    setUploadProgress(file.name)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await authFetch('/api/upload', { method: 'POST', body: form })
      if (!res.ok) throw new Error((await res.json()).error)
      await load()
    } catch (e) { setError(e.message) }
    finally { setUploading(false); setUploadProgress(null) }
  }

  async function handleFileInput(e) {
    const files = [...e.target.files]
    for (const f of files) await uploadFile(f)
    e.target.value = ''
  }

  async function handleDelete(filename) {
    const res = await authFetch('/api/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename }),
    })
    if (res.ok) setFiles(f => f.filter(x => x.filename !== filename))
    else setError('Gagal menghapus file')
  }

  function onDragOver(e) { e.preventDefault(); setDragging(true) }
  function onDragLeave() { setDragging(false) }
  async function onDrop(e) {
    e.preventDefault(); setDragging(false)
    const dropped = [...e.dataTransfer.files]
    for (const f of dropped) await uploadFile(f)
  }

  const filtered = files.filter(f => {
    if (!search) return true
    return f.filename.toLowerCase().includes(search.toLowerCase())
  })

  // Group filtered files by date (YYYY-MM-DD based on mtime)
  const dateLabel = (ms) => {
    const d = new Date(ms)
    const today = new Date()
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
    const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    if (sameDay(d, today)) return 'Hari Ini'
    if (sameDay(d, yesterday)) return 'Kemarin'
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const grouped = filtered.reduce((acc, f) => {
    const label = dateLabel(f.mtime)
    if (!acc[label]) acc[label] = { files: [], maxMtime: 0 }
    acc[label].files.push(f)
    if (f.mtime > acc[label].maxMtime) acc[label].maxMtime = f.mtime
    return acc
  }, {})
  const groupKeys = Object.keys(grouped).sort((a, b) => grouped[b].maxMtime - grouped[a].maxMtime)
  const allPreviewable = filtered.filter(f => f.type === 'image' || f.type === 'video')

  const totalImages = files.filter(f => f.type === 'image').length
  const totalVideos = files.filter(f => f.type === 'video').length
  const totalAudio  = files.filter(f => f.type === 'audio').length
  const totalUploads = files.filter(f => f.folder === 'uploads').length

  return (
    <div className="ml-wrap">
      {lightbox && (
        <Lightbox
          file={lightbox}
          allPreviewable={allPreviewable}
          onClose={() => setLightbox(null)}
          onPrev={() => {
            const i = allPreviewable.findIndex(f => f.url === lightbox.url)
            if (i > 0) setLightbox(allPreviewable[i - 1])
          }}
          onNext={() => {
            const i = allPreviewable.findIndex(f => f.url === lightbox.url)
            if (i < allPreviewable.length - 1) setLightbox(allPreviewable[i + 1])
          }}
        />
      )}

      {/* ── Header ── */}
      <div className="ml-header">
        <div className="ml-header-left">
          <div className="ml-header-icon"><i className="fas fa-photo-video" /></div>
          <div>
            <h1 className="ml-header-title">Media Library</h1>
            <p className="ml-header-sub">Repositori semua file media di folder assets.</p>
          </div>
        </div>
        <button
          type="button"
          className="gl-btn gl-btn--primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading
            ? <><i className="fas fa-circle-notch fa-spin" /> Mengupload…</>
            : <><i className="fas fa-upload" /> Upload File</>
          }
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,audio/*" style={{ display: 'none' }} onChange={handleFileInput} />
      </div>

      {/* ── Stats ── */}
      <div className="ml-stats">
        <div className="ml-stat"><i className="fas fa-images" /><span>{totalImages} Gambar</span></div>
        <div className="ml-stat"><i className="fas fa-film" /><span>{totalVideos} Video</span></div>
        <div className="ml-stat"><i className="fas fa-music" /><span>{totalAudio} Audio</span></div>
        <div className="ml-stat ml-stat--uploads"><i className="fas fa-cloud-upload-alt" /><span>{totalUploads} Upload</span></div>
      </div>

      {/* ── Drop Zone ── */}
      <div
        ref={dropRef}
        className={`ml-dropzone${dragging ? ' ml-dropzone--active' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <i className="fas fa-cloud-upload-alt" />
        <span>{uploading ? `Mengupload ${uploadProgress}…` : 'Drag & drop file ke sini, atau klik untuk pilih'}</span>
        <span className="ml-dropzone-sub">JPG, PNG, GIF, MP4, MP3, dll — maks. 80 MB</span>
      </div>

      {error && <div className="gl-error"><i className="fas fa-exclamation-circle" /> {error}</div>}

      {/* ── Toolbar ── */}
      <div className="ml-toolbar">
        <div className="gl-search-wrap">
          <i className="fas fa-search gl-search-icon" />
          <input
            type="text" className="gl-input gl-search"
            placeholder="Cari nama file…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="gl-search-clear" onClick={() => setSearch('')}>
              <i className="fas fa-times" />
            </button>
          )}
        </div>
        <select className="gl-input gl-select" value={filterFolder} onChange={e => setFilterFolder(e.target.value)}>
          <option value="">Semua Folder</option>
          <option value="images">images/</option>
          <option value="media">media/</option>
          <option value="uploads">uploads/</option>
        </select>
        <select className="gl-input gl-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">Semua Tipe</option>
          <option value="image">Gambar</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
        <span className="ml-count">{filtered.length} file</span>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="gl-empty"><i className="fas fa-circle-notch fa-spin" /><span>Memuat…</span></div>
      ) : filtered.length === 0 ? (
        <div className="gl-empty"><i className="fas fa-inbox" /><span>Tidak ada file yang cocok.</span></div>
      ) : (
        groupKeys.map(label => (
          <div key={label} className="ml-date-group">
            <div className="ml-date-divider">
              <span className="ml-date-divider-line" />
              <span className="ml-date-divider-label">
                <i className="fas fa-calendar-alt" />
                {label}
                <span className="ml-date-divider-count">{grouped[label].files.length}</span>
              </span>
              <span className="ml-date-divider-line" />
            </div>
            <div className="ml-grid">
              {grouped[label].files.map(f => (
                <MediaCard
                  key={`${f.folder}/${f.filename}`}
                  file={f}
                  onDelete={handleDelete}
                  onPreview={() => setLightbox(f)}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
