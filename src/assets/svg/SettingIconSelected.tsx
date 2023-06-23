import type { SVGProps } from 'react';
const SvgSettingIconSelected = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={45} height={45} fill="none" {...props}>
    <g
      stroke="#844AFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      clipPath="url(#setting_icon_selected_svg__a)"
    >
      <path
        fill="#844AFF"
        d="M35.61 11.234a3.986 3.986 0 0 1 2.015 3.49v13.05c0 1.45-.794 2.787-2.075 3.49l-12.093 7.651a4.065 4.065 0 0 1-3.913 0L7.45 31.265a3.986 3.986 0 0 1-2.075-3.49V14.721c0-1.45.794-2.784 2.075-3.488l12.094-7.131a4.175 4.175 0 0 1 4.03 0l12.095 7.13h-.06Z"
      />
      <path fill="#fff" d="M14.625 21.5a6.875 6.875 0 1 0 13.75 0 6.875 6.875 0 0 0-13.75 0Z" />
    </g>
    <defs>
      <clipPath id="setting_icon_selected_svg__a">
        <path fill="#fff" d="M0 0h43v43H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgSettingIconSelected;
