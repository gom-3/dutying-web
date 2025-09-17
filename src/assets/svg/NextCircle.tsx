import type { SVGProps } from 'react';

const SvgNextCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 52 52" {...props}>
    <circle cx={26} cy={26} r={25.5} fill="#fff" fillOpacity={0.3} stroke="#fff" />
    <g clipPath="url(#next_circle_svg__a)">
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m21.5 17 9 9-9 9"
      />
    </g>
    <defs>
      <clipPath id="next_circle_svg__a">
        <path fill="#fff" d="M8 8h36v36H8z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgNextCircle;
