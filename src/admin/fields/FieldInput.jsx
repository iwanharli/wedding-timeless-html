import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { authFetch } from '../auth/authClient'
import { uploadFileWithProgress } from '../lib/uploadFile'

const SIZE_FMT = b => b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(1)} MB`

const TYPE_ICON = {
  image: 'fa-image',
  video: 'fa-film',
  audio: 'fa-music',
  other: 'fa-file',
}

function MediaPickerLightbox({ file, allFiles, onClose, onPick, onPrev, onNext }) {
  const idx = allFiles.findIndex(f => `${f.folder}/${f.filename}` === `${file.folder}/${file.filename}`)
  const hasPrev = idx > 0
  const hasNext = idx < allFiles.length - 1

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft'  && hasPrev) onPrev()
      if (e.key === 'ArrowRight' && hasNext) onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hasPrev, hasNext])

  return (
    <div className="mpm-lb-backdrop" onClick={onClose}>
      <div className="mpm-lb-topbar">
        <div className="mpm-lb-topbar-info">
          <i className={`fas ${TYPE_ICON[file.type] || 'fa-file'}`} />
          <span className="mpm-lb-filename">{file.filename}</span>
          <span className={`mpm-folder-badge mpm-folder-badge--${file.folder}`}>{file.folder}</span>
        </div>
        <button type="button" className="mpm-lb-close" onClick={onClose} title="Tutup (Esc)">
          <i className="fas fa-times" />
        </button>
      </div>

      <div className="mpm-lb-media" onClick={e => e.stopPropagation()}>
        {file.type === 'image' ? (
          <img src={file.url} alt={file.filename} className="mpm-lb-img" draggable={false} />
        ) : file.type === 'video' ? (
          <video src={file.url} className="mpm-lb-video" controls autoPlay />
        ) : file.type === 'audio' ? (
          <div className="mpm-lb-audio">
            <div className="mpm-card-icon mpm-card-icon--audio mpm-lb-audio-icon">
              <i className="fas fa-wave-square" />
            </div>
            <audio src={file.url} controls autoPlay className="mpm-lb-audio-player" />
          </div>
        ) : (
          <div className="mpm-lb-audio">
            <div className="mpm-card-icon mpm-lb-audio-icon"><i className="fas fa-file" /></div>
          </div>
        )}
      </div>

      {hasPrev && (
        <button type="button" className="mpm-lb-nav mpm-lb-nav--prev" onClick={e => { e.stopPropagation(); onPrev() }}>
          <i className="fas fa-chevron-left" />
        </button>
      )}
      {hasNext && (
        <button type="button" className="mpm-lb-nav mpm-lb-nav--next" onClick={e => { e.stopPropagation(); onNext() }}>
          <i className="fas fa-chevron-right" />
        </button>
      )}

      <div className="mpm-lb-footer" onClick={e => e.stopPropagation()}>
        <span className="mpm-lb-counter">{idx + 1} / {allFiles.length}</span>
        <button type="button" className="mpm-lb-pick" onClick={() => onPick(file.url)}>
          <i className="fas fa-check-circle" /> Pilih file ini
        </button>
      </div>
    </div>
  )
}

export function MediaPickerModal({ type, onSelect, onClose }) {
  const [files, setFiles]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [folder, setFolder]     = useState('uploads')
  const [activeType, setActiveType] = useState(type || '')
  const [sortBy, setSortBy]     = useState('newest')
  const [preview, setPreview]   = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const p = new URLSearchParams()
      if (folder) p.set('folder', folder)
      if (activeType) p.set('type', activeType)
      const res = await authFetch(`/api/media?${p}`)
      if (res.ok) setFiles(await res.json())
      setLoading(false)
    }
    load()
  }, [folder, activeType])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape' && !preview) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preview])

  const filtered = search
    ? files.filter(f => f.filename.toLowerCase().includes(search.toLowerCase()))
    : files

  const sorted = [...filtered]
  switch (sortBy) {
    case 'oldest':    sorted.sort((a, b) => a.mtime - b.mtime); break
    case 'name-asc':  sorted.sort((a, b) => a.filename.localeCompare(b.filename)); break
    case 'name-desc': sorted.sort((a, b) => b.filename.localeCompare(a.filename)); break
    case 'size-desc': sorted.sort((a, b) => b.size - a.size); break
    case 'size-asc':  sorted.sort((a, b) => a.size - b.size); break
    default:          sorted.sort((a, b) => b.mtime - a.mtime) // newest
  }

  const TYPE_TABS = [
    { value: '',       label: 'Semua' },
    { value: 'image',  label: 'Gambar' },
    { value: 'video',  label: 'Video' },
    { value: 'audio',  label: 'Audio' },
  ]

  return createPortal(
    <div className="edit-shell mpm-portal-root">
    <div className="mpm-backdrop" onClick={onClose}>
      <div className="mpm-box" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="mpm-header">
          <div className="mpm-header-top">
            <div className="mpm-header-left">
              <div className="mpm-header-icon"><i className="fas fa-photo-video" /></div>
              <span className="mpm-header-title">Pilih dari Media Library</span>
            </div>
            <button type="button" className="mpm-close" onClick={onClose} title="Tutup (Esc)">
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="mpm-header-controls">
            <div className="mpm-type-tabs">
              {TYPE_TABS.map(t => (
                <button
                  key={t.value}
                  type="button"
                  className={`mpm-type-tab${activeType === t.value ? ' mpm-type-tab--active' : ''}`}
                  onClick={() => setActiveType(t.value)}
                >{t.label}</button>
              ))}
            </div>
            <div className="mpm-header-sep" />
            <select className="mpm-select" value={folder} onChange={e => setFolder(e.target.value)}>
              <option value="">Semua Folder</option>
              <option value="images">images/</option>
              <option value="media">media/</option>
              <option value="uploads">uploads/</option>
            </select>
            <select className="mpm-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="name-asc">Nama A-Z</option>
              <option value="name-desc">Nama Z-A</option>
              <option value="size-desc">Ukuran Terbesar</option>
              <option value="size-asc">Ukuran Terkecil</option>
            </select>
            <div className="mpm-search">
              <i className="fas fa-search" />
              <input
                type="text"
                placeholder="Cari nama file…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
              {search && <button type="button" onClick={() => setSearch('')}><i className="fas fa-times" /></button>}
            </div>
          </div>
        </div>

        {/* Count bar */}
        <div className="mpm-subbar">
          <span className="mpm-count">{sorted.length} file</span>
          <span className="mpm-hint">Klik file untuk memilih</span>
        </div>

        {/* Grid */}
        <div className="mpm-body">
          {loading ? (
            <div className="mpm-empty"><i className="fas fa-circle-notch fa-spin" /><span>Memuat…</span></div>
          ) : sorted.length === 0 ? (
            <div className="mpm-empty"><i className="fas fa-inbox" /><span>Tidak ada file.</span></div>
          ) : (
            <div className="mpm-grid">
              {sorted.map(f => (
                <div
                  key={`${f.folder}/${f.filename}`}
                  role="button"
                  tabIndex={0}
                  className="mpm-card"
                  onClick={() => onSelect(f.url)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(f.url) } }}
                  title={f.filename}
                >
                  <div className="mpm-card-thumb">
                    {f.type === 'image'
                      ? <img src={f.url} alt={f.filename} loading="lazy" />
                      : f.type === 'video'
                      ? <>
                          <video src={`${f.url}#t=0.1`} muted preload="metadata" playsInline />
                          <div className="mpm-card-play-badge"><i className="fas fa-play" /></div>
                        </>
                      : <div className="mpm-card-icon mpm-card-icon--audio">
                          <i className="fas fa-wave-square" />
                        </div>
                    }
                    <button
                      type="button"
                      className="mpm-card-zoom"
                      title="Lihat fullscreen"
                      onClick={e => { e.stopPropagation(); setPreview(f) }}
                    >
                      <i className="fas fa-expand-alt" />
                    </button>
                    <div className="mpm-card-hover">
                      <span className="mpm-card-pill">
                        <i className="fas fa-check-circle" />
                        Pilih
                      </span>
                    </div>
                  </div>
                  <div className="mpm-card-info">
                    <span className="mpm-card-name">{f.filename}</span>
                    <div className="mpm-card-meta">
                      <span className={`mpm-folder-badge mpm-folder-badge--${f.folder}`}>{f.folder}</span>
                      <span className="mpm-card-size">{SIZE_FMT(f.size)}</span>
                    </div>
                    {f.usedIn && f.usedIn.length > 0 && (
                      <div className="mpm-usage-row">
                        {f.usedIn.map(l => <span key={l} className="mpm-usage-badge">{l}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    {preview && (
      <MediaPickerLightbox
        file={preview}
        allFiles={sorted}
        onClose={() => setPreview(null)}
        onPick={url => { onSelect(url) }}
        onPrev={() => {
          const idx = sorted.findIndex(f => `${f.folder}/${f.filename}` === `${preview.folder}/${preview.filename}`)
          if (idx > 0) setPreview(sorted[idx - 1])
        }}
        onNext={() => {
          const idx = sorted.findIndex(f => `${f.folder}/${f.filename}` === `${preview.folder}/${preview.filename}`)
          if (idx < sorted.length - 1) setPreview(sorted[idx + 1])
        }}
      />
    )}
    </div>,
    document.body
  )
}

export function MediaUpload({ value, onChange, accept, type }) {
  const inputRef = useRef(null)
  const [progress, setProgress]     = useState(null) // { phase: 'uploading'|'processing', percent }
  const [error, setError]           = useState(null)
  const [dragOver, setDragOver]     = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const uploading = !!progress

  async function processFile(file) {
    if (!file) return
    setProgress({ phase: 'uploading', percent: 0 })
    setError(null)
    try {
      const url = await uploadFileWithProgress(file, setProgress)
      onChange(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setProgress(null)
    }
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    await processFile(file)
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }
  function handleDragOver(e) {
    e.preventDefault()
    setDragOver(true)
  }
  function handleDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false)
  }

  const hasValue = !!value
  const isAudio = type === 'audio'
  const isVideo = type === 'video'

  const progressLabel = progress
    ? progress.phase === 'uploading'
      ? `Uploading… ${progress.percent}%`
      : 'Compressing…'
    : null
  const progressLabelShort = progress
    ? progress.phase === 'uploading'
      ? ` ${progress.percent}%`
      : ' Compressing…'
    : null

  const dropIcon = isAudio ? 'fa-music' : isVideo ? 'fa-file-video' : 'fa-image'
  const dropLabel = isAudio ? 'audio / music' : isVideo ? 'video' : 'image'

  return (
    <div className="edit-upload-field">
      {showPicker && (
        <MediaPickerModal
          type={type}
          onSelect={url => { onChange(url); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Audio preview */}
      {hasValue && isAudio && (
        <div className="edit-upload-audio">
          <div className="edit-upload-audio-top">
            <span className="edit-upload-audio-icon"><i className="fas fa-music" /></span>
            <span className="edit-upload-audio-name">{value.split('/').pop().replace(/-/g, ' ').replace(/\.[^.]+$/, '')}</span>
            <div className="edit-upload-audio-actions">
              <button
                type="button"
                className="edit-upload-change-btn edit-upload-change-btn--flat"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                title="Change file"
              >
                <i className="fas fa-folder-open" />
                {uploading ? progressLabelShort : ' Change'}
              </button>
              <button
                type="button"
                className="edit-upload-change-btn edit-upload-change-btn--flat"
                onClick={() => setShowPicker(true)}
                title="Pilih dari library"
              >
                <i className="fas fa-th" /> Library
              </button>
              <button
                type="button"
                className="edit-upload-remove-btn edit-upload-remove-btn--flat"
                onClick={() => onChange('')}
                title="Remove"
              >
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
          <audio src={value} controls className="edit-upload-audio-player" />
        </div>
      )}

      {/* Video preview — buttons below, not overlaid */}
      {hasValue && isVideo && (
        <div className="edit-upload-video-wrap">
          <video src={value} className="edit-upload-thumb" controls />
          <div className="edit-upload-video-actions">
            <button
              type="button"
              className="edit-upload-change-btn edit-upload-change-btn--flat"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              <i className="fas fa-exchange-alt" />
              {uploading ? progressLabelShort : ' Change'}
            </button>
            <button
              type="button"
              className="edit-upload-change-btn edit-upload-change-btn--flat"
              onClick={() => setShowPicker(true)}
            >
              <i className="fas fa-th" /> Library
            </button>
            <button
              type="button"
              className="edit-upload-remove-btn edit-upload-remove-btn--flat"
              onClick={() => onChange('')}
              title="Remove"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        </div>
      )}

      {/* Image preview — hover overlay */}
      {hasValue && !isAudio && !isVideo && (
        <div className="edit-upload-preview">
          <img src={value} alt="" className="edit-upload-thumb" />
          <div className="edit-upload-overlay">
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="edit-upload-view-btn"
              title="View fullscreen"
            >
              <i className="fas fa-expand-alt" />
            </a>
            <button
              type="button"
              className="edit-upload-change-btn"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              <i className="fas fa-camera" />
              {uploading ? progressLabelShort : ' Change'}
            </button>
            <button
              type="button"
              className="edit-upload-change-btn"
              onClick={() => setShowPicker(true)}
            >
              <i className="fas fa-th" /> Library
            </button>
            <button
              type="button"
              className="edit-upload-remove-btn"
              onClick={() => onChange('')}
              title="Remove"
            >
              <i className="fas fa-trash-alt" />
            </button>
          </div>
        </div>
      )}

      {/* Drop zone + library picker (shown when no value) */}
      {!hasValue && (
        <div className="edit-upload-empty">
          <button
            type="button"
            className={`edit-upload-dropzone${uploading ? ' uploading' : ''}${dragOver ? ' drag-over' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            disabled={uploading}
          >
            {uploading
              ? (
                <div className="edit-upload-progress-inline">
                  <i className="fas fa-circle-notch fa-spin" />
                  <span>{progressLabel}</span>
                  {progress.phase === 'uploading' && (
                    <div className="edit-upload-progress-bar">
                      <div className="edit-upload-progress-bar-fill" style={{ width: `${progress.percent}%` }} />
                    </div>
                  )}
                </div>
              )
              : <><i className={`fas ${dropIcon}`} /><span>Upload {dropLabel}</span></>}
          </button>
          <button
            type="button"
            className="edit-upload-pick-btn"
            onClick={() => setShowPicker(true)}
            disabled={uploading}
          >
            <i className="fas fa-th" />
            <span>Pilih dari Library</span>
          </button>
        </div>
      )}

      {/* Upload progress (when replacing existing) */}
      {hasValue && uploading && (
        <div className="edit-upload-progress">
          <i className="fas fa-circle-notch fa-spin" /> {progressLabel}
          {progress.phase === 'uploading' && (
            <div className="edit-upload-progress-bar">
              <div className="edit-upload-progress-bar-fill" style={{ width: `${progress.percent}%` }} />
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && <p className="edit-upload-error"><i className="fas fa-exclamation-circle" /> {error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  )
}

const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_EN   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function toDatetimeLocal(v) {
  if (!v) return ''
  const d = new Date(v)
  if (isNaN(d)) return typeof v === 'string' ? v.slice(0, 16) : ''
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Try to infer ISO date (YYYY-MM-DD) from a display text like "Saturday, 02 March 2024"
function inferIsoDate(str) {
  if (!str) return ''
  const cleaned = str.replace(/[()]/g, '').trim()
  const d = new Date(cleaned)
  if (!isNaN(d.getTime())) {
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }
  return ''
}

function formatDateDisplay(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const dayName = DAYS_EN[date.getDay()]
  const pad = n => String(n).padStart(2, '0')
  return `${dayName}, ${pad(d)} ${MONTHS_EN[m - 1]} ${y}`
}

// Parse "HH:MM - HH:MM" or "At HH:MM - HH:MM" into { from, to }
function parseTimeRange(str) {
  if (!str) return { from: '', to: '' }
  const matches = str.match(/(\d{1,2}[:.]\d{2})/g) || []
  const normalize = t => {
    const [h, m] = t.replace('.', ':').split(':')
    return `${String(h).padStart(2, '0')}:${m.padStart(2, '0')}`
  }
  return { from: matches[0] ? normalize(matches[0]) : '', to: matches[1] ? normalize(matches[1]) : '' }
}

function buildTimeRange(from, to) {
  if (!from && !to) return ''
  if (!to) return from
  return `${from} - ${to}`
}

export default function FieldInput({ field, value, onChange }) {
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          className="edit-textarea"
          rows={field.rows ?? 4}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
        />
      )

    case 'date-text': {
      const iso = inferIsoDate(value)
      return (
        <div className="edit-date-text-field">
          <div className="edit-date-text-row">
            <span className="edit-date-text-icon"><i className="fas fa-calendar-alt" /></span>
            <input
              type="date"
              className="edit-date-picker"
              value={iso}
              onChange={e => {
                if (e.target.value) onChange(formatDateDisplay(e.target.value))
              }}
            />
            {iso && (
              <span className="edit-date-text-preview">
                {formatDateDisplay(iso)}
              </span>
            )}
          </div>
          <input
            type="text"
            className="edit-date-text-override"
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder="e.g. Saturday, 02 March 2024"
          />
          <span className="edit-date-text-hint">
            <i className="fas fa-info-circle" /> Pilih tanggal di atas untuk auto-isi, atau edit teks langsung di bawah
          </span>
        </div>
      )
    }

    case 'datetime':
      return (
        <div className="edit-datetime-field">
          <input
            type="datetime-local"
            className="edit-datetime"
            value={toDatetimeLocal(value)}
            onChange={e => onChange(e.target.value ? new Date(e.target.value).toISOString() : '')}
          />
          {value && (
            <span className="edit-datetime-preview">
              <i className="fas fa-clock" />{' '}
              {new Date(value).toLocaleString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
              })}
            </span>
          )}
        </div>
      )

    case 'time': {
      return (
        <input
          type="time"
          className="edit-time"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
        />
      )
    }

    case 'time-range': {
      const { from, to } = parseTimeRange(value)
      return (
        <div className="edit-time-range-field">
          <div className="edit-time-range-row">
            <div className="edit-time-range-group">
              <span className="edit-time-range-label">Mulai</span>
              <input
                type="time"
                className="edit-time"
                value={from}
                onChange={e => onChange(buildTimeRange(e.target.value, to))}
              />
            </div>
            <span className="edit-time-range-sep">—</span>
            <div className="edit-time-range-group">
              <span className="edit-time-range-label">Selesai</span>
              <input
                type="time"
                className="edit-time"
                value={to}
                onChange={e => onChange(buildTimeRange(from, e.target.value))}
              />
            </div>
          </div>
          <input
            type="text"
            className="edit-date-text-override"
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder || 'e.g. 09:00 - 10:00'}
          />
          <span className="edit-date-text-hint">
            <i className="fas fa-info-circle" /> Pilih jam di atas, atau edit teks di bawah untuk format kustom (e.g. "09:00 - 11:00 WIB")
          </span>
        </div>
      )
    }

    case 'number':
      return (
        <input
          type="number"
          className="edit-number"
          value={value ?? ''}
          min="1"
          onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
      )

    case 'url':
      return (
        <div className="edit-url-field">
          <input
            type="text"
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder="https://..."
          />
          {value && (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="edit-url-test-btn"
              title="Open in new tab"
            >
              <i className="fas fa-external-link-alt" /> Test
            </a>
          )}
        </div>
      )

    case 'image':
      return (
        <MediaUpload value={value} onChange={onChange} accept="image/*" type="image" />
      )

    case 'video':
      return (
        <MediaUpload value={value} onChange={onChange} accept="video/*" type="video" />
      )

    case 'audio':
      return (
        <MediaUpload value={value} onChange={onChange} accept="audio/*" type="audio" />
      )

    case 'media': {
      const raw = value && typeof value === 'object' ? value : { type: 'image', value: '' }
      const media = {
        type: raw.type || 'image',
        image: raw.image ?? (raw.type === 'image' ? raw.value : '') ?? '',
        video: raw.video ?? (raw.type === 'video' ? raw.value : '') ?? '',
      }
      return (
        <div className="edit-media-field">
          <div className="edit-radio-group">
            {[
              { value: 'image', icon: 'fa-image', label: 'Foto' },
              { value: 'video', icon: 'fa-film',  label: 'Video' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                className={`edit-radio-btn${media.type === opt.value ? ' active' : ''}`}
                onClick={() => onChange({ ...media, type: opt.value })}
              >
                <i className={`fas ${opt.icon}`} />
                {opt.label}
              </button>
            ))}
          </div>
          <MediaUpload
            value={media[media.type]}
            onChange={v => onChange({ ...media, [media.type]: v })}
            accept={media.type === 'video' ? 'video/*' : 'image/*'}
            type={media.type}
          />
        </div>
      )
    }

    case 'color':
      return (
        <div className="edit-color-field">
          <div className="edit-color-swatch">
            <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} />
          </div>
          <input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder="#cccccc" />
        </div>
      )

    case 'radio':
      return (
        <div className="edit-radio-group">
          {(field.options || []).map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`edit-radio-btn${(value ?? field.options[0]?.value) === opt.value ? ' active' : ''}`}
              onClick={() => onChange(opt.value)}
            >
              {opt.icon && <i className={`fas ${opt.icon}`} />}
              {opt.label}
            </button>
          ))}
        </div>
      )

    default:
      return (
        <input
          type="text"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder || ''}
        />
      )
  }
}
