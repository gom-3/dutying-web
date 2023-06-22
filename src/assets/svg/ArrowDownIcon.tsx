import type { SVGProps } from 'react';
const SvgArrowDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} fill="none" {...props}>
    <path
      fill="#B08BFF"
      stroke="#B08BFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m10 16.667 10 10 10-10H10Z"
    />
  </svg>
);
export default SvgArrowDownIcon;
