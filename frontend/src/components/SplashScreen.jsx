import { useEffect, useState } from 'react'

/* ─── Inline Logo ─────────────────────────────────────────────── */
function SplashLogo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="slensGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="sbgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="splume" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#sbgGrad)" />
      <circle cx="24" cy="24" r="13" stroke="url(#slensGrad)" strokeWidth="2.5" fill="none" opacity="0.5" />
      <circle cx="24" cy="24" r="9"  stroke="url(#slensGrad)" strokeWidth="1.5" fill="none" />
      <path d="M24 11 A13 13 0 0 1 35.26 17.5" stroke="url(#slensGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M35.26 17.5 A13 13 0 0 1 35.26 30.5" stroke="url(#slensGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M35.26 30.5 A13 13 0 0 1 24 37" stroke="url(#slensGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M24 37 A13 13 0 0 1 12.74 30.5" stroke="url(#slensGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M12.74 30.5 A13 13 0 0 1 12.74 17.5" stroke="url(#slensGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M12.74 17.5 A13 13 0 0 1 24 11" stroke="url(#slensGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M24 28 C22.5 26 22 23.5 24 19 C26 23.5 25.5 26 24 28Z" fill="white" />
      <path d="M22.5 26.5 L20.5 29 L22.5 28Z" fill="#06b6d4" />
      <path d="M25.5 26.5 L27.5 29 L25.5 28Z" fill="#7c3aed" />
      <path d="M23 28 Q24 31.5 24 32 Q24 31.5 25 28" fill="url(#splume)" opacity="0.9" />
      <circle cx="29" cy="17" r="1.2" fill="white" opacity="0.6" />
    </svg>
  )
}

/* ─── Orbiting ring particle ──────────────────────────────────── */
function OrbitRing({ radius, duration, size, color, delay }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ animation: `splash-orbit ${duration}s linear ${delay}s infinite` }}
    >
      <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
        <div
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            background: color,
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            boxShadow: `0 0 ${size * 2}px ${color}`,
          }}
        />
      </div>
    </div>
  )
}

/* ─── Main SplashScreen ───────────────────────────────────────── */
export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter') // enter → hold → exit

  useEffect(() => {
    // After 2.2s start exit animation
    const t1 = setTimeout(() => setPhase('exit'), 2200)
    // After exit animation (0.6s), call onDone
    const t2 = setTimeout(() => onDone?.(), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  const isExiting = phase === 'exit'

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        animation: isExiting ? 'splash-fade-out 0.6s ease-in forwards' : 'none',
      }}
    >
      {/* Ambient glow blobs */}
      <div
        className="pointer-events-none absolute rounded-full opacity-20"
        style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
          top: '10%', left: '5%',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full opacity-15"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
          bottom: '10%', right: '5%',
          filter: 'blur(80px)',
        }}
      />

      {/* Center stack */}
      <div
        className="relative flex flex-col items-center gap-6"
        style={{ animation: isExiting ? 'splash-zoom-out 0.6s ease-in forwards' : 'splash-zoom-in 0.7s cubic-bezier(0.22,1,0.36,1) forwards' }}
      >
        {/* Orbit rings around logo */}
        <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
          <OrbitRing radius={80} duration={3.2} size={8}  color="#06b6d4" delay={0}    />
          <OrbitRing radius={65} duration={2.4} size={6}  color="#7c3aed" delay={-0.8} />
          <OrbitRing radius={92} duration={4.5} size={5}  color="#a78bfa" delay={-1.5} />

          {/* Outer glow ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: 140, height: 140,
              border: '1.5px solid rgba(6, 182, 212, 0.2)',
              animation: 'splash-pulse-ring 2s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 110, height: 110,
              border: '1.5px solid rgba(124, 58, 237, 0.25)',
              animation: 'splash-pulse-ring 2s ease-in-out 0.5s infinite',
            }}
          />

          {/* Logo tile */}
          <div
            className="relative z-10 rounded-[22px] p-1"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
              boxShadow: '0 0 40px rgba(6,182,212,0.4), 0 0 80px rgba(124,58,237,0.2)',
              animation: 'splash-float 3s ease-in-out infinite',
            }}
          >
            <div className="rounded-[18px] overflow-hidden" style={{ background: '#0f172a' }}>
              <SplashLogo size={80} />
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <div className="flex flex-col items-center gap-2" style={{ animation: 'splash-rise 0.9s 0.2s cubic-bezier(0.22,1,0.36,1) both' }}>
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{
              background: 'linear-gradient(90deg, #ffffff 0%, #a5f3fc 40%, #c4b5fd 80%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
            }}
          >
            Launch Lens
          </h1>
          <p className="text-sm font-medium tracking-widest uppercase" style={{ color: 'rgba(148,163,184,0.8)', letterSpacing: '0.2em' }}>
            AI · Startups · Vision
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="overflow-hidden rounded-full"
          style={{
            width: 200, height: 3,
            background: 'rgba(255,255,255,0.08)',
            animation: 'splash-rise 0.9s 0.4s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #7c3aed)',
              animation: 'splash-progress 2s 0.3s cubic-bezier(0.4,0,0.2,1) forwards',
              width: '0%',
              boxShadow: '0 0 8px rgba(6,182,212,0.6)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
