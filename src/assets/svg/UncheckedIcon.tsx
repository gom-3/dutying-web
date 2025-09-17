import type { SVGProps } from 'react';

const SvgUncheckedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 31 31" {...props}>
    <rect width={30} height={30} x={0.5} y={0.5} fill="#fff" stroke="#D6D6DE" rx={6.5} />
    <g clipPath="url(#unchecked_icon_svg__a)">
      <path
        stroke="#D6D6DE"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m10 16.167 4.167 4.166L22.5 12"
      />
    </g>
    <defs>
      <clipPath id="unchecked_icon_svg__a">
        <path fill="#fff" d="M6 6h20v20H6z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgUncheckedIcon;
