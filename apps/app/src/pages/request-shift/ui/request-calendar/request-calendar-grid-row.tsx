import {cn} from '@dutying/utils/style';
import {type DraggableProvided} from '@hello-pangea/dnd';
import {type RefObject} from 'react';
import {type TDutyRequest, type TRequestShift} from '@/entities/shift';
import {type TWardShiftType} from '@/entities/ward';
import {type TFocus} from '@/features/request-shift/model/types';
import {type TSkillLevelConfig} from '@/features/ward-skill/model/skill-level';
import SkillBadge from '@/features/ward-skill/ui/skill-badge';
import {DragIcon, LinkedIcon, UnlinkedIcon} from '@/shared/assets/svg';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import RequestCalendarGridCell from './request-calendar-grid-cell';
import {REQUEST_CALENDAR_NAME_COLUMN_CLASS, REQUEST_CALENDAR_NURSE_NAME_TEXT_CLASS} from './request-calendar-layout';
import {getDutyRequestLookupKey, getRequestCalendarRowClassName} from './utils';

type TRequestShiftRow = TRequestShift['divisionShiftNurses'][number][number];

type TRequestCalendarGridRowProps = {
    row: TRequestShiftRow;
    rowIndex: number;
    focus: TFocus | null;
    readonly: boolean;
    canReorder: boolean;
    separateWeekendColor: boolean;
    requestShift: TRequestShift;
    wardShiftTypeMap: Map<number, TWardShiftType>;
    dutyRequestLookup: Map<string, TDutyRequest>;
    connectedNurseIds: Set<number>;
    skillConfig: TSkillLevelConfig;
    skillLevel: number | null | undefined;
    showSkillColumn: boolean;
    focusedCellRef: RefObject<HTMLDivElement | null>;
    draggableProvided: DraggableProvided;
    onSelectCell: (focus: TFocus) => void;
};

export default function RequestCalendarGridRow({
    row,
    rowIndex,
    focus,
    readonly,
    canReorder,
    separateWeekendColor,
    requestShift,
    wardShiftTypeMap,
    dutyRequestLookup,
    connectedNurseIds,
    skillConfig,
    skillLevel,
    showSkillColumn,
    focusedCellRef,
    draggableProvided,
    onSelectCell,
}: TRequestCalendarGridRowProps) {
    const {t} = useTypedTranslation();
    const isFocusedRow = focus?.shiftNurseId === row.shiftNurse.shiftNurseId;

    return (
        <div
            className={getRequestCalendarRowClassName({isFocusedRow})}
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
        >
            {canReorder ? (
                <div
                    className="relative flex w-6 shrink-0 items-center justify-center text-gray-4"
                    {...draggableProvided.dragHandleProps}
                    aria-label={t('page.request.calendar.reorderAria', {name: row.shiftNurse.name})}
                >
                    <DragIcon className="h-5 w-5 cursor-grab active:cursor-grabbing" />
                </div>
            ) : null}
            <div
                className={cn(
                    REQUEST_CALENDAR_NAME_COLUMN_CLASS,
                    REQUEST_CALENDAR_NURSE_NAME_TEXT_CLASS,
                    isFocusedRow && 'font-semibold text-main-1',
                )}
            >
                {row.shiftNurse.name}
            </div>
            {showSkillColumn ? (
                <div className="flex w-11 shrink-0 justify-center">
                    <SkillBadge level={skillLevel} config={skillConfig} className="min-h-[18px] min-w-10 px-1.5 text-[10px]" />
                </div>
            ) : null}
            <div className="flex w-6 shrink-0 items-center justify-center text-center font-apple text-[13px] text-sub-1">
                {connectedNurseIds.has(row.shiftNurse.nurseId) ? (
                    <LinkedIcon className="h-[17px] w-[17px]" />
                ) : (
                    <UnlinkedIcon className="h-[17px] w-[17px]" />
                )}
            </div>
            <div className="flex h-full flex-1 px-1">
                {row.wardReqShiftList.map((currentShiftTypeId, day) => {
                    const requestDutyRequest = dutyRequestLookup.get(getDutyRequestLookupKey(row.shiftNurse.nurseId, day)) ?? null;

                    return (
                        <RequestCalendarGridCell
                            key={day}
                            day={day}
                            isSampleCell={rowIndex === 0 && day === 0}
                            dayType={requestShift.days[day].dayType}
                            isFocusedRow={isFocusedRow}
                            shiftNurseId={row.shiftNurse.shiftNurseId}
                            shiftNurseName={row.shiftNurse.name}
                            currentShiftTypeId={currentShiftTypeId}
                            requestDutyRequest={requestDutyRequest}
                            focus={focus}
                            readonly={readonly}
                            separateWeekendColor={separateWeekendColor}
                            wardShiftTypeMap={wardShiftTypeMap}
                            focusedCellRef={focusedCellRef}
                            onSelectCell={onSelectCell}
                        />
                    );
                })}
            </div>
        </div>
    );
}
