import { getPath } from '../utils'
import FieldInput from '../fields/FieldInput'
import WhatsAppRichEditor from './WhatsAppRichEditor'
import WhatsAppPreview, { WA_SAMPLE_NAME as SAMPLE_NAME } from '../components/WhatsAppPreview'

function SectionLabel({ icon, children }) {
  return (
    <div className="share-section-label">
      <i className={`fas ${icon}`} />
      {children}
    </div>
  )
}

function Field({ label, hint, full, children }) {
  return (
    <label className={`edit-field${full ? ' edit-field--full' : ''}`}>
      <span className="edit-field-label">{label}</span>
      {children}
      {hint && <span className="edit-field-hint">{hint}</span>}
    </label>
  )
}

export default function ShareSetup({ draft, onFieldChange }) {
  const template = getPath(draft, 'share.whatsappTemplate') || ''

  return (
    <div className="share-page-grid">

      {/* ── Merged card ──────────────────────────────── */}
      <div className="edit-form-card">
        <div className="edit-form-card-header">
          <div className="edit-form-card-header-icon" style={{ background: '#f0f9ff', color: '#0369a1' }}>
            <i className="fas fa-share-alt" />
          </div>
          <div className="edit-form-card-header-text">
            <div className="edit-form-card-title">Share Setup</div>
            <div className="edit-form-card-desc">Atur template pesan dan tampilan tautan undangan saat dibagikan.</div>
          </div>
        </div>

        <div className="edit-form-card-body share-merged-body">

          <SectionLabel icon="fa-comment-dots">Template Pesan WhatsApp</SectionLabel>
          <Field
            label="Teks Pesan"
            hint="{{name}} akan diganti nama tamu, {{link}} akan diganti tautan undangan."
            full
          >
            <WhatsAppRichEditor
              value={template}
              onChange={v => onFieldChange('share.whatsappTemplate', v)}
            />
          </Field>

          <div className="edit-divider" />

          <SectionLabel icon="fa-globe">Pratinjau Tautan</SectionLabel>
          <p className="share-section-desc">
            Tampilan kartu yang muncul saat tautan undangan dibagikan di WhatsApp, iMessage, atau media sosial.
          </p>

          <div className="share-og-layout">
            <label className="edit-field share-og-image-field">
              <span className="edit-field-label">Gambar Pratinjau</span>
              <FieldInput
                field={{ path: 'share.ogImage', type: 'image' }}
                value={getPath(draft, 'share.ogImage')}
                onChange={v => onFieldChange('share.ogImage', v)}
              />
              <span className="edit-field-hint">Rasio 1.91:1 (mis. 1200×630 px).</span>
            </label>

            <div className="share-og-fields">
              <Field label="Judul" hint="Judul yang tampil di kartu pratinjau saat tautan dibagikan.">
                <FieldInput
                  field={{ path: 'share.ogTitle', type: 'text' }}
                  value={getPath(draft, 'share.ogTitle')}
                  onChange={v => onFieldChange('share.ogTitle', v)}
                />
              </Field>
              <Field label="Deskripsi" hint="Teks singkat di bawah judul pada kartu pratinjau.">
                <FieldInput
                  field={{ path: 'share.ogDescription', type: 'textarea' }}
                  value={getPath(draft, 'share.ogDescription')}
                  onChange={v => onFieldChange('share.ogDescription', v)}
                />
              </Field>
            </div>
          </div>

        </div>
      </div>

      {/* ── Preview panel ─────────────────────────────── */}
      <div className="share-preview-panel">
        <div className="share-preview-panel-label">
          <i className="fas fa-eye" /> Pratinjau Pesan
        </div>
        <WhatsAppPreview
          template={template}
          ogImage={getPath(draft, 'share.ogImage')}
          ogTitle={getPath(draft, 'share.ogTitle')}
          ogDescription={getPath(draft, 'share.ogDescription')}
        />
        <p className="share-preview-panel-note">
          Contoh tampilan dengan nama tamu "<strong>{SAMPLE_NAME}</strong>"
        </p>
      </div>

    </div>
  )
}
