export default function SectionBride({ content }) {
  const b = content.bride
  return (
    <div className="section-profile section-bride child">
      <div className="profile-card">
        <h3
          className="profile-role profile-role--left"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {b.title}
        </h3>

        <div className="profile-photo-wrap">
          <img src={b.image} className="profile-photo" alt="" />
        </div>

        <h2
          className="profile-firstname"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {b.firstName}
        </h2>

        <h2
          className="profile-lastname profile-lastname--left"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {b.lastName}
        </h2>

        <div className="profile-parents">
          <p className="profile-relation">{b.relation}</p>
          <p
            className="profile-relation-desc"
            data-aos="fade"
            data-aos-offset="0"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            {b.relationDescription}
          </p>
        </div>

        <a
          className="profile-instagram-btn"
          href="#"
          rel="noopener"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="300"
          data-aos-duration="1000"
        >
          <i className="fab fa-instagram" aria-hidden="true"></i>
          <span>{b.instagramUsername}</span>
        </a>
      </div>
    </div>
  )
}
