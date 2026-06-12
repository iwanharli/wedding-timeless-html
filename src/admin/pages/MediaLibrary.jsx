import { useState, useEffect, useRef, useCallback } from 'react'
import { authFetch } from '../auth/authClient'
import { uploadFileWithProgress } from '../lib/uploadFile'
import UserMenu from '../shell/UserMenu'
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

      {/* Top bar */}
      <div className="ml-lb-topbar">
        <div className="ml-lb-topbar-info">
          <i className={`fas ${file.type === 'video' ? 'fa-film' : 'fa-image'}`} />
          <span className="ml-lb-filename">{file.filename}</span>
          <span className={`ml-folder-badge ml-folder-badge--${file.folder}`}>{file.folder}</span>
        </div>
        <div className="ml-lb-topbar-actions">
          <a href={file.url} download={file.filename} className="ml-lb-btn" onClick={e => e.stopPropagation()}>
            <i className="fas fa-download" /> Download
          </a>
          <button type="button" className="ml-lb-btn ml-lb-btn--close" onClick={onClose}>
            <i className="fas fa-times" /> Tutup
          </button>
        </div>
      </div>

      {/* Media */}
      <div className="ml-lb-media" onClick={e => e.stopPropagation()}>
        {file.type === 'image' ? (
          <img src={file.url} alt={file.filename} className="ml-lb-img" draggable={false} />
        ) : (
          <video ref={videoRef} src={file.url} className="ml-lb-video" controls autoPlay />
        )}
      </div>

      {/* Nav arrows */}
      {hasPrev && (
        <button type="button" className="ml-lb-nav ml-lb-nav--prev" onClick={e => { e.stopPropagation(); onPrev() }}>
          <i className="fas fa-chevron-left" /> Sebelumnya
        </button>
      )}
      {hasNext && (
        <button type="button" className="ml-lb-nav ml-lb-nav--next" onClick={e => { e.stopPropagation(); onNext() }}>
          Berikutnya <i className="fas fa-chevron-right" />
        </button>
      )}

      {/* Counter */}
      <div className="ml-lb-counter">{idx + 1} / {allPreviewable.length}</div>
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


function DeleteModal({ file, onConfirm, onCancel, deleting }) {
  const hasUsage = file.usedIn && file.usedIn.length > 0

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="ml-modal-backdrop" onClick={onCancel}>
      <div className="ml-modal" onClick={e => e.stopPropagation()}>
        <div className="ml-modal-header">
          <div className="ml-modal-title-wrap">
            <div className="ml-modal-icon ml-modal-icon--danger">
              <i className="fas fa-trash-alt" />
            </div>
            <div>
              <h3 className="ml-modal-title">Hapus File</h3>
              <p className="ml-modal-sub">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
          </div>
          <button type="button" className="ml-modal-close" onClick={onCancel}>
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="ml-modal-body">
          <div className="ml-modal-file-row">
            {file.type === 'image'
              ? <img src={file.url} alt={file.filename} className="ml-modal-thumb" />
              : <div className="ml-modal-thumb ml-modal-thumb--icon">
                  <i className={`fas ${file.type === 'video' ? 'fa-film' : file.type === 'audio' ? 'fa-music' : 'fa-file'}`} />
                </div>
            }
            <div className="ml-modal-file-info">
              <span className="ml-modal-file-name">{file.filename}</span>
              <div className="ml-modal-file-meta">
                <span className={`ml-folder-badge ml-folder-badge--${file.folder}`}>{file.folder}</span>
                <span className="ml-card-size">{SIZE_LABELS(file.size)}</span>
              </div>
            </div>
          </div>

          {hasUsage && (
            <div className="ml-modal-warning">
              <i className="fas fa-exclamation-triangle" />
              <div>
                <strong>File ini sedang digunakan di:</strong>
                <div className="ml-modal-usage-list">
                  {file.usedIn.map(label => (
                    <span key={label} className="ml-usage-badge">{label}</span>
                  ))}
                </div>
                <p className="ml-modal-warning-note">
                  Menghapus file ini akan menyebabkan gambar kosong di section tersebut.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="ml-modal-footer">
          <button type="button" className="gl-btn gl-btn--ghost" onClick={onCancel} disabled={deleting}>
            Batal
          </button>
          <button type="button" className="gl-btn gl-btn--danger" onClick={onConfirm} disabled={deleting}>
            {deleting
              ? <><i className="fas fa-circle-notch fa-spin" /> Menghapus…</>
              : <><i className="fas fa-trash-alt" /> {hasUsage ? 'Tetap Hapus' : 'Hapus'}</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

function MediaCard({ file, onRequestDelete, onPreview }) {
  const canPreview = file.type === 'image' || file.type === 'video'

  return (
    <div className="ml-card">
      <div
        className={`ml-card-thumb${canPreview ? ' ml-card-thumb--clickable' : ''}`}
        onClick={canPreview ? onPreview : undefined}
      >
        {file.type === 'image' ? (
          <img src={file.url} alt={file.filename} loading="lazy" />
        ) : file.type === 'video' ? (
          <>
            <video src={`${file.url}#t=0.1`} preload="metadata" muted playsInline className="ml-card-video-thumb" />
            <div className="ml-card-play-badge"><i className="fas fa-play" /></div>
          </>
        ) : file.type === 'audio' ? (
          <div className="ml-card-thumb-icon ml-card-thumb-icon--audio">
            <i className="fas fa-wave-square" />
          </div>
        ) : (
          <div className="ml-card-thumb-icon"><i className="fas fa-file" /></div>
        )}
        {canPreview && (
          <div className="ml-card-preview-hint"><i className="fas fa-expand-alt" /></div>
        )}
        {file.origin === 'cropped' && (
          <div className="ml-card-origin-badge" title="Hasil crop"><i className="fas fa-crop-alt" /> Crop</div>
        )}
        <div className="ml-card-overlay" />
      </div>
      <div className="ml-card-info">
        <span className="ml-card-name" title={file.filename}>{file.filename}</span>
        <div className="ml-card-meta">
          <span className="ml-card-size">{SIZE_LABELS(file.size)}</span>
          <button type="button" className="ml-card-del" onClick={() => onRequestDelete(file)} title="Hapus file">
            <i className="fas fa-trash-alt" />
          </button>
        </div>
        {file.usedIn && file.usedIn.length > 0 && (
          <div className="ml-usage-badges">
            {file.usedIn.map(label => (
              <span key={label} className="ml-usage-badge ml-usage-badge--info">{label}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getMediaType(file) {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  if (file.type.startsWith('audio/')) return 'audio'
  return 'other'
}

function StagingArea({ pending, onRemove, onCancel, onSave, progress, compress, onToggleCompress }) {
  return (
    <div className="ml-staging">
      <div className="ml-staging-header">
        <div className="ml-staging-title">
          <i className="fas fa-layer-group" />
          <span>{pending.length} file siap diupload</span>
        </div>
        <div className="ml-staging-actions">
          <label className="ml-staging-compress">
            <input
              type="checkbox"
              checked={compress}
              onChange={e => onToggleCompress(e.target.checked)}
              disabled={!!progress}
            />
            Kompres file
          </label>
          <button type="button" className="ml-staging-cancel" onClick={onCancel} disabled={!!progress}>
            Batal
          </button>
          <button type="button" className="ml-staging-save" onClick={onSave} disabled={!!progress}>
            {progress
              ? <>
                  <i className="fas fa-circle-notch fa-spin" /> {progress.current}/{progress.total} — {progress.name}
                  {' '}({progress.phase === 'uploading' ? `${progress.percent}%` : 'Compressing…'})
                </>
              : <><i className="fas fa-upload" /> Simpan</>
            }
          </button>
        </div>
      </div>
      <div className="ml-staging-grid">
        {pending.map(item => (
          <div key={item.id} className="ml-staging-item">
            <div className="ml-staging-thumb">
              {item.mediaType === 'image'
                ? <img src={item.previewUrl} alt={item.file.name} />
                : <div className="ml-staging-thumb-icon">
                    <i className={`fas ${item.mediaType === 'video' ? 'fa-film' : item.mediaType === 'audio' ? 'fa-music' : 'fa-file'}`} />
                  </div>
              }
              <button
                type="button"
                className="ml-staging-remove"
                onClick={() => onRemove(item.id)}
                disabled={!!progress}
                title="Hapus dari antrian"
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="ml-staging-name" title={item.file.name}>{item.file.name}</div>
            <div className="ml-staging-size">{SIZE_LABELS(item.file.size)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MediaLibrary({ onMenuOpen }) {
  const [files, setFiles]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [search, setSearch]       = useState('')
  const [filterType, setFilterType]     = useState('')
  const [filterOrigin, setFilterOrigin] = useState('')
  const [sortBy, setSortBy]             = useState('newest')
  const [pending, setPending]           = useState([])   // staged files
  const [compressUpload, setCompressUpload] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(null) // { current, total, name }
  const [lightbox, setLightbox]         = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)
  const fileInputRef = useRef(null)
  const dropRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams()
      params.set('folder', 'uploads')
      if (filterType) params.set('type', filterType)
      if (filterOrigin) params.set('origin', filterOrigin)
      const res = await authFetch(`/api/media?${params}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setFiles(await res.json())
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [filterType, filterOrigin])

  useEffect(() => { load() }, [load])

  function stageFiles(fileList) {
    const items = [...fileList].map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      mediaType: getMediaType(file),
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }))
    setPending(prev => [...prev, ...items])
  }

  function removePending(id) {
    setPending(prev => {
      const item = prev.find(x => x.id === id)
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl)
      return prev.filter(x => x.id !== id)
    })
  }

  function cancelPending() {
    pending.forEach(item => { if (item.previewUrl) URL.revokeObjectURL(item.previewUrl) })
    setPending([])
  }

  async function uploadAll() {
    const total = pending.length
    for (let i = 0; i < total; i++) {
      const item = pending[i]
      setUploadProgress({ current: i + 1, total, name: item.file.name, phase: 'uploading', percent: 0 })
      try {
        await uploadFileWithProgress(item.file, p => {
          setUploadProgress({ current: i + 1, total, name: item.file.name, phase: p.phase, percent: p.percent })
        }, compressUpload)
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      } catch (e) {
        setError(`Gagal upload ${item.file.name}: ${e.message}`)
      }
    }
    setPending([])
    setUploadProgress(null)
    await load()
  }

  function handleFileInput(e) {
    stageFiles(e.target.files)
    e.target.value = ''
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await authFetch('/api/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: deleteTarget.filename }),
    })
    setDeleting(false)
    if (res.ok) {
      setFiles(f => f.filter(x => x.filename !== deleteTarget.filename))
      setDeleteTarget(null)
    } else {
      setError('Gagal menghapus file')
      setDeleteTarget(null)
    }
  }

  function onDragOver(e) { e.preventDefault(); setDragging(true) }
  function onDragLeave() { setDragging(false) }
  function onDrop(e) {
    e.preventDefault(); setDragging(false)
    stageFiles(e.dataTransfer.files)
  }

  const filtered = files.filter(f => {
    if (!search) return true
    return f.filename.toLowerCase().includes(search.toLowerCase())
  })

  const sorted = [...filtered]
  switch (sortBy) {
    case 'oldest':    sorted.sort((a, b) => a.mtime - b.mtime); break
    case 'name-asc':  sorted.sort((a, b) => a.filename.localeCompare(b.filename)); break
    case 'name-desc': sorted.sort((a, b) => b.filename.localeCompare(a.filename)); break
    case 'size-desc': sorted.sort((a, b) => b.size - a.size); break
    case 'size-asc':  sorted.sort((a, b) => a.size - b.size); break
    default:          sorted.sort((a, b) => b.mtime - a.mtime) // newest
  }

  // Date grouping only makes sense when sorting by time
  const useDateGroups = sortBy === 'newest' || sortBy === 'oldest'

  // Group by date (YYYY-MM-DD based on mtime)
  const dateLabel = (ms) => {
    const d = new Date(ms)
    const today = new Date()
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
    const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    if (sameDay(d, today)) return 'Hari Ini'
    if (sameDay(d, yesterday)) return 'Kemarin'
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const grouped = sorted.reduce((acc, f) => {
    const label = dateLabel(f.mtime)
    if (!acc[label]) acc[label] = { files: [], maxMtime: f.mtime }
    acc[label].files.push(f)
    if (sortBy === 'oldest') {
      if (f.mtime < acc[label].maxMtime) acc[label].maxMtime = f.mtime
    } else if (f.mtime > acc[label].maxMtime) {
      acc[label].maxMtime = f.mtime
    }
    return acc
  }, {})
  const groupKeys = useDateGroups
    ? Object.keys(grouped).sort((a, b) => sortBy === 'oldest' ? grouped[a].maxMtime - grouped[b].maxMtime : grouped[b].maxMtime - grouped[a].maxMtime)
    : []
  // Urutan navigasi lightbox harus sama persis dengan urutan visual grid
  const orderedFiltered = useDateGroups ? groupKeys.flatMap(label => grouped[label].files) : sorted
  const allPreviewable = orderedFiltered.filter(f => f.type === 'image' || f.type === 'video')

  const totalImages = files.filter(f => f.type === 'image').length
  const totalVideos = files.filter(f => f.type === 'video').length
  const totalAudio  = files.filter(f => f.type === 'audio').length
  const totalUploads = files.filter(f => f.folder === 'uploads').length

  return (
    <div className="ml-wrap">
      {deleteTarget && (
        <DeleteModal
          file={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

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
      <div className="gl-header">
        <button type="button" className="edit-hamburger" onClick={onMenuOpen} title="Toggle menu">
          <i className="fas fa-bars" />
        </button>
        <div className="gl-header-left">
          <div className="gl-header-icon"><i className="fas fa-photo-video" /></div>
          <div>
            <h1 className="gl-header-title">Media Library</h1>
            <p className="gl-header-sub">Repositori semua file media di folder assets.</p>
          </div>
        </div>
        <div className="gl-header-actions">
          <UserMenu />
        </div>
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
        <span>Drag &amp; drop file ke sini, atau klik untuk pilih</span>
        <span className="ml-dropzone-sub">JPG, PNG, GIF, MP4, MP3, dll — pilih banyak sekaligus</span>
      </div>

      {/* ── Staging Area ── */}
      {pending.length > 0 && (
        <StagingArea
          pending={pending}
          onRemove={removePending}
          onCancel={cancelPending}
          onSave={uploadAll}
          progress={uploadProgress}
          compress={compressUpload}
          onToggleCompress={setCompressUpload}
        />
      )}

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
        <select className="gl-input gl-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">Semua Tipe</option>
          <option value="image">Gambar</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
        <select className="gl-input gl-select" value={filterOrigin} onChange={e => setFilterOrigin(e.target.value)}>
          <option value="">Semua Asal</option>
          <option value="original">Original</option>
          <option value="cropped">Hasil Crop</option>
        </select>
        <select className="gl-input gl-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="name-asc">Nama A-Z</option>
          <option value="name-desc">Nama Z-A</option>
          <option value="size-desc">Ukuran Terbesar</option>
          <option value="size-asc">Ukuran Terkecil</option>
        </select>
        <span className="ml-count"><i className="fas fa-images" /> {filtered.length} file</span>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="gl-empty"><i className="fas fa-circle-notch fa-spin" /><span>Memuat…</span></div>
      ) : filtered.length === 0 ? (
        <div className="gl-empty"><i className="fas fa-inbox" /><span>Tidak ada file yang cocok.</span></div>
      ) : useDateGroups ? (
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
                  onRequestDelete={setDeleteTarget}
                  onPreview={() => setLightbox(f)}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="ml-grid">
          {sorted.map(f => (
            <MediaCard
              key={`${f.folder}/${f.filename}`}
              file={f}
              onRequestDelete={setDeleteTarget}
              onPreview={() => setLightbox(f)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
