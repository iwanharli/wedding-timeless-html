import './profile-intro.css'

export default function SectionProfileIntro({ content }) {
  const p = content.profile
  return (
    <div className="section-profile-intro child">

      {/* Gradient overlay */}
      <div className="pi-photo-overlay" />

      {/* Content pinned to bottom */}
      <div className="pi-body">
        {p.quoteSource && (
          <span className="pi-ref-badge" data-aos="fade-up" data-aos-delay="0" data-aos-duration="500">{p.quoteSource}</span>
        )}
        <p className="pi-text" data-aos="fade-up" data-aos-delay="50" data-aos-duration="500">{p.quoteText}</p>
        <div className="pi-divider" data-aos="fade-up" data-aos-delay="100" data-aos-duration="500">
          <span className="pi-divider-line" />
          <i className="fas fa-circle pi-divider-dot" />
          <span className="pi-divider-line" />
        </div>
        <h2 className="pi-names" data-aos="fade-up" data-aos-delay="150" data-aos-duration="500">
          {content.hero.name1} {content.hero.connector} {content.hero.name2}
        </h2>
      </div>

    </div>
  )
}
