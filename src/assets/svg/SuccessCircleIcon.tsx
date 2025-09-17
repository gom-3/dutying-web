import type { SVGProps } from 'react';

const SvgSuccessCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 60 60" {...props}>
    <circle cx={30} cy={30} r={30} fill="#EDE4FF" />
    <circle cx={30} cy={30} r={23} fill="#844AFF" stroke="#844AFF" strokeWidth={2} />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="m20 30.75 6.667 8.75L40 22"
    />
  </svg>
);

export default SvgSuccessCircleIcon;
