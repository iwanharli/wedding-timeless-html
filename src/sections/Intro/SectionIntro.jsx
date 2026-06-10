import Confetti from './Confetti'
import './intro.css'

export default function SectionIntro({ content }) {
  return (
    <div id="pertama" className="section-intro child">
      <div id="home"></div>

      <Confetti />

      {/* Vignette overlay for text contrast */}
      <div className="intro-vignette" />

      <div className="intro-content">

        <p className="intro-invite-title" data-aos="fade-up" data-aos-delay="0" data-aos-duration="900">{content.hero.inviteTitle}</p>

        <div className="intro-ornament" data-aos="fade-up" data-aos-delay="100" data-aos-duration="900">
          <span className="intro-orn-line" />
          <span className="intro-orn-diamond" />
          <span className="intro-orn-line" />
        </div>

        <div className="intro-names" data-aos="fade-up" data-aos-delay="200" data-aos-duration="900">
          <span className="intro-name intro-name1">{content.hero.name1}</span>
          <span className="intro-name-connector">{content.hero.connector}</span>
          <span className="intro-name intro-name2">{content.hero.name2}</span>
        </div>

        <div className="intro-ornament" data-aos="fade-up" data-aos-delay="300" data-aos-duration="900">
          <span className="intro-orn-line" />
          <span className="intro-orn-diamond" />
          <span className="intro-orn-line" />
        </div>

        <p className="intro-date" data-aos="fade-up" data-aos-delay="400" data-aos-duration="900">{content.hero.date}</p>

        {content.hero.vow && (
          <p className="intro-vow" style={{ whiteSpace: 'pre-line' }} data-aos="fade-up" data-aos-delay="500" data-aos-duration="900">
            {content.hero.vow}
          </p>
        )}

      </div>

      <div
        className="intro-scroll-hint"
        role="button"
        tabIndex={0}
        aria-label="Scroll ke bagian berikutnya"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
          }
        }}
      >
        <i className="fas fa-chevron-up intro-scroll-icon" />
      </div>

      <div className="scroll"></div>
    </div>
  )
}
