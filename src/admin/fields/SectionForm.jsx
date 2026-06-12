import { useState } from 'react'
import FieldInput from './FieldInput'
import ArrayEditor from './ArrayEditor'
import ImageListEditor from './ImageListEditor'
import AudioTrimField from './AudioTrimField'
import { getPath } from '../utils'

const FULL_WIDTH_TYPES = new Set(['textarea', 'image', 'video', 'audio', 'media'])

const FIELD_ICONS = {
  image: 'fa-image',
  video: 'fa-film',
  audio: 'fa-music',
  media: 'fa-photo-video',
}

function FieldLabel({ field }) {
  if (!field.label) return null
  const icon = FIELD_ICONS[field.type]
  return (
    <span className="edit-field-label">
      {icon && <i className={`fas ${icon} edit-field-label-icon`} />}
      {field.label}
      {field.hintTooltip && field.hint && (
        <i className="fas fa-info-circle edit-field-label-hint" data-tooltip={field.hint} />
      )}
    </span>
  )
}

function isFullWidth(field, colCount) {
  if (field.span != null) return field.span >= colCount
  return FULL_WIDTH_TYPES.has(field.type)
}

function FieldGroup({ fields, arrays, imageLists, audioTrim, draft, onFieldChange, onArrayChange, columns, layout }) {
  const hasFields = (fields || []).length > 0
  const hasArrays = (arrays || []).length > 0
  const hasLists  = (imageLists || []).length > 0
  const colCount  = columns === 3 ? 3 : columns === 2 ? 2 : 1
  const useGrid   = colCount > 1 && hasFields
  const gridClass = `edit-field-grid${colCount === 3 ? ' edit-field-grid--3' : ''}`

  const isFieldVisible = (field) => {
    if (!field.showWhen) return true
    const current = getPath(draft, field.showWhen.path) ?? field.showWhen.default
    return current === field.showWhen.value
  }

  const makeFieldNode = (field, inGrid) => {
    if (!isFieldVisible(field)) return null
    if (field.type === 'divider') {
      return (
        <div
          className={`edit-field-divider${inGrid && isFullWidth(field, colCount) ? ' edit-field--full' : ''}`}
          key={field.label}
        >
          <span>{field.label}</span>
        </div>
      )
    }
    const cls = [
      'edit-field',
      inGrid && isFullWidth(field, colCount) ? 'edit-field--full' : '',
      inGrid && field.span > 1 && field.span < colCount ? `edit-field--span${field.span}` : '',
      field.compact ? 'edit-field--compact-media' : '',
    ].filter(Boolean).join(' ')
    return (
      <label className={cls} key={field.path}>
        <FieldLabel field={field} />
        <FieldInput
          field={field}
          value={getPath(draft, field.path)}
          onChange={v => onFieldChange(field.path, v)}
          draft={draft}
        />
        {field.hint && !field.hintTooltip && <span className="edit-field-hint">{field.hint}</span>}
      </label>
    )
  }

  // Profile layout: first image field pinned left, rest in 2-col grid on the right
  const fieldNodes = layout === 'profile' && useGrid
    ? (() => {
        const photoField = (fields || []).find(f => f.type === 'image')
        const detailFields = (fields || []).filter(f => f !== photoField)
        return (
          <div className="edit-field-profile-layout">
            {photoField && (
              <div className="edit-field-profile-photo">
                <label className={`edit-field${photoField.compact ? ' edit-field--compact-media' : ''}`}>
                  <FieldLabel field={photoField} />
                  <FieldInput
                    field={photoField}
                    value={getPath(draft, photoField.path)}
                    onChange={v => onFieldChange(photoField.path, v)}
                  />
                  {photoField.hint && <span className="edit-field-hint">{photoField.hint}</span>}
                </label>
              </div>
            )}
            <div className="edit-field-grid edit-field-profile-details">
              {detailFields.map(f => makeFieldNode(f, true))}
            </div>
          </div>
        )
      })()
    : useGrid
      ? <div className={gridClass}>{(fields || []).map(f => makeFieldNode(f, true))}</div>
      : (fields || []).map(f => makeFieldNode(f, false))

  return (
    <>
      {fieldNodes}

      {hasArrays && hasFields && <div className="edit-divider" />}
      {(arrays || []).map(arraySchema => (
        <ArrayEditor
          key={arraySchema.path}
          schema={arraySchema}
          items={getPath(draft, arraySchema.path) || []}
          onChange={items => onArrayChange(arraySchema.path, items)}
        />
      ))}

      {hasLists && (hasFields || hasArrays) && <div className="edit-divider" />}
      {(imageLists || []).map(listSchema => (
        <ImageListEditor
          key={listSchema.path}
          label={listSchema.label}
          accept={listSchema.accept}
          cropAspect={listSchema.cropAspect}
          items={getPath(draft, listSchema.path) || []}
          onChange={items => onArrayChange(listSchema.path, items)}
        />
      ))}

      {audioTrim && (
        <>
          <div className="edit-divider" />
          <label className="edit-field edit-field--full">
            <span className="edit-field-label">Trim / Loop Range</span>
            <AudioTrimField
              audioUrl={getPath(draft, audioTrim.trackPath)}
              startTime={getPath(draft, audioTrim.startPath) || 0}
              endTime={getPath(draft, audioTrim.endPath) || 0}
              onChangeStart={v => onFieldChange(audioTrim.startPath, v)}
              onChangeEnd={v => onFieldChange(audioTrim.endPath, v)}
            />
            <span className="edit-field-hint">Play lagu, geser ke posisi yang diinginkan, lalu klik 📍 untuk set start/end.</span>
          </label>
        </>
      )}
    </>
  )
}

function CardHeader({ title, description, icon, iconColor, iconFg, disabled, children }) {
  return (
    <div className="edit-form-card-header">
      {icon && (
        <div
          className="edit-form-card-header-icon"
          style={{ background: iconColor || 'var(--accent-light)', color: iconFg || 'var(--accent-dark)' }}
        >
          <i className={`fas ${icon}`} />
        </div>
      )}
      <div className="edit-form-card-header-text">
        <div className="edit-form-card-title">
          {title}
          {disabled && (
            <span className="edit-form-card-disabled-badge">
              <i className="fas fa-eye-slash" /> Inactive
            </span>
          )}
        </div>
        {description && <div className="edit-form-card-desc">{description}</div>}
        {children}
      </div>
    </div>
  )
}

function isLayoutSectionVisible(draft, sectionId) {
  if (!draft || !draft.sections) return true
  const sec = draft.sections.find(s => s.id === sectionId)
  return sec ? sec.visible : true
}

export default function SectionForm({ schema, draft, onFieldChange, onArrayChange, onTabChange }) {
  const getTabSectionId = () => null

  const isTabVisible = (idx) => {
    const sectionId = getTabSectionId(idx)
    return sectionId ? isLayoutSectionVisible(draft, sectionId) : true
  }

  const firstActiveTab = schema.tabs ? schema.tabs.findIndex((_, idx) => isTabVisible(idx)) : 0
  const initialTab = firstActiveTab !== -1 ? firstActiveTab : 0
  const [activeTab, setActiveTab] = useState(initialTab)

  const getGroupSectionId = (group) => {
    if (schema.id === 'couple') {
      if (group.label === 'Groom') return 'groom'
      if (group.label === 'Bride') return 'bride'
    }
    return null
  }

  const isGroupVisible = (group) => {
    const sectionId = getGroupSectionId(group)
    return sectionId ? isLayoutSectionVisible(draft, sectionId) : true
  }

  // ── Tabbed layout ──────────────────────────────────────
  if (schema.tabs) {
    const activeTabIdx = isTabVisible(activeTab)
      ? activeTab
      : (schema.tabs.findIndex((_, idx) => isTabVisible(idx)) !== -1
         ? schema.tabs.findIndex((_, idx) => isTabVisible(idx))
         : 0)

    const tab = schema.tabs[activeTabIdx] || schema.tabs[0]
    return (
      <div className="edit-form-wrap">
        <div className="edit-form-card">
          <CardHeader title={schema.label} description={schema.description} icon={schema.icon} iconColor={schema.iconColor} iconFg={schema.iconFg}>
            <div className="edit-tab-bar">
              {schema.tabs.map((t, i) => {
                const visible = isTabVisible(i)
                return (
                  <button
                    key={i}
                    type="button"
                    className={`edit-tab-btn${activeTabIdx === i ? ' active' : ''}${!visible ? ' disabled' : ''}`}
                    onClick={() => {
                      if (visible) {
                        setActiveTab(i)
                        if (onTabChange) onTabChange(getTabSectionId(i))
                      }
                    }}
                    title={!visible ? 'Section dinonaktifkan di Section Layout' : ''}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </CardHeader>
          <div className="edit-form-card-body">
            {tab.description && <p className="edit-tab-desc">{tab.description}</p>}
            <FieldGroup
              fields={tab.fields}
              arrays={tab.arrays}
              imageLists={tab.imageLists}
              audioTrim={tab.audioTrim}
              draft={draft}
              onFieldChange={onFieldChange}
              onArrayChange={onArrayChange}
              columns={tab.columns}
              layout={tab.layout}
            />
            {tab.footnote && (
              <p className="edit-tab-footnote">
                <i className="fas fa-info-circle" /> {tab.footnote}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Grouped layout (multiple cards) ───────────────────
  if (schema.groups) {
    return (
      <div
        className={`edit-form-wrap edit-form-wrap--stack${schema.groupLayout === 'cols2' ? ' edit-form-wrap--cols2' : ''}`}
        style={schema.groupColumns ? { gridTemplateColumns: schema.groupColumns } : undefined}
      >
        {schema.groups.map((group, i) => {
          const visible = isGroupVisible(group)
          return (
            <div
              className={`edit-form-card${!visible ? ' disabled' : ''}`}
              key={i}
              title={!visible ? 'Grup ini dinonaktifkan di Section Layout' : ''}
            >
              <CardHeader
                title={group.label}
                description={group.description}
                icon={group.icon}
                iconColor={group.iconColor}
                iconFg={group.iconFg}
                disabled={!visible}
              />
              <div className="edit-form-card-body">
                <FieldGroup
                  fields={group.fields}
                  arrays={group.arrays}
                  imageLists={group.imageLists}
                  audioTrim={group.audioTrim}
                  draft={draft}
                  onFieldChange={onFieldChange}
                  onArrayChange={onArrayChange}
                  columns={group.columns}
                  layout={group.layout}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ── Flat layout ────────────────────────────────────────
  return (
    <div className="edit-form-wrap">
      <div className="edit-form-card">
        <CardHeader title={schema.label} description={schema.description} icon={schema.icon} iconColor={schema.iconColor} iconFg={schema.iconFg} />
        <div className="edit-form-card-body">
          <FieldGroup
            fields={schema.fields}
            arrays={schema.arrays}
            imageLists={schema.imageLists}
            audioTrim={schema.audioTrim}
            draft={draft}
            onFieldChange={onFieldChange}
            onArrayChange={onArrayChange}
            columns={schema.columns}
            layout={schema.layout}
          />
        </div>
      </div>
    </div>
  )
}
