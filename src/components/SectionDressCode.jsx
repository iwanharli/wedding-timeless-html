export default function SectionDressCode({ content }) {
  return (
    <div className="section-dress-code child">
      <div
        className="dc-inner"
        data-aos="fade"
        data-aos-offset="0"
        data-aos-delay="100"
        data-aos-duration="1000"
      >
        <h2
          className="dc-title"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          {content.rsvp.guestAttendanceTitle}
        </h2>

        <div className="dc-swatches">
          <i className="fas fa-circle dc-swatch" style={{ color: '#dbd6d3' }} data-aos="zoom-in" data-aos-delay="200" data-aos-duration="1000"></i>
          <i className="fas fa-circle dc-swatch" style={{ color: '#2a211c' }} data-aos="zoom-in" data-aos-delay="400" data-aos-duration="1000"></i>
          <i className="fas fa-circle dc-swatch" style={{ color: '#806f5f' }} data-aos="zoom-in" data-aos-delay="600" data-aos-duration="1000"></i>
          <i className="fas fa-circle dc-swatch" style={{ color: '#bca8a0' }} data-aos="zoom-in" data-aos-delay="800" data-aos-duration="1000"></i>
        </div>

        <p
          className="dc-text"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="2000"
        >
          WE KINDLY ENCOURAGE OUR GUESTS TO<br />
          WEAR THESE COLORS FOR OUR SPECIAL DAY
        </p>
      </div>
    </div>
  )
}
