import { useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Logo, Ico, Bulb, Calendar, BarChart, Message } from '../icons.jsx'

const LINKS = [
  { to: '/', end: true, label: 'Analyze', Icon: Bulb },
  { to: '/events', label: 'Events', Icon: Calendar },
  { to: '/report', label: 'Report', Icon: BarChart },
  { to: '/pitch', label: 'Pitch Coach', Icon: Message },
]

export default function Header() {
  const location = useLocation()
  const navRef = useRef(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 })

  useLayoutEffect(() => {
    function place() {
      const nav = navRef.current
      if (!nav) return
      const active = nav.querySelector('[aria-current="page"]')
      if (active) {
        setIndicator({ left: active.offsetLeft, width: active.offsetWidth, opacity: 1 })
      } else {
        setIndicator((i) => ({ ...i, opacity: 0 }))
      }
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [location.pathname])

  return (
    <header className="animate-drop-in sticky top-0 z-50 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-100/95 py-4 backdrop-blur-sm">
      <div className="group flex items-center gap-3">
        <div className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
          <Logo size={44} />
        </div>
        <div>
          <h1 className="bg-gradient-to-r from-brand-600 via-violet-600 to-pink-600 bg-clip-text text-xl font-extrabold leading-tight tracking-tight text-transparent">
            Startup Analyzer
          </h1>
          <p className="text-sm font-medium text-slate-500">Real-world viability analysis &amp; investor pitch coaching</p>
        </div>
      </div>

      <nav
        ref={navRef}
        aria-label="Primary"
        className="no-scrollbar relative flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-soft"
      >
        <span
          aria-hidden="true"
          className="absolute bottom-1.5 top-1.5 left-0 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 shadow-glow transition-[transform,width,opacity] duration-300 ease-out"
          style={{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px`, opacity: indicator.opacity }}
        />
        {LINKS.map(({ to, end, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative z-10 flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors active:translate-y-px ${
                isActive ? 'text-white' : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <Ico size="h-[15px] w-[15px]"><Icon /></Ico>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
