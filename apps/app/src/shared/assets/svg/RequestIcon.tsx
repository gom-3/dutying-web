import type {SVGProps} from 'react';

const SvgRequestIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 46 45" {...props}>
        <g stroke="#ABABB4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} clipPath="url(#request_icon_svg__a)">
            <path d="M38.408 38c-3.978-7.043-9.374-11-15-11-5.626 0-11.021 3.957-15 11M34.25 7.133a11.25 11.25 0 0 0-15.367 4.117L38.368 22.5A11.25 11.25 0 0 0 34.25 7.133Z" />
            <path d="M31.873 18.75c3.109-5.381 4.172-10.583 2.377-11.618C32.456 6.097 28.485 9.62 25.378 15M28.625 16.875 23 26.617" />
        </g>
        <defs>
            <clipPath id="request_icon_svg__a">
                <path fill="#fff" d="M.5 0h45v45H.5z" />
            </clipPath>
        </defs>
    </svg>
);

export default SvgRequestIcon;
