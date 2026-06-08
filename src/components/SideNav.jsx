import { useState, useEffect, useRef } from 'react'

const NAV_LABELS = {
  intro:        'Home',
  profileIntro: 'Profile',
  groom:        'Mempelai Pria',
  bride:        'Mempelai Wanita',
  loveStory:    'Love Story',
  countdown:    'Countdown',
  event:        'Wedding Event',
  livestream:   'Livestream',
  dressCode:    'Dress Code',
  rsvp:         'RSVP',
  wishes:       'Ucapan',
  gift:         'Wedding Gift',
  gallery:      'Gallery',
  thankYou:     'Thank You',
}

const SECTION_SELECTOR = {
  intro:        '#pertama',
  profileIntro: '.section-profile-intro',
  groom:        '#profile',
  bride:        '.section-bride',
  loveStory:    '#lovestory',
  countdown:    '.section-countdown',
  event:        '#weddingevent',
  livestream:   '#livestreaming',
  dressCode:    '.section-dress-code',
  rsvp:         '#rsvp',
  wishes:       '.section-wishes',
  gift:         '#weddinggift',
  gallery:      '#gallery',
  thankYou:     '#section-thankyou',
}

function scrollToSection(sectionId) {
  const selector = SECTION_SELECTOR[sectionId]
  if (!selector) return
  const el = document.querySelector(selector)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function SideNav({ content, isOpen: invitationOpen }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef(null)
  const audioUrl   = content.audio?.track
  const startTime  = parseFloat(content.audio?.startTime) || 0
  const endTime    = parseFloat(content.audio?.endTime)   || 0

  useEffect(() => {
    if (!audioUrl) return
    const player = new Audio()
    player.preload = 'none'
    player.loop = !endTime  // only native-loop when no end marker
    if (startTime) player.currentTime = startTime
    playerRef.current = player

    function onTimeUpdate() {
      if (endTime > 0 && player.currentTime >= endTime) {
        player.currentTime = startTime
      }
    }
    player.addEventListener('timeupdate', onTimeUpdate)
    return () => { player.pause(); player.removeEventListener('timeupdate', onTimeUpdate) }
  }, [audioUrl, startTime, endTime])

  function playAudio() {
    const player = playerRef.current
    if (!player || !audioUrl) return
    if (!player.src || (!player.src.endsWith(audioUrl) && !player.src.includes(audioUrl.replace(/^\//, '')))) {
      player.src = audioUrl
      if (startTime) player.currentTime = startTime
    }
    player.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }

  function pauseAudio() {
    playerRef.current?.pause()
    setIsPlaying(false)
  }

  useEffect(() => {
    if (invitationOpen) playAudio()
  }, [invitationOpen])

  useEffect(() => {
    function onVisibility() { document.hidden ? pauseAudio() : invitationOpen && playAudio() }
    function onBlur()  { pauseAudio() }
    function onFocus() { if (invitationOpen) playAudio() }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }, [invitationOpen])

  if (!invitationOpen) return null

  const navItems = (content.sections || []).filter(s => s.visible !== false && SECTION_SELECTOR[s.id])

  return (
    <>
      {/* Backdrop */}
      {menuOpen && (
        <div className="snav-backdrop" onClick={() => setMenuOpen(false)} />
      )}

      {/* Floating toggle button */}
      <button
        className={`snav-toggle${menuOpen ? ' is-open' : ''}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
      </button>

      {/* Slide panel */}
      <nav className={`snav-panel${menuOpen ? ' is-open' : ''}`}>
        <div className="snav-header">
          <span className="snav-title">Menu</span>
        </div>

        <ul className="snav-list">
          {navItems.map((s, i) => (
            <li key={s.id} className="snav-item" style={{ '--i': i }}>
              <button
                className="snav-link"
                onClick={() => { scrollToSection(s.id); setMenuOpen(false) }}
              >
                <span className="snav-link-text">{NAV_LABELS[s.id] || s.label}</span>
                <i className="fas fa-arrow-right snav-link-arrow" />
              </button>
            </li>
          ))}
        </ul>

        {audioUrl && (
          <div className="snav-audio">
            <span className="snav-audio-label">Music</span>
            <button className="snav-audio-btn" onClick={isPlaying ? pauseAudio : playAudio}>
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        )}
      </nav>
    </>
  )
}
