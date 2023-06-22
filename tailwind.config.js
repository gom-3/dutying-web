/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      scale: {
        '-1': '-1',
      },
      colors: {
        'main-1': '#844AFF',
        'main-2': '#B08BFF',
        'main-3': '#CEB6FF',
        'main-4': '#EDE4FF',
        'sub-1': '#242428',
        'sub-2': '#595961',
        'sub-2.5': '#93939D',
        'sub-3': '#ABABB4',
        'sub-4': '#D6D6D3',
        'sub-4.5': '#E7E7EF',
        'sub-5': '#F2F2F7',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        apple: ['Apple-SDG', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
