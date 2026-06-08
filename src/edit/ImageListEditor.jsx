import { useRef, useState } from 'react'
import { getToken } from './authClient'

async function uploadFile(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', {
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

function MediaRow({ src, index, accept, isDragging, isDropTarget, onUpdate, onRemove, onDragStart, onDragEnd, onDragOver, onDrop }) {
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
      // keep existing value on error
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div
      className={`edit-image-row${isDragging ? ' is-dragging' : ''}${isDropTarget ? ' drop-target' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <span className="edit-array-handle"><i className="fas fa-grip-vertical" /></span>

      <div className="edit-imgrow-thumb-wrap" onClick={() => inputRef.current?.click()}>
        {src ? (
          isVideo ? (
            <div className="edit-imgrow-thumb edit-imgrow-thumb--video">
              <i className="fas fa-film" />
              <span className="edit-imgrow-video-label">Video</span>
            </div>
          ) : (
            <img src={src} alt="" className="edit-imgrow-thumb" />
          )
        ) : (
          <div className="edit-imgrow-thumb-empty">
            <i className="fas fa-plus" />
            <span>Upload</span>
          </div>
        )}
        {uploading && (
          <div className="edit-imgrow-thumb-spinner">
            <i className="fas fa-circle-notch fa-spin" />
          </div>
        )}
        {src && <div className="edit-imgrow-thumb-overlay"><i className={`fas ${isVideo ? 'fa-video' : 'fa-camera'}`} /></div>}
      </div>

      <input ref={inputRef} type="file" accept={accept || 'image/*'} style={{ display: 'none' }} onChange={handleFile} />

      <button type="button" className="edit-icon-btn edit-icon-btn--danger" onClick={onRemove} title="Remove">
        <i className="fas fa-trash-alt" />
      </button>
    </div>
  )
}

export default function ImageListEditor({ label, items, onChange, accept }) {
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const dragIndex = useRef(null)

  function update(index, value) { onChange(items.map((v, i) => (i === index ? value : v))) }
  function add() { onChange([...items, '']) }
  function remove(index) { onChange(items.filter((_, i) => i !== index)) }
  function reorder(from, to) {
    const next = [...items]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
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
  const addLabel = isMedia ? 'Add Photo / Video' : 'Add Photo'

  return (
    <div className="edit-array-wrap">
      <div className="edit-array-header">
        <div className="edit-array-header-left">
          <span className="edit-array-title">{label}</span>
          <span className="edit-array-count">{items.length}</span>
        </div>
        <button type="button" className="edit-array-add-btn" onClick={add}>
          <i className="fas fa-plus" /> {addLabel}
        </button>
      </div>

      <div className="edit-array-list">
        {items.map((src, i) => (
          <MediaRow
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
        {items.length === 0 && (
          <div className="edit-array-empty">
            No media yet — click <strong>+ {addLabel}</strong>.
          </div>
        )}
      </div>
    </div>
  )
}
