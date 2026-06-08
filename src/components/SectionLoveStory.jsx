function ChapterRow({ chapter, reverse }) {
  const text = (
    <div className={`ls-col ls-text${reverse ? ' ls-text--last' : ''}`}>
      <h3 className="ls-date">{chapter.date}</h3>
      <p
        className="ls-desc"
        data-aos="fade"
        data-aos-offset="0"
        data-aos-delay="200"
        data-aos-duration="800"
      >
        {chapter.description}
      </p>
    </div>
  )

  const image = reverse ? (
    <div className="ls-col ls-img ls-img--overlap">
      <img src={chapter.image} className="ls-photo" loading="lazy" alt="" />
      <img
        src="/assets/images/Black-Vintage-Photo-Collage-Instagram-Portrait-2-Medium.png"
        className="ls-deco-overlay"
        loading="lazy"
        alt=""
      />
    </div>
  ) : (
    <div className="ls-col ls-img ls-img--right">
      <p className="ls-chapter-title">{chapter.title}</p>
      <img src={chapter.image} className="ls-photo" loading="lazy" alt="" />
    </div>
  )

  return (
    <div className={`ls-row${reverse ? ' ls-row--reverse' : ''}`}>
      {reverse ? <>{image}{text}</> : <>{text}{image}</>}
    </div>
  )
}

export default function SectionLoveStory({ content }) {
  const chapters = content.loveStory.chapters || []
  const pages = []
  for (let i = 0; i < chapters.length; i += 2) {
    pages.push(chapters.slice(i, i + 2))
  }

  return (
    <>
      {pages.map((page, pageIndex) => (
        <div id={pageIndex === 0 ? 'lovestory' : undefined} className="section-lovestory child" key={pageIndex}>
          {page.map((chapter, i) => (
            <ChapterRow chapter={chapter} reverse={i % 2 === 1} key={i} />
          ))}
        </div>
      ))}
    </>
  )
}
