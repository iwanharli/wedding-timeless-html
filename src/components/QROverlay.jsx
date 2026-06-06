import { useState } from 'react'

export default function QROverlay() {
  const [visible, setVisible] = useState(false)

  return (
    <div className="qr-overlay-wrap" style={{ display: visible ? 'flex' : 'none' }}>
      <a className="dqr" role="button" onClick={() => setVisible(false)}>
        <i className="fas fa-xmark" aria-hidden="true"></i>
        Close
      </a>
      <div className="selebaran-wrapper">
        <div className="selebaran-card">
          <div className="selebaran-image">
            <div className="selebaran-img-wrap">
              <img
                loading="lazy"
                decoding="async"
                src="/assets/images/groove-blog-olive-versi-400173.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
