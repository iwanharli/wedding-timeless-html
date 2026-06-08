import { useState, useRef } from 'react'

const SECTION_ICON = {
  intro:        'fa-align-left',
  profileIntro: 'fa-id-card',
  couple:       'fa-user-friends',
  loveStory:    'fa-heart',
  event:        'fa-calendar-alt',
  countdown:    'fa-hourglass-half',
  dressCode:    'fa-tshirt',
  rsvp:         'fa-envelope',
  gift:         'fa-gift',
  gallery:      'fa-images',
  thankYou:     'fa-star',
  livestream:   'fa-video',
}

export default function LayoutPanel({ sections, onChange }) {
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [dropTarget,    setDropTarget]    = useState(null)
  const [editingDiv,    setEditingDiv]    = useState(null) // index of divider being edited
  const [divLabel,      setDivLabel]      = useState('')
  const dragIndex = useRef(null)

  function toggleVisible(index) {
    onChange(sections.map((s, i) => (i === index ? { ...s, visible: !s.visible } : s)))
  }
  function reorder(from, to) {
    const next = [...sections]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }
  function move(index, dir) {
    const target = index + dir
    if (target < 0 || target >= sections.length) return
    reorder(index, target)
  }
  function addDivider(atIndex) {
    const next = [...sections]
    next.splice(atIndex, 0, { type: 'divider', id: `div-${Date.now()}`, label: 'Divider' })
    onChange(next)
    // start editing immediately
    setEditingDiv(atIndex)
    setDivLabel('Divider')
  }
  function removeDivider(index) {
    onChange(sections.filter((_, i) => i !== index))
  }
  function commitDividerLabel(index) {
    onChange(sections.map((s, i) => i === index ? { ...s, label: divLabel || 'Divider' } : s))
    setEditingDiv(null)
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

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="edit-layout-hint">
        <i className="fas fa-info-circle" />&nbsp; Reorder or show/hide sections. Drag rows or use the arrow buttons. <strong>Hero / Cover</strong> always renders first. Dividers are editor-only labels and don't appear on the public site.
      </div>

      <div className="edit-layout-list">
        {sections.map((section, i) => {
          const isDragging = draggingIndex === i
          const isTarget   = dropTarget === i && draggingIndex !== i

          if (section.type === 'divider') {
            return (
              <div
                key={section.id || i}
                className={`edit-layout-divider${isDragging ? ' is-dragging' : ''}${isTarget ? ' drop-target' : ''}`}
                draggable
                onDragStart={e => handleDragStart(e, i)}
                onDragEnd={handleDragEnd}
                onDragOver={e => handleDragOver(e, i)}
                onDrop={e => handleDrop(e, i)}
              >
                <span className="edit-layout-handle"><i className="fas fa-grip-vertical" /></span>
                <span className="edit-layout-div-line" />
                {editingDiv === i ? (
                  <input
                    className="edit-layout-div-input"
                    value={divLabel}
                    autoFocus
                    onChange={e => setDivLabel(e.target.value)}
                    onBlur={() => commitDividerLabel(i)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitDividerLabel(i)
                      if (e.key === 'Escape') setEditingDiv(null)
                    }}
                  />
                ) : (
                  <span
                    className="edit-layout-div-label"
                    onClick={() => { setEditingDiv(i); setDivLabel(section.label || '') }}
                    title="Klik untuk ubah label"
                  >
                    {section.label || 'Divider'}
                    <i className="fas fa-pen edit-layout-div-edit-icon" />
                  </span>
                )}
                <span className="edit-layout-div-line" />
                <button
                  type="button"
                  className="edit-icon-btn edit-icon-btn--danger"
                  onClick={() => removeDivider(i)}
                  title="Hapus divider"
                ><i className="fas fa-times" /></button>
              </div>
            )
          }

          return (
            <div
              key={section.id}
              className={`edit-layout-row${!section.visible ? ' edit-layout-row--hidden' : ''}${isDragging ? ' is-dragging' : ''}${isTarget ? ' drop-target' : ''}`}
              draggable
              onDragStart={e => handleDragStart(e, i)}
              onDragEnd={handleDragEnd}
              onDragOver={e => handleDragOver(e, i)}
              onDrop={e => handleDrop(e, i)}
            >
              <span className="edit-layout-handle"><i className="fas fa-grip-vertical" /></span>
              <span className="edit-layout-index">{i + 1}</span>
              <span className="edit-layout-section-icon">
                <i className={`fas ${SECTION_ICON[section.id] || 'fa-circle'}`} />
              </span>
              <span className="edit-layout-label">{section.label}</span>
              <div className="edit-layout-actions">
                <label className="edit-toggle-wrap" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={section.visible}
                    onChange={() => toggleVisible(i)}
                  />
                  <span className="edit-toggle-track">
                    <span className="edit-toggle-thumb" />
                  </span>
                  <span className="edit-toggle-label">
                    {section.visible ? 'Visible' : 'Hidden'}
                  </span>
                </label>
                <button type="button" className="edit-icon-btn"
                  onClick={() => move(i, -1)} disabled={i === 0} title="Move up">
                  <i className="fas fa-arrow-up" />
                </button>
                <button type="button" className="edit-icon-btn"
                  onClick={() => move(i, 1)} disabled={i === sections.length - 1} title="Move down">
                  <i className="fas fa-arrow-down" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className="edit-layout-add-divider"
        onClick={() => addDivider(sections.length)}
      >
        <i className="fas fa-plus" /> Tambah Divider
      </button>
    </div>
  )
}
