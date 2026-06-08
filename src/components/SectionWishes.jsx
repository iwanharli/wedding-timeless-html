import { useState, useEffect } from 'react'

export default function SectionWishes() {
  const [wishes, setWishes] = useState([])
  const [index, setIndex]   = useState(0)

  useEffect(() => {
    fetch('/api/rsvp/public')
      .then(r => r.ok ? r.json() : [])
      .then(data => setWishes(data))
      .catch(() => {})
  }, [])

  const total = wishes.length

  function prev() { setIndex(i => (i - 1 + total) % total) }
  function next() { setIndex(i => (i + 1) % total) }

  const current = wishes[index]

  return (
    <div className="section-wishes child">
      <div id="komentar-navigation">
        <a
          className={`wishes-nav-btn${total <= 1 ? ' wishes-nav-btn--disabled' : ''}`}
          id="prev-btn"
          role="button"
          onClick={total > 1 ? prev : undefined}
        >
          <i className="fas fa-arrow-left" aria-hidden="true"></i>
          PREV
        </a>
        <a
          className={`wishes-nav-btn${total <= 1 ? ' wishes-nav-btn--disabled' : ''}`}
          id="next-btn"
          role="button"
          onClick={total > 1 ? next : undefined}
        >
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
        {total === 0 ? (
          <p className="wishes-empty">Jadilah yang pertama memberikan ucapan.</p>
        ) : (
          <>
            <p className="wishes-name">{current.name}</p>
            <p className="wishes-message">"{current.message}"</p>
            <p className="wishes-counter">{index + 1} / {total}</p>
          </>
        )}
      </div>

      <div id="komentar-navigation-sticky"></div>
    </div>
  )
}
