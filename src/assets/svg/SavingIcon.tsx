import type { SVGProps } from 'react';
const SvgSavingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" {...props}>
    <g stroke="#93939D" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} clipPath="url(#saving_icon_svg__a)">
      <path d="M7.5 3.792a6.693 6.693 0 0 1 5 12.416m0-3.708v4.167h4.167M4.692 5.967v.01M3.383 9.166v.01M3.858 12.584v.01M5.967 15.308v.01M9.167 16.617v.01" />
    </g>
    <defs>
      <clipPath id="saving_icon_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgSavingIcon;
