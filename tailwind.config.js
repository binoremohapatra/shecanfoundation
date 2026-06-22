/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flame:    "#E8452A",
        navy:     "#0D1B2A",
        ivory:    "#FDF6F0",
        blush:    "#F9C5B0",
        charcoal: "#2C2C2C",
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'confetti-1': 'confetti1 1.2s ease-out forwards',
        'confetti-2': 'confetti2 1.4s ease-out forwards',
        'confetti-3': 'confetti3 1.0s ease-out forwards',
        'confetti-4': 'confetti4 1.3s ease-out forwards',
        'confetti-5': 'confetti5 1.1s ease-out forwards',
        'confetti-6': 'confetti6 1.5s ease-out forwards',
        'spin-slow':  'spin 1s linear infinite',
      },
      keyframes: {
        confetti1: {
          '0%':   { transform: 'translate(0,0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate(-120px,-180px) rotate(720deg)', opacity: '0' },
        },
        confetti2: {
          '0%':   { transform: 'translate(0,0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate(140px,-200px) rotate(-540deg)', opacity: '0' },
        },
        confetti3: {
          '0%':   { transform: 'translate(0,0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate(-80px,-220px) rotate(600deg)', opacity: '0' },
        },
        confetti4: {
          '0%':   { transform: 'translate(0,0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate(100px,-160px) rotate(-480deg)', opacity: '0' },
        },
        confetti5: {
          '0%':   { transform: 'translate(0,0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate(-160px,-140px) rotate(420deg)', opacity: '0' },
        },
        confetti6: {
          '0%':   { transform: 'translate(0,0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate(180px,-190px) rotate(-660deg)', opacity: '0' },
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(13,27,42,0.08), 0 1px 4px rgba(13,27,42,0.04)',
        'card-hover': '0 8px 40px rgba(13,27,42,0.14), 0 2px 8px rgba(13,27,42,0.06)',
      },
    },
  },
  plugins: [],
}
