import type { SVGProps } from 'react';
const SvgCheckedIcon = ({ fill, ...props }: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <rect width={24} height={24} fill={fill || '#844AFF'} rx={5} />
    <path stroke="#FDFCFE" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m6.75 12 3.75 5L18 7" />
  </svg>
);
export default SvgCheckedIcon;
