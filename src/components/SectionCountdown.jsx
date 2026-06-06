import { useState, useEffect } from 'react'

function pad(n) { return String(n).padStart(2, '0') }

export default function SectionCountdown({ content }) {
  const targetTs = 1729310400 * 1000
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00' })

  useEffect(() => {
    function tick() {
      const diff = targetTs - Date.now()
      if (diff <= 0) {
        setTime({ d: '00', h: '00', m: '00', s: '00' })
        return
      }
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
  }, [])

  return (
    <div className="section-countdown child">
      <div className="cd-main-wrap">
        <img
          src="/assets/images/Timeless-00046.jpg"
          className="cd-main-photo"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="200"
          data-aos-duration="800"
          loading="lazy"
          alt=""
        />
        <div
          className="cd-countdown"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="600"
          data-aos-duration="800"
        >
          <div className="cd-items">
            <div className="cd-item">
              <span className="cd-digits cd-days">{time.d}</span>
              <span className="cd-label">Hari</span>
            </div>
            <div className="cd-item">
              <span className="cd-digits cd-hours">{time.h}</span>
              <span className="cd-label">Jam</span>
            </div>
            <div className="cd-item">
              <span className="cd-digits cd-minutes">{time.m}</span>
              <span className="cd-label">Menit</span>
            </div>
            <div className="cd-item">
              <span className="cd-digits cd-seconds">{time.s}</span>
              <span className="cd-label">Detik</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="cd-photos-row"
        data-aos="fade"
        data-aos-offset="0"
        data-aos-delay="200"
        data-aos-duration="1000"
      >
        <div className="cd-photo-wrap">
          <img
            src="/assets/images/footage-paper-Desain-tanpa-judul-3.jpg"
            className="cd-small-photo"
            loading="lazy"
            alt=""
          />
          <span className="cd-paper-name">{content.thankYou.message}</span>
          <span className="cd-paper-date">{content.hero.date}</span>
        </div>
        <div className="cd-photo-wrap">
          <img
            src="/assets/images/Timeless-00041-1.jpg"
            className="cd-small-photo"
            loading="lazy"
            alt=""
          />
        </div>
      </div>

      <h2
        className="cd-message"
        data-aos="fade"
        data-aos-offset="0"
        data-aos-delay="200"
        data-aos-duration="800"
      >
        <span>{content.countdown.message}</span>
      </h2>

      <div className="cd-save-wrap">
        <a
          className="cd-save-btn"
          download="Hanson-amp-Catherine"
          href="data:text/calendar;charset=utf8;base64,QkVHSU46VkNBTEVOREFSDQpWRVJTSU9OOjIuMA0KQkVHSU46VkVWRU5UDQpVSUQ6Mzc4YzMwNjM3YjNkMDcxNzk3ZjI1MWMxZTY3YTBhMmINClNVTU1BUlk6VGhlIFdlZGRpbmcgb2YgSGFuc29uICZhbXBcOyBDYXRoZXJpbmUNCkRUU1RBUlQ7VFpJRD1Bc2lhL0pha2FydGE6MjAyNDEyMDVUMTQzMDAwDQpEVEVORDtUWklEPUFzaWEvSmFrYXJ0YToyMDI0MTIwNlQxNDMwMDANCkRFU0NSSVBUSU9OOjxwPkFrdGlma2FuIHBlcmluZ2F0YW4gYXBhYmlsYSBiZWx1bSBha3RpZiBzZWNhcmEgYmF3YWFuLiAoYXR1ciAxNSBtZW5pdCBzZWJlbHVtbnlhXCwgYXRhdSBzZXN1YWlrYW4gbGFnaSk8L3A+PHA+RW5hYmxlIGFsZXJ0cyBpZiB0aGV5IGFyZSBub3QgYWxyZWFkeSBhY3RpdmUgYnkgZGVmYXVsdC4gKHNldCAxNSBtaW51dGVzIHByZXZpb3VzbHlcLCBvciBhZGp1c3QgYWdhaW4pPC9wPg0KTE9DQVRJT046aHR0cHM6Ly9tYXBzLmFwcC5nb28uZ2wvZVE3S1FoQmNKa0VaZEdEdDcNCkVORDpWRVZFTlQNCkVORDpWQ0FMRU5EQVI="
          target="_blank"
          rel="nofollow"
        >
          <i className="fas fa-arrow-right" aria-hidden="true"></i>
          Save the date
        </a>
      </div>
    </div>
  )
}
