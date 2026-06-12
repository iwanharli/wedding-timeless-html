import { useState } from 'react'
import './gift.css'

export default function SectionGift({ content, onOpenGiftPopup }) {
  const g = content.gift
  const [copiedIndex, setCopiedIndex] = useState(null)

  function copyNumber(number, i) {
    navigator.clipboard.writeText(number).then(() => {
      setCopiedIndex(i)
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

  return (
    <div id="weddinggift" className="section-gift child">

      <div className="gift-header" data-aos="fade" data-aos-offset="0" data-aos-duration="500">
        <span className="gift-label">Wedding Gift</span>
        <div className="gift-ornament">
          <span className="gift-orn-line" />
          <i className="fas fa-circle gift-orn-dot" />
          <span className="gift-orn-line" />
        </div>
        <h2 className="gift-title">{g.title}</h2>
        <p className="gift-desc">{g.description}</p>
      </div>

      <div className="gift-accounts" data-aos="fade-up" data-aos-offset="0" data-aos-delay="80" data-aos-duration="500">
        {(g.accounts || []).map((account, i) => (
          <div className="gift-account-card" key={i}>
            <div className="gift-account-header">
              <span className="gift-account-bank">{account.bankType}</span>
              <button
                className={`gift-copy-btn${copiedIndex === i ? ' gift-copy-btn--copied' : ''}`}
                onClick={() => copyNumber(account.accountNumber, i)}
                title="Salin nomor rekening"
              >
                <i className={`fas ${copiedIndex === i ? 'fa-check' : 'fa-copy'}`} />
                {copiedIndex === i ? 'Tersalin' : 'Salin'}
              </button>
            </div>
            <span className="gift-account-number">{account.accountNumber}</span>
            <span className="gift-account-owner">{account.bankName}</span>
          </div>
        ))}
      </div>

      <button
        className="gift-confirm-btn"
        onClick={onOpenGiftPopup}
        data-aos="fade" data-aos-offset="0" data-aos-delay="120" data-aos-duration="500"
      >
        <i className="fas fa-paper-plane" />
        {g.confirmButtonText || 'Confirm Gift'}
      </button>

    </div>
  )
}
