import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#035483',
          900: '#0c2e4e',
        },
        school: {
          blue: '#1e3a8a',
          navy: '#0f172a',
          gold: '#eab308',
        },
        // Semantic surface tokens — read from CSS variables so the same
        // class works in both light and dark mode. Defined in globals.css.
        surface: {
          DEFAULT: 'var(--surface)',
          raised: 'var(--surface-raised)',
          sunken: 'var(--surface-sunken)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          subtle: 'var(--border-subtle)',
        },
        status: {
          success: '#059669',
          'success-bg': 'var(--status-success-bg)',
          warning: '#d97706',
          'warning-bg': 'var(--status-warning-bg)',
          danger: '#e11d48',
          'danger-bg': 'var(--status-danger-bg)',
          info: '#0284c7',
          'info-bg': 'var(--status-info-bg)',
        },
      },
      borderRadius: {
        card: '1rem',      // 16px — standard content surfaces
        control: '0.75rem', // 12px — buttons, inputs, nav items
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(15 23 42 / 0.04)',
        card: '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)',
        raised: '0 4px 16px -4px rgb(15 23 42 / 0.10), 0 2px 6px -2px rgb(15 23 42 / 0.06)',
        modal: '0 20px 40px -12px rgb(15 23 42 / 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
