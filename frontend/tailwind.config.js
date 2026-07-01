/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand primary
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04)',
        card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.05)',
        glow: '0 6px 16px rgba(99, 76, 230, 0.35)',
      },
      keyframes: {
        screenIn: {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.99)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        dropIn: {
          from: { opacity: '0', transform: 'translateY(-14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        cardIn: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        micPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(225, 29, 72, 0.3)' },
          '70%': { boxShadow: '0 0 0 8px rgba(225, 29, 72, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(225, 29, 72, 0)' },
        },
      },
      animation: {
        'screen-in': 'screenIn 0.45s cubic-bezier(0.22,1,0.36,1) both',
        'drop-in': 'dropIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'card-in': 'cardIn 0.45s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'mic-pulse': 'micPulse 1.5s infinite',
      },
    },
  },
  plugins: [],
}
