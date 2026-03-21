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
        cream: '#FFF8F0',
        'cream-dark': '#F5EDE0',
        'soft-blue': '#4A90D9',
        'soft-blue-light': '#6BA5E3',
        'soft-blue-dark': '#3A7BC8',
        sage: '#7CB97D',
        'sage-light': '#9DD09E',
        'sage-dark': '#5FA360',
        amber: '#E8A849',
        'amber-light': '#F0C06E',
        'amber-dark': '#D49530',
        'warm-gray': '#6B6560',
        'warm-gray-light': '#9B9590',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      },
      fontSize: {
        'body': ['18px', '28px'],
        'body-lg': ['20px', '30px'],
        'heading': ['28px', '36px'],
        'heading-lg': ['36px', '44px'],
      },
      borderRadius: {
        'warm': '12px',
        'warm-lg': '16px',
      },
      boxShadow: {
        'warm': '0 2px 8px rgba(107, 101, 96, 0.08)',
        'warm-md': '0 4px 16px rgba(107, 101, 96, 0.12)',
        'warm-lg': '0 8px 32px rgba(107, 101, 96, 0.16)',
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
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
