/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#F7F7F5',
          subtle: '#F3F3F1',
          surface: '#FFFFFF',
          dark: '#111111',
          card: '#FFFFFF',
        },
        foreground: {
          DEFAULT: '#111111',
          subtle: '#4A4A46',
          muted: '#777772',
          light: '#AFAFAA',
          inverted: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E5E2',
          subtle: '#EBEBE8',
          strong: '#D9D9D5',
          dark: '#2A2A26',
        },
        brand: {
          DEFAULT: '#111111',
          nearBlack: '#181818',
        },
        // Restrained functional accents
        status: {
          success: {
            bg: '#F0FDF4',
            text: '#166534',
            border: '#DCFCE7',
          },
          warning: {
            bg: '#FFFBEB',
            text: '#92400E',
            border: '#FEF3C7',
          },
          error: {
            bg: '#FEF2F2',
            text: '#991B1B',
            border: '#FEE2E2',
          },
          info: {
            bg: '#F8FAFC',
            text: '#334155',
            border: '#E2E8F0',
          }
        }
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        DEFAULT: '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '14px',
        '2xl': '16px',
        'pill': '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'elevated': '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        'modal': '0 12px 28px 0 rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
