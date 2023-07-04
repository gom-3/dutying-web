import type { SVGProps } from 'react';
const SvgNextIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 41 40" {...props}>
    <circle cx={20.799} cy={19.933} r={19.433} stroke="#CEB6FF" />
    <g clipPath="url(#next_icon_svg__a)">
      <path
        stroke="#CEB6FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.875}
        d="m17.924 11.308 8.626 8.625-8.626 8.625"
      />
    </g>
    <defs>
      <clipPath id="next_icon_svg__a">
        <path fill="#fff" d="M4.986 2.683h34.501v34.5h-34.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgNextIcon;
