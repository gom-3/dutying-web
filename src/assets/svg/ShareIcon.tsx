import type { SVGProps } from 'react';

const SvgShareIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <g stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
      <path d="M8 9H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1M12 14V3M9 6l3-3 3 3" />
    </g>
  </svg>
);

export default SvgShareIcon;
