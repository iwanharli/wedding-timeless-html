import { useState, useEffect, useRef } from 'react'
import { apiUrl } from '../../lib/api'
import './wishes.css'

const AUTO_INTERVAL = 4000

export default function SectionWishes() {
  const [wishes, setWishes] = useState([])
  const [index, setIndex]   = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    fetch(apiUrl('/api/rsvp/public'))
      .then(r => r.ok ? r.json() : [])
      .then(data => setWishes(data))
      .catch(() => {})
  }, [])

  const total = wishes.length

  useEffect(() => {
    if (total <= 1) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % total)
      setAnimKey(k => k + 1)
    }, AUTO_INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [total])

  function go(dir) {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % total)
      setAnimKey(k => k + 1)
    }, AUTO_INTERVAL)
    setIndex(i => (i + dir + total) % total)
    setAnimKey(k => k + 1)
  }

  const current = wishes[index]

  return (
    <div className="section-wishes child">
      <div
        className="wishes-inner"
        data-aos="fade"
        data-aos-offset="0"
        data-aos-delay="200"
        data-aos-duration="1000"
      >
        {total === 0 ? (
          <p className="wishes-empty">Jadilah yang pertama memberikan ucapan.</p>
        ) : (
          <>
            <div className="wishes-card" key={animKey}>
              <span className="wishes-quote-mark">"</span>
              <p className="wishes-message">{current.message}</p>
              <div className="wishes-author">
                <span className="wishes-author-line" />
                <span className="wishes-name">{current.name}</span>
              </div>
            </div>

            <div className="wishes-footer">
              <button
                className={`wishes-arrow${total <= 1 ? ' wishes-arrow--disabled' : ''}`}
                onClick={total > 1 ? () => go(-1) : undefined}
              >
                <i className="fas fa-chevron-left" />
              </button>
              <div className="wishes-counter-wrap">
                <span className="wishes-counter">
                  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                {total > 1 && (
                  <div className="wishes-progress-bar">
                    <div className="wishes-progress-fill" key={`${animKey}-progress`} />
                  </div>
                )}
              </div>
              <button
                className={`wishes-arrow${total <= 1 ? ' wishes-arrow--disabled' : ''}`}
                onClick={total > 1 ? () => go(1) : undefined}
              >
                <i className="fas fa-chevron-right" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
