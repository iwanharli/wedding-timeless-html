export default function SectionGift({ content, onOpenGiftPopup }) {
  const g = content.gift
  return (
    <div id="weddinggift" className="section-gift child">
      <div className="gift-header">
        <h2
          className="gift-title"
          data-aos="fade"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {g.title}
        </h2>
        <p
          className="gift-desc"
          data-aos="fade"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {g.description}
        </p>
      </div>

      <div
        className="gift-accounts"
        data-aos="fade"
        data-aos-delay="100"
        data-aos-duration="1000"
      >
        {(g.accounts || []).map((account, i) => (
          <div className="gift-account" key={i}>
            <p className="gift-account-name">{account.bankName}</p>
            <div className="gift-account-detail">
              <p>{account.bankType}<br />{account.accountNumber}</p>
            </div>
          </div>
        ))}
      </div>

      <a
        className="gift-confirm-btn"
        href="#"
        onClick={e => { e.preventDefault(); onOpenGiftPopup() }}
      >
        Confirm
      </a>
    </div>
  )
}
