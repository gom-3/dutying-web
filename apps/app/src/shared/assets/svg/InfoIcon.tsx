import type {SVGProps} from 'react';

const SvgInfoIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" fill="none" {...props}>
        <circle cx="13" cy="13" r="10.75" fill="none" stroke="currentColor" strokeWidth={2} />
        <circle cx="13" cy="9.6" r="1.35" fill="currentColor" />
        <rect x="11.35" y="13.25" width="3.3" height="5.5" rx="1.65" fill="currentColor" />
    </svg>
);

export default SvgInfoIcon;
