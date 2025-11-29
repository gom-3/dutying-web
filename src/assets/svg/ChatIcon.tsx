import type {SVGProps} from 'react';

const SvgChatIcon = ({fill, ...props}: SVGProps<SVGSVGElement> & {fill: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 21" {...props}>
        <path
            fill={fill}
            fillRule="evenodd"
            d="M4.185 0a3.6 3.6 0 0 0-3.6 3.6v9.783a3.6 3.6 0 0 0 3.6 3.6h2.93l1.65 2.857a.36.36 0 0 0 .623 0l1.65-2.857h2.93a3.6 3.6 0 0 0 3.6-3.6V3.6a3.6 3.6 0 0 0-3.6-3.6H4.185Z"
            clipRule="evenodd"
        />
    </svg>
);

export default SvgChatIcon;
