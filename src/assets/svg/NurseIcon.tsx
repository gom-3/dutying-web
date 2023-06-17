import * as React from 'react';
import type { SVGProps } from 'react';
const SvgNurseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="46"
    height="45"
    fill="none"
    viewBox="0 0 46 45"
    {...props}
  >
    <g
      stroke="#ABABB4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      clipPath="url(#nurse_icon_svg__a)"
    >
      <path d="M23 11.25c5.514 0 10.66 1.588 15 4.331L34.25 33.75h-22.5L8 15.58a27.994 27.994 0 0 1 15-4.33ZM19.25 22.5h7.5M23 18.75v7.5" />
    </g>
    <defs>
      <clipPath id="nurse_icon_svg__a">
        <path fill="#fff" d="M.5 0h45v45H.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgNurseIcon;
