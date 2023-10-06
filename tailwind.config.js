/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      scale: {
        '-1': '-1',
      },
      colors: {
        'text-1': '#150B3C',
        'main-bg': '#FDFCFE',
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
        day: '#D7EB2A',
        evening: '#EB39E8',
        night: '#5534E0',
        off: '#271F3E',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        apple: ['Apple-SDG', 'sans-serif'],
        line: ['LINESeedKR', 'sans-serif'],
      },
      boxShadow: {
        'shadow-1': '0px 4px 34px #EDE9F5',
        'shadow-2': '3px 4px 20px 0px #D2C7E7',
        'shadow-3': '4px 4px 19px 0px #68519533',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
