import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        masar: {
          navy: '#0A1628',
          dark: '#0F2847',
          blue: '#1E4D8C',
          gold: '#C8A951',
          'gold-light': '#E8D48B',
          green: '#2D7D46',
          red: '#C1272D',
          sand: '#F5F0E8',
          cream: '#FDF8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
