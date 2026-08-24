/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-base)',
        card: 'var(--bg-card)',
        textMain: 'var(--text-main)',
        textMuted: 'var(--text-muted)',
        primary: 'var(--accent-primary)',
        secondary: 'var(--accent-secondary)',
        borderLine: 'var(--border-color)',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', '"Courier New"', 'monospace'],
      }
    },
  },
  plugins: [],
}