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

        <div className="dc-divider" data-aos="fade" data-aos-delay="300" data-aos-duration="800">
          <span className="dc-divider-dot" />
        </div>

        <div className="dc-swatches">
          {dc.colors.map((color, i) => (
            <div
              key={i}
              className="dc-swatch-item"
              data-aos="zoom-in"
              data-aos-delay={200 + i * 150}
              data-aos-duration="900"
            >
              <div
                className="dc-swatch"
                style={{ background: color.hex }}
                title={color.label || color.hex}
              />
              {color.label && <span className="dc-swatch-label">{color.label}</span>}
            </div>
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
