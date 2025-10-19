/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#60A5FA', // Hover / secondary highlight
          600: '#2563EB', // Deep royal blue
        },
        neutral: {
          100: '#F9FAFB', // Main background
          700: '#334155', // Secondary text and icons
          900: '#0F172A', // High-contrast base for text
        },
        status: {
          success: '#22C55E', // Success (Offer)
          warning: '#F59E0B', // Warning (Interviewing)
          danger: '#EF4444', // Danger (Rejected)
        },
      },
      fontFamily: {
        'sans': ['Nunito Sans', 'sans-serif'],
        'display': ['Satoshi', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '40px',
      },
      fontSize: {
        'h1': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
        'ui-label': ['13px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }],
      },
      backdropBlur: {
        'md': '12px',
      },
    },
  },
  plugins: [],
}