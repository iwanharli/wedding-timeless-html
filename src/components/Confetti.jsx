import { useMemo } from 'react'

const COLORS = [
  'rgba(212,175,55,0.7)',   // gold
  'rgba(255,255,255,0.5)',  // white
  'rgba(220,190,120,0.6)',  // champagne
  'rgba(255,220,180,0.45)', // rose gold
  'rgba(212,175,55,0.4)',   // gold faint
]

const SHAPES = ['circle', 'diamond', 'circle', 'diamond', 'circle']

export default function Confetti() {
  const particles = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,          // 2–6px
      color: COLORS[i % COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      delay: `${(Math.random() * 8).toFixed(2)}s`,
      duration: `${(Math.random() * 6 + 7).toFixed(2)}s`, // 7–13s
      drift: `${(Math.random() * 60 - 30).toFixed(1)}px`,  // horizontal drift
    }))
  }, [])

  return (
    <div className="confetti-wrap" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className={`confetti-particle confetti-${p.shape}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            '--drift': p.drift,
          }}
        />
      ))}
    </div>
  )
}
