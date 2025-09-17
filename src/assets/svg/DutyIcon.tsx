import type { SVGProps } from 'react';

const SvgDutyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 46 45" {...props}>
    <g
      stroke="#ABABB4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      clipPath="url(#duty_icon_svg__a)"
    >
      <path d="M23.938 39.375H11.75A3.75 3.75 0 0 1 8 35.625v-22.5a3.75 3.75 0 0 1 3.75-3.75h22.5a3.75 3.75 0 0 1 3.75 3.75V22.5M30.5 5.625v7.5M15.5 5.625v7.5M8 20.625h30M30.5 35.625h11.25M36.125 30v11.25" />
    </g>
    <defs>
      <clipPath id="duty_icon_svg__a">
        <path fill="#fff" d="M.5 0h45v45H.5z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgDutyIcon;
