export default function SectionLoveStory({ content }) {
  const ch = content.loveStory.chapters
  return (
    <>
      {/* Page 1: Chapters 0 & 1 */}
      <div id="lovestory" className="section-lovestory child">
        {/* Chapter 0: text left | image right */}
        <div className="ls-row">
          <div className="ls-col ls-text">
            <h3 className="ls-date">{ch[0].date}</h3>
            <p
              className="ls-desc"
              data-aos="fade"
              data-aos-offset="0"
              data-aos-delay="200"
              data-aos-duration="800"
            >
              {ch[0].description}
            </p>
          </div>
          <div className="ls-col ls-img ls-img--right">
            <p className="ls-chapter-title">The Journey of Two Souls in Love</p>
            <img
              src="/assets/images/Timeless-00023.jpg"
              className="ls-photo"
              loading="lazy"
              alt=""
            />
          </div>
        </div>

        {/* Chapter 1: image left | text right */}
        <div className="ls-row ls-row--reverse">
          <div className="ls-col ls-img ls-img--overlap">
            <img
              src="/assets/images/Timeless-00021.jpg"
              className="ls-photo"
              loading="lazy"
              alt=""
            />
            <img
              src="/assets/images/Black-Vintage-Photo-Collage-Instagram-Portrait-2-Medium.png"
              className="ls-deco-overlay"
              loading="lazy"
              alt=""
            />
          </div>
          <div className="ls-col ls-text ls-text--last">
            <h3 className="ls-date">{ch[1].date}</h3>
            <p
              className="ls-desc"
              data-aos="fade"
              data-aos-offset="0"
              data-aos-delay="200"
              data-aos-duration="800"
            >
              {ch[1].description}
            </p>
          </div>
        </div>
      </div>

      {/* Page 2: Chapter 2 collage */}
      <div className="section-lovestory child">
        <div className="ls-row ls-row--collage">
          <div className="ls-col ls-deco-col">
            <div className="ls-deco-wrap">
              <img
                src="/assets/images/footage-paper-Desain-tanpa-judul-3.jpg"
                className="ls-paper"
                loading="lazy"
                alt=""
              />
              <span className="ls-paper-title">The Journey of Two<br />Souls in Love</span>
            </div>
            <div className="ls-overlap-wrap">
              <img
                src="/assets/images/Timeless-00034-1.jpg"
                className="ls-overlap-photo"
                loading="lazy"
                alt=""
              />
            </div>
          </div>
        </div>

        <div className="ls-col ls-text">
          <h3 className="ls-date">{ch[2].date}</h3>
          <p
            className="ls-desc"
            data-aos="fade"
            data-aos-offset="0"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            {ch[2].description}
          </p>
        </div>
      </div>
    </>
  )
}
