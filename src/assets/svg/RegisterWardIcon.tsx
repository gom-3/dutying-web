import type { SVGProps } from 'react';

const SvgRegisterWardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" {...props}>
    <g
      stroke="#CEB6FF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      clipPath="url(#register_ward_icon_svg__a)"
    >
      <path d="M25 42H10a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v15M32 38h12M38 32v12" />
    </g>
    <defs>
      <clipPath id="register_ward_icon_svg__a">
        <path fill="#fff" d="M0 0h48v48H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgRegisterWardIcon;
