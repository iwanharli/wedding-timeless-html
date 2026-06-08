export default function SectionThankYou({ content }) {
  const ty = content.thankYou
  return (
    <div id="section-thankyou" className="section-thankyou child">

      <div className="ty-content">
        <div className="ty-top" data-aos="fade-up" data-aos-delay="100" data-aos-duration="900">
          <span className="ty-label">Thank You</span>
          <h2 className="ty-title">{ty.title}</h2>
        </div>

        <div className="ty-divider" data-aos="fade" data-aos-delay="300" data-aos-duration="800">
          <span className="ty-divider-line" />
          <i className="fas fa-heart ty-divider-heart" />
          <span className="ty-divider-line" />
        </div>

        <div className="ty-names-wrap" data-aos="fade-up" data-aos-delay="400" data-aos-duration="1200">
          <h1 className="ty-names">{ty.message}</h1>
          {ty.note && ty.note !== 'Note!' && (
            <p className="ty-note">{ty.note}</p>
          )}
        </div>
      </div>

      <div className="ty-footer">
        <div className="ty-footer-sep" />
        <p className="ty-credit">CREATED BY GROOVE PUBLIC</p>
        <div className="ty-contacts">
          <a className="ty-contact-link" href="https://wa.link/amk9ua" target="_blank" rel="noopener">
            <i className="fab fa-whatsapp" />
            <span>+62 813-2757-7133</span>
          </a>
          <span className="ty-contact-dot" />
          <a className="ty-contact-link" href="https://www.instagram.com/groovepublic.id" target="_blank" rel="noopener">
            <i className="fab fa-instagram" />
            <span>GROOVEPUBLIC.ID</span>
          </a>
          <span className="ty-contact-dot" />
          <a className="ty-contact-link" href="https://www.groovepublic.com" target="_blank" rel="noopener">
            <i className="fas fa-globe" />
            <span>GROOVEPUBLIC.COM</span>
          </a>
        </div>
        <p className="ty-copyright">&copy; All rights reserved by groovepublic</p>
      </div>

    </div>
  )
}
