import {cn} from '@dutying/utils/style';
import {useMemo} from 'react';
import {type TShift, type TWardShiftType} from '@/entities';
import {useUIConfigStore} from '@/entities/ui/useUIConfig/store';
import {type TDutyDoc, useShiftEditorStore} from '@/features/shift-editor/model';
import {SHIFT_CALENDAR_DAY_GRID_CLASSNAME} from '@/features/shift-editor/ui/complex-view/shift-calendar/shift-calendar-layout';

interface ICountDutyByDayProps {
    shift: TShift;
    doc: TDutyDoc;
    focusDay?: number | null;
    className?: string;
    gridTemplateColumns: string;
    /** 일자 헤더 바로 아래: 별도 카드·그림자 없이 표 헤더 연장선에 맞춤 */
    variant?: 'underDateHeader' | 'card';
}

function CountDutyByDay({
    shift,
    doc,
    focusDay = null,
    className,
    gridTemplateColumns,
    variant = 'underDateHeader',
}: ICountDutyByDayProps) {
    const selection = useShiftEditorStore((s) => s.selection);
    const {shiftTypeColorStyle} = useUIConfigStore();
    const effectiveFocusDay = useMemo(() => {
        if (typeof focusDay === 'number') return focusDay;

        if (selection?.type !== 'single') return null;

        return selection.anchor.col;
    }, [focusDay, selection]);
    const countedShiftTypes = useMemo(() => shift.wardShiftTypes.filter((x) => x.isCounted), [shift.wardShiftTypes]);
    const shortNameToType = useMemo(() => {
        const map = new Map<string, TWardShiftType>();

        for (const t of shift.wardShiftTypes) {
            map.set(t.shortName, t);
        }

        return map;
    }, [shift.wardShiftTypes]);
    const getCountByDay = (dayIndex: number, wardShiftTypeId: number) =>
        doc.rows.filter((row) => {
            const cell = row.cells[dayIndex] ?? null;

            if (!cell) return false;

            return shortNameToType.get(cell)?.wardShiftTypeId === wardShiftTypeId;
        }).length;

    const isCard = variant === 'card';

    return (
        <div
            id="count_by_day"
            className={cn(
                'w-full min-w-0',
                isCard && 'overflow-hidden rounded-[1.25rem] bg-[#FDFCFE] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]',
                !isCard && 'border-t-[.0625rem] border-[#E0E0E0] bg-[#FDFCFE]',
                className,
            )}
        >
            {countedShiftTypes.map((wardShiftType) => (
                <div
                    key={wardShiftType.wardShiftTypeId}
                    className="grid h-8 w-full min-w-0 max-w-full items-center gap-x-2 border-b-[.0625rem] border-[#E0E0E0] last:border-b-0"
                    style={{gridTemplateColumns}}
                >
                    <div className="min-w-0" />
                    <div className="min-w-0" />
                    <div className="flex min-w-0 items-center justify-center">
                        <div
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[.3125rem] font-poppins text-[clamp(10px,0.72vw,15px)] leading-none"
                            style={
                                shiftTypeColorStyle === 'background'
                                    ? {backgroundColor: wardShiftType.color, color: 'white'}
                                    : {color: wardShiftType.color, backgroundColor: 'white'}
                            }
                        >
                            {wardShiftType.shortName}
                        </div>
                    </div>
                    <div
                        className={SHIFT_CALENDAR_DAY_GRID_CLASSNAME}
                        style={{gridTemplateColumns: `repeat(${doc.columns.length}, minmax(0, 1fr))`}}
                    >
                        {doc.columns.map((_date, i) => (
                            <div
                                key={i}
                                className={`relative flex h-full min-h-0 w-full min-w-0 items-center justify-center px-[.125rem] font-poppins text-[clamp(9px,0.65vw,12px)] tabular-nums text-sub-2 ${
                                    effectiveFocusDay === i ? 'bg-main-4' : ''
                                }`}
                            >
                                {getCountByDay(i, wardShiftType.wardShiftTypeId)}
                            </div>
                        ))}
                    </div>
                    <div className="min-w-0" aria-hidden />
                </div>
            ))}
        </div>
    );
}

export default CountDutyByDay;
