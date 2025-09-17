import type { SVGProps } from 'react';

const SvgInjectorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 45 45" {...props}>
    <path
      stroke="#ABABB4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="m31.875 5.625 7.5 7.5M35.625 9.375l-8.438 8.438M21.563 12.188l11.25 11.25M30.938 21.563 18.75 33.75h-7.5v-7.5l12.188-12.188M14.063 23.438l2.812 2.812M19.688 17.813l2.812 2.812M5.625 39.375l5.625-5.625"
    />
  </svg>
);

export default SvgInjectorIcon;
