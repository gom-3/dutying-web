import {type TWardShiftType, type TShift} from '@/entities';

type TShiftCalendarHeaderProps = {
    shift: TShift;
    effectiveFocusDay?: number;
    separateWeekendColor: boolean;
    shiftTypeColorStyle: string;
    gridTemplateColumns: string;
};

export function ShiftCalendarHeader({
    shift,
    effectiveFocusDay,
    separateWeekendColor,
    shiftTypeColorStyle,
    gridTemplateColumns,
}: TShiftCalendarHeaderProps) {
    const offShiftType = shift.wardShiftTypes.find((x) => x.name === '오프');

    return (
        <div
            id="shift_calendar_header_grid"
            className="z-20 grid w-full min-w-0 items-center gap-x-2 py-1.5"
            style={{gridTemplateColumns, maxWidth: '100%'}}
        >
            <div className="min-w-0 truncate text-center font-apple text-[clamp(11px,0.7vw,14px)] font-medium text-sub-3">이름</div>
            <div className="text-center font-apple text-[clamp(11px,0.7vw,14px)] font-medium text-sub-3">이월</div>
            <div className="text-center font-apple text-[clamp(11px,0.7vw,14px)] font-medium text-sub-3">전달 근무</div>

            <div
                className="grid min-w-0 rounded-[2.5rem] border-[.0625rem] border-sub-4 px-2 py-[.1875rem]"
                style={{gridTemplateColumns: `repeat(${shift.days.length}, minmax(0, 1fr))`}}
            >
                {shift.days.map((item, j) => (
                    <p
                        key={j}
                        className={`min-w-0 rounded-full text-center font-poppins text-[clamp(9px,0.65vw,12px)] ${
                            item.dayType === 'saturday'
                                ? j === effectiveFocusDay
                                    ? separateWeekendColor
                                        ? 'bg-blue text-white'
                                        : 'bg-red text-white'
                                    : separateWeekendColor
                                      ? 'text-blue'
                                      : 'text-red'
                                : item.dayType === 'sunday' || item.dayType === 'holiday'
                                  ? j === effectiveFocusDay
                                      ? 'bg-red text-white'
                                      : 'text-red'
                                  : item.dayType === 'workday'
                                    ? j === effectiveFocusDay
                                        ? 'bg-main-1 text-white'
                                        : 'text-sub-2.5'
                                    : ''
                        } `}
                    >
                        {item.day}
                    </p>
                ))}
            </div>

            <div className="flex shrink-0 items-center gap-1.5 px-2.5 text-center">
                {shift.wardShiftTypes
                    .filter((x) => x.isCounted)
                    .map((shiftType: TWardShiftType) => (
                        <div
                            key={shiftType.wardShiftTypeId}
                            className="flex h-5 w-5 items-center justify-center rounded-[.3125rem] p-1.5 font-poppins text-[clamp(10px,0.72vw,15px)]"
                            style={
                                shiftTypeColorStyle === 'background'
                                    ? {backgroundColor: shiftType.color, color: 'white'}
                                    : {color: shiftType.color, backgroundColor: 'white'}
                            }
                        >
                            {shiftType.shortName}
                        </div>
                    ))}
                <div
                    className="flex h-5 w-5 items-center justify-center rounded-[.3125rem] bg-red p-1.5 font-poppins text-[clamp(9px,0.62vw,11px)] text-white"
                    style={
                        shiftTypeColorStyle === 'background'
                            ? {backgroundColor: offShiftType?.color, color: 'white'}
                            : {color: offShiftType?.color, backgroundColor: 'white'}
                    }
                >
                    WO
                </div>
            </div>
        </div>
    );
}
