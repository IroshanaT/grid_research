/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: '#f3eadf',
        ink: '#121212',
        sand: '#fff7ef',
        ember: '#d86e42',
        moss: '#6b846d',
        line: 'rgba(18, 18, 18, 0.12)',
      },
      boxShadow: {
        soft: '0 26px 70px -45px rgba(18, 18, 18, 0.55)',
        insetGlow: 'inset 0 1px 0 rgba(255, 255, 255, 0.65)',
      },
    },
  },
  plugins: [],
}
