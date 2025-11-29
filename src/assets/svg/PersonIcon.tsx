import type {SVGProps} from 'react';

const SvgPersonIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" {...props}>
        <g fill="#fff" clipPath="url(#person_icon_svg__a)">
            <path d="M5.334 4.667a2.667 2.667 0 1 0 5.333 0 2.667 2.667 0 0 0-5.333 0ZM3 14v-1.667A3.333 3.333 0 0 1 6.333 9h3.334A3.333 3.333 0 0 1 13 12.333V14" />
        </g>
        <defs>
            <clipPath id="person_icon_svg__a">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);

export default SvgPersonIcon;
