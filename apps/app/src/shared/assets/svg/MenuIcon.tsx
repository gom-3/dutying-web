import type {SVGProps} from 'react';

const SvgMenuIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 31 30" {...props}>
        <g stroke="#ABABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} clipPath="url(#menu_icon_svg__a)">
            <path d="M5.037 7.5h20M5.037 15h20M5.037 22.5h20" />
        </g>
        <defs>
            <clipPath id="menu_icon_svg__a">
                <path fill="#fff" d="M.037 0h30v30h-30z" />
            </clipPath>
        </defs>
    </svg>
);

export default SvgMenuIcon;
