import { getPath } from '../utils'
import FieldInput from '../fields/FieldInput'
import WhatsAppRichEditor from './WhatsAppRichEditor'
import { waToPreviewHtml } from '../lib/waFormat'

const SAMPLE_NAME = 'Budi Santoso'
const SAMPLE_LINK = typeof window !== 'undefined'
  ? window.location.origin + '?to=BudiSantoso'
  : 'https://example.com?to=BudiSantoso'

const SAMPLE_DOMAIN = typeof window !== 'undefined' ? window.location.hostname : 'riskitallforadel.com'

function WhatsAppPreview({ template, ogImage, ogTitle, ogDescription }) {
  const text = (template || '')
    .replace(/\{\{name\}\}/g, SAMPLE_NAME)
    .replace(/\{\{link\}\}/g, SAMPLE_LINK)

  const hasContent = text || ogImage || ogTitle || ogDescription

  return (
    <div className="share-iphone-frame">
      <div className="share-iphone-btn share-iphone-btn--action" />
      <div className="share-iphone-btn share-iphone-btn--volup" />
      <div className="share-iphone-btn share-iphone-btn--voldown" />
      <div className="share-iphone-btn share-iphone-btn--power" />

      <div className="share-iphone-screen">
        <div className="share-iphone-dynamic-island" />

        <div className="share-wa-phone">
          <div className="share-wa-statusbar">
            <span className="share-wa-statusbar-time">9:41</span>
            <div className="share-wa-statusbar-icons">
              <i className="fas fa-signal" />
              <i className="fas fa-wifi" />
              <i className="fas fa-battery-full" />
            </div>
          </div>

          <div className="share-wa-topbar">
            <i className="fas fa-chevron-left share-wa-back" />
            <div className="share-wa-avatar"><i className="fas fa-user" /></div>
            <div className="share-wa-contact">
              <div className="share-wa-contact-name">{SAMPLE_NAME}</div>
              <div className="share-wa-contact-status">online</div>
            </div>
            <div className="share-wa-topbar-icons">
              <i className="fas fa-video" />
              <i className="fas fa-phone" />
            </div>
          </div>

          <div className="share-wa-body">
            {hasContent ? (
              <div className="share-wa-bubble">
                {/* OG link preview card */}
                {(ogImage || ogTitle || ogDescription) && (
                  <div className="share-wa-og-card">
                    {ogImage && (
                      <img className="share-wa-og-img" src={ogImage} alt="" />
                    )}
                    <div className="share-wa-og-info">
                      {ogTitle && <div className="share-wa-og-title">{ogTitle}</div>}
                      {ogDescription && <div className="share-wa-og-desc">{ogDescription}</div>}
                      <div className="share-wa-og-domain">
                        <i className="fas fa-link" /> {SAMPLE_DOMAIN}
                      </div>
                    </div>
                  </div>
                )}

                {/* Message text */}
                {text && (
                  <div
                    className="share-wa-bubble-text"
                    dangerouslySetInnerHTML={{ __html: waToPreviewHtml(text) }}
                  />
                )}

                <div className="share-wa-bubble-meta">
                  10.30 <i className="fas fa-check-double" />
                </div>
              </div>
            ) : (
              <div className="share-wa-empty">Pratinjau pesan akan muncul di sini</div>
            )}
          </div>

          <div className="share-wa-input-bar">
            <div className="share-wa-input-fake"><span>Ketik pesan…</span></div>
            <div className="share-wa-send-btn"><i className="fas fa-paper-plane" /></div>
          </div>
        </div>

        <div className="share-iphone-home-indicator" />
      </div>
    </div>
  )
}

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
