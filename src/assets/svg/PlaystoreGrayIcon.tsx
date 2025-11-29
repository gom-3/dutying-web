import type {SVGProps} from 'react';

const SvgPlaystoreGrayIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 19" {...props}>
        <path
            fill="#595961"
            d="M15.607 8.705a.891.891 0 0 1 .001 1.556L1.327 18.257A.891.891 0 0 1 0 17.48V1.518C0 .838.731.408 1.325.739l14.282 7.966Z"
        />
        <mask
            id="playstore_gray_icon_svg__a"
            width={17}
            height={19}
            x={0}
            y={0}
            maskUnits="userSpaceOnUse"
            style={{
                maskType: 'alpha',
            }}
        >
            <path
                fill="#EDE4FF"
                d="M15.607 8.705a.891.891 0 0 1 .001 1.556L1.327 18.257A.891.891 0 0 1 0 17.48V1.518C0 .838.731.408 1.325.739l14.282 7.966Z"
            />
        </mask>
        <g mask="url(#playstore_gray_icon_svg__a)">
            <path fill="#595961" fillRule="evenodd" d="M0 19V.07L.233.2l9.162 9.282L0 19Z" clipRule="evenodd" />
            <mask id="playstore_gray_icon_svg__b" width={15} height={23} x={-1} y={-2.037} fill="#000" maskUnits="userSpaceOnUse">
                <path fill="#fff" d="M-1-2.037h15v23H-1z" />
                <path
                    fillRule="evenodd"
                    d="m9.395 9.481 2.684 2.72L0 19 9.395 9.48ZM.233.2 12.08 6.762l-2.684 2.72L.233.198ZM0 .07.233.2 0-.038V.07Z"
                    clipRule="evenodd"
                />
            </mask>
            <path
                fill="#595961"
                fillRule="evenodd"
                d="m9.395 9.481 2.684 2.72L0 19 9.395 9.48ZM.233.2 12.08 6.762l-2.684 2.72L.233.198ZM0 .07.233.2 0-.038V.07Z"
                clipRule="evenodd"
            />
            <path
                fill="#F2F2F7"
                d="m12.079 12.2.343.61.799-.449-.644-.652-.498.492ZM0 19h-.7v1.197l1.043-.587L0 19Zm0 0-.498-.492-.202.204V19H0ZM12.079 6.762l.498.491.648-.657-.807-.447-.34.613ZM0 .07h-.7v.412l.36.2L0 .07Zm0-.107L.498-.53-.7-1.743v1.706H0Zm12.577 11.746L9.893 8.99l-.997.984 2.685 2.72.996-.984ZM.343 19.61l12.08-6.798-.687-1.22-12.08 6.799.687 1.22ZM-.7 19H.7-.7Zm1.198.492 9.395-9.518-.997-.983-9.394 9.518.996.983ZM12.418 6.15.573-.413-.106.812 11.74 7.374l.678-1.225ZM9.893 9.973l2.684-2.72-.996-.983-2.685 2.72.997.983Zm0-.983L.732-.292-.265.69l9.161 9.282.997-.983ZM.573-.413l-.234-.13L-.339.683l.233.13.679-1.225Zm.159.12L.498-.528l-.996.984.233.236.997-.983ZM-.7-.036V.07H.7v-.107H-.7Z"
                mask="url(#playstore_gray_icon_svg__b)"
            />
        </g>
    </svg>
);

export default SvgPlaystoreGrayIcon;
