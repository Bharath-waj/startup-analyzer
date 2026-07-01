import { useEffect, useState } from 'react'

const CIRCUMFERENCE = 283

export default function ViabilityMeter({ score = 0 }) {
  const [value, setValue] = useState(0)
  const [offset, setOffset] = useState(CIRCUMFERENCE)

  useEffect(() => {
    const target = CIRCUMFERENCE - (CIRCUMFERENCE * score) / 100
    const raf = requestAnimationFrame(() => setOffset(target))

    let current = 0
    const timer = setInterval(() => {
      if (current >= score) {
        setValue(score)
        clearInterval(timer)
      } else {
        current += 1
        setValue(current)
      }
    }, 10)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(timer)
    }
  }, [score])

  return (
    <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center">
      <svg className="h-[100px] w-[100px] -rotate-90">
        <defs>
          <linearGradient id="meter-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="#eef0f3" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#meter-grad)"
          strokeWidth="9"
          strokeDasharray={CIRCUMFERENCE}
          strokeLinecap="round"
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-[1.55rem] font-extrabold text-slate-900">{value}</span>
        <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-widest text-slate-400">Viable</span>
      </div>
    </div>
  )
}
