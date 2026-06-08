import { useState, useEffect } from 'react'
import AOS from 'aos'
import { useWeddingConfig } from '../data/useWeddingConfig'

import Preloader from './Preloader'
import SectionHero from './SectionHero'
import SectionIntro from './SectionIntro'
import SectionProfileIntro from './SectionProfileIntro'
import SectionGroom from './SectionGroom'
import SectionBride from './SectionBride'
import SectionLoveStory from './SectionLoveStory'
import SectionCountdown from './SectionCountdown'
import SectionEvent from './SectionEvent'
import SectionLivestream from './SectionLivestream'
import SectionDressCode from './SectionDressCode'
import SectionRSVP from './SectionRSVP'
import SectionWishes from './SectionWishes'
import SectionGift from './SectionGift'
import SectionGallery from './SectionGallery'
import SectionThankYou from './SectionThankYou'
import SideNav from './SideNav'
import QROverlay from './QROverlay'
import GiftPopup from './GiftPopup'

const SECTION_COMPONENTS = {
  SectionIntro,
  SectionProfileIntro,
  SectionGroom,
  SectionBride,
  SectionLoveStory,
  SectionCountdown,
  SectionEvent,
  SectionLivestream,
  SectionDressCode,
  SectionRSVP,
  SectionWishes,
  SectionGift,
  SectionGallery,
  SectionThankYou,
}

const isPreview = new URLSearchParams(window.location.search).has('preview')
const guestSlug  = new URLSearchParams(window.location.search).get('g')

export default function PublicSite() {
  const { data: content, loading } = useWeddingConfig()
  const [isOpen, setIsOpen] = useState(false)
  const [giftPopupOpen, setGiftPopupOpen] = useState(false)
  const [guestName, setGuestName] = useState('')

  useEffect(() => {
    if (!guestSlug) return
    fetch(`/api/guests/by-slug?g=${encodeURIComponent(guestSlug)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.name) setGuestName(data.name) })
      .catch(() => {})
  }, [])

  // Track page visit (skip in editor preview)
  useEffect(() => {
    if (isPreview) return
    fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: guestSlug || null }),
    }).catch(() => {})
  }, [])

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true,
      offset: 0,
    })
  }, [])

  // Replicate lockSection() / unlockSection() from original app.js
  useEffect(() => {
    if (!content || isPreview) return
    const isDesktop = window.matchMedia('(min-width: 801px)').matches
    if (!isOpen) {
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.overflowY = 'scroll'
      document.body.style.height = '100vh'
      document.getElementById('section-cover').style.width = isDesktop ? '700px' : '100%'
      document.body.classList.remove('opened')
    } else {
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.overflowY = ''
      document.body.style.height = ''
      document.getElementById('section-cover').style.width = ''
      document.body.classList.add('opened')
    }
  }, [isOpen, content])

  // Preview mode — activate scroll-snap and listen for editor messages
  useEffect(() => {
    if (!isPreview || !content) return
    document.documentElement.style.scrollSnapType = 'y mandatory'
    document.body.classList.add('opened')
    AOS.refresh()

    window.addEventListener('scrollend', () => AOS.refresh(), { passive: true })

    function handleMessage(e) {
      if (e.data?.type !== 'scrollToSection') return
      const { id } = e.data
      if (id === 'hero') {
        setIsOpen(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (id === 'backdrop') {
        setIsOpen(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => AOS.refresh(), 400)
      } else {
        setIsOpen(true)
        setTimeout(() => {
          document.getElementById(`ps-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => AOS.refresh(), 400)
        }, 80)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [content])

  // IntersectionObserver — tell editor which section is visible
  useEffect(() => {
    if (!isPreview || !content) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.sectionId
          window.parent?.postMessage({ type: 'sectionVisible', id }, '*')
        }
      })
    }, { threshold: 0.4 })

    document.querySelectorAll('[data-section-id]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [content])

  function handleOpen() {
    setIsOpen(true)
    document.documentElement.style.scrollSnapType = 'none'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      document.documentElement.style.scrollSnapType = 'y mandatory'
      AOS.refresh()
    }, 600)
  }

  if (loading || !content) return null

  const visibleSections = (content.sections || []).filter(s => s.visible)

  return (
    <div id="app-wrapper">
      <Preloader content={content} />

      <div
        id="section-cover"
        className="invitation-layout"
      >
        {/* Left panel */}
        <aside
          id="left-panel"
          style={{ backgroundImage: `url(${content.hero.backgroundOverlayImage})` }}
        >
          <div className="left-names">
            <h2 className="left-name">{content.hero.name1}</h2>
            <h2 className="left-connector">{content.hero.connector}</h2>
            <h2 className="left-name">{content.hero.name2}</h2>
          </div>
        </aside>

        {/* Right panel */}
        <div id="right-panel">
          {/* Video background */}
          <div id="video-bg">
            <video
              id="video-bg-player"
              src={content.hero.backgroundVideo}
              autoPlay
              muted
              playsInline
              loop
            ></video>
          </div>

          {/* Hero cover — removed from DOM on open */}
          <div id="ps-hero" data-section-id="hero">
            <SectionHero content={content} onOpen={handleOpen} isOpen={isOpen} guestName={guestName} />
          </div>

          {/* All content sections, driven by editable order/visibility */}
          {visibleSections.map(s => {
            const SectionComponent = SECTION_COMPONENTS[s.component]
            if (!SectionComponent) return null
            return (
              <div key={s.id} id={`ps-${s.id}`} data-section-id={s.id}>
                <SectionComponent
                  content={content}
                  onOpenGiftPopup={() => setGiftPopupOpen(true)}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating elements */}
      <SideNav content={content} isOpen={isOpen} />
      <QROverlay />
      <GiftPopup isOpen={giftPopupOpen} onClose={() => setGiftPopupOpen(false)} gift={content.gift || {}} />
    </div>
  )
}
