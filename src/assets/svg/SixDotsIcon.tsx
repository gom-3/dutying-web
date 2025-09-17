import type { SVGProps } from 'react';

const SvgSixDotsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path fill="#fff" d="M0 0h30v30H0V0Z" />
    <path
      fill="#93939D"
      stroke="#93939D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6.25a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0ZM10 15a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0ZM10 23.75a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0ZM17.5 6.25a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0ZM17.5 15a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0ZM17.5 23.75a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0Z"
    />
  </svg>
);

export default SvgSixDotsIcon;
