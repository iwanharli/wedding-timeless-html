export default function SectionThankYou({ content }) {
  const ty = content.thankYou
  return (
    <div id="section-thankyou" className="section-thankyou child">
      <div className="thankyou-top">
        <h2
          className="thankyou-title"
          data-aos="fade"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {ty.title}
        </h2>
        <p
          className="thankyou-message"
          data-aos="fade"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          It is a pleasure and honor for us, if you are willing to attend and give us your blessing.
        </p>
        <h2
          className="thankyou-names"
          data-aos="fade"
          data-aos-delay="500"
          data-aos-duration="2000"
        >
          {ty.message}
        </h2>
      </div>

      <div className="thankyou-bottom">
        <div style={{ textAlign: 'center' }}>
          <p className="thankyou-credit">CREATED BY GROOVE PUBLIC</p>
          <div className="thankyou-contacts">
            <a className="thankyou-contact-link" href="https://wa.link/amk9ua" target="_blank" rel="noopener">
              <i className="fab fa-whatsapp" aria-hidden="true"></i>
              <span>+62 813-2757-7133</span>
            </a>
            <a className="thankyou-contact-link" href="https://www.instagram.com/groovepublic.id" target="_blank" rel="noopener">
              <i className="fab fa-instagram" aria-hidden="true"></i>
              <span>GROOVEPUBLIC.ID</span>
            </a>
            <a className="thankyou-contact-link" href="https://www.groovepublic.com" target="_blank" rel="noopener">
              <i className="fas fa-globe" aria-hidden="true"></i>
              <span>GROOVEPUBLIC.COM</span>
            </a>
          </div>
          <p className="thankyou-copyright">&copy; All rights reserved by groovepublic</p>
        </div>
      </div>
    </div>
  )
}
