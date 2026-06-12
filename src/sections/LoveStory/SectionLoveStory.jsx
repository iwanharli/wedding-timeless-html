import { imgSrc, handleImgError } from '../../lib/image'
import './love-story.css'

export default function SectionLoveStory({ content }) {
  const chapters = content.loveStory.chapters || []

  return (
    <>
      {chapters.map((chapter, i) => (
        <div
          id={i === 0 ? 'lovestory' : undefined}
          className="section-lovestory child"
          key={i}
        >
          {i === 0 && (
            <div className="ls-header" data-aos="fade-up" data-aos-duration="500">
              <span className="ls-section-label">{content.loveStory.sectionLabel || 'Love Story'}</span>
              <h2 className="ls-section-title">{content.loveStory.sectionTitle || 'Our Journey Together'}</h2>
              <div className="ls-header-line" />
            </div>
          )}

          <div className="ls-chapter" data-aos="fade-up" data-aos-delay="40" data-aos-duration="500">
            <div className="ls-chapter-top">
              <span className="ls-chapter-index">{String(i + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</span>
              <span className="ls-chapter-date">{chapter.date}</span>
            </div>
            <div className="ls-chapter-photo-wrap">
              <img src={imgSrc(chapter.image)} onError={handleImgError} className="ls-chapter-photo" loading="lazy" alt="" />
            </div>
            <div className="ls-chapter-body">
              <h3 className="ls-chapter-title" data-aos="ls-title-in" data-aos-delay="60" data-aos-duration="500">{chapter.title}</h3>
              <p className="ls-chapter-desc" style={{ whiteSpace: 'pre-line' }}>{chapter.description}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
