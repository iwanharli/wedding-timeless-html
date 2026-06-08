import { forwardRef, useState, useRef, useEffect } from 'react'

// iPhone 15 Pro Max logical resolution
const DEVICE_W = 430
const DEVICE_H = 932

const PreviewPanel = forwardRef(function PreviewPanel({ visible, onRefresh, activeLabel, refreshKey }, ref) {
  const [refreshing, setRefreshing] = useState(false)
  const screenRef  = useRef(null)
  const iframeRef  = useRef(null)
  const scaleRef   = useRef(1)

  // Scale iframe to fit the phone screen container
  useEffect(() => {
    const screen = screenRef.current
    if (!screen) return

    function applyScale() {
      const w = screen.clientWidth
      const h = screen.clientHeight
      if (!w || !h) return
      const scale = Math.min(w / DEVICE_W, h / DEVICE_H)
      scaleRef.current = scale
      if (iframeRef.current) {
        iframeRef.current.style.transform = `scale(${scale})`
        iframeRef.current.style.transformOrigin = 'top left'
        iframeRef.current.style.width  = `${DEVICE_W}px`
        iframeRef.current.style.height = `${DEVICE_H}px`
        iframeRef.current.style.pointerEvents = 'auto'
      }
    }

    const ro = new ResizeObserver(applyScale)
    ro.observe(screen)
    applyScale()
    return () => ro.disconnect()
  }, [visible])

  // Forward ref to the iframe
  function setIframeRef(el) {
    iframeRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) ref.current = el
  }

  function handleRefresh() {
    setRefreshing(true)
    onRefresh()
    setTimeout(() => setRefreshing(false), 800)
  }

  if (!visible) return null

  return (
    <div className="edit-preview-panel">
      {/* Header */}
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

      {/* Phone chrome */}
      <div className="edit-preview-stage">
        <div className="edit-preview-phone">
          <div className="edit-preview-phone-vol-up"   />
          <div className="edit-preview-phone-vol-down" />
          <div className="edit-preview-phone-power"    />

          <div className="edit-preview-phone-top">
            <div className="edit-preview-phone-island" />
          </div>

          {/* Screen — iframe rendered at 430px and scaled down */}
          <div className="edit-preview-phone-screen" ref={screenRef}>
            <iframe
              key={refreshKey}
              ref={setIframeRef}
              src="/?preview=1"
              title="Mobile preview"
              className="edit-preview-iframe"
              style={{ width: DEVICE_W, height: DEVICE_H, transformOrigin: 'top left' }}
            />
          </div>

          <div className="edit-preview-phone-bottom">
            <div className="edit-preview-phone-bar" />
          </div>
        </div>
      </div>
    </div>
  )
})

export default PreviewPanel
