import React from 'react';
import {FaultDotIcon} from '@/shared/assets/svg';
import {type TViolation} from '../../model';

interface IViolationLayerProps {
    violation: TViolation;
    children?: React.ReactNode;
    /**
     * 일자 영역 최상위 `grid` 안에서 `grid-column: span`으로 깔 때.
     * (셀 내부 `width: N×100%`는 DOM/클릭 타깃을 깨뜨리기 쉬움)
     */
    spanningCell?: boolean;
}

const LEVEL_STYLE: Record<TViolation['level'], {border: string; background: string}> = {
    // 강 제약 (Step 2의 강 제약 조건 = error)
    error: {border: '#FF0000', background: '#ff000033'},
    // 약 제약 (Step 2의 약 제약 조건 = warning)
    warning: {border: '#FFD900', background: '#EEFF004D'},
};

function ViolationLayer({violation, children, spanningCell = false}: IViolationLayerProps) {
    const style = LEVEL_STYLE[violation.level];

    if (spanningCell) {
        return (
            <div
                className="group pointer-events-none relative flex h-full min-h-0 w-full min-w-0 cursor-help"
                title={violation.message}
                role="note"
                aria-label={violation.message}
            >
                <div
                    style={{borderColor: style.border, backgroundColor: style.background}}
                    className="pointer-events-auto absolute inset-y-0.5 left-[.0625rem] right-[.0625rem] z-10 origin-center rounded-[.5625rem] border-[.125rem] transition-transform duration-150 ease-out group-hover:scale-[1.085]"
                    aria-hidden
                />
                <FaultDotIcon className="pointer-events-none absolute top-[-0.55rem] right-0 z-20 h-3 w-3" aria-hidden />
                {children}
                <div className="pointer-events-none invisible absolute top-[calc(100%+0.25rem)] left-1/2 z-[100] w-max max-w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 rounded-md bg-white px-2.5 py-1.5 text-left font-apple text-xs leading-snug whitespace-normal text-sub-1 shadow-lg ring-1 ring-black/10 group-hover:visible">
                    {violation.message}
                </div>
            </div>
        );
    }

    const span = Math.max(1, violation.cells.length);

    return (
        <div
            style={{
                // 일자 칸은 `repeat(n, minmax(0, 1fr))`이라 셀마다 폭이 변함. 고정 rem은 스케일/뷰포트에서 어긋남.
                // 위반은 항상 같은 행의 연속 칸이므로, 시작 셀 기준 `span × 100%`로 실제 칸 폭에 맞춤.
                width: `${span * 100}%`,
            }}
            className={`group absolute inset-y-0.5 left-[.0625rem] cursor-help ${
                violation.level === 'error' ? 'z-[32]' : 'z-[22]'
            }`}
            title={violation.message}
            role="note"
            aria-label={violation.message}
        >
            <div
                style={{borderColor: style.border, backgroundColor: style.background}}
                className="pointer-events-auto absolute inset-0 z-10 origin-center rounded-[.5625rem] border-[.125rem] transition-transform duration-150 ease-out group-hover:scale-[1.085]"
                aria-hidden
            />
            <FaultDotIcon className="pointer-events-none absolute top-[-0.55rem] right-0 z-20 h-3 w-3" aria-hidden />
            {children}
            <div className="pointer-events-none invisible absolute top-[calc(100%+0.25rem)] left-1/2 z-[100] w-max max-w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 rounded-md bg-white px-2.5 py-1.5 text-left font-apple text-xs leading-snug whitespace-normal text-sub-1 shadow-lg ring-1 ring-black/10 group-hover:visible">
                {violation.message}
            </div>
        </div>
    );
}

export default ViolationLayer;
