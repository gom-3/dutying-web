import type {SVGProps} from 'react';

const SvgEnterIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
        <g clipPath="url(#enter_icon_svg__a)">
            <path
                stroke="#844AFF"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18 9v1a3 3 0 0 1-3 3H5m0 0 4-4m-4 4 4 4"
            />
        </g>
        <defs>
            <clipPath id="enter_icon_svg__a">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

export default SvgEnterIcon;
