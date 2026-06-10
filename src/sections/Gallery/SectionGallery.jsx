import { useState, useEffect, useRef } from 'react'
import { bgAudioRef } from '../../lib/bgAudioRef'
import './gallery.css'

const BG_DUCK_VOLUME = 0

function isVideo(src) {
  return /\.(mp4|mov|webm|ogg)(\?|$)/i.test(src || '')
}

export default function SectionGallery({ content }) {
  const gallery = content.gallery
  const allImages = gallery.images || []

  const [videoPlaying, setVideoPlaying] = useState(false)
  const swiperRef = useRef(null)
  const paginationRef = useRef(null)
  const lightboxRef = useRef(null)
  const videoRef = useRef(null)

  // Re-attach audio ducking whenever the video element mounts (on first play)
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

    function duckBackground() {
      if (bgAudioRef.current) bgAudioRef.current.volume = BG_DUCK_VOLUME
    }
    function restoreBackground() {
      if (bgAudioRef.current) bgAudioRef.current.volume = 1
    }

    vid.addEventListener('play', duckBackground)
    vid.addEventListener('pause', restoreBackground)
    vid.addEventListener('ended', restoreBackground)
    return () => {
      vid.removeEventListener('play', duckBackground)
      vid.removeEventListener('pause', restoreBackground)
      vid.removeEventListener('ended', restoreBackground)
      restoreBackground()
    }
  }, [videoPlaying])

  useEffect(() => {
    let sw
    Promise.all([import('swiper'), import('swiper/modules')]).then(
      ([{ default: Swiper }, { Autoplay, Pagination }]) => {
        if (!swiperRef.current) return
        sw = new Swiper(swiperRef.current, {
          modules: [Autoplay, Pagination],
          loop: true,
          slidesPerView: 1,
          autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
          pagination: { el: paginationRef.current, clickable: true },
          speed: 700,
          observer: true,
          observeParents: true,
        })
      }
    )
    return () => sw?.destroy()
  }, [])

  function handleVideoPlay() {
    setVideoPlaying(true)
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {})
    })
  }

  function openLightbox(index) {
    const lb = lightboxRef.current
    if (!lb) return
    lb._index = index
    lb.querySelector('#lightbox-img').src = allImages[index]
    lb.querySelector('#lightbox-counter').textContent = `${index + 1} / ${allImages.length}`
    lb.style.display = 'block'
    setTimeout(() => { lb.style.opacity = '1' }, 10)
    document.body.style.overflow = 'hidden'
    document.body.classList.add('lightbox-open')
  }

  function closeLightbox() {
    const lb = lightboxRef.current
    if (!lb) return
    lb.style.opacity = '0'
    setTimeout(() => { lb.style.display = 'none' }, 300)
    document.body.style.overflow = ''
    document.body.classList.remove('lightbox-open')
  }

  function navigateLightbox(dir) {
    const lb = lightboxRef.current
    if (!lb) return
    lb._index = (lb._index + dir + allImages.length) % allImages.length
    lb.querySelector('#lightbox-img').src = allImages[lb._index]
    lb.querySelector('#lightbox-counter').textContent = `${lb._index + 1} / ${allImages.length}`
  }

  return (
    <div id="gallery" className="section-gallery child">
      <div className="gal-inner">
        <div className="gal-title-wrap">
          <span className="gal-label">Gallery</span>
          <h2 className="gal-title" style={{ whiteSpace: 'pre-line' }}>{gallery.title}</h2>
        </div>

        {gallery.videoFile && (
          <div className="gal-video-wrap">
            <div className="gallery-video-inner">
              {!videoPlaying ? (
                <div
                  className="gal-video-poster"
                  style={gallery.videoThumb ? { backgroundImage: `url(${gallery.videoThumb})` } : {}}
                  onClick={handleVideoPlay}
                >
                  <button type="button" className="gal-play-btn" aria-label="Play video">
                    <i className="fas fa-play" />
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  className="gallery-video-frame"
                  src={gallery.videoFile}
                  playsInline
                  controls
                  preload="auto"
                />
              )}
            </div>
          </div>
        )}

        {/* Single auto slider */}
        <div className="gal-slider-wrap">
          <div className="swiper-container" ref={swiperRef}>
            <div className="swiper-wrapper">
              {allImages.map((src, i) => (
                <div className="swiper-slide" key={src + i}>
                  {isVideo(src) ? (
                    <div className="gal-img-wrap gal-img-wrap--video">
                      <video src={src} controls playsInline preload="metadata" className="gal-slide-video" />
                    </div>
                  ) : (
                    <div className="gal-img-wrap" onClick={() => openLightbox(i)}>
                      <img decoding="async" loading="lazy" src={src || null} alt="" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="gal-pagination" ref={paginationRef} />
        </div>

        <p className="gal-quote">{gallery.quote}</p>
      </div>

      {/* Lightbox */}
      <div
        ref={lightboxRef}
        id="custom-lightbox"
        style={{
          display: 'none', position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.92)',
          zIndex: 9999, opacity: 0, transition: 'opacity 0.3s',
        }}
        onClick={e => { if (e.target === lightboxRef.current) closeLightbox() }}
      >
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%', maxHeight: '95%',
        }}>
          <img
            id="lightbox-img"
            src={null}
            alt=""
            style={{ width: '100%', maxHeight: '90vh', display: 'block', margin: '0 auto', objectFit: 'contain' }}
          />
        </div>
        <button onClick={() => navigateLightbox(-1)} className="lb-btn lb-btn--prev">
          <i className="fas fa-chevron-left" />
        </button>
        <button onClick={() => navigateLightbox(1)} className="lb-btn lb-btn--next">
          <i className="fas fa-chevron-right" />
        </button>
        <button onClick={closeLightbox} className="lb-btn lb-btn--close">
          <i className="fas fa-times" />
        </button>
        <div
          id="lightbox-counter"
          style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: 'inter', fontSize: '12px', letterSpacing: '2px' }}
        />
      </div>
    </div>
  )
}
