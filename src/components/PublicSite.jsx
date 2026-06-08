import { useState, useEffect } from 'react'
import AOS from 'aos'
import { useWeddingConfig } from '../data/useWeddingConfig'
import { apiUrl } from '../lib/api'
import defaultContent from '../data/content'

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
  const [guestNotFound, setGuestNotFound] = useState(false)

  useEffect(() => {
    if (!guestSlug) return
    fetch(apiUrl(`/api/guests/by-slug?g=${encodeURIComponent(guestSlug)}`))
      .then(async (res) => {
        if (res.ok) return res.json()
        if (res.status === 404) {
          setGuestNotFound(true)
          return null
        }
        throw new Error('Failed to resolve guest slug')
      })
      .then(data => { if (data?.name) setGuestName(data.name) })
      .catch(() => {})
  }, [])

  // Track page visit (skip in editor preview and invalid slug)
  useEffect(() => {
    if (isPreview || guestNotFound) return
    fetch(apiUrl('/api/visits'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: guestSlug || null }),
    }).catch(() => {})
  }, [guestNotFound])

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true,
      offset: 0,
    })
  }, [])

  useEffect(() => {
    if (!content) return

    const shareTitle = content.share?.ogTitle?.trim()
    const shareDescription = content.share?.ogDescription?.trim()
    const shareImage = content.share?.ogImage?.trim()

    if (shareTitle) {
      document.title = shareTitle
      setMetaTag('og:title', shareTitle)
      setMetaTag('twitter:title', shareTitle)
    }
    if (shareDescription) {
      setMetaTag('og:description', shareDescription)
      setMetaTag('twitter:description', shareDescription)
    }
    if (shareImage) {
      setMetaTag('og:image', shareImage)
      setMetaTag('twitter:image', shareImage)
      setMetaTag('twitter:card', 'summary_large_image')
    }
  }, [content])

  // Replicate lockSection() / unlockSection() from original app.js
  useEffect(() => {
    if (!content || isPreview || guestNotFound) return
    const isDesktop = window.matchMedia('(min-width: 801px)').matches
    if (!isOpen) {
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.overflowY = 'scroll'
      document.body.style.height = '100vh'
      const sectionCover = document.getElementById('section-cover')
      if (sectionCover) sectionCover.style.width = isDesktop ? '700px' : '100%'
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

  function setMetaTag(name, contentValue) {
    let tag = document.querySelector(`meta[property='${name}'], meta[name='${name}']`)
    if (!tag) {
      tag = document.createElement('meta')
      if (name.startsWith('og:')) tag.setAttribute('property', name)
      else tag.setAttribute('name', name)
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', contentValue)
  }

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

  // Use fallback names while API is loading so preloader shows immediately
  const preloaderContent = content || defaultContent

  if (guestNotFound) {
    return (
      <div id="app-wrapper" className="not-found-page">
        <div className="not-found-card">
          <div className="not-found-badge">404</div>
          <h1>Undangan tidak ditemukan</h1>
          <p>Maaf, tautan undangan pribadi ini tidak valid atau sudah tidak tersedia.</p>
          <a href="/" className="not-found-button">Kembali ke halaman utama</a>
        </div>
      </div>
    )
  }

  if (loading || !content) {
    return (
      <div id="app-wrapper">
        <Preloader content={preloaderContent} apiLoading={true} />
      </div>
    )
  }

  const visibleSections = (content.sections || []).filter(s => s.visible)

  return (
    <div id="app-wrapper">
      <Preloader content={content} apiLoading={false} />

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
