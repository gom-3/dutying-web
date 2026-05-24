import {cn} from '@dutying/utils/style';
import {type ComponentProps, type RefObject} from 'react';
import {type TShift} from '@/entities';
import {type TDutyDoc} from '@/features/shift-editor/model';
import {ResponsiveScaleContainer} from '@/pages/make-shift/ui/steps/shared/responsive-scale-container';
import ShiftCalendar from './shift-calendar';

type TShiftEditorCanvasProps = {
    shift: TShift;
    doc: TDutyDoc;
    className?: string;
    showCountByDay?: boolean;
    exportMode?: boolean;
    exportRef?: RefObject<HTMLDivElement | null>;
    calendarProps?: Omit<ComponentProps<typeof ShiftCalendar>, 'shift' | 'doc' | 'exportMode' | 'showCountByDay'>;
};

export function ShiftEditorCanvas({
    shift,
    doc,
    className,
    showCountByDay = true,
    exportMode = false,
    exportRef,
    calendarProps,
}: TShiftEditorCanvasProps) {
    return (
        <div ref={exportRef} className={cn('flex w-full min-w-0 flex-col items-start', className)}>
            <ResponsiveScaleContainer
                disabled={exportMode}
                // 캘린더+우측통계+하단통계를 "디자인 기준폭"으로 일괄 스케일
                // 실제 콘텐츠 폭을 기준으로 스케일 (너비 측정 오차는 width 보정으로 해결)
                minScale={0.62}
                maxScale={1.08}
                // 이 뷰에서는 사이드바/패딩으로 가용 폭이 1280 미만이 자주 발생하므로
                // 스케일을 항상 적용하고(필요하면) 페이지 전체 스크롤 정책은 상위 컨테이너가 담당합니다.
                minSupportedWidth={0}
                className="w-full"
            >
                <div className="w-fit">
                    <ShiftCalendar
                        shift={shift}
                        doc={doc}
                        exportMode={exportMode}
                        showCountByDay={showCountByDay}
                        {...calendarProps}
                    />
                </div>
            </ResponsiveScaleContainer>
        </div>
    );
}
