export default function SectionDressCode({ content }) {
  const dc = content.dressCode
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
          {dc.title}
        </h2>

        <div className="dc-swatches">
          {dc.colors.map((color, i) => (
            <i
              key={i}
              className="fas fa-circle dc-swatch"
              style={{ color: color.hex }}
              title={color.label || color.hex}
              data-aos="zoom-in"
              data-aos-delay={200 + i * 200}
              data-aos-duration="1000"
            ></i>
          ))}
        </div>

        <p
          className="dc-text"
          style={{ whiteSpace: 'pre-line' }}
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="2000"
        >
          {dc.text}
        </p>
      </div>
    </div>
  )
}
