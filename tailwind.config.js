/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'main-1': '#844AFF',
        'main-2': '#B08BFF',
        'main-3': '#CEB6FF',
        'main-4': '#EDE4FF',
        'sub-1': '#242428',
        'sub-2': '#595961',
        'sub-3': '#ABABB4',
        'sub-4': '#D6D6D3',
      },
    },
  },
  plugins: [],
};
