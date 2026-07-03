import {cn} from '@dutying/utils/style';
import {Pin} from 'lucide-react';
import {type RefObject} from 'react';
import {type TDutyRequest, type TRequestShift} from '@/entities/shift';
import ShiftBadge from '@/entities/shift/ui/shift-badge';
import {type TWardShiftType} from '@/entities/ward';
import {type TFocus} from '@/features/request-shift/model/types';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import {createRequestCalendarCellFocus, getDayCellClass, getRequestCalendarCellState} from './utils';

const REQUEST_SHIFT_STATUS_PIN_CLASS =
    'pointer-events-none absolute -top-[clamp(2px,0.2cqw,3px)] -left-[clamp(2px,0.2cqw,3px)] z-20 flex items-center justify-center text-[#2563EB]';
const REQUEST_SHIFT_STATUS_PIN_ICON_CLASS = 'size-[clamp(8px,0.62cqw,11px)]';
const REQUEST_SHIFT_STATUS_PIN_FILTER = 'drop-shadow(0 0 1px rgba(255,255,255,0.95)) drop-shadow(0 1px 1px rgba(15,23,42,0.32))';

type TRequestCalendarGridCellProps = {
    day: number;
    isSampleCell: boolean;
    dayType: TRequestShift['days'][number]['dayType'];
    isFocusedRow: boolean;
    shiftNurseId: number;
    shiftNurseName: string;
    currentShiftTypeId: number | null;
    requestDutyRequest: TDutyRequest | null;
    focus: TFocus | null;
    readonly: boolean;
    separateWeekendColor: boolean;
    wardShiftTypeMap: Map<number, TWardShiftType>;
    focusedCellRef: RefObject<HTMLDivElement | null>;
    onSelectCell: (focus: TFocus) => void;
};

export default function RequestCalendarGridCell({
    day,
    isSampleCell,
    dayType,
    isFocusedRow,
    shiftNurseId,
    shiftNurseName,
    currentShiftTypeId,
    requestDutyRequest,
    focus,
    readonly,
    separateWeekendColor,
    wardShiftTypeMap,
    focusedCellRef,
    onSelectCell,
}: TRequestCalendarGridCellProps) {
    const {t} = useTypedTranslation();
    const cellState = getRequestCalendarCellState({
        currentShiftTypeId,
        requestDutyRequest,
        focus,
        shiftNurseId,
        day,
        wardShiftTypeMap,
    });
    const hasAcceptedRequest = requestDutyRequest?.isAccepted === true;
    const isHighlightedCell = isFocusedRow || day === focus?.day;

    return (
        <button
            type="button"
            tabIndex={-1}
            data-readonly={readonly || undefined}
            onClick={() => {
                onSelectCell(createRequestCalendarCellFocus({shiftNurseName, shiftNurseId, day}));
            }}
            className={cn(
                'group relative flex h-full min-w-0 flex-1 cursor-pointer items-center justify-center border-0 bg-transparent px-px text-inherit',
                getDayCellClass(dayType, isHighlightedCell, separateWeekendColor),
            )}
        >
            <span className="relative z-10 flex min-w-0 items-center justify-center">
                <ShiftBadge
                    id={isSampleCell ? 'cell_sample' : undefined}
                    shiftType={cellState.shiftType}
                    isOnlyRequest={cellState.isOnlyRequest}
                    className={`transition-[box-shadow,transform] duration-150 ${cellState.isFocused ? 'ring-2 ring-main-1/70' : ''} ${cellState.isRejectedOnlyRequest ? 'opacity-30' : ''}`}
                    forwardRef={cellState.isFocused ? focusedCellRef : null}
                />
                {hasAcceptedRequest ? (
                    <span
                        aria-hidden
                        title={t('page.makeShift.calendar.requestStatusPin')}
                        data-request-shift-status-pin="true"
                        className={REQUEST_SHIFT_STATUS_PIN_CLASS}
                        style={{filter: REQUEST_SHIFT_STATUS_PIN_FILTER}}
                    >
                        <Pin className={REQUEST_SHIFT_STATUS_PIN_ICON_CLASS} strokeWidth={3} fill="currentColor" />
                    </span>
                ) : null}
            </span>
        </button>
    );
}
