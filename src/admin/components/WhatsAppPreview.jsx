import { waToPreviewHtml } from '../lib/waFormat'

export const WA_SAMPLE_NAME = 'Budi Santoso'
export const WA_SAMPLE_LINK = typeof window !== 'undefined'
  ? window.location.origin + '?to=BudiSantoso'
  : 'https://example.com?to=BudiSantoso'

export const WA_SAMPLE_DOMAIN = typeof window !== 'undefined' ? window.location.hostname : 'riskitallforadel.com'

export default function WhatsAppPreview({
  template,
  ogImage,
  ogTitle,
  ogDescription,
  sampleName = WA_SAMPLE_NAME,
  sampleLink = WA_SAMPLE_LINK,
  sampleDomain = WA_SAMPLE_DOMAIN,
}) {
  const text = (template || '')
    .replace(/\{\{name\}\}/g, sampleName)
    .replace(/\{\{link\}\}/g, sampleLink)

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
              <div className="share-wa-contact-name">{sampleName}</div>
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
                        <i className="fas fa-link" /> {sampleDomain}
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
