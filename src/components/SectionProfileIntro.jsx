export default function SectionProfileIntro({ content }) {
  return (
    <div className="section-profile-intro child">
      <div className="profile-intro-inner">
        <h2
          className="profile-biblical-ref"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {content.profile.biblicalReference}
        </h2>

        <div className="profile-image-wrap">
          <img
            src={content.profile.coupleImage}
            className="profile-preview-img"
            alt=""
          />
        </div>

        <p
          className="profile-biblical-text"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {content.profile.biblicalText}
        </p>

        <h2
          className="profile-couple-names"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="500"
          data-aos-duration="1000"
        >
          <span>{content.hero.name1} {content.hero.connector} {content.hero.name2}</span>
        </h2>
      </div>
    </div>
  )
}
