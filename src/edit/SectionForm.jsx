import { useState } from 'react'
import FieldInput from './FieldInput'
import ArrayEditor from './ArrayEditor'
import ImageListEditor from './ImageListEditor'
import { getPath } from './utils'

const FULL_WIDTH_TYPES = new Set(['textarea', 'image', 'video', 'audio'])

function FieldGroup({ fields, arrays, imageLists, draft, onFieldChange, onArrayChange, columns }) {
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
    </>
  )
}

function CardHeader({ title, description, icon, iconColor, iconFg, children }) {
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
        <div className="edit-form-card-title">{title}</div>
        {description && <div className="edit-form-card-desc">{description}</div>}
        {children}
      </div>
    </div>
  )
}

export default function SectionForm({ schema, draft, onFieldChange, onArrayChange }) {
  const [activeTab, setActiveTab] = useState(0)

  // ── Tabbed layout ──────────────────────────────────────
  if (schema.tabs) {
    const tab = schema.tabs[activeTab] || schema.tabs[0]
    return (
      <div className="edit-form-wrap">
        <div className="edit-form-card">
          <CardHeader title={schema.label} description={schema.description} icon={schema.icon} iconColor={schema.iconColor} iconFg={schema.iconFg}>
            <div className="edit-tab-bar">
              {schema.tabs.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  className={`edit-tab-btn${activeTab === i ? ' active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {t.label}
                </button>
              ))}
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
        {schema.groups.map((group, i) => (
          <div className="edit-form-card" key={i}>
            <CardHeader
              title={group.label}
              description={group.description}
              icon={group.icon}
              iconColor={group.iconColor}
              iconFg={group.iconFg}
            />
            <div className="edit-form-card-body">
              <FieldGroup
                fields={group.fields}
                arrays={group.arrays}
                imageLists={group.imageLists}
                draft={draft}
                onFieldChange={onFieldChange}
                onArrayChange={onArrayChange}
                columns={group.columns}
              />
            </div>
          </div>
        ))}
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
