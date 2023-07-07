import type { SVGProps } from 'react';
const SvgLogoSymbolFill = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    fill="none"
    viewBox="0 0 29 30"
    {...props}
  >
    <path fill="url(#logo_symbol_fill_svg__a)" d="M0 0h28.5v30H0z" />
    <defs>
      <pattern
        id="logo_symbol_fill_svg__a"
        width={1}
        height={1}
        patternContentUnits="objectBoundingBox"
      >
        <use xlinkHref="#logo_symbol_fill_svg__b" transform="matrix(.00775 0 0 .00736 0 0)" />
      </pattern>
      <image
        xlinkHref="data:image/png;base64,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"
        id="logo_symbol_fill_svg__b"
        width={129}
        height={136}
      />
    </defs>
  </svg>
);
export default SvgLogoSymbolFill;
