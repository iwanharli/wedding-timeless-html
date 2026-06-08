export default function SectionProfileIntro({ content }) {
  const p = content.profile
  return (
    <div className="section-profile-intro child">

      {/* Full-bleed photo */}
      <img src={p.coupleImage} className="pi-photo" alt="" data-aos="fade" data-aos-duration="1200" />

      {/* Gradient overlay */}
      <div className="pi-photo-overlay" />

      {/* Content pinned to bottom */}
      <div className="pi-body" data-aos="fade-up" data-aos-delay="200" data-aos-duration="900">
        {p.quoteSource && (
          <span className="pi-ref-badge">{p.quoteSource}</span>
        )}
        <p className="pi-text">{p.quoteText}</p>
        <div className="pi-divider">
          <span className="pi-divider-line" />
          <i className="fas fa-circle pi-divider-dot" />
          <span className="pi-divider-line" />
        </div>
        <h2 className="pi-names">
          {content.hero.name1} {content.hero.connector} {content.hero.name2}
        </h2>
      </div>

    </div>
  )
}
