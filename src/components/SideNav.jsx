import { useState, useEffect, useRef } from 'react'

export default function SideNav({ content, isOpen: invitationOpen }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const playerRef = useRef(null)
  const audioUrl = content.audio.track

  useEffect(() => {
    const player = new Audio()
    player.preload = 'none'
    player.loop = true
    playerRef.current = player

    return () => {
      player.pause()
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function playAudio() {
    const player = playerRef.current
    if (!player) return
    if (player.src !== window.location.origin + audioUrl && !player.src.includes(audioUrl.replace('/', ''))) {
      player.src = audioUrl
    }
    player.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }

  function pauseAudio() {
    const player = playerRef.current
    if (!player) return
    player.pause()
    setIsPlaying(false)
  }

  // Auto-play when invitation opens
  useEffect(() => {
    if (invitationOpen) {
      playAudio()
    }
  }, [invitationOpen])

  // Visibility & focus handlers
  useEffect(() => {
    function onVisibilityChange() {
      if (document.hidden) pauseAudio()
      else if (invitationOpen) playAudio()
    }
    function onBlur() { pauseAudio() }
    function onFocus() { if (invitationOpen) playAudio() }
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }, [invitationOpen])

  function toggleMenu() {
    setMenuOpen(prev => !prev)
  }

  const areaClasses = [
    'mdw-side-menu-area',
    'section-song',
    menuOpen ? 'open open-instant open-arrow anim' : 'anim',
    isVisible ? 'is-visible' : '',
    !invitationOpen ? 'hidden' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={areaClasses} id="nav-side-area">
      {/* Hamburger */}
      <div
        className="mdw-side-menu-button navsound-button"
        id="navsound-button"
        onClick={toggleMenu}
      >
        <div className={`nav-btn${menuOpen ? ' open' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 7.5" style={{ width: '21px', height: '7.5px', fill: 'currentColor' }}>
            <path d="M10.5,1.5H.3c-.2,0-.3,0-.3-.2V.2C0,0,0,0,.2,0H20.7c.2,0,.3,0,.3.3a1.7,1.7,0,0,0,0,1c0,.2-.1.2-.2.2H10.5Z"/>
            <path d="M10.5,7.5H.2c-.1,0-.2,0-.2-.2V6.1H20.7c.2,0,.3,0,.3.2a4,4,0,0,0,0,1.1c0,.2-.1.2-.2.2H10.5Z"/>
          </svg>
        </div>
        <div className={`nav-btn navsound-button${menuOpen ? ' open' : ''}`}>
          <a className="btn" href="#" onClick={e => e.preventDefault()}>
            <span className="nav-btn-text">CLOSE</span>
          </a>
        </div>
      </div>

      {/* Side menu panel */}
      <div className="mdw-side-menu">
        <ul className="nav-list">
          {[
            { href: '#home', label: 'Home' },
            { href: '#profile', label: 'Profile' },
            { href: '#lovestory', label: 'Love Story' },
            { href: '#weddingevent', label: 'Wedding Event' },
            { href: '#rsvp', label: 'RSVP' },
            { href: '#weddinggift', label: 'Wedding Gift' },
            { href: '#gallery', label: 'Gallery' },
          ].map((item, i) => (
            <li
              className="nav-item"
              key={item.href}
              style={{ '--index': i }}
              onClick={() => setMenuOpen(false)}
            >
              <a href={item.href}>
                <span className="nav-icon"><i className="fas fa-arrow-right"></i></span>
                <span className="nav-text">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Audio controls */}
        <div className={`navsound${menuOpen ? ' show' : ''}`}>
          <div className="play-music" style={{ display: isPlaying ? 'none' : 'inline' }}>
            <a className="btn" role="button" onClick={playAudio}>
              <span className="btn-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 117.9 130.8">
                  <g><g><g><g>
                    <path d="M13.8,130.8H9.7c-.2-.4-.7-.4-1-.4a10.4,10.4,0,0,1-6.4-5.2A20.9,20.9,0,0,1,0,115V15.7A28.2,28.2,0,0,1,.8,9.2C2.3,3.1,6.8-.3,12.9,0A19.5,19.5,0,0,1,22,3.2l86.6,49.7a21.1,21.1,0,0,1,5.6,4.2c4.7,4.8,4.9,10.8.7,15.9a24,24,0,0,1-6.4,5L22,127.6a27.5,27.5,0,0,1-4.9,2.3Z"></path>
                  </g></g></g></g>
                </svg>
              </span>
            </a>
          </div>
          <div className="off-music" style={{ display: isPlaying ? 'inline' : 'none' }}>
            <a className="btn btn-link" role="button" onClick={pauseAudio}>
              <span className="btn-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118.8 255.4">
                  <g><g><g>
                    <path d="M32,127.7V238.8c0,11.1-9.2,18.5-19.6,16.2C5.8,253.5.9,247.8.1,240.6c-.1-1.1-.1-2.2-.1-3.3V18.2C0,13.9.7,9.8,3.4,6.3A15.9,15.9,0,0,1,21.2.9,15.7,15.7,0,0,1,32,15.9c.1,18.6,0,37.2,0,55.8Z"></path>
                    <path d="M86.8,127.6c0-37-.1-74.1,0-111.1C86.8,3.8,99.6-3.9,110.4,2a15.9,15.9,0,0,1,8.3,12.6c.1,1.1.1,2.3.1,3.4V237.5c0,9.1-4.6,15.6-12.2,17.4a15.9,15.9,0,0,1-19.8-15.6c-.1-11.4,0-22.9,0-34.3Z"></path>
                  </g></g></g>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Hidden audio URL reference (not rendered visibly) */}
      <div className="link-mp3" style={{ display: 'none' }}>
        <div className="audio-url">
          <p>{audioUrl}</p>
        </div>
      </div>
    </div>
  )
}
