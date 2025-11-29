import type {SVGProps} from 'react';

const SvgCameraIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 19" {...props}>
        <path
            stroke={props.stroke ?? '#93939d'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.889 5.444h.778A1.556 1.556 0 0 0 6.222 3.89.778.778 0 0 1 7 3.11h4.667a.778.778 0 0 1 .777.778A1.556 1.556 0 0 0 14 5.444h.778A1.555 1.555 0 0 1 16.333 7v7a1.555 1.555 0 0 1-1.555 1.556H3.888A1.556 1.556 0 0 1 2.334 14V7A1.556 1.556 0 0 1 3.89 5.444Z"
        />
        <path
            stroke={props.stroke ?? '#93939d'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 10.111a2.333 2.333 0 1 0 4.667 0 2.333 2.333 0 0 0-4.667 0Z"
        />
    </svg>
);

export default SvgCameraIcon;
