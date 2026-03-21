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
        // Primary palette — national park lodge
        forest: '#2B5F3E',
        'forest-dark': '#1A3D27',
        'forest-deeper': '#0F2418',
        'forest-light': '#3D7A55',
        'forest-pale': '#EAF3ED',

        // Warm amber / gold
        amber: '#C4841A',
        'amber-dark': '#8B5A0A',
        'amber-light': '#D4A040',
        'amber-pale': '#FDF3DC',

        // Warm cream backgrounds
        cream: '#F5F0E4',
        'cream-dark': '#E8DFCF',
        'cream-deep': '#D4C4A8',

        // Warm brown bark
        bark: '#5C3D1E',
        'bark-dark': '#3A2210',
        'bark-light': '#8B6040',

        // Neutral warm stone (text & UI)
        stone: '#4A4540',
        'stone-light': '#7A7268',
        'stone-pale': '#B0A898',

        // Kept for backward compatibility with game components
        'soft-blue': '#4A90D9',
        'soft-blue-light': '#6BA5E3',
        'soft-blue-dark': '#3A7BC8',
        sage: '#7CB97D',
        'sage-light': '#9DD09E',
        'sage-dark': '#5FA360',
        'warm-gray': '#4A4540',
        'warm-gray-light': '#7A7268',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
      },
      fontSize: {
        'body': ['18px', { lineHeight: '1.7' }],
        'body-lg': ['20px', { lineHeight: '1.7' }],
        'heading': ['28px', { lineHeight: '1.3' }],
        'heading-lg': ['36px', { lineHeight: '1.2' }],
        'heading-xl': ['48px', { lineHeight: '1.1' }],
        'display': ['60px', { lineHeight: '1.05' }],
      },
      borderRadius: {
        'warm': '10px',
        'warm-lg': '16px',
        'warm-xl': '24px',
      },
      boxShadow: {
        'warm': '0 2px 8px rgba(26, 22, 18, 0.07)',
        'warm-md': '0 4px 20px rgba(26, 22, 18, 0.10)',
        'warm-lg': '0 8px 40px rgba(26, 22, 18, 0.15)',
        'forest': '0 4px 20px rgba(27, 61, 39, 0.22)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
