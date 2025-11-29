import type {SVGProps} from 'react';

const LogoGray = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 17" {...props}>
        <g clipPath="url(#logo_with_symbol_gray_svg__a)">
            <path
                fill="#595961"
                d="m.018 14.914.114-12.9A2 2 0 0 1 2.15.03l5.321.047c2.844-.144 8.518 1.306 8.456 8.254-.061 6.947-5.763 8.66-8.606 8.648l-5.32-.047a2 2 0 0 1-1.983-2.019Z"
            />
            <path stroke="#fff" strokeLinecap="round" strokeWidth={2.501} d="M5.34 11.6c1.497.35 4.715.143 5.604-3.477" />
        </g>
        <defs>
            <clipPath id="logo_with_symbol_gray_svg__a">
                <path fill="#fff" d="M0 0h16v17H0z" />
            </clipPath>
        </defs>
    </svg>
);

export default LogoGray;
