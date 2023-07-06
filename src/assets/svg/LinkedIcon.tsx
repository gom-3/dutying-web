import type { SVGProps } from 'react';
const SvgLinkedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="#B08BFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m9 15 6-6M11 6l.463-.536a5 5 0 0 1 7.071 7.072L18 13M13 18l-.397.534a5.068 5.068 0 0 1-7.127 0 4.972 4.972 0 0 1 0-7.071L6 11"
    />
  </svg>
);
export default SvgLinkedIcon;
