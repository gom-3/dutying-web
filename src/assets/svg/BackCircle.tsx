import type {SVGProps} from 'react';

const SvgBackCircle = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 52 52" {...props}>
        <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m30.5 17-9 9 9 9" />
        <circle cx={26} cy={26} r={25.5} fill="#fff" fillOpacity={0.3} stroke="#fff" />
    </svg>
);

export default SvgBackCircle;
