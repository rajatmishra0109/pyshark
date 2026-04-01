import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        border: 'var(--border)',
        primary: 'var(--text-primary)',
        muted: 'var(--text-secondary)',
        subtle: 'var(--text-tertiary)',
        accent: 'var(--accent-blue)',
        cyan: 'var(--accent-cyan)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-in': 'slide-in 0.2s ease-out',
        'fade-in': 'fade-in 0.15s ease-out',
      },
      keyframes: {
        'pulse-dot': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'slide-in': {
          from: { transform: 'translateY(-8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
