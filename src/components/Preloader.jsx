import { useState, useEffect } from 'react'

export default function Preloader({ content }) {
  const [progress, setProgress] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 5
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setHidden(true)
            setTimeout(() => setRemoved(true), 1000)
          }, 200)
          return 100
        }
        return next
      })
    }, 20)
    return () => clearInterval(interval)
  }, [])

  if (removed) return null

  return (
    <div id="preloader" className={hidden ? 'hide' : ''}>
      <div className="preloader-content">
        <div className="preloader-names-row">
          <h2 className="preloader-name">{content.hero.name1}</h2>
          <h2 className="preloader-connector">{content.hero.connector}</h2>
          <h2 className="preloader-name">{content.hero.name2}</h2>
        </div>
      </div>
      <div className="preloader-progress">
        <span className="loading-text">Loading... <span id="progress-percentage">{progress}</span>%</span>
      </div>
    </div>
  )
}
