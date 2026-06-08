export default function SectionLivestream({ content }) {
  const ls = content.livestream
  return (
    <div id="livestreaming" className="section-livestream child">
      <div
        className="ls9-inner"
        data-aos="fade"
        data-aos-offset="0"
        data-aos-delay="200"
        data-aos-duration="3000"
      >
        <div className="ls9-photo-wrap">
          <img
            src={ls.image}
            className="ls9-photo"
            data-aos="fade"
            data-aos-offset="0"
            data-aos-delay="200"
            data-aos-duration="1000"
            loading="lazy"
            alt=""
          />
        </div>

        <h2
          className="ls9-title"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          {ls.title}
        </h2>

        <p
          className="ls9-date"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="300"
          data-aos-duration="1000"
        >
          {ls.date}
        </p>

        <a
          className="ls9-btn"
          role="button"
          href={ls.url || '#'}
          target={ls.url ? '_blank' : undefined}
          rel="noreferrer"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          <span>{ls.buttonText}</span>
        </a>
      </div>
    </div>
  )
}
