import { useState } from 'react'
import { createPortal } from 'react-dom'
import Cropper from 'react-easy-crop'
import { uploadFileWithProgress } from '../lib/uploadFile'

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Gagal memuat gambar'))
    img.src = src
  })
}

async function getCroppedBlob(src, area) {
  const img = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(area.width)
  canvas.height = Math.round(area.height)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Gagal memproses gambar')), 'image/jpeg', 0.92)
  })
}

// Right after upload, the dev server's static middleware may briefly 404/serve
// a fallback for the new file before it's visible on disk — retry with a
// cache-busting query until the image actually decodes.
async function waitForImageReady(url, attempts = 8, delayMs = 250) {
  for (let i = 0; i < attempts; i++) {
    try {
      await loadImage(`${url}?t=${Date.now()}`)
      return
    } catch {
      await new Promise(r => setTimeout(r, delayMs))
    }
  }
}

export default function ImageCropModal({ src, aspect, onCancel, onApply }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleApply() {
    if (!area) return
    setSaving(true)
    setError(null)
    try {
      const blob = await getCroppedBlob(src, area)
      const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' })
      const url = await uploadFileWithProgress(file, null, false, 'cropped')
      await waitForImageReady(url)
      onApply(url)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan hasil crop')
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="edit-shell icm-portal-root">
      <div className="icm-backdrop" onClick={onCancel}>
        <div className="icm-box" onClick={e => e.stopPropagation()}>
          <div className="icm-header">
            <span className="icm-title"><i className="fas fa-crop-alt" /> Crop Foto</span>
            <button type="button" className="icm-close" onClick={onCancel} title="Tutup">
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="icm-cropper">
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect || 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => setArea(croppedAreaPixels)}
            />
          </div>

          <div className="icm-controls">
            <i className="fas fa-search-minus" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="icm-zoom-slider"
            />
            <i className="fas fa-search-plus" />
          </div>

          {error && <p className="icm-error"><i className="fas fa-exclamation-circle" /> {error}</p>}

          <div className="icm-footer">
            <button type="button" className="icm-btn icm-btn--ghost" onClick={onCancel} disabled={saving}>
              Batal
            </button>
            <button type="button" className="icm-btn icm-btn--primary" onClick={handleApply} disabled={saving || !area}>
              {saving ? <><i className="fas fa-circle-notch fa-spin" /> Menyimpan…</> : <><i className="fas fa-check" /> Terapkan</>}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
