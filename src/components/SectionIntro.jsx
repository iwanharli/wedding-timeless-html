import Confetti from './Confetti'

export default function SectionIntro({ content }) {
  return (
    <div id="pertama" className="section-intro child">
      <div id="home"></div>

      <Confetti />

      {/* Vignette overlay for text contrast */}
      <div className="intro-vignette" />

      <div className="intro-content">

        <p className="intro-invite-title">{content.hero.inviteTitle}</p>

        <div className="intro-ornament">
          <span className="intro-orn-line" />
          <span className="intro-orn-diamond" />
          <span className="intro-orn-line" />
        </div>

        <div className="intro-names">
          <div className="intro-names-top">
            <span className="intro-name intro-name1">{content.hero.name1}</span>
            <span className="intro-name-connector">{content.hero.connector}</span>
          </div>
          <div className="intro-names-bottom">
            <span className="intro-name intro-name2">{content.hero.name2}</span>
          </div>
        </div>

        <div className="intro-ornament">
          <span className="intro-orn-line" />
          <span className="intro-orn-diamond" />
          <span className="intro-orn-line" />
        </div>

        <p className="intro-date">{content.hero.date}</p>

        {content.hero.vow && (
          <p className="intro-vow" style={{ whiteSpace: 'pre-line' }}>
            {content.hero.vow}
          </p>
        )}

      </div>

      <div className="intro-scroll-hint">
        <i className="fas fa-chevron-up intro-scroll-icon" />
      </div>

      <div className="scroll"></div>
    </div>
  )
}
