/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Syne"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        base: '#0C0F1A',
        elevated: '#141826',
        surface: '#1C2235',
        overlay: '#252D42',
        amber: { DEFAULT: '#F0B429', dim: '#8B6514', glow: 'rgba(240,180,41,0.20)' },
        hit: { DEFAULT: '#12F28A', bg: '#0A2620', glow: 'rgba(18,242,138,0.35)', text: '#001A10' },
        'win-gold': { DEFAULT: '#FFD700', bg: 'rgba(255,215,0,0.10)', border: 'rgba(255,215,0,0.60)' },
        danger: { DEFAULT: '#FF4757', dim: 'rgba(255,71,87,0.15)' },
        info: { DEFAULT: '#4ECDC4', dim: 'rgba(78,205,196,0.12)' },
        'text-primary': '#EDF0FF',
        'text-secondary': '#7B88A8',
        'text-muted': '#3D4A65',
        ticket: { bg: '#161C2E', border: '#2A3555', grid: '#1F2840' },
        'cell-blank': '#0F1320',
        'cell-unfilled': '#1E2845',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
      keyframes: {
        numberPop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1.05)' },
        },
        cellHit: {
          '0%': { transform: 'scale(1)', backgroundColor: '#1E2845' },
          '40%': { transform: 'scale(1.18)', backgroundColor: '#12F28A' },
          '100%': { transform: 'scale(1)', backgroundColor: '#0A2620' },
        },
        winPulse: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(255,215,0,0.60)' },
          '50%': { boxShadow: '0 0 28px rgba(255,215,0,0.60), 0 0 48px rgba(255,215,0,0.15)' },
        },
        toastIn: {
          from: { opacity: '0', transform: 'translateY(-20px) scale(0.96)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'number-pop': 'numberPop 0.3s ease-out forwards',
        'cell-hit': 'cellHit 0.4s ease-out forwards',
        'win-pulse': 'winPulse 2s ease-in-out infinite',
        'toast-in': 'toastIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
