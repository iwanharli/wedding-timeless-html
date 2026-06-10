import { useRef, useState } from 'react'
import { getToken } from '../auth/authClient'
import { apiUrl } from '../../lib/api'
import { MediaPickerModal } from './FieldInput'

async function uploadFile(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(apiUrl('/api/upload'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: fd,
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Upload failed (${res.status})`)
  return body.url
}

function isVideoSrc(src) {
  return /\.(mp4|mov|webm|ogg)(\?|$)/i.test(src || '')
}

function MediaCard({ src, index, accept, isDragging, isDropTarget, onUpdate, onRemove, onDragStart, onDragEnd, onDragOver, onDrop }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const isVideo = isVideoSrc(src)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file)
      onUpdate(url)
    } catch {
      // keep existing on error
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div
      className={`edit-media-card${isDragging ? ' is-dragging' : ''}${isDropTarget ? ' drop-target' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="edit-media-card-thumb" onClick={() => inputRef.current?.click()}>
        {src ? (
          isVideo ? (
            <div className="edit-media-card-video">
              <i className="fas fa-film" />
              <span>Video</span>
            </div>
          ) : (
            <img src={src} alt="" />
          )
        ) : (
          <div className="edit-media-card-empty">
            <i className="fas fa-image" />
          </div>
        )}
        {uploading && (
          <div className="edit-media-card-spinner">
            <i className="fas fa-circle-notch fa-spin" />
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept={accept || 'image/*'} style={{ display: 'none' }} onChange={handleFile} />

      <div className="edit-media-card-overlay">
        <span className="edit-media-card-handle"><i className="fas fa-grip-dots-vertical" /></span>
        <button
          type="button"
          className="edit-media-card-remove"
          onClick={e => { e.stopPropagation(); onRemove() }}
          title="Remove"
        >
          <i className="fas fa-trash-alt" />
        </button>
      </div>

      <span className="edit-media-card-index">{index + 1}</span>
    </div>
  )
}

export default function ImageListEditor({ label, items, onChange, accept }) {
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const [showPicker, setShowPicker] = useState(false)
  const dragIndex = useRef(null)
  const addInputRef = useRef(null)

  const pickerType = (accept || '').includes('video') ? '' : 'image'

  function update(index, value) { onChange(items.map((v, i) => (i === index ? value : v))) }
  function remove(index) { onChange(items.filter((_, i) => i !== index)) }
  function reorder(from, to) {
    const next = [...items]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  async function handleAddFile(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const urls = await Promise.all(
      files.map(async file => {
        try { return await uploadFile(file) } catch { return null }
      })
    )
    onChange([...items, ...urls.filter(Boolean)])
    e.target.value = ''
  }

  function handleDragStart(e, i) {
    dragIndex.current = i
    setDraggingIndex(i)
    e.dataTransfer.effectAllowed = 'move'
  }
  function handleDragEnd() {
    setDraggingIndex(null)
    setDropTarget(null)
    dragIndex.current = null
  }
  function handleDragOver(e, i) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dropTarget !== i) setDropTarget(i)
  }
  function handleDrop(e, i) {
    e.preventDefault()
    const from = dragIndex.current
    if (from !== null && from !== i) reorder(from, i)
    setDraggingIndex(null)
    setDropTarget(null)
    dragIndex.current = null
  }

  const isMedia = (accept || '').includes('video')

  return (
    <div className="edit-imagelist-wrap">
      {showPicker && (
        <MediaPickerModal
          type={pickerType}
          onSelect={url => { onChange([...items, url]); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}

      <div className="edit-array-header">
        <div className="edit-array-header-left">
          <span className="edit-array-title">{label}</span>
          <span className="edit-array-count">{items.length}</span>
        </div>
        <div className="edit-array-header-right">
          <button
            type="button"
            className="edit-array-add-btn edit-array-add-btn--secondary"
            onClick={() => setShowPicker(true)}
            title="Pilih dari Media Library"
          >
            <i className="fas fa-th" /> Library
          </button>
          <button
            type="button"
            className="edit-array-add-btn"
            onClick={() => addInputRef.current?.click()}
          >
            <i className="fas fa-upload" /> Upload
          </button>
        </div>
      </div>

      <div className="edit-media-grid">
        {items.map((src, i) => (
          <MediaCard
            key={i}
            src={src}
            index={i}
            accept={accept}
            isDragging={draggingIndex === i}
            isDropTarget={dropTarget === i && draggingIndex !== i}
            onUpdate={v => update(i, v)}
            onRemove={() => remove(i)}
            onDragStart={e => handleDragStart(e, i)}
            onDragEnd={handleDragEnd}
            onDragOver={e => handleDragOver(e, i)}
            onDrop={e => handleDrop(e, i)}
          />
        ))}

        <input
          ref={addInputRef}
          type="file"
          accept={accept || 'image/*'}
          multiple
          style={{ display: 'none' }}
          onChange={handleAddFile}
        />
      </div>

      {items.length === 0 && (
        <p className="edit-media-grid-empty">
          Belum ada media — klik <strong>Upload</strong> atau <strong>Library</strong> untuk menambah.
        </p>
      )}
    </div>
  )
}
