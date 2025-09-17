import type { SVGProps } from 'react';

const SvgXIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" {...props}>
    <circle cx={9} cy={9} r={9} fill="#ABABB4" />
    <g stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12.5 5.5-7 7M5.5 5.5l7 7" />
    </g>
  </svg>
);

export default SvgXIcon;
