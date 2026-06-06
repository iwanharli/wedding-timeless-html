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
        {/* Account 1: Groove Public BCA */}
        <div className="gift-account">
          <p className="gift-account-name">Groove Public</p>
          <div className="gift-account-detail">
            <p>Bank BCA<br />00008888123</p>
          </div>
        </div>

        {/* Account 2: Groove Public Invitation BCA */}
        <div className="gift-account">
          <p className="gift-account-name">Groove Public Invitation</p>
          <div className="gift-account-detail">
            <p>Bank BCA<br />00008888123</p>
          </div>
        </div>

        {/* Account 3: Groove Public Invitation Mandiri */}
        <div className="gift-account">
          <p className="gift-account-name">Groove Public Invitation</p>
          <div className="gift-account-detail">
            <p>Bank Mandiri<br />00008888123</p>
          </div>
        </div>
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
