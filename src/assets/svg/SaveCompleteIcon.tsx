import type { SVGProps } from 'react';
const SvgSaveCompleteIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" {...props}>
    <g stroke="#93939D" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} clipPath="url(#save_complete_icon_svg__a)">
      <path d="M2.5 10a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0Z" />
      <path d="m7.5 10 1.667 1.667L12.5 8.333" />
    </g>
    <defs>
      <clipPath id="save_complete_icon_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgSaveCompleteIcon;
