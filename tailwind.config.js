/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Forest greens
        forest: {
          50: '#f0f7f0',
          100: '#dceddc',
          200: '#b8dbb8',
          300: '#8ac38a',
          400: '#5da65d',
          500: '#3d8b3d',
          600: '#2d6e2d',
          700: '#255725',
          800: '#1e451e',
          900: '#183a18',
          950: '#0a1f0a',
        },
        // Warm ambers
        amber: {
          50: '#fefbf0',
          100: '#fdf4d6',
          200: '#fae6a8',
          300: '#f6d374',
          400: '#f0bb3e',
          500: '#e8a020',
          600: '#cc7d16',
          700: '#a95c15',
          800: '#8a4918',
          900: '#723c18',
          950: '#431f09',
        },
        // Deep wood browns
        wood: {
          50: '#faf6f1',
          100: '#f0e8dc',
          200: '#e0ceb6',
          300: '#cdb08b',
          400: '#bb9266',
          500: '#ae7d4f',
          600: '#9a6743',
          700: '#7f5139',
          800: '#6a4333',
          900: '#58392d',
          950: '#301c17',
        },
        // Warm cream
        cream: {
          50: '#fffef9',
          100: '#fefcf0',
          200: '#fdf8e1',
          300: '#faf0c8',
          400: '#f5e4a6',
          DEFAULT: '#faf7f0',
        },
        // Sage greens
        sage: {
          50: '#f4f7f4',
          100: '#e4ece4',
          200: '#c9d9c9',
          300: '#a4bfa4',
          400: '#7da07d',
          500: '#5d845d',
          600: '#496a49',
          700: '#3c553c',
          800: '#334533',
          900: '#2b3a2b',
          950: '#141f14',
        },
        // Bark tones for text
        bark: {
          DEFAULT: '#3d3028',
          light: '#6b5d52',
          lighter: '#8f8079',
        },
      },
      fontFamily: {
        sans: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        display: ['"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      },
      fontSize: {
        'body': ['18px', { lineHeight: '28px' }],
        'body-lg': ['20px', { lineHeight: '32px' }],
        'body-xl': ['22px', { lineHeight: '34px' }],
        'heading-sm': ['24px', { lineHeight: '32px' }],
        'heading': ['28px', { lineHeight: '36px' }],
        'heading-lg': ['36px', { lineHeight: '44px' }],
        'heading-xl': ['42px', { lineHeight: '52px' }],
        'display': ['48px', { lineHeight: '56px' }],
      },
      borderRadius: {
        'lodge': '12px',
        'lodge-lg': '16px',
        'lodge-xl': '20px',
      },
      boxShadow: {
        'lodge': '0 2px 12px rgba(61, 48, 40, 0.06)',
        'lodge-md': '0 4px 20px rgba(61, 48, 40, 0.10)',
        'lodge-lg': '0 8px 40px rgba(61, 48, 40, 0.14)',
        'lodge-inner': 'inset 0 2px 4px rgba(61, 48, 40, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'gentle-pulse': 'gentlePulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gentlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
