import { useState, useEffect, useMemo, useRef } from 'react'
import AOS from 'aos'
import { useWeddingConfig } from '../data/useWeddingConfig'
import { apiUrl } from '../lib/api'
import defaultContent from '../data/content'
import { hexToRgba } from '../lib/color'
import { collectCoverImageUrls, preloadImages } from '../lib/preloadImages'

import Preloader from './Preloader'
import SectionHero from '../sections/Hero/SectionHero'
import SectionIntro from '../sections/Intro/SectionIntro'
import SectionProfileIntro from '../sections/ProfileIntro/SectionProfileIntro'
import SectionGroom from '../sections/GroomBride/SectionGroom'
import SectionBride from '../sections/GroomBride/SectionBride'
import SectionLoveStory from '../sections/LoveStory/SectionLoveStory'
import SectionCountdown from '../sections/Countdown/SectionCountdown'
import SectionEvent from '../sections/Event/SectionEvent'
import SectionLivestream from '../sections/Livestream/SectionLivestream'
import SectionDressCode from '../sections/DressCode/SectionDressCode'
import SectionRSVP from '../sections/RSVP/SectionRSVP'
import SectionWishes from '../sections/Wishes/SectionWishes'
import SectionGift from '../sections/Gift/SectionGift'
import SectionGallery from '../sections/Gallery/SectionGallery'
import SectionThankYou from '../sections/ThankYou/SectionThankYou'
import SideNav from './SideNav'
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

const isPreview   = new URLSearchParams(window.location.search).has('preview')
const guestSlug   = new URLSearchParams(window.location.search).get('g')
const onlySection = new URLSearchParams(window.location.search).get('onlysection')

// Render one section block with its background layers.
function IsolatedSectionBlock({ sectionId, content }) {
  const sectionDef = (content.sections || []).find(s => s.id === sectionId)
  const Comp = sectionDef ? SECTION_COMPONENTS[sectionDef.component] : null
  if (!Comp) return null

  const bg = sectionDef.background || { type: 'video', value: '' }
  const mediaOpacity = bg.type === 'image' ? (bg.mediaOpacity ?? 100) / 100 : 1
  const bgLayerStyle =
    bg.type === 'image' && bg.value
      ? { backgroundImage: `url(${bg.value})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: mediaOpacity }
      : bg.type === 'color' && bg.value
      ? { backgroundColor: bg.value }
      : null
  // In isolated mode #video-bg doesn't exist — render video inline.
  const videoBg = bg.type === 'video' ? (content.hero?.backgroundVideo || '') : ''
  const overlayOpacity = (bg.opacity || 0) / 100
  const wrapperStyle = (bgLayerStyle || videoBg || overlayOpacity > 0) ? { position: 'relative' } : undefined
  if (wrapperStyle && bg.type === 'image' && mediaOpacity < 1 && bg.bgColor) {
    wrapperStyle.backgroundColor = bg.bgColor
  }
  if (!wrapperStyle && !videoBg && bg.type === 'video') {
    // no video configured — ensure dark bg so white text stays readable
    Object.assign(wrapperStyle ?? {}, { backgroundColor: '#111' })
  }

  return (
    <div id={`ps-${sectionId}`} data-section-id={sectionId} style={wrapperStyle}>
      {videoBg && (
        <video className="preview-isolated-video-bg" src={videoBg} autoPlay muted playsInline loop />
      )}
      {bgLayerStyle && <div className="section-bg-layer" style={bgLayerStyle} />}
      {overlayOpacity > 0 && (
        <div className="section-bg-overlay" style={{ backgroundColor: hexToRgba(bg.overlayColor, overlayOpacity) }} />
      )}
      <Comp content={content} onOpenGiftPopup={() => {}} />
    </div>
  )
}

// Wrapper for isolated section preview — supports single id or comma-separated ids
// (e.g. "groom,bride" for the Couple editor). Owns its own AOS.refresh() so the
// animation trigger fires after this subtree is painted, not before.
function IsolatedSectionPreview({ id, content }) {
  useEffect(() => {
    let raf1, raf2
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => AOS.refresh())
    })
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2) }
  }, [])

  if (id === 'hero') {
    return (
      <div id="app-wrapper" className="preview-isolated">
        <SectionHero content={content} onOpen={() => {}} isOpen={false} guestName="Nama Tamu" />
      </div>
    )
  }

  const ids = id.split(',')
  return (
    <div id="app-wrapper" className="preview-isolated">
      {ids.map(sectionId => (
        <IsolatedSectionBlock key={sectionId} sectionId={sectionId} content={content} />
      ))}
    </div>
  )
}

export default function PublicSite() {
  const { data: rawContent, loading, fetchProgress } = useWeddingConfig()
  const [isOpen, setIsOpen] = useState(false)
  const [giftPopupOpen, setGiftPopupOpen] = useState(false)
  const [guestName, setGuestName] = useState(isPreview && !guestSlug ? 'Nama Tamu' : '')
  const [guestNotFound, setGuestNotFound] = useState(false)
  const [previewOverride, setPreviewOverride] = useState(null)
  const [imagesReady, setImagesReady] = useState(false)
  const [imageProgress, setImageProgress] = useState(0)
  const sentReadyRef = useRef(false)

  // Real preloader progress: 0-50% covers the /api/config download,
  // 50-100% covers preloading the cover-screen images.
  const loadProgress = Math.round(fetchProgress * 0.5 + imageProgress * 0.5)

  // In preview mode, the editor can push live (unsaved) section/hero background edits
  const content = useMemo(() => {
    if (!rawContent || !previewOverride) return rawContent
    return {
      ...rawContent,
      sections: previewOverride.sections || rawContent.sections,
      hero: { ...rawContent.hero, background: previewOverride.heroBackground || rawContent.hero.background },
    }
  }, [rawContent, previewOverride])

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

  // Preload only the cover-screen images before hiding the preloader.
  // Other sections' images load lazily as the user scrolls.
  useEffect(() => {
    if (!content) return
    let cancelled = false
    setImagesReady(false)
    setImageProgress(0)
    preloadImages([...collectCoverImageUrls(content)], (done, total) => {
      if (!cancelled) setImageProgress(Math.round((done / total) * 100))
    }).then(() => {
      if (!cancelled) setImagesReady(true)
    })
    return () => { cancelled = true }
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
    document.body.classList.add('opened')
    setIsOpen(true)   // SideNav requires isOpen:true to render

    let refreshTimer = null
    const debouncedRefresh = () => {
      clearTimeout(refreshTimer)
      refreshTimer = setTimeout(() => AOS.refresh(), 400)
    }

    AOS.refresh()

    // Full preview only: scroll-snap + scroll-sync
    if (!onlySection) {
      document.documentElement.style.scrollSnapType = 'y mandatory'
      window.addEventListener('scrollend', debouncedRefresh, { passive: true })
    }

    function handleMessage(e) {
      if (e.data?.type === 'previewConfig') {
        setPreviewOverride({ sections: e.data.sections, heroBackground: e.data.heroBackground })
        return
      }
      // Isolated mode: ignore scroll commands (section is already shown via URL param)
      if (onlySection) return
      if (e.data?.type !== 'scrollToSection') return
      const { id } = e.data
      if (id === 'hero') {
        setIsOpen(false)
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          debouncedRefresh()
        }, 80)
      } else if (id === 'backdrop') {
        setIsOpen(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        debouncedRefresh()
      } else {
        setIsOpen(true)
        setTimeout(() => {
          document.getElementById(`ps-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          debouncedRefresh()
        }, 80)
      }
    }
    window.addEventListener('message', handleMessage)
    if (!sentReadyRef.current) {
      sentReadyRef.current = true
      window.parent?.postMessage({ type: 'previewReady' }, window.location.origin)
    }
    return () => {
      window.removeEventListener('message', handleMessage)
      if (!onlySection) {
        window.removeEventListener('scrollend', debouncedRefresh)
        clearTimeout(refreshTimer)
      }
    }
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

  // IntersectionObserver — tell editor which section is visible (full preview only)
  useEffect(() => {
    if (!isPreview || !content || onlySection) return
    const ratios = new Map()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        ratios.set(entry.target.dataset.sectionId, entry.isIntersecting ? entry.intersectionRatio : 0)
      })
      let bestId = null
      let bestRatio = 0
      ratios.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio
          bestId = id
        }
      })
      if (bestId) {
        window.parent?.postMessage({ type: 'sectionVisible', id: bestId }, '*')
      }
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
        <Preloader content={preloaderContent} apiLoading={true} assetsLoading={true} loadProgress={loadProgress} />
      </div>
    )
  }

  // ── Isolated section preview (?onlysection=<id>) ──────────────────────────
  if (onlySection && content) {
    return <IsolatedSectionPreview id={onlySection} content={content} />
  }

  const visibleSections = (content.sections || []).filter(s => s.visible)

  return (
    <div id="app-wrapper">
      <Preloader content={content} apiLoading={false} assetsLoading={!imagesReady} loadProgress={loadProgress} />

      <div
        id="section-cover"
        className="invitation-layout"
      >
        {/* Left panel */}
        <aside
          id="left-panel"
          style={
            content.hero.leftPanel?.type === 'video' || !content.hero.leftPanel?.image
              ? undefined
              : { backgroundImage: `url(${content.hero.leftPanel.image})` }
          }
        >
          {content.hero.leftPanel?.type === 'video' && content.hero.leftPanel?.video && (
            <video
              className="left-panel-video"
              src={content.hero.leftPanel.video}
              autoPlay
              muted
              playsInline
              loop
            />
          )}
          <div className="left-names">
            <h2 className="left-name">{content.hero.name1}</h2>
            <h2 className="left-connector">{content.hero.connector}</h2>
            <h2 className="left-name">{content.hero.name2}</h2>
          </div>
        </aside>

        {/* Right panel */}
        <main id="right-panel">
          {/* Video background */}
          <div id="video-bg">
            <video
              id="video-bg-player"
              src={content.hero.backgroundVideo}
              autoPlay
              muted
              playsInline
              loop
              fetchPriority="high"
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
            const bg = s.background || { type: 'video', value: '' }
            const mediaOpacity = bg.type === 'image' ? (bg.mediaOpacity ?? 100) / 100 : 1
            const bgLayerStyle =
              bg.type === 'image' && bg.value
                ? { backgroundImage: `url(${bg.value})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: mediaOpacity }
                : bg.type === 'color' && bg.value
                ? { backgroundColor: bg.value }
                : null
            const overlayOpacity = (bg.opacity || 0) / 100
            const wrapperStyle = (bgLayerStyle || overlayOpacity > 0) ? { position: 'relative' } : undefined
            if (wrapperStyle && bg.type === 'image' && mediaOpacity < 1 && bg.bgColor) {
              wrapperStyle.backgroundColor = bg.bgColor
            }
            return (
              <div key={s.id} id={`ps-${s.id}`} data-section-id={s.id} style={wrapperStyle}>
                {bgLayerStyle && <div className="section-bg-layer" style={bgLayerStyle} />}
                {overlayOpacity > 0 && <div className="section-bg-overlay" style={{ backgroundColor: hexToRgba(bg.overlayColor, overlayOpacity) }} />}
                <SectionComponent
                  content={content}
                  onOpenGiftPopup={() => setGiftPopupOpen(true)}
                />
              </div>
            )
          })}
        </main>
      </div>

      {/* Floating elements */}
      <SideNav content={content} isOpen={isOpen} />
      <GiftPopup isOpen={giftPopupOpen} onClose={() => setGiftPopupOpen(false)} gift={content.gift || {}} />
    </div>
  )
}
