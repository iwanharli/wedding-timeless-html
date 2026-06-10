import { useState, useEffect, useRef } from 'react'
import animData from '../assets/preloader-anim.json'

export default function Preloader({ content, apiLoading, assetsLoading, loadProgress = 0 }) {
  const [animDone, setAnimDone] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [removed, setRemoved] = useState(false)
  const [displayProgress, setDisplayProgress] = useState(0)
  const lottieRef = useRef(null)
  const targetProgressRef = useRef(loadProgress)

  // Progress bar reflects real loading work (config fetch + cover images),
  // not the decorative animation's playback position. It's animated so it
  // always counts up smoothly (1, 2, 3, ...) and never jumps straight to
  // 100% on a fast connection, but it never shows ahead of real progress.
  targetProgressRef.current = loadProgress
  const progress = Math.round(displayProgress)

  useEffect(() => {
    let raf
    let last = performance.now()
    const tick = now => {
      const dt = now - last
      last = now
      setDisplayProgress(prev => {
        const target = targetProgressRef.current
        if (prev >= target) return prev
        return Math.min(target, prev + dt / 18)
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    let cancelled = false
    let anim
    import('lottie-web').then(({ default: lottie }) => {
      if (cancelled || !lottieRef.current) return
      anim = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: animData,
      })
      anim.setSpeed(2)
      anim.addEventListener('complete', () => setAnimDone(true))
    })
    return () => { cancelled = true; anim?.destroy() }
  }, [])

  // Fade out when animation done, API has responded, all images are loaded,
  // and the progress counter has visually caught up to 100%
  useEffect(() => {
    if (!animDone || apiLoading || assetsLoading || progress < 100) return
    const t1 = setTimeout(() => setHidden(true), 150)
    const t2 = setTimeout(() => setRemoved(true), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [animDone, apiLoading, assetsLoading, progress])

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
        <div className="preloader-progress">
          <div className="preloader-progress-bar-wrap">
            <div className="preloader-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <span className="preloader-progress-percent">{progress}%</span>
        </div>
        <div className="preloader-ornament">
          <span className="preloader-orn-line" />
          <i className="fas fa-circle preloader-orn-dot" />
          <span className="preloader-orn-line" />
        </div>
      </div>
    </div>
  )
}
