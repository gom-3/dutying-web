import type { SVGProps } from 'react';
const SvgPenIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    viewBox="0 0 36 36"
    fill="none"
    stroke="#CEB6FF"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 30h6l15.75-15.75a4.243 4.243 0 0 0-6-6L6 24v6ZM20.25 9.75l6 6"
    />
  </svg>
);
export default SvgPenIcon;
