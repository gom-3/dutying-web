import type { SVGProps } from 'react';

const SvgEnterWardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" {...props}>
    <g
      stroke="#CEB6FF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      clipPath="url(#enter_ward_icon_svg__a)"
    >
      <path d="M25 42H10a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v15M31.313 38.063h13.125M31.313 38.063l5.625 5.624M31.313 38.063l5.625-5.626" />
    </g>
    <defs>
      <clipPath id="enter_ward_icon_svg__a">
        <path fill="#fff" d="M0 0h48v48H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgEnterWardIcon;
