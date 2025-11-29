import type {SVGProps} from 'react';

const SvgMinusIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
        <g stroke="#F9A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} clipPath="url(#minus_icon_svg__a)">
            <path d="M3 12a9 9 0 1 0 18.001 0A9 9 0 0 0 3 12ZM9 12h6" />
        </g>
        <defs>
            <clipPath id="minus_icon_svg__a">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

export default SvgMinusIcon;
