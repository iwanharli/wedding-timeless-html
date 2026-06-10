import './thankyou.css'

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
          <h1 className="ty-names">
            <span className="ty-name">{content.hero.name1}</span>
            <span className="ty-name-connector">&amp;</span>
            <span className="ty-name">{content.hero.name2}</span>
          </h1>
          {ty.note && ty.note !== 'Note!' && (
            <p className="ty-note">{ty.note}</p>
          )}
        </div>
      </div>

      <div className="ty-footer">
        <div className="ty-footer-row">
          <p className="ty-credit">CREATED BY <span style={{ textTransform: 'none' }}>RnA</span></p>
          <span className="ty-footer-dot" />
          <a className="ty-contact-link" href="https://wa.me/6281249442476" target="_blank" rel="noopener">
            <i className="fab fa-whatsapp" />
            <span>+62 812-4944-2476</span>
          </a>
        </div>
        <p className="ty-copyright">&copy; All rights reserved by <span style={{ textTransform: 'none' }}>RnA</span></p>
      </div>

    </div>
  )
}
