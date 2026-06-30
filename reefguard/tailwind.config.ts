import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        surface: '#0d1117',
        reef: {
          teal: '#14b8a6',
          cyan: '#06b6d4',
        },
        posture: {
          healthy: '#10b981',
          watch: '#f59e0b',
          needs_improvement: '#f97316',
          poor: '#ef4444',
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up':         'fade-up 0.6s cubic-bezier(0.32,0.72,0,1) forwards',
        'fade-up-d1':      'fade-up 0.6s cubic-bezier(0.32,0.72,0,1) 0.08s forwards',
        'fade-up-d2':      'fade-up 0.6s cubic-bezier(0.32,0.72,0,1) 0.16s forwards',
        'fade-up-d3':      'fade-up 0.6s cubic-bezier(0.32,0.72,0,1) 0.24s forwards',
      },
    },
  },
  plugins: [],
};

export default config;
