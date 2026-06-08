export default function SectionHero({ content, onOpen, isOpen, guestName }) {
  if (isOpen) return null

  return (
    <div
      id="hapus-section"
      className="section-hero child"
      style={{ backgroundImage: `url(${content.hero.backgroundImage})` }}
    >
      <div className="hero-overlay" />

      <div className="hero-content">

        <p className="hero-invite-title hero-anim" style={{ '--d': '0ms' }}>{content.hero.inviteTitle}</p>

        <div className="hero-ornament hero-anim" style={{ '--d': '200ms' }}>
          <span className="hero-orn-line" />
          <span className="hero-orn-diamond" />
          <span className="hero-orn-line" />
        </div>

        <div className="hero-names">
          <span className="hero-name hero-name1 hero-anim" style={{ '--d': '400ms' }}>{content.hero.name1}</span>
          <span className="hero-name-connector hero-anim" style={{ '--d': '650ms' }}>{content.hero.connector}</span>
          <span className="hero-name hero-name2 hero-anim" style={{ '--d': '800ms' }}>{content.hero.name2}</span>
        </div>

        <p className="hero-date hero-anim" style={{ '--d': '1050ms' }}>{content.hero.date}</p>

        <div className="hero-ornament hero-anim" style={{ '--d': '1200ms' }}>
          <span className="hero-orn-line" />
          <span className="hero-orn-diamond" />
          <span className="hero-orn-line" />
        </div>

        {guestName && (
          <div className="hero-guest-section">
            <p className="hero-dear">{content.hero.dear},</p>
            <p className="hero-guest-name">{guestName}</p>
            <p className="hero-apology">{content.hero.apologyText}</p>
          </div>
        )}

        <div id="tombol-buka" className="hero-open-btn hero-anim" style={{ '--d': '1400ms' }} onClick={onOpen}>
          <i className="fas fa-envelope-open-text" />
          <span>{content.hero.openButton}</span>
        </div>

      </div>
    </div>
  )
}
