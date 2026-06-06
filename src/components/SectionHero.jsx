export default function SectionHero({ content, onOpen, isOpen }) {
  if (isOpen) return null

  return (
    <div
      id="hapus-section"
      className="section-hero child"
      style={{ backgroundImage: `url(${content.hero.backgroundImage})` }}
    >
      <div className="hero-top">
        <p className="hero-invite-title">{content.hero.inviteTitle}</p>
        <div className="hero-names">
          <div className="hero-names-top">
            <span className="hero-name hero-name1">{content.hero.name1}</span>
            <span className="hero-name-connector">{content.hero.connector}</span>
          </div>
          <div className="hero-names-bottom">
            <span className="hero-name hero-name2">{content.hero.name2}</span>
          </div>
        </div>
        <p className="hero-date">{content.hero.date}</p>
      </div>

      <div className="hero-open-box">
        <div className="hero-open-inner">
          <p className="hero-dear">{content.hero.dear}</p>
          <p className="hero-apology">{content.hero.apologyText}</p>
          <div id="tombol-buka" className="hero-open-btn" onClick={onOpen}>
            <span>{content.hero.openButton}</span>
          </div>
        </div>
      </div>

      <div className="scroll" style={{ display: 'none' }}>
        <i className="fas fa-angle-up"></i>
      </div>
    </div>
  )
}
