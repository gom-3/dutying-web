import * as React from 'react';
import type { SVGProps } from 'react';
const SvgFoldDutyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" {...props}>
    <circle cx={11} cy={11} r={11} fill="#E7E7EF" transform="rotate(-180 11 11)" />
    <path
      stroke="#93939D"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.5 12.25 11 7.75l-4.5 4.5"
    />
  </svg>
);
export default SvgFoldDutyIcon;
