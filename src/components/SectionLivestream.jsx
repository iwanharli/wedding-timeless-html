export default function SectionLivestream({ content }) {
  const ls = content.livestream
  return (
    <div id="livestreaming" className="section-livestream child">
      <div className="ls9-photo-wrap">
        <img src={ls.image} className="ls9-photo" loading="lazy" alt="" />
        <div className="ls9-photo-overlay" />
        <span className="ls9-live-badge">
          <span className="ls9-live-dot" />
          LIVE
        </span>
      </div>

      <div
        className="ls9-content"
        data-aos="fade-up"
        data-aos-offset="0"
        data-aos-delay="200"
        data-aos-duration="900"
      >
        <p className="ls9-label">Streaming Event</p>
        <h2 className="ls9-title">{ls.title}</h2>
        <div className="ls9-date-row">
          <i className="fas fa-calendar-alt" />
          <span className="ls9-date">{ls.date}</span>
        </div>
        <a
          className="ls9-btn"
          role="button"
          href={ls.url || '#'}
          target={ls.url ? '_blank' : undefined}
          rel="noreferrer"
        >
          <i className="fas fa-play-circle" />
          <span>{ls.buttonText}</span>
        </a>
      </div>
    </div>
  )
}
