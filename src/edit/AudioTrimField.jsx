import { useState, useRef, useEffect } from 'react'

function fmt(s) {
  if (!s && s !== 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function AudioTrimField({ audioUrl, startTime, endTime, onChangeStart, onChangeEnd }) {
  const audioRef = useRef(null)
  const barRef   = useRef(null)
  const [playing,  setPlaying]  = useState(false)
  const [current,  setCurrent]  = useState(0)
  const [duration, setDuration] = useState(0)

  const startSec = parseFloat(startTime) || 0
  const endSec   = parseFloat(endTime)   || 0
  const hasTrim  = startSec > 0 || (endSec > 0 && endSec < duration - 0.5)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    function onTime() {
      setCurrent(a.currentTime)
      if (endSec > 0 && a.currentTime >= endSec) {
        a.currentTime = startSec
        if (playing) a.play().catch(() => {})
        else { a.pause(); setPlaying(false) }
      }
    }
    function onMeta() { setDuration(a.duration || 0) }
    function onEnded() { setPlaying(false); a.currentTime = startSec }
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onMeta)
    a.addEventListener('ended', onEnded)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onMeta)
      a.removeEventListener('ended', onEnded)
    }
  }, [startSec, endSec, playing])

  function togglePlay() {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else {
      if (!a.src) a.src = audioUrl
      a.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  function seek(e) {
    if (!duration || !barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    if (audioRef.current) audioRef.current.currentTime = pct * duration
  }

  function markStart() {
    onChangeStart(Math.round(current * 10) / 10)
  }

  function markEnd() {
    const t = Math.round(current * 10) / 10
    onChangeEnd(t > startSec ? t : 0)
  }

  function clearTrim() {
    onChangeStart(0)
    onChangeEnd(0)
    if (audioRef.current) audioRef.current.currentTime = 0
  }

  const cPct = duration ? (current  / duration) * 100 : 0
  const sPct = duration ? (startSec / duration) * 100 : 0
  const ePct = duration ? ((endSec || duration) / duration) * 100 : 100

  if (!audioUrl) return (
    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
      Upload musik terlebih dahulu.
    </p>
  )

  return (
    <div className="atf-wrap">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* ── Player ── */}
      <div className="atf-player">
        <button type="button" className="atf-play" onClick={togglePlay}>
          <i className={`fas ${playing ? 'fa-pause' : 'fa-play'}`} />
        </button>

        <div className="atf-bar-wrap">
          <div className="atf-bar" ref={barRef} onClick={seek}>
            <div className="atf-dim"   style={{ left: 0, width: `${sPct}%` }} />
            <div className="atf-range" style={{ left: `${sPct}%`, width: `${ePct - sPct}%` }} />
            <div className="atf-dim"   style={{ left: `${ePct}%`, width: `${100 - ePct}%` }} />
            <div className="atf-head"  style={{ left: `${cPct}%` }} />
          </div>
          <div className="atf-times">
            <span>{fmt(current)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>

      {/* ── Mark buttons ── */}
      <div className="atf-marks">
        <button type="button" className="atf-mark-btn atf-mark-btn--start" onClick={markStart}>
          <i className="fas fa-step-backward" />
          <div className="atf-mark-info">
            <span className="atf-mark-label">Tandai START</span>
            <span className="atf-mark-time">{startSec > 0 ? fmt(startSec) : '—'}</span>
          </div>
        </button>

        <div className="atf-mark-mid">
          {hasTrim
            ? <span className="atf-range-pill"><i className="fas fa-redo-alt" /> {fmt(startSec)} → {endSec > 0 ? fmt(endSec) : 'akhir'}</span>
            : <span className="atf-range-empty">Play → tandai</span>
          }
        </div>

        <button type="button" className="atf-mark-btn atf-mark-btn--end" onClick={markEnd}>
          <div className="atf-mark-info">
            <span className="atf-mark-label">Tandai END</span>
            <span className="atf-mark-time">{endSec > 0 ? fmt(endSec) : '—'}</span>
          </div>
          <i className="fas fa-step-forward" />
        </button>
      </div>

      {hasTrim && (
        <button type="button" className="atf-reset" onClick={clearTrim}>
          <i className="fas fa-times" /> Reset trim
        </button>
      )}
    </div>
  )
}
