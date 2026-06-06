import { useState, useEffect } from 'react'
import AOS from 'aos'
import content from './data/content'

import Preloader from './components/Preloader'
import SectionHero from './components/SectionHero'
import SectionIntro from './components/SectionIntro'
import SectionProfileIntro from './components/SectionProfileIntro'
import SectionGroom from './components/SectionGroom'
import SectionBride from './components/SectionBride'
import SectionLoveStory from './components/SectionLoveStory'
import SectionCountdown from './components/SectionCountdown'
import SectionEvent from './components/SectionEvent'
import SectionLivestream from './components/SectionLivestream'
import SectionDressCode from './components/SectionDressCode'
import SectionRSVP from './components/SectionRSVP'
import SectionWishes from './components/SectionWishes'
import SectionGift from './components/SectionGift'
import SectionGallery from './components/SectionGallery'
import SectionThankYou from './components/SectionThankYou'
import SideNav from './components/SideNav'
import QROverlay from './components/QROverlay'
import GiftPopup from './components/GiftPopup'

export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [giftPopupOpen, setGiftPopupOpen] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true,
      offset: 0,
    })
  }, [])

  function handleOpen() {
    setIsOpen(true)
    // Disable scroll snap briefly then re-enable
    document.documentElement.style.scrollSnapType = 'none'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      document.documentElement.style.scrollSnapType = 'y mandatory'
      AOS.refresh()
    }, 600)
  }

  return (
    <div id="app-wrapper">
      <Preloader content={content} />

      <div
        id="section-cover"
        className={`invitation-layout${isOpen ? '' : ' hidden'}`}
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
          <SectionHero content={content} onOpen={handleOpen} isOpen={isOpen} />

          {/* All content sections */}
          <SectionIntro content={content} />
          <SectionProfileIntro content={content} />
          <SectionGroom content={content} />
          <SectionBride content={content} />
          <SectionLoveStory content={content} />
          <SectionCountdown content={content} />
          <SectionEvent content={content} />
          <SectionLivestream content={content} />
          <SectionDressCode content={content} />
          <SectionRSVP content={content} />
          <SectionWishes />
          <SectionGift content={content} onOpenGiftPopup={() => setGiftPopupOpen(true)} />
          <SectionGallery />
          <SectionThankYou content={content} />
        </div>
      </div>

      {/* Floating elements */}
      <SideNav content={content} isOpen={isOpen} />
      <QROverlay />
      <GiftPopup isOpen={giftPopupOpen} onClose={() => setGiftPopupOpen(false)} />
    </div>
  )
}
