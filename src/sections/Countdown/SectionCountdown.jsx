import { useState, useEffect, useMemo } from 'react'
import './countdown.css'

function pad(n) { return String(n).padStart(2, '0') }

function coupleNames(content) {
  const h = content.hero || {}
  return [h.name1, h.connector, h.name2].filter(Boolean).join(' ') || 'The Couple'
}

function buildGCalUrl(content) {
  const date = content.countdown?.date || ''
  if (!date) return '#'
  const names = coupleNames(content)
  const location = content.event?.ceremony?.mapsUrl || content.event?.reception?.mapsUrl || ''
  const start = new Date(date)
  const end = new Date(start.getTime() + 3 * 3600000)
  const fmt = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `The Wedding of ${names}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: 'Aktifkan peringatan 1 hari sebelumnya.',
    location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default function SectionCountdown({ content }) {
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00' })
  const cd = content.countdown
  const gcalHref = useMemo(() => buildGCalUrl(content), [content])

  useEffect(() => {
    const targetTs = new Date(cd.date).getTime()
    function tick() {
      const diff = targetTs - Date.now()
      if (diff <= 0) { setTime({ d: '00', h: '00', m: '00', s: '00' }); return }
      setTime({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [cd.date])

  return (
    <div className="section-countdown child">
      <div className="cd-body">

        <div className="cd-top" data-aos="fade-up" data-aos-delay="100" data-aos-duration="900">
          <h2 className="cd-message">{cd.message}</h2>
          <p className="cd-names-date">
            <span className="cd-names">{coupleNames(content)}</span>
            <span className="cd-dot-sep">·</span>
            <span className="cd-date">{content.hero.date}</span>
          </p>
        </div>

        <div className="cd-timer" data-aos="fade-up" data-aos-delay="250" data-aos-duration="900">
          <div className="cd-unit">
            <span className="cd-digits">{time.d}</span>
            <span className="cd-label">Hari</span>
          </div>
          <span className="cd-sep">:</span>
          <div className="cd-unit">
            <span className="cd-digits">{time.h}</span>
            <span className="cd-label">Jam</span>
          </div>
          <span className="cd-sep">:</span>
          <div className="cd-unit">
            <span className="cd-digits">{time.m}</span>
            <span className="cd-label">Menit</span>
          </div>
          <span className="cd-sep">:</span>
          <div className="cd-unit">
            <span className="cd-digits">{time.s}</span>
            <span className="cd-label">Detik</span>
          </div>
        </div>

        <div className="cd-save-wrap" data-aos="fade" data-aos-delay="400" data-aos-duration="800">
          <a
            className="cd-save-btn"
            href={gcalHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-calendar-plus" />
            <span>Save the Date</span>
          </a>
        </div>

      </div>
    </div>
  )
}
