import { useState } from 'react'

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
      <div className="gift-header" data-aos="fade" data-aos-delay="200" data-aos-duration="800">
        <h2 className="gift-title">{g.title}</h2>
        <p className="gift-desc">{g.description}</p>
      </div>

      <div className="gift-accounts" data-aos="fade-up" data-aos-delay="300" data-aos-duration="900">
        {(g.accounts || []).map((account, i) => (
          <div className="gift-account-card" key={i}>
            <div className="gift-account-card-left">
              <div className="gift-account-icon-wrap">
                <i className="fas fa-university" />
              </div>
              <div className="gift-account-info">
                <span className="gift-account-bank">{account.bankType}</span>
                <span className="gift-account-number">{account.accountNumber}</span>
                <span className="gift-account-owner">{account.bankName}</span>
              </div>
            </div>
            <button
              className={`gift-copy-btn${copiedIndex === i ? ' gift-copy-btn--copied' : ''}`}
              onClick={() => copyNumber(account.accountNumber, i)}
              title="Salin nomor rekening"
            >
              <i className={`fas ${copiedIndex === i ? 'fa-check' : 'fa-copy'}`} />
            </button>
          </div>
        ))}
      </div>

      <a
        className="gift-confirm-btn"
        href="#"
        onClick={e => { e.preventDefault(); onOpenGiftPopup() }}
        data-aos="fade" data-aos-delay="400" data-aos-duration="800"
      >
        <i className="fas fa-heart" />
        {g.confirmButtonText || 'Confirm Gift'}
      </a>
    </div>
  )
}
