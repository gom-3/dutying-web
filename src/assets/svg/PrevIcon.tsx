import type { SVGProps } from 'react';

const SvgPrevIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" {...props}>
    <circle cx={19.933} cy={19.933} r={19.433} stroke="#CEB6FF" />
    <path
      stroke="#CEB6FF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.875}
      d="m22.808 11.308-8.625 8.625 8.625 8.626"
    />
  </svg>
);

export default SvgPrevIcon;
