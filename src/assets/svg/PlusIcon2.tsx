import type {SVGProps} from 'react';

const SvgPlusIcon2 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" {...props}>
        <circle cx={10} cy={10} r={9} fill="#fff" stroke="#93939D" strokeWidth={1.5} />
        <path
            fill="#93939D"
            fillRule="evenodd"
            d="M10.75 5.714a.75.75 0 0 0-1.5 0V9.25H5.715a.75.75 0 0 0 0 1.5H9.25v3.535a.75.75 0 0 0 1.5 0V10.75h3.536a.75.75 0 0 0 0-1.5H10.75V5.714Z"
            clipRule="evenodd"
        />
    </svg>
);

export default SvgPlusIcon2;
