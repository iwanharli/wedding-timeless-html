import { useState, useRef } from 'react'
import FieldInput from './FieldInput'
import { getPath, setPath } from '../utils'

const FULL_WIDTH_ITEM_TYPES = new Set(['textarea', 'image', 'video', 'audio'])

function isItemFullWidth(field, colCount) {
  if (field.span != null) return field.span >= colCount
  return FULL_WIDTH_ITEM_TYPES.has(field.type)
}

function renderItemFields(fields, columns, layout, item, onFieldChange) {
  const colCount = columns === 3 ? 3 : columns === 2 ? 2 : 1
  const useGrid = colCount > 1

  const makeField = (field, inGrid) => (
    <label
      className={`edit-field${inGrid && isItemFullWidth(field, colCount) ? ' edit-field--full' : ''}`}
      key={field.path}
    >
      <span className="edit-field-label">{field.label}</span>
      <FieldInput
        field={field}
        value={getPath(item, field.path)}
        onChange={v => onFieldChange(field.path, v)}
      />
      {field.hint && <span className="edit-field-hint">{field.hint}</span>}
    </label>
  )

  if (layout === 'profile' && useGrid) {
    const photoField = fields.find(f => f.type === 'image')
    const detailFields = fields.filter(f => f !== photoField)
    return (
      <div className="edit-field-profile-layout">
        {photoField && (
          <div className="edit-field-profile-photo">
            <label className="edit-field">
              <span className="edit-field-label">{photoField.label}</span>
              <FieldInput
                field={photoField}
                value={getPath(item, photoField.path)}
                onChange={v => onFieldChange(photoField.path, v)}
              />
            </label>
          </div>
        )}
        <div className="edit-field-grid edit-field-profile-details">
          {detailFields.map(f => makeField(f, true))}
        </div>
      </div>
    )
  }

  if (useGrid) {
    const gridClass = `edit-field-grid${colCount === 3 ? ' edit-field-grid--3' : ''}`
    return <div className={gridClass}>{fields.map(f => makeField(f, true))}</div>
  }

  return fields.map(f => makeField(f, false))
}

export default function ArrayEditor({ schema, items, onChange }) {
  const [openSet, setOpenSet] = useState(() => new Set(items.length > 0 ? [0] : []))
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const dragIndex = useRef(null)

  function toggleOpen(i) {
    setOpenSet(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function updateItem(index, fieldPath, value) {
    onChange(items.map((item, i) => (i === index ? setPath(item, fieldPath, value) : item)))
  }
  function addItem() {
    const newItems = [...items, schema.addItem()]
    onChange(newItems)
    setOpenSet(prev => new Set([...prev, newItems.length - 1]))
  }
  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index))
    setOpenSet(prev => {
      const next = new Set()
      for (const idx of prev) {
        if (idx < index) next.add(idx)
        else if (idx > index) next.add(idx - 1)
      }
      return next
    })
  }
  function reorderItems(from, to) {
    const next = [...items]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }
  function moveItem(index, dir) {
    const target = index + dir
    if (target < 0 || target >= items.length) return
    reorderItems(index, target)
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
    if (from !== null && from !== i) reorderItems(from, i)
    setDraggingIndex(null)
    setDropTarget(null)
    dragIndex.current = null
  }

  return (
    <div className="edit-array-wrap">
      <div className="edit-array-header">
        <div className="edit-array-header-left">
          <span className="edit-array-title">{schema.label}</span>
          <span className="edit-array-count">{items.length}</span>
        </div>
        <button type="button" className="edit-array-add-btn" onClick={addItem}>
          <i className="fas fa-plus" /> Add
        </button>
      </div>

      <div className="edit-array-list">
        {items.map((item, i) => {
          const isOpen = openSet.has(i)
          const isDragging = draggingIndex === i
          const isTarget = dropTarget === i && draggingIndex !== i
          return (
            <div
              key={i}
              className={`edit-array-item${isOpen ? ' open' : ''}${isDragging ? ' is-dragging' : ''}${isTarget ? ' drop-target' : ''}`}
              draggable
              onDragStart={e => handleDragStart(e, i)}
              onDragEnd={handleDragEnd}
              onDragOver={e => handleDragOver(e, i)}
              onDrop={e => handleDrop(e, i)}
            >
              <div
                className="edit-array-item-header"
                onClick={() => toggleOpen(i)}
              >
                <span className="edit-array-handle">
                  <i className="fas fa-grip-vertical" />
                </span>
                <span className="edit-array-index">{i + 1}</span>
                <span className="edit-array-item-label">{schema.itemLabel(item, i)}</span>
                <div className="edit-array-item-actions" onClick={e => e.stopPropagation()}>
                  <button
                    type="button"
                    className="edit-icon-btn"
                    onClick={() => moveItem(i, -1)}
                    disabled={i === 0}
                    title="Move up"
                  ><i className="fas fa-arrow-up" /></button>
                  <button
                    type="button"
                    className="edit-icon-btn"
                    onClick={() => moveItem(i, 1)}
                    disabled={i === items.length - 1}
                    title="Move down"
                  ><i className="fas fa-arrow-down" /></button>
                  <button
                    type="button"
                    className="edit-icon-btn edit-icon-btn--danger"
                    onClick={() => removeItem(i)}
                    title="Remove"
                  ><i className="fas fa-trash-alt" /></button>
                </div>
                <i className={`fas fa-chevron-down edit-array-chevron${isOpen ? ' open' : ''}`} />
              </div>

              {isOpen && (
                <div className="edit-array-item-body">
                  {renderItemFields(
                    schema.itemFields,
                    schema.itemColumns,
                    schema.itemLayout,
                    item,
                    (fieldPath, v) => updateItem(i, fieldPath, v)
                  )}
                </div>
              )}
            </div>
          )
        })}

        {items.length === 0 && (
          <div className="edit-array-empty">
            No items yet — click <strong>+ Add</strong> to create one.
          </div>
        )}
      </div>
    </div>
  )
}
