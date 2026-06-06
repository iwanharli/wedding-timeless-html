import { useEffect, useRef } from 'react'
import Swiper from 'swiper'

const leftImages = [
  '/assets/images/Timeless-00028.jpg',
  '/assets/images/Timeless-00013.jpg',
  '/assets/images/Timeless-00024.jpg',
  '/assets/images/Timeless-00002-1.jpg',
]

const rightTopImages = [
  '/assets/images/Timeless-00042.jpg',
  '/assets/images/Timeless-00001.jpg',
  '/assets/images/Timeless-00043-1.jpg',
  '/assets/images/Timeless-00045.jpg',
]

const rightBottomImages = [
  '/assets/images/Timeless-00019.jpg',
  '/assets/images/Timeless-00003-1.jpg',
  '/assets/images/Timeless-00030-1.jpg',
  '/assets/images/Timeless-00033.jpg',
]

export default function SectionGallery() {
  const swiperLeftRef = useRef(null)
  const swiperRightTopRef = useRef(null)
  const swiperRightBottomRef = useRef(null)
  const lightboxRef = useRef(null)

  useEffect(() => {
    const opts = {
      loop: true,
      slidesPerView: 'auto',
      centeredSlides: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
    }

    const sw1 = new Swiper(swiperLeftRef.current, opts)
    const sw2 = new Swiper(swiperRightTopRef.current, opts)
    const sw3 = new Swiper(swiperRightBottomRef.current, opts)

    return () => {
      sw1.destroy()
      sw2.destroy()
      sw3.destroy()
    }
  }, [])

  // Collect all images for lightbox
  const allImages = [...leftImages, ...rightTopImages, ...rightBottomImages]

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

  function renderSlides(images, startIdx) {
    return images.map((src, i) => (
      <div className="swiper-slide" key={src}>
        <figure className="gal-slide-item">
          <div
            className="gal-img-wrap"
            style={{ cursor: 'pointer' }}
            onClick={() => openLightbox(startIdx + i)}
          >
            <img decoding="async" src={src} alt="" />
          </div>
        </figure>
      </div>
    ))
  }

  return (
    <div id="gallery" className="section-gallery child">
      <div className="gal-inner">
        <h2 className="gal-title">Unveiling<br />Our Prewedding Story</h2>

        <div className="gal-video-wrap">
          <div className="gallery-video-inner">
            <div className="gallery-video-frame" id="gallery-video"></div>
            <div
              className="gallery-video-thumb"
              style={{ backgroundImage: 'url(/assets/images/Timeless-00028.jpg)' }}
            >
              <div className="gallery-video-play" role="button" tabIndex="0">
                <i aria-hidden="true" className="fas fa-play"></i>
              </div>
            </div>
          </div>
        </div>

        <p className="gal-hint">Click image for preview</p>

        <div className="gal-grid">
          {/* Left column */}
          <div className="gal-col gal-col--left">
            <div className="gal-swiper">
              <div className="swiper-container" ref={swiperLeftRef}>
                <div className="swiper-wrapper">
                  {renderSlides(leftImages, 0)}
                </div>
              </div>
            </div>
            <p className="gal-quote">
              Every love story is beautiful, but ours is my favorite. Through the highs and lows,
              our love grows stronger and deeper with each passing day.
            </p>
          </div>

          {/* Right column */}
          <div className="gal-col gal-col--right">
            <div className="gal-swiper">
              <div className="swiper-container" ref={swiperRightTopRef}>
                <div className="swiper-wrapper">
                  {renderSlides(rightTopImages, leftImages.length)}
                </div>
              </div>
            </div>
            <div className="gal-swiper">
              <div className="swiper-container" ref={swiperRightBottomRef}>
                <div className="swiper-wrapper">
                  {renderSlides(rightBottomImages, leftImages.length + rightTopImages.length)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <div
        ref={lightboxRef}
        id="custom-lightbox"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 9999,
          opacity: 0,
          transition: 'opacity 0.3s',
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
            src=""
            alt=""
            style={{ width: '100%', maxHeight: '90vh', display: 'block', margin: '0 auto', objectFit: 'contain' }}
          />
        </div>
        <button
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer', padding: '20px' }}
        >&#10094;</button>
        <button
          onClick={() => navigate(1)}
          style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer', padding: '20px' }}
        >&#10095;</button>
        <button
          onClick={closeLightbox}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer' }}
        >&#10005;</button>
        <div
          id="lightbox-counter"
          style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, textAlign: 'center', color: 'white' }}
        ></div>
      </div>
    </div>
  )
}
