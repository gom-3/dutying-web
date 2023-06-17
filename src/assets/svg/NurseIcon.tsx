import type { SVGProps } from 'react';
const SvgNurseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={46} height={46} fill="none" {...props}>
    <g
      stroke="#ABABB4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      clipPath="url(#nurse_icon_svg__a)"
    >
      <path d="M23 11.726c5.514 0 10.66 1.588 15 4.332l-3.75 18.168h-22.5L8 16.056a27.993 27.993 0 0 1 15-4.33ZM19.25 22.976h7.5M23 19.226v7.5" />
    </g>
    <defs>
      <clipPath id="nurse_icon_svg__a">
        <path fill="#fff" d="M.5.476h45v45H.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgNurseIcon;
