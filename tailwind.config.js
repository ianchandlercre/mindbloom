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
        // Forest greens — deep, rich, national park
        forest: {
          950: '#071D0F',
          900: '#0D2818',
          800: '#1B4332',
          700: '#2D6A4F',
          600: '#40916C',
          500: '#52B788',
          400: '#74C69D',
          300: '#95D5B2',
          200: '#B7E4C7',
          100: '#D8F3DC',
          50:  '#F0FBF3',
        },
        // Warm ambers — firelight, lantern glow
        amber: {
          950: '#431407',
          900: '#78350F',
          800: '#92400E',
          700: '#B45309',
          600: '#D97706',
          500: '#F59E0B',
          400: '#FBBF24',
          300: '#FCD34D',
          200: '#FDE68A',
          100: '#FEF3C7',
          50:  '#FFFBEB',
        },
        // Wood browns — timber, bark, earth
        wood: {
          950: '#1C0A00',
          900: '#3D1C02',
          800: '#5C2D10',
          700: '#7C3F1E',
          600: '#9A5230',
          500: '#B86A42',
          400: '#C98B62',
          300: '#DAAC88',
          200: '#EAC9AA',
          100: '#F5E4D4',
          50:  '#FAF0E8',
        },
        // Cream — warm, welcoming backgrounds
        cream: {
          DEFAULT: '#FFFBF5',
          50:  '#FFFBF5',
          100: '#FFF8EC',
          200: '#FEF3DC',
          300: '#FDEAC5',
          400: '#FBDDA4',
          500: '#F8CC7E',
        },
        // Sage — muted, natural greens for accents
        sage: {
          700: '#3D6B4A',
          600: '#4A7C5F',
          500: '#6B8F71',
          400: '#8FAF95',
          300: '#B3CEB7',
          200: '#D0E5D3',
          100: '#EBF4ED',
        },
        // Stone — warm neutrals for text
        stone: {
          950: '#0C0A09',
          900: '#1C1917',
          800: '#292524',
          700: '#44403C',
          600: '#57534E',
          500: '#78716C',
          400: '#A8A29E',
          300: '#D6D3D1',
          200: '#E7E5E4',
          100: '#F5F5F4',
          50:  '#FAFAF9',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      fontSize: {
        'body':    ['18px', { lineHeight: '28px' }],
        'body-lg': ['20px', { lineHeight: '30px' }],
        'heading':    ['28px', { lineHeight: '36px' }],
        'heading-lg': ['36px', { lineHeight: '44px' }],
        'display':    ['48px', { lineHeight: '56px' }],
      },
      borderRadius: {
        'lodge':    '10px',
        'lodge-lg': '16px',
        'lodge-xl': '24px',
      },
      boxShadow: {
        'lodge':    '0 2px 8px rgba(27, 67, 50, 0.08)',
        'lodge-md': '0 4px 16px rgba(27, 67, 50, 0.12)',
        'lodge-lg': '0 8px 32px rgba(27, 67, 50, 0.18)',
        'lodge-xl': '0 16px 48px rgba(27, 67, 50, 0.22)',
        'amber':    '0 4px 16px rgba(217, 119, 6, 0.20)',
        'inner-lodge': 'inset 0 1px 3px rgba(27, 67, 50, 0.10)',
      },
      backgroundImage: {
        'gradient-lodge': 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)',
        'gradient-amber': 'linear-gradient(135deg, #B45309 0%, #D97706 100%)',
        'gradient-cream': 'linear-gradient(180deg, #FFFBF5 0%, #FFF8EC 100%)',
        'gradient-forest-top': 'linear-gradient(180deg, #1B4332 0%, #2D6A4F 60%, transparent 100%)',
      },
      animation: {
        'fade-in':       'fadeIn 0.4s ease-out',
        'slide-up':      'slideUp 0.4s ease-out',
        'slide-in-right':'slideInRight 0.35s ease-out',
        'scale-in':      'scaleIn 0.3s ease-out',
        'pulse-gentle':  'pulseGentle 2.5s ease-in-out infinite',
        'shimmer':       'shimmer 1.8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
