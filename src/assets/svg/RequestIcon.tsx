import * as React from 'react';
import type { SVGProps } from 'react';
const SvgRequestIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="46"
    height="46"
    fill="none"
    viewBox="0 0 46 46"
    {...props}
  >
    <g
      stroke="#ABABB4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      clipPath="url(#request_icon_svg__a)"
    >
      <path d="M33.412 31.883a14.062 14.062 0 0 0-19.887 0M34.25 7.609a11.25 11.25 0 0 0-15.368 4.117l19.485 11.25A11.25 11.25 0 0 0 34.25 7.61Z" />
      <path d="M31.872 19.226c3.11-5.38 4.172-10.582 2.378-11.617-1.794-1.035-5.766 2.486-8.873 7.867M28.625 17.351 23 27.094M6.125 36.57A4.5 4.5 0 0 1 8 36.101a4.5 4.5 0 0 1 3.75 1.875 4.498 4.498 0 0 0 3.75 1.875 4.5 4.5 0 0 0 3.75-1.875A4.5 4.5 0 0 1 23 36.101a4.5 4.5 0 0 1 3.75 1.875 4.498 4.498 0 0 0 3.75 1.875 4.5 4.5 0 0 0 3.75-1.875A4.5 4.5 0 0 1 38 36.101a4.5 4.5 0 0 1 1.875.47" />
    </g>
    <defs>
      <clipPath id="request_icon_svg__a">
        <path fill="#fff" d="M.5.476h45v45H.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgRequestIcon;
