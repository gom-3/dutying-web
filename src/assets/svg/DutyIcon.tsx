import type { SVGProps } from 'react';
const SvgDutyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="46"
    height="46"
    fill="none"
    viewBox="0 0 46 46"
    {...props}
  >
    <g
      stroke="#ABABB4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      clipPath="url(#duty_icon_svg__a)"
    >
      <path d="M23.938 39.851H11.75A3.75 3.75 0 0 1 8 36.101v-22.5a3.75 3.75 0 0 1 3.75-3.75h22.5a3.75 3.75 0 0 1 3.75 3.75v9.375M30.5 6.101v7.5M15.5 6.101v7.5M8 21.101h30M30.5 36.101h11.25M36.125 30.476v11.25" />
    </g>
    <defs>
      <clipPath id="duty_icon_svg__a">
        <path fill="#fff" d="M.5.476h45v45H.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgDutyIcon;
