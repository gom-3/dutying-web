import type { SVGProps } from 'react';
const SvgFoldIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 31 30" {...props}>
    <g
      stroke="#ABABB4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      clipPath="url(#fold_icon_svg__a)"
    >
      <path d="M14.106 8.75 7.856 15l6.25 6.25M21.606 8.75 15.356 15l6.25 6.25" />
    </g>
    <defs>
      <clipPath id="fold_icon_svg__a">
        <path fill="#fff" d="M.356 0h30v30h-30z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgFoldIcon;
