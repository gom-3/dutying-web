import type { SVGProps } from 'react';
const SvgSettingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={45} height={45} fill="none" {...props}>
    <g
      stroke="#ABABB4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      clipPath="url(#setting_icon_svg__a)"
    >
      <path d="M36.11 11.71a3.986 3.986 0 0 1 2.015 3.49v13.05c0 1.45-.794 2.787-2.075 3.49l-12.093 7.651a4.065 4.065 0 0 1-3.913 0L7.95 31.741a3.987 3.987 0 0 1-2.075-3.49V15.198c0-1.449.794-2.784 2.075-3.488l12.094-7.13a4.175 4.175 0 0 1 4.03 0l12.095 7.13h-.06Z" />
      <path d="M16.625 21.976a5.375 5.375 0 1 0 10.75 0 5.375 5.375 0 0 0-10.75 0Z" />
    </g>
    <defs>
      <clipPath id="setting_icon_svg__a">
        <path fill="#fff" d="M.5.476h43v43H.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgSettingIcon;
