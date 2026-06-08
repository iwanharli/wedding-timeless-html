import { useState } from 'react'
import FieldInput from './FieldInput'
import ArrayEditor from './ArrayEditor'
import ImageListEditor from './ImageListEditor'
import AudioTrimField from './AudioTrimField'
import { getPath } from './utils'

const FULL_WIDTH_TYPES = new Set(['textarea', 'image', 'video', 'audio'])

function FieldGroup({ fields, arrays, imageLists, audioTrim, draft, onFieldChange, onArrayChange, columns }) {
  const hasFields = (fields || []).length > 0
  const hasArrays = (arrays || []).length > 0
  const hasLists  = (imageLists || []).length > 0
  const useGrid   = columns === 2 && hasFields

  const fieldNodes = (fields || []).map(field => (
    <label
      className={`edit-field${useGrid && FULL_WIDTH_TYPES.has(field.type) ? ' edit-field--full' : ''}`}
      key={field.path}
    >
      <span className="edit-field-label">{field.label}</span>
      <FieldInput
        field={field}
        value={getPath(draft, field.path)}
        onChange={v => onFieldChange(field.path, v)}
      />
      {field.hint && <span className="edit-field-hint">{field.hint}</span>}
    </label>
  ))

  return (
    <>
      {useGrid
        ? <div className="edit-field-grid">{fieldNodes}</div>
        : fieldNodes}

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

export default function SectionForm({ schema, draft, onFieldChange, onArrayChange }) {
  const getTabSectionId = (idx) => {
    if (schema.id === 'event') {
      return idx === 0 ? 'event' : idx === 1 ? 'countdown' : 'livestream'
    }
    return null
  }

  const isTabVisible = (idx) => {
    const sectionId = getTabSectionId(idx)
    return sectionId ? isLayoutSectionVisible(draft, sectionId) : true
  }

  const firstActiveTab = schema.tabs ? schema.tabs.findIndex((_, idx) => isTabVisible(idx)) : 0
  const initialTab = firstActiveTab !== -1 ? firstActiveTab : 0
  const [activeTab, setActiveTab] = useState(initialTab)

  const getGroupSectionId = (group) => {
    if (schema.id === 'general') {
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
                      if (visible) setActiveTab(i)
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
              draft={draft}
              onFieldChange={onFieldChange}
              onArrayChange={onArrayChange}
              columns={tab.columns}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── Grouped layout (multiple cards) ───────────────────
  if (schema.groups) {
    return (
      <div className="edit-form-wrap edit-form-wrap--stack">
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
            draft={draft}
            onFieldChange={onFieldChange}
            onArrayChange={onArrayChange}
            columns={schema.columns}
          />
        </div>
      </div>
    </div>
  )
}
