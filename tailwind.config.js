/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          950: '#040711',
          900: '#070B19',
          850: '#0B1124',
          800: '#0F172E',
          750: '#15203D',
          700: '#1E294B',
          600: '#2A3B66',
          border: 'rgba(56, 189, 248, 0.15)',
          glow: 'rgba(56, 189, 248, 0.25)',
        },
        ops: {
          cyan: '#06B6D4',
          blue: '#3B82F6',
          emerald: '#10B981',
          amber: '#F59E0B',
          crimson: '#EF4444',
          purple: '#8B5CF6',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'hud': '0 0 20px -5px rgba(6, 182, 212, 0.2)',
        'hud-amber': '0 0 20px -5px rgba(245, 158, 11, 0.25)',
        'hud-red': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
        'hud-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
}
