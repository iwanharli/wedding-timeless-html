import { useEffect, useRef } from 'react'
import Swiper from 'swiper'
import { Autoplay, Pagination } from 'swiper/modules'

function isVideo(src) {
  return /\.(mp4|mov|webm|ogg)(\?|$)/i.test(src || '')
}

export default function SectionGallery({ content }) {
  const gallery = content.gallery
  const allImages = gallery.images || [
    ...(gallery.columns?.[0]?.images || []),
    ...(gallery.columns?.[1]?.images || []),
    ...(gallery.columns?.[2]?.images || []),
  ]

  const swiperRef = useRef(null)
  const paginationRef = useRef(null)
  const lightboxRef = useRef(null)

  useEffect(() => {
    const sw = new Swiper(swiperRef.current, {
      modules: [Autoplay, Pagination],
      loop: true,
      slidesPerView: 1,
      autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: paginationRef.current, clickable: true },
      speed: 700,
    })
    return () => sw.destroy()
  }, [])

  function openLightbox(index) {
    const lb = lightboxRef.current
    if (!lb) return
    lb._index = index
    lb.querySelector('#lightbox-img').src = allImages[index]
    lb.querySelector('#lightbox-counter').textContent = `${index + 1} / ${allImages.length}`
    lb.style.display = 'block'
    setTimeout(() => { lb.style.opacity = '1' }, 10)
    document.body.style.overflow = 'hidden'
  }

  function closeLightbox() {
    const lb = lightboxRef.current
    if (!lb) return
    lb.style.opacity = '0'
    setTimeout(() => { lb.style.display = 'none' }, 300)
    document.body.style.overflow = ''
  }

  function navigate(dir) {
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

        {gallery.videoFile ? (
          <div className="gal-video-wrap">
            <div className="gallery-video-inner">
              <video
                className="gallery-video-frame"
                src={gallery.videoFile}
                poster={gallery.videoThumb || undefined}
                controls
                playsInline
              />
            </div>
          </div>
        ) : gallery.videoThumb ? (
          <div className="gal-video-wrap">
            <div className="gallery-video-inner">
              <div
                className="gallery-video-thumb"
                style={{ backgroundImage: `url(${gallery.videoThumb})`, cursor: 'default' }}
              />
            </div>
          </div>
        ) : null}

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
                      <img decoding="async" src={src} alt="" />
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
        <button onClick={() => navigate(-1)} className="lb-btn lb-btn--prev">
          <i className="fas fa-chevron-left" />
        </button>
        <button onClick={() => navigate(1)} className="lb-btn lb-btn--next">
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
