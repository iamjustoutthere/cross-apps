/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fast Terminal Design System
        terminal: {
          bg: {
            primary: '#0A0A0A',
            secondary: '#141414',
            tertiary: '#1E1E1E',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#888888',
            muted: '#555555',
          },
          border: '#2A2A2A',
          accent: '#FF3D00',
          positive: '#00FF88',
          negative: '#FF3B3B',
          warning: '#FFB800',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Mono', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['1.5rem', { lineHeight: '1.2' }],
        'title': ['1.125rem', { lineHeight: '1.3' }],
        'body': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
        'micro': ['0.625rem', { lineHeight: '1.4' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'flash-positive': 'flashPositive 0.3s linear',
        'flash-negative': 'flashNegative 0.3s linear',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        flashPositive: {
          '0%': { backgroundColor: 'rgba(0, 255, 136, 0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
        flashNegative: {
          '0%': { backgroundColor: 'rgba(255, 59, 59, 0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
    },
  },
  plugins: [],
}
