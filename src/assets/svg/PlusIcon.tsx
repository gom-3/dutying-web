import type { SVGProps } from 'react';
const SvgPlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" {...props}>
    <path
      stroke="#93939D"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.5 14a10.5 10.5 0 1 0 21 0 10.5 10.5 0 0 0-21 0Z"
    />
    <path
      stroke="#93939D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.429}
      d="M9 14h10M14 9v10"
    />
  </svg>
);
export default SvgPlusIcon;
