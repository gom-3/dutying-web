import * as React from 'react';
import type { SVGProps } from 'react';
const SvgFullLogoTransparent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={92}
    height={26}
    fill="none"
    {...props}
  >
    <path fill="url(#full_logo_transparent_svg__a)" d="M.322 0h91.356v25.22H.322z" />
    <defs>
      <pattern
        id="full_logo_transparent_svg__a"
        width={1}
        height={1}
        patternContentUnits="objectBoundingBox"
      >
        <use xlinkHref="#full_logo_transparent_svg__b" transform="scale(.00193 .007)" />
      </pattern>
      <image
        xlinkHref="data:image/png;base64,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"
        id="full_logo_transparent_svg__b"
        width={518}
        height={143}
      />
    </defs>
  </svg>
);
export default SvgFullLogoTransparent;