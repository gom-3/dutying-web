import {type DropResult, DragDropContext, Draggable, Droppable} from '@hello-pangea/dnd';
import {type RefObject} from 'react';
import {type TDutyRequest, type TRequestShift} from '@/entities/shift';
import {type TWardShiftType} from '@/entities/ward';
import {type TFocus} from '@/features/request-shift/model/types';
import {type TSkillLevelConfig} from '@/features/ward-skill/model/skill-level';
import RequestCalendarGridRow from './request-calendar-grid-row';

interface IRequestCalendarGridProps {
    requestShift: TRequestShift;
    focus: TFocus | null;
    readonly: boolean;
    canReorder?: boolean;
    separateWeekendColor: boolean;
    wardShiftTypeMap: Map<number, TWardShiftType>;
    dutyRequestLookup: Map<string, TDutyRequest>;
    connectedNurseIds: Set<number>;
    skillConfig: TSkillLevelConfig;
    levelsByNurseId: Record<number, number>;
    focusedCellRef: RefObject<HTMLDivElement | null>;
    onDragEnd?: (result: DropResult) => void;
    onSelectCell: (focus: TFocus) => void;
}

export default function RequestCalendarGrid({
    requestShift,
    focus,
    readonly,
    canReorder = false,
    separateWeekendColor,
    wardShiftTypeMap,
    dutyRequestLookup,
    connectedNurseIds,
    skillConfig,
    levelsByNurseId,
    focusedCellRef,
    onDragEnd,
    onSelectCell,
}: IRequestCalendarGridProps) {
    return (
        <DragDropContext onDragEnd={(result) => canReorder && onDragEnd?.(result)}>
            <div className="flex min-h-0 w-full flex-col gap-1 pb-1">
                {requestShift.divisionShiftNurses
                    .map((division) => division.filter((row) => row.shiftNurse.isWorker))
                    .map((rows, level) => {
                        if (rows.length === 0) return null;

                        return (
                            <Droppable droppableId={level.toString()} key={level}>
                                {(provided) => (
                                    <div ref={provided.innerRef} className="w-full" {...provided.droppableProps}>
                                        {rows.map((row, rowIndex) => (
                                            <Draggable
                                                draggableId={row.shiftNurse.shiftNurseId.toString()}
                                                index={rowIndex}
                                                key={row.shiftNurse.shiftNurseId}
                                                isDragDisabled={!canReorder}
                                            >
                                                {(draggableProvided) => (
                                                    <RequestCalendarGridRow
                                                        row={row}
                                                        rowIndex={rowIndex}
                                                        focus={focus}
                                                        readonly={readonly}
                                                        canReorder={canReorder}
                                                        separateWeekendColor={separateWeekendColor}
                                                        requestShift={requestShift}
                                                        wardShiftTypeMap={wardShiftTypeMap}
                                                        dutyRequestLookup={dutyRequestLookup}
                                                        connectedNurseIds={connectedNurseIds}
                                                        skillConfig={skillConfig}
                                                        skillLevel={levelsByNurseId[row.shiftNurse.nurseId]}
                                                        focusedCellRef={focusedCellRef}
                                                        draggableProvided={draggableProvided}
                                                        onSelectCell={onSelectCell}
                                                    />
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        );
                    })}
            </div>
        </DragDropContext>
    );
}
