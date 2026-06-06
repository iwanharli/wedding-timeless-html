export default function SectionGroom({ content }) {
  const g = content.groom
  return (
    <div id="profile" className="section-profile child">
      <div className="profile-card">
        <h3
          className="profile-role"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {g.title}
        </h3>

        <div className="profile-photo-wrap">
          <img src={g.image} className="profile-photo" alt="" />
        </div>

        <h2
          className="profile-firstname"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {g.firstName}
        </h2>

        <h2
          className="profile-lastname"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {g.lastName}
        </h2>

        <div className="profile-parents">
          <p className="profile-relation profile-relation--left">{g.relation}</p>
          <p
            className="profile-relation-desc"
            data-aos="fade"
            data-aos-offset="0"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            {g.relationDescription}
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
          <span>{g.instagramUsername}</span>
        </a>
      </div>
    </div>
  )
}
