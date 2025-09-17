import tailwindScrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        'real-screen': 'calc(var(--vh) * 100)',
      },

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
        red: '#FF4A80',
        blue: '#436DFF',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        apple: ['Apple-SDG', 'sans-serif'],
        line: ['LINESeedKR', 'sans-serif'],
      },
      boxShadow: {
        banner: '0rem .25rem 2.125rem #EDE9F5',
        'shadow-2': '.1875rem .25rem 1.25rem 0rem #D2C7E7',
        'shadow-3': '.25rem .25rem 1.1875rem 0rem #68519533',
      },
    },
    minHeight: {
      'real-screen': 'calc(var(--vh) * 100)',
    },
  },
  plugins: [tailwindScrollbarHide],
};
