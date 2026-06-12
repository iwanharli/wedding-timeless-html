import './event.css'

export default function SectionEvent({ content }) {
  const ev = content.event

  const events = [
    { ...ev.ceremony, icon: 'fa-ring' },
    { ...ev.reception, icon: 'fa-glass-cheers' },
  ]

  return (
    <div id="weddingevent" className="section-event child">

      {/* Header */}
      <div className="ev-header" data-aos="fade" data-aos-offset="0" data-aos-duration="500">
        <span className="ev-label">Wedding Event</span>
        <div className="ev-ornament">
          <span className="ev-orn-line" />
          <i className="fas fa-circle ev-orn-dot" />
          <span className="ev-orn-line" />
        </div>
        <h2 className="ev-date">{ev.date || content.hero.date}</h2>
      </div>

      {/* Event cards — side by side */}
      <div className="ev-list" data-aos="fade-up" data-aos-offset="0" data-aos-delay="80" data-aos-duration="500">
        {events.map((e, i) => (
          <div className="ev-card" key={i}>
            <div className="ev-card-top">
              <div className="ev-card-icon">
                <i className={`fas ${e.icon}`} />
              </div>
              <div className="ev-card-body">
                <span className="ev-card-name">{e.title}</span>
                <span className="ev-card-time">{e.time}</span>
                <span className="ev-card-venue">{e.location}</span>
              </div>
              {e.mapsUrl && (
                <a className="ev-maps-btn" href={e.mapsUrl} target="_blank" rel="noopener">
                  <i className="fas fa-map-marked-alt" />
                  Maps
                </a>
              )}
            </div>
            {e.address && (
              <div className="ev-card-footer">
                <i className="fas fa-map-marker-alt" />
                <span>{e.address}</span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
