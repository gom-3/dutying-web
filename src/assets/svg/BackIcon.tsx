import type {SVGProps} from 'react';

const SvgBackIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" {...props}>
        <g stroke="#ABABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} clipPath="url(#back_icon_svg__a)">
            <path d="M10 24h28M10 24l12 12M10 24l12-12" />
        </g>
        <defs>
            <clipPath id="back_icon_svg__a">
                <path fill="#fff" d="M0 0h48v48H0z" />
            </clipPath>
        </defs>
    </svg>
);

export default SvgBackIcon;
