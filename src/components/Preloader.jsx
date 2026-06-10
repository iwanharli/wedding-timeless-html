import { useState, useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import animData from '../assets/preloader-anim.json'

export default function Preloader({ content, apiLoading, assetsLoading, loadProgress = 0 }) {
  const [animDone, setAnimDone] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [removed, setRemoved] = useState(false)
  const lottieRef = useRef(null)

  // Progress bar reflects real loading work (config fetch + cover images),
  // not the decorative animation's playback position.
  const progress = Math.max(loadProgress, animDone ? 100 : 0)

  useEffect(() => {
    if (!lottieRef.current) return
    const anim = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animData,
    })

    anim.setSpeed(2)

    anim.addEventListener('complete', () => {
      setAnimDone(true)
    })

    return () => anim.destroy()
  }, [])

  // Fade out when animation done, API has responded, and all images are loaded
  useEffect(() => {
    if (!animDone || apiLoading || assetsLoading) return
    const t1 = setTimeout(() => setHidden(true), 150)
    const t2 = setTimeout(() => setRemoved(true), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [animDone, apiLoading, assetsLoading])

  if (removed) return null

  // Only show the names once the real config has loaded — the fallback
  // content's placeholder names differ from the actual ones, which would
  // otherwise flash/change visibly on slow connections.
  const { name1, connector, name2 } = apiLoading ? {} : (content?.hero || {})

  return (
    <div id="preloader" className={hidden ? 'hide' : ''}>
      <div className="preloader-content">
        <div ref={lottieRef} className="preloader-lottie" />
        <div className="preloader-names">
          <span className="preloader-name1">{name1}</span>
          <span className="preloader-connector">{connector}</span>
          <span className="preloader-name2">{name2}</span>
        </div>
        <div className="preloader-ornament">
          <span className="preloader-orn-line" />
          <i className="fas fa-circle preloader-orn-dot" />
          <span className="preloader-orn-line" />
        </div>
      </div>

      <div className="preloader-bar-wrap">
        <div className="preloader-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
