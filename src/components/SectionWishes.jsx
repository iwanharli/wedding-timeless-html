export default function SectionWishes() {
  return (
    <div className="section-wishes child">
      <div id="komentar-navigation">
        <a className="wishes-nav-btn" id="prev-btn" role="button">
          <i className="fas fa-arrow-left" aria-hidden="true"></i>
          PREV
        </a>
        <a className="wishes-nav-btn" id="next-btn" role="button">
          NEXT
          <i className="fas fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>

      <div
        id="komentar-container"
        data-aos="fade"
        data-aos-offset="0"
        data-aos-delay="300"
        data-aos-duration="1000"
        style={{ color: 'white' }}
      >
        Your wishes will be shown here.
      </div>

      <div id="komentar-navigation-sticky"></div>
    </div>
  )
}
