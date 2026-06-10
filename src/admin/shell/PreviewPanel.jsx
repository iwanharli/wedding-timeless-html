import { forwardRef, useState, useRef, useEffect } from 'react'

const DEVICES = [
  { label: '360px', name: 'Android mid-range (Samsung A, Xiaomi, dll)', w: 360, h: 800 },
  { label: '390px', name: 'iPhone 14 / 15 standard',                   w: 390, h: 844 },
  { label: '430px', name: 'iPhone 15 Pro Max',                         w: 430, h: 932 },
]

const PreviewPanel = forwardRef(function PreviewPanel({ visible, onRefresh, activeLabel, refreshKey, activeSection }, ref) {
  const [refreshing, setRefreshing] = useState(false)
  const [deviceIdx, setDeviceIdx]   = useState(1)           // default: 390×844
  const device    = DEVICES[deviceIdx]
  const deviceRef = useRef(device)
  deviceRef.current = device

  const screenRef = useRef(null)
  const iframeRef = useRef(null)
  const scaleRef  = useRef(1)

  // Scale iframe to fit the phone screen container.
  // The phone chassis has no padding and uses aspect-ratio matching the device,
  // so the screen element has the same ratio as device.w × device.h —
  // scale = screenW / device.w fills both dimensions exactly.
  // deviceRef stays current between renders so applyScale always uses the
  // latest device without needing to re-run the effect on device change.
  useEffect(() => {
    const screen = screenRef.current
    if (!screen) return

    function applyScale() {
      const w = screen.clientWidth
      if (!w) return
      const d = deviceRef.current
      const scale = w / d.w
      scaleRef.current = scale
      if (iframeRef.current) {
        iframeRef.current.style.transform       = `scale(${scale})`
        iframeRef.current.style.transformOrigin = 'top left'
        iframeRef.current.style.width           = `${d.w}px`
        iframeRef.current.style.height          = `${d.h}px`
        iframeRef.current.style.pointerEvents   = 'auto'
      }
    }

    const ro = new ResizeObserver(applyScale)
    ro.observe(screen)
    applyScale()

    // CSS transform: scale() breaks native wheel forwarding in Chromium —
    // manually scroll the same-origin document instead.
    function handleWheel(e) {
      const win = iframeRef.current?.contentWindow
      if (!win) return
      e.preventDefault()
      win.scrollBy(0, e.deltaY / (scaleRef.current || 1))
    }
    screen.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      ro.disconnect()
      screen.removeEventListener('wheel', handleWheel)
    }
  }, [visible])

  // Forward ref to the iframe AND re-apply the cached scale immediately.
  // Navigation changes the iframe key (remount), giving us a new element that
  // has no transform yet — the ResizeObserver won't fire because the screen
  // didn't resize, so we must apply scale here.
  function setIframeRef(el) {
    iframeRef.current = el
    if (el && scaleRef.current) {
      const d = deviceRef.current
      el.style.transform       = `scale(${scaleRef.current})`
      el.style.transformOrigin = 'top left'
      el.style.width           = `${d.w}px`
      el.style.height          = `${d.h}px`
      el.style.pointerEvents   = 'auto'
    }
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
            href={`/?preview=1${activeSection ? `&onlysection=${activeSection}` : ''}`}
            target="_blank"
            rel="noreferrer"
            className="edit-preview-ctrl-btn"
            title="Buka di tab baru"
          >
            <i className="fas fa-external-link-alt" />
          </a>
        </div>
      </div>

      {/* Device viewport switcher */}
      <div className="edit-preview-devices-bar">
        <span className="edit-preview-devices-label">Viewport</span>
        {DEVICES.map((d, i) => (
          <button
            key={i}
            type="button"
            className={`edit-preview-device-btn${deviceIdx === i ? ' active' : ''}`}
            onClick={() => setDeviceIdx(i)}
            title={`${d.name} — ${d.w}×${d.h}px`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Phone chrome */}
      <div className="edit-preview-stage">
        <div
          className="edit-preview-phone"
          style={{
            aspectRatio: `${device.w} / ${device.h}`,
            // Phone height scales proportionally to device width so selecting
            // a narrower device (e.g. 360px) shows a physically smaller frame.
            height: `min(calc(100vh - 166px), ${Math.round(820 * device.w / 430)}px)`,
          }}
        >
          <div className="edit-preview-phone-vol-up"   />
          <div className="edit-preview-phone-vol-down" />
          <div className="edit-preview-phone-power"    />

          {/* Screen fills the full phone interior — island & bar are overlays */}
          <div className="edit-preview-phone-screen" ref={screenRef}>
            <div className="edit-preview-phone-island" />

            <iframe
              key={`${refreshKey}-${activeSection ?? 'full'}`}
              ref={setIframeRef}
              src={`/?preview=1${activeSection ? `&onlysection=${activeSection}` : ''}`}
              title="Mobile preview"
              className="edit-preview-iframe"
              style={{ width: device.w, height: device.h, transformOrigin: 'top left' }}
            />

            <div className="edit-preview-phone-bar" />
          </div>
        </div>
      </div>
    </div>
  )
})

export default PreviewPanel
