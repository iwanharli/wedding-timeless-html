import { useState, useEffect, useMemo } from 'react'

function pad(n) { return String(n).padStart(2, '0') }

function toICSDate(isoString) {
  const d = new Date(isoString)
  const y = d.getFullYear()
  const mo = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const h = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${y}${mo}${day}T${h}${mi}00`
}

function buildICS(content) {
  const names = content.thankYou?.message || 'The Couple'
  const date = content.countdown?.date || ''
  const location = content.event?.ceremony?.mapsUrl || content.event?.reception?.mapsUrl || ''
  const start = date ? toICSDate(date) : ''
  const end = date ? toICSDate(new Date(new Date(date).getTime() + 3 * 3600000).toISOString()) : ''
  const summary = `The Wedding of ${names}`
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:wedding-${Date.now()}@groovepublic`,
    `SUMMARY:${summary}`,
    start ? `DTSTART;TZID=Asia/Jakarta:${start}` : '',
    end   ? `DTEND;TZID=Asia/Jakarta:${end}`   : '',
    location ? `LOCATION:${location}` : '',
    'DESCRIPTION:Aktifkan peringatan 15 menit sebelumnya.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')
  return 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics)
}

export default function SectionCountdown({ content }) {
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00' })
  const cd = content.countdown
  const icsHref = useMemo(() => buildICS(content), [content])

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

  const bgImage = cd.image || '/assets/images/Timeless-00046.jpg'

  return (
    <div
      className="section-countdown child"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="cd-body">

        <div className="cd-top" data-aos="fade-up" data-aos-delay="100" data-aos-duration="900">
          <h2 className="cd-message">{cd.message}</h2>
          <p className="cd-names-date">
            <span className="cd-names">{content.thankYou.message}</span>
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
            download="save-the-date.ics"
            href={icsHref}
          >
            <i className="fas fa-calendar-plus" />
            <span>Save the Date</span>
          </a>
        </div>

      </div>
    </div>
  )
}
