import { forwardRef, useState } from 'react'

const PreviewPanel = forwardRef(function PreviewPanel({ visible, onRefresh, activeLabel, refreshKey }, ref) {
  const [refreshing, setRefreshing] = useState(false)

  function handleRefresh() {
    setRefreshing(true)
    onRefresh()
    setTimeout(() => setRefreshing(false), 800)
  }

  if (!visible) return null
  return (
    <div className="edit-preview-panel">
      {/* ── Header ── */}
      <div className="edit-preview-header">
        <div className="edit-preview-header-left">
          <span className="edit-preview-title">
            <i className="fas fa-mobile-alt" /> Preview
          </span>
          {activeLabel && (
            <span className="edit-preview-section-badge">{activeLabel}</span>
          )}
        </div>
        <div className="edit-preview-header-right">
          <button
            type="button"
            className={`edit-preview-ctrl-btn${refreshing ? ' spinning' : ''}`}
            onClick={handleRefresh}
            title="Refresh preview"
          >
            <i className="fas fa-redo-alt" />
          </button>
          <a
            href="/?preview=1"
            target="_blank"
            rel="noreferrer"
            className="edit-preview-ctrl-btn"
            title="Buka di tab baru"
          >
            <i className="fas fa-external-link-alt" />
          </a>
        </div>
      </div>

      {/* ── Phone chrome ── */}
      <div className="edit-preview-stage">
        <div className="edit-preview-phone">
          {/* Volume & power side buttons (decorative) */}
          <div className="edit-preview-phone-vol-up"   />
          <div className="edit-preview-phone-vol-down" />
          <div className="edit-preview-phone-power"    />

          {/* Dynamic island */}
          <div className="edit-preview-phone-top">
            <div className="edit-preview-phone-island" />
          </div>

          {/* Screen */}
          <div className="edit-preview-phone-screen">
            <iframe
              key={refreshKey}
              ref={ref}
              src="/?preview=1"
              title="Mobile preview"
              className="edit-preview-iframe"
            />
          </div>

          {/* Home indicator */}
          <div className="edit-preview-phone-bottom">
            <div className="edit-preview-phone-bar" />
          </div>
        </div>
      </div>
    </div>
  )
})

export default PreviewPanel
