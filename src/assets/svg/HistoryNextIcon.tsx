import type {SVGProps} from 'react';

const SvgHistoryNextIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" {...props}>
        <circle cx={14} cy={14} r={13} fill="#FDFCFE" stroke="#B08BFF" strokeWidth={0.5} />
        <g stroke="#B08BFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} clipPath="url(#history_next_icon_svg__a)">
            <path d="m16.5 15.667 3.333-3.334L16.5 9" />
            <path d="M19.833 12.334h-9.166a3.333 3.333 0 0 0 0 6.666h.833" />
        </g>
        <defs>
            <clipPath id="history_next_icon_svg__a">
                <path fill="#fff" d="M4 4h20v20H4z" />
            </clipPath>
        </defs>
    </svg>
);

export default SvgHistoryNextIcon;
