import { useState, useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import animData from '../assets/preloader-anim.json'

export default function Preloader({ content, apiLoading }) {
  const [progress, setProgress] = useState(0)
  const [animDone, setAnimDone] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [removed, setRemoved] = useState(false)
  const lottieRef = useRef(null)

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

    anim.addEventListener('enterFrame', () => {
      const pct = Math.round((anim.currentFrame / anim.totalFrames) * 100)
      setProgress(Math.min(pct, 100))
    })

    anim.addEventListener('complete', () => {
      setProgress(100)
      setAnimDone(true)
    })

    return () => anim.destroy()
  }, [])

  // Fade out when animation done AND API has responded
  useEffect(() => {
    if (!animDone || apiLoading) return
    const t1 = setTimeout(() => setHidden(true), 150)
    const t2 = setTimeout(() => setRemoved(true), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [animDone, apiLoading])

  if (removed) return null

  const { name1, connector, name2 } = content?.hero || {}

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
