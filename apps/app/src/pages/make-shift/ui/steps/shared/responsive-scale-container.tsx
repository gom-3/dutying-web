import {cn} from '@dutying/utils/style';
import {type PropsWithChildren, useLayoutEffect, useRef, useState} from 'react';

type TResponsiveScaleContainerProps = PropsWithChildren<{
    /**
     * 콘텐츠가 컨테이너보다 넓을 때만 축소합니다.
     * 너무 작아지는 것을 막기 위해 최소 스케일을 둡니다.
     */
    minScale?: number;
    /**
     * 확대(업스케일) 최대값. 기본은 살짝만 확대되도록 제한합니다.
     * (너무 크게 확대하면 텍스트/선이 흐려질 수 있음)
     */
    maxScale?: number;
    /**
     * 컨테이너 폭이 이 값보다 작아지면 "축소" 대신
     * 최소 가독 폭으로 간주하고(스케일=1) 페이지 전체 가로 스크롤에 맡깁니다.
     */
    minSupportedWidth?: number;
    /**
     * 콘텐츠의 실제 폭 측정 대신, "디자인 기준 폭"으로 스케일을 계산합니다.
     * (transform scale은 레이아웃 폭을 바꾸지 않아서, 측정 오차가 있으면 클리핑이 쉽게 발생함)
     */
    designWidth?: number;
    disabled?: boolean;
    className?: string;
}>;

export function ResponsiveScaleContainer({
    children,
    minScale = 0.78,
    maxScale = 1.1,
    minSupportedWidth = 1280,
    designWidth,
    disabled = false,
    className,
}: TResponsiveScaleContainerProps) {
    const outerRef = useRef<HTMLDivElement | null>(null);
    const scaleRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);
    const [scaledHeight, setScaledHeight] = useState<number | null>(null);

    useLayoutEffect(() => {
        if (disabled) {
            setScale(1);
            setScaledHeight(null);
            return;
        }

        const outer = outerRef.current;
        const content = contentRef.current;
        const scaleEl = scaleRef.current;
        if (!outer || !content || !scaleEl) return;

        const compute = () => {
            const available = outer.clientWidth;
            const contentW = designWidth ?? content.scrollWidth;
            const contentH = content.scrollHeight;
            if (!available || !contentW) return;

            // Below the supported width, don't scale down further. Let the page scroll horizontally instead.
            const nextScale =
                minSupportedWidth && available < minSupportedWidth
                    ? 1
                    : Math.min(maxScale, Math.max(minScale, available / contentW));
            setScale(nextScale);
            setScaledHeight(contentH * nextScale);
        };

        compute();

        const ro = new ResizeObserver(() => compute());
        ro.observe(outer);
        ro.observe(content);

        window.addEventListener('resize', compute);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', compute);
        };
    }, [disabled, minScale, maxScale, minSupportedWidth, designWidth]);

    return (
        <div
            ref={outerRef}
            className={cn('w-full', className)}
            style={scaledHeight && scale !== 1 ? {height: scaledHeight, overflow: 'hidden'} : undefined}
        >
            <div
                ref={scaleRef}
                data-responsive-scale="true"
                data-scale={scale}
                style={{
                    transform: scale === 1 ? undefined : `scale(${scale})`,
                    transformOrigin: 'top left',
                    // transform은 레이아웃 폭을 줄이지 않으므로, 스케일된 결과가 컨테이너 폭을 "꽉" 차도록
                    // 반대로 width를 늘려서(1/scale) 시각적 폭을 맞춥니다.
                    width: scale === 1 ? undefined : `calc(100% / ${scale})`,
                }}
            >
                <div ref={contentRef} className="w-fit">
                    {children}
                </div>
            </div>
        </div>
    );
}

