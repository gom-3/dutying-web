import * as React from 'react';
import type { SVGProps } from 'react';
const SvgNurseIconSelected = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="46"
    height="46"
    fill="none"
    viewBox="0 0 46 46"
    {...props}
  >
    <g
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      clipPath="url(#nurse_icon_selected_svg__a)"
    >
      <path
        fill="#844AFF"
        stroke="#844AFF"
        d="M23 11.47c5.514 0 10.66 1.588 15 4.331l-3.75 18.17h-22.5L8 15.798a27.993 27.993 0 0 1 15-4.329Z"
      />
      <path stroke="#FDFCFE" d="M19.25 22.72h7.5M23 18.97v7.5" />
    </g>
    <defs>
      <clipPath id="nurse_icon_selected_svg__a">
        <path fill="#fff" d="M.5.22h45v45H.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgNurseIconSelected;
