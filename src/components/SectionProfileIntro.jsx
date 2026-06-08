export default function SectionProfileIntro({ content }) {
  const p = content.profile
  return (
    <div className="section-profile-intro child">

      <div className="pi-photo-wrap" data-aos="fade" data-aos-duration="1000">
        <img src={p.coupleImage} className="pi-photo" alt="" />
        <div className="pi-photo-overlay" />
        {p.biblicalReference && (
          <span className="pi-ref-badge">{p.biblicalReference}</span>
        )}
      </div>

      <div className="pi-body" data-aos="fade-up" data-aos-delay="150" data-aos-duration="800">
        <p className="pi-text">{p.biblicalText}</p>
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
