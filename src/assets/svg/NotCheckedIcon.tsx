import * as React from 'react';
import type { SVGProps } from 'react';
const SvgNotCheckedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <rect width={24} height={24} fill="#ABABB4" rx={5} />
    <path stroke="#FDFCFE" strokeLinecap="round" strokeWidth={1.5} d="M6 12h12" />
  </svg>
);
export default SvgNotCheckedIcon;
