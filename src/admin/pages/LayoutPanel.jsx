import { useState, useRef } from 'react'
import { MediaUpload } from '../fields/FieldInput'

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
  wishes:       'fa-comment-dots',
}

function OpacitySlider({ label, value, onChange }) {
  return (
    <div className="edit-layout-opacity-row">
      <div className="edit-layout-opacity-head">
        <span className="edit-layout-opacity-label">{label}</span>
        <span className="edit-layout-opacity-value">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="edit-layout-opacity-slider"
        style={{ '--fill': `${value}%` }}
      />
    </div>
  )
}

function ColorPickerField({ value, onChange, fallback, placeholder }) {
  return (
    <div className="edit-color-field">
      <div className="edit-color-swatch">
        <input
          type="color"
          value={value || fallback || '#000000'}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

function BackgroundPanel({ bg, onUpdate }) {
  return (
    <div className="edit-layout-bg-panel" onClick={e => e.stopPropagation()}>
      <div className="edit-layout-bg-section">
        <span className="edit-layout-bg-panel-label">Latar Belakang</span>
        <div className="edit-layout-bg-types">
          {[
            { value: 'video', icon: 'fa-film',    label: 'Video' },
            { value: 'image', icon: 'fa-image',   label: 'Foto' },
            { value: 'color', icon: 'fa-palette', label: 'Warna' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`edit-layout-bg-type-btn${bg.type === opt.value ? ' active' : ''}`}
              onClick={() => onUpdate({ type: opt.value, value: bg.type === opt.value ? bg.value : '' })}
            >
              <i className={`fas ${opt.icon}`} />
              {opt.label}
            </button>
          ))}
        </div>

        {bg.type === 'image' && (
          <MediaUpload
            value={bg.value}
            onChange={v => onUpdate({ value: v })}
            accept="image/*"
            type="image"
          />
        )}

        {bg.type === 'color' && (
          <ColorPickerField
            value={bg.value}
            onChange={v => onUpdate({ value: v })}
            fallback="#1a1a2e"
            placeholder="#1a1a2e"
          />
        )}
      </div>

      {bg.type === 'image' && (
        <div className="edit-layout-bg-section">
          <OpacitySlider label="Opacity Foto" value={bg.mediaOpacity ?? 100} onChange={v => onUpdate({ mediaOpacity: v })} />
          {(bg.mediaOpacity ?? 100) < 100 && (
            <ColorPickerField
              value={bg.bgColor}
              onChange={v => onUpdate({ bgColor: v })}
              fallback="#1a1a2e"
              placeholder="Warna di belakang foto, mis. #1a1a2e"
            />
          )}
        </div>
      )}

      <div className="edit-layout-bg-section">
        <OpacitySlider label="Overlay Warna" value={bg.opacity || 0} onChange={v => onUpdate({ opacity: v })} />
        {bg.opacity > 0 && bg.type !== 'color' && (
          <ColorPickerField
            value={bg.overlayColor}
            onChange={v => onUpdate({ overlayColor: v })}
            fallback="#000000"
            placeholder="#000000"
          />
        )}
      </div>
    </div>
  )
}

function BgBadge({ bg }) {
  return (
    <span className={`edit-layout-bg-badge edit-layout-bg-badge--${bg.type}`}>
      <i className={`fas ${bg.type === 'image' ? 'fa-image' : bg.type === 'color' ? 'fa-palette' : 'fa-film'}`} />
      {bg.type === 'video' ? 'Video' : bg.type === 'image' ? 'Foto' : 'Warna'}
    </span>
  )
}

export default function LayoutPanel({ sections, onChange, onPreviewScroll, onDrawerChange, heroBackground, onHeroBackgroundChange }) {
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [dropTarget,    setDropTarget]    = useState(null)
  const [editingDiv,    setEditingDiv]    = useState(null)
  const [divLabel,      setDivLabel]      = useState('')
  const [activeId,      setActiveId]      = useState(null)
  const [drawerId,      setDrawerId]      = useState(null)
  const dragIndex = useRef(null)

  function openDrawer(id) {
    setActiveId(id)
    setDrawerId(id)
    onDrawerChange?.(id)
  }
  function closeDrawer() {
    setDrawerId(null)
    onDrawerChange?.(null)
  }

  const heroCount    = heroBackground ? 1 : 0
  const visibleCount = sections.filter(s => s.type !== 'divider' && s.visible).length + heroCount
  const totalCount   = sections.filter(s => s.type !== 'divider').length + heroCount

  function toggleVisible(index) {
    onChange(sections.map((s, i) => i === index ? { ...s, visible: !s.visible } : s))
  }

  function updateBackground(index, bg) {
    onChange(sections.map((s, i) => i === index ? { ...s, background: { ...s.background, ...bg } } : s))
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

  let sectionCounter = 1

  return (
    <div className="edit-form-wrap">
      <div className="edit-form-card">

        {/* Header */}
        <div className="edit-form-card-header">
          <div className="edit-form-card-header-icon" style={{ background: '#f0f9ff', color: '#0369a1' }}>
            <i className="fas fa-th-large" />
          </div>
          <div className="edit-form-card-header-text">
            <div className="edit-form-card-title">
              Urutan, Visibilitas &amp; Latar Belakang Section
              <span className="edit-layout-stat">{visibleCount} / {totalCount} aktif</span>
            </div>
            <div className="edit-form-card-desc">
              Seret baris untuk mengubah urutan, atau gunakan tombol panah. Aktifkan/nonaktifkan tampilnya section dengan toggle, dan atur latar belakangnya lewat tombol <i className="fas fa-sliders-h" />. Section <strong>Hero / Cover</strong> selalu tampil pertama dan tidak dapat dinonaktifkan. Divider hanya terlihat di editor, tidak muncul di halaman publik.
            </div>
          </div>
        </div>

        {/* List */}
        <div className="edit-form-card-body edit-layout-body">
          <div className="edit-layout-list">
            {/* Hero / Cover — locked first item, no drag/reorder/visibility */}
            {heroBackground && (
              <div className="edit-layout-item">
                <div
                  className={`edit-layout-row${onPreviewScroll ? ' edit-layout-row--clickable' : ''}${activeId === 'hero' ? ' edit-layout-row--active' : ''}`}
                  onClick={() => {
                    onPreviewScroll?.('hero')
                    setActiveId(activeId === 'hero' ? null : 'hero')
                  }}
                >
                  <span className="edit-layout-handle"><i className="fas fa-lock" /></span>
                  <span className="edit-layout-index">1</span>
                  <span className="edit-layout-section-icon">
                    <i className="fas fa-door-open" />
                  </span>
                  <span className="edit-layout-label">Hero / Cover</span>
                  <div className="edit-layout-actions">
                    <BgBadge bg={heroBackground} />
                    <span className="edit-toggle-label">Selalu tampil</span>
                    <button type="button" className="edit-icon-btn"
                      onClick={e => { e.stopPropagation(); openDrawer('hero') }} title="Pengaturan latar belakang">
                      <i className="fas fa-sliders-h" />
                    </button>
                  </div>
                </div>
              </div>
            )}

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

              sectionCounter++
              const num = sectionCounter
              const isActive = activeId === section.id
              const bg = section.background || { type: 'video', value: '' }

              return (
                <div
                  key={section.id}
                  className={`edit-layout-item${isDragging ? ' is-dragging' : ''}${isTarget ? ' drop-target' : ''}`}
                  draggable
                  onDragStart={e => handleDragStart(e, i)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => handleDragOver(e, i)}
                  onDrop={e => handleDrop(e, i)}
                >
                  {/* Main row */}
                  <div
                    className={`edit-layout-row${!section.visible ? ' edit-layout-row--hidden' : ''}${onPreviewScroll ? ' edit-layout-row--clickable' : ''}${isActive ? ' edit-layout-row--active' : ''}`}
                    onClick={() => {
                      onPreviewScroll?.(section.id)
                      setActiveId(isActive ? null : section.id)
                    }}
                  >
                    <span className="edit-layout-handle"><i className="fas fa-grip-vertical" /></span>
                    <span className="edit-layout-index">{num}</span>
                    <span className="edit-layout-section-icon">
                      <i className={`fas ${SECTION_ICON[section.id] || 'fa-circle'}`} />
                    </span>
                    <span className="edit-layout-label">{section.label}</span>
                    <div className="edit-layout-actions">
                      <BgBadge bg={bg} />
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
                          {section.visible ? 'Tampil' : 'Disembunyikan'}
                        </span>
                      </label>
                      <button type="button" className="edit-icon-btn"
                        onClick={e => { e.stopPropagation(); move(i, -1) }} disabled={i === 0} title="Pindah ke atas">
                        <i className="fas fa-arrow-up" />
                      </button>
                      <button type="button" className="edit-icon-btn"
                        onClick={e => { e.stopPropagation(); move(i, 1) }} disabled={i === sections.length - 1} title="Pindah ke bawah">
                        <i className="fas fa-arrow-down" />
                      </button>
                      <button type="button" className="edit-icon-btn"
                        onClick={e => { e.stopPropagation(); openDrawer(section.id) }} title="Pengaturan latar belakang">
                        <i className="fas fa-sliders-h" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="edit-layout-footer">
            <button
              type="button"
              className="edit-layout-add-divider"
              onClick={() => addDivider(sections.length)}
            >
              <i className="fas fa-plus" /> Tambah Divider
            </button>
          </div>
        </div>

      </div>

      {drawerId && (() => {
        const isHero = drawerId === 'hero'
        const drawerSection = isHero ? null : sections.find(s => s.id === drawerId)
        const drawerBg = isHero ? heroBackground : (drawerSection?.background || { type: 'video', value: '' })
        const drawerLabel = isHero ? 'Hero / Cover' : (drawerSection?.label || '')
        const drawerUpdate = isHero
          ? onHeroBackgroundChange
          : patch => updateBackground(sections.findIndex(s => s.id === drawerId), patch)

        return (
          <>
            <div className="edit-layout-bg-drawer-backdrop" onClick={closeDrawer} />
            <div className="edit-layout-bg-drawer">
              <div className="edit-layout-bg-drawer-header">
                <span className="edit-layout-bg-drawer-title">
                  <i className={`fas ${isHero ? 'fa-door-open' : (SECTION_ICON[drawerId] || 'fa-circle')}`} />
                  {drawerLabel}
                </span>
                <button type="button" className="edit-icon-btn" onClick={closeDrawer} title="Tutup">
                  <i className="fas fa-times" />
                </button>
              </div>
              <div className="edit-layout-bg-drawer-body">
                <BackgroundPanel bg={drawerBg} onUpdate={drawerUpdate} />
              </div>
            </div>
          </>
        )
      })()}
    </div>
  )
}
