import type { SVGProps } from 'react';
const SvgFullLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={92}
    height={25}
    fill="none"
    {...props}
  >
    <path fill="url(#full_logo_svg__a)" d="M.5 0h91v25H.5z" />
    <defs>
      <pattern id="full_logo_svg__a" width={1} height={1} patternContentUnits="objectBoundingBox">
        <use xlinkHref="#full_logo_svg__b" transform="matrix(.00193 0 0 .00703 0 -.002)" />
      </pattern>
      <image
        xlinkHref="data:image/png;base64,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"
        id="full_logo_svg__b"
        width={518}
        height={143}
      />
    </defs>
  </svg>
);
export default SvgFullLogo;
