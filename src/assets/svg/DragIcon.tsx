import type { SVGProps } from 'react';

const SvgDragIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="#ABABB4"
      stroke="#ABABB4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.5}
      d="M8 5a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM8 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM8 19a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM14 5a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM14 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM14 19a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"
    />
  </svg>
);

export default SvgDragIcon;
