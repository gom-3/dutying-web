import type {SVGProps} from 'react';

const SvgInfoIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" {...props}>
        <g stroke="#93939D" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} clipPath="url(#info_icon_svg__a)">
            <path d="M1.913 17.592a12 12 0 1 1 22.173-9.184 12 12 0 0 1-22.173 9.184ZM13 9.596h.012" />
            <path d="M11.753 13.464h1.245v5.16h1.246" />
        </g>
        <defs>
            <clipPath id="info_icon_svg__a">
                <path fill="#fff" d="M0 0h26v26H0z" />
            </clipPath>
        </defs>
    </svg>
);

export default SvgInfoIcon;
