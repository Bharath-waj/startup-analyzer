// Thin line icons (lucide-style) replacing all emoji.
// Icons fill their parent; wrap them in a sized element (or use <Ico>).
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  width: '100%',
  height: '100%',
}

const stroke25 = { ...base, strokeWidth: 2.5 }

// Sized wrapper for an icon. Pass Tailwind size classes via `size`.
export const Ico = ({ size = 'h-[18px] w-[18px]', className = '', children }) => (
  <span className={`inline-flex shrink-0 items-center justify-center ${size} ${className}`}>{children}</span>
)

// Launch Lens brand mark — aperture ring + rocket, cyan-to-violet gradient.
export const Logo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lensGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </linearGradient>
      <linearGradient id="plume" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Background tile */}
    <rect width="48" height="48" rx="13" fill="url(#bgGrad)" />
    {/* Aperture ring — 6 blades */}
    <circle cx="24" cy="24" r="13" stroke="url(#lensGrad)" strokeWidth="2.5" fill="none" opacity="0.5" />
    <circle cx="24" cy="24" r="9" stroke="url(#lensGrad)" strokeWidth="1.5" fill="none" />
    {/* Aperture blade segments */}
    <path d="M24 11 A13 13 0 0 1 35.26 17.5" stroke="url(#lensGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M35.26 17.5 A13 13 0 0 1 35.26 30.5" stroke="url(#lensGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M35.26 30.5 A13 13 0 0 1 24 37" stroke="url(#lensGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
    <path d="M24 37 A13 13 0 0 1 12.74 30.5" stroke="url(#lensGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M12.74 30.5 A13 13 0 0 1 12.74 17.5" stroke="url(#lensGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M12.74 17.5 A13 13 0 0 1 24 11" stroke="url(#lensGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
    {/* Rocket body */}
    <path d="M24 28 C22.5 26 22 23.5 24 19 C26 23.5 25.5 26 24 28Z" fill="white" />
    {/* Rocket fins */}
    <path d="M22.5 26.5 L20.5 29 L22.5 28Z" fill="#06b6d4" />
    <path d="M25.5 26.5 L27.5 29 L25.5 28Z" fill="#7c3aed" />
    {/* Rocket plume */}
    <path d="M23 28 Q24 31.5 24 32 Q24 31.5 25 28" fill="url(#plume)" opacity="0.9" />
    {/* Lens gleam */}
    <circle cx="29" cy="17" r="1.2" fill="white" opacity="0.6" />
  </svg>
)
export const Search = () => (
  <svg {...base}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
)
export const Filter = () => (
  <svg {...base}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
)
export const Sort = () => (
  <svg {...base}><path d="M11 5h10M11 9h7M11 13h4" /><path d="M3 17l3 3 3-3" /><path d="M6 18V4" /></svg>
)
export const Download = () => (
  <svg {...base}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
)
export const Copy = () => (
  <svg {...base}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
)
export const Printer = () => (
  <svg {...base}><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
)
export const Refresh = () => (
  <svg {...base}><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
)
export const X = () => (
  <svg {...stroke25}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
)
export const Sparkles = () => (
  <svg {...base}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6z" /></svg>
)
export const Clock = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>
)
export const Bulb = () => (
  <svg {...base}><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></svg>
)
export const Mic = () => (
  <svg {...base}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
)
export const Calendar = () => (
  <svg {...base}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
)
export const BarChart = () => (
  <svg {...base}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
)
export const Message = () => (
  <svg {...base}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
)
export const Cube = () => (
  <svg {...base} strokeWidth={1.75}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
)
export const Grid = () => (
  <svg {...base}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
)
export const Trend = () => (
  <svg {...base}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
)
export const Users = () => (
  <svg {...base}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
)
export const Plus = () => (
  <svg {...stroke25}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
)
export const CheckSquare = () => (
  <svg {...base}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
)
export const Check = () => (
  <svg {...stroke25}><polyline points="20 6 9 17 4 12" /></svg>
)
export const Shuffle = () => (
  <svg {...base}><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>
)
export const Arrow = () => (
  <svg {...stroke25}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
)
export const Rocket = () => (
  <svg {...base}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
)
export const Link = () => (
  <svg {...base}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
)
export const Reddit = () => (
  <svg {...base}><circle cx="12" cy="13" r="9" /><circle cx="8.5" cy="13" r="1" fill="currentColor" /><circle cx="15.5" cy="13" r="1" fill="currentColor" /><path d="M8.5 16.5c2 1.3 5 1.3 7 0" /><path d="M12 4l1.5-2 3.5 1" /><circle cx="17" cy="3" r="1" /></svg>
)
export const Github = () => (
  <svg {...base}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
)
export const Handshake = () => (
  <svg {...base}><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" /></svg>
)
export const Close = () => (
  <svg {...stroke25}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
)
export const Briefcase = () => (
  <svg {...base}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
)
export const Speaker = () => (
  <svg {...base}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
)
export const SpeakerOff = () => (
  <svg {...base}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
)
