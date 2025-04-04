/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#264653',
        secondary: '#2A9D8F',
        accent: '#E9C46A',
        warning: '#F4A261',
        danger: '#E76F51',
      },
    },
  },
  plugins: [],
}

