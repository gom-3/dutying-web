import {Droppable} from '@hello-pangea/dnd';
import {type ComponentProps, type RefObject} from 'react';
import {type TWardShiftType, type TShift} from '@/entities';
import {type TDutyDoc} from '@/features/shift-editor/model';
import {FoldDutyIcon} from '@/shared/assets/svg';
import {type TLayerFlags, type TShiftCalendarFocus} from '../types';
import {ShiftCalendarRow} from './shift-calendar-row';

type TSelection = ComponentProps<typeof ShiftCalendarRow>['selection'];
type TSelectionRect = ComponentProps<typeof ShiftCalendarRow>['selectionRect'];
type TViolationMap = ComponentProps<typeof ShiftCalendarRow>['violations'];

type TShiftCalendarDivisionProps = {
    level: number;
    rows: TShift['divisionShiftNurses'][number];
    shift: TShift;
    readonly: boolean;
    folded: boolean;
    enableDragAndDrop: boolean;
    enableDivisionManagement: boolean;
    onToggleFoldLevel?: (level: number) => void;
    onEditDivision?: (opts: {shiftNurseId: number; level: number; direction: 1 | -1}) => void;
    onSelectNurse?: (nurseId: number | null) => void;
    onUpdateCarry?: (shiftNurseId: number, nextCarry: number) => void;
    workerRowMap: Map<string, {row: TDutyDoc['rows'][number]; index: number}>;
    doc: TDutyDoc;
    getCellShiftType: (rowIndex: number, colIndex: number) => TWardShiftType | null;
    idToType: Map<number, TWardShiftType>;
    shortNameToType: Map<string, TWardShiftType>;
    selection: TSelection;
    selectionRect: TSelectionRect;
    effectiveFocus: TShiftCalendarFocus | null;
    layerFlags: TLayerFlags;
    violations?: TViolationMap;
    separateWeekendColor: boolean;
    focusedCellRef: RefObject<HTMLParagraphElement | null>;
    onCellClick: (rowIndex: number, colIndex: number) => void;
    gridTemplateColumns: string;
};

export function ShiftCalendarDivision({
    level,
    rows,
    shift,
    readonly,
    folded,
    enableDragAndDrop,
    enableDivisionManagement,
    onToggleFoldLevel,
    onEditDivision,
    onSelectNurse,
    onUpdateCarry,
    workerRowMap,
    doc,
    getCellShiftType,
    idToType,
    shortNameToType,
    selection,
    selectionRect,
    effectiveFocus,
    layerFlags,
    violations,
    separateWeekendColor,
    focusedCellRef,
    onCellClick,
    gridTemplateColumns,
}: TShiftCalendarDivisionProps) {
    if (!rows.length) return null;

    if (folded) {
        return (
            <div
                className="flex h-7.5 w-full min-w-0 cursor-pointer items-center gap-[.125rem] rounded-[.625rem] bg-sub-4.5 px-[.625rem]"
                onClick={() => onToggleFoldLevel?.(level)}
            >
                <FoldDutyIcon className="h-5.5 w-5.5 rotate-180" />
                <p className="font-poppins text-base font-light text-sub-3">Duty {level + 1}</p>
                <p className="ml-4 font-poppins text-base font-light text-sub-3">{rows.length}명</p>
            </div>
        );
    }

    return (
        <Droppable droppableId={level.toString()} key={level.toString()}>
            {(provided) => (
                <div ref={provided.innerRef} className="flex w-full min-w-0 gap-5" {...provided.droppableProps}>
                    <div className="relative min-w-0 flex-1 rounded-[1.25rem] shadow-banner">
                        {!readonly && onToggleFoldLevel && (
                            <div className="absolute left-[-.9375rem] flex h-full w-7.5 items-center justify-center font-poppins font-light text-sub-2.5">
                                <FoldDutyIcon
                                    className="absolute top-[50%] left-0 z-10 h-5.5 w-5.5 translate-x-[50%] translate-y-[-50%] cursor-pointer"
                                    onClick={() => onToggleFoldLevel(level)}
                                />
                            </div>
                        )}
                        {rows.map((row, rowIndex) => {
                            const workerId = String(row.shiftNurse.shiftNurseId);
                            const docEntry = workerRowMap.get(workerId);

                            return (
                                <ShiftCalendarRow
                                    key={row.shiftNurse.shiftNurseId}
                                    row={row}
                                    rowIndex={rowIndex}
                                    rowsLength={rows.length}
                                    level={level}
                                    shift={shift}
                                    readonly={readonly}
                                    enableDragAndDrop={enableDragAndDrop}
                                    enableDivisionManagement={enableDivisionManagement}
                                    onEditDivision={onEditDivision}
                                    onSelectNurse={onSelectNurse}
                                    onUpdateCarry={onUpdateCarry}
                                    docRowIndex={docEntry?.index ?? -1}
                                    docRow={docEntry?.row}
                                    doc={doc}
                                    getCellShiftType={getCellShiftType}
                                    idToType={idToType}
                                    shortNameToType={shortNameToType}
                                    selection={selection}
                                    selectionRect={selectionRect}
                                    effectiveFocus={effectiveFocus}
                                    layerFlags={layerFlags}
                                    violations={violations}
                                    separateWeekendColor={separateWeekendColor}
                                    focusedCellRef={focusedCellRef}
                                    onCellClick={onCellClick}
                                    gridTemplateColumns={gridTemplateColumns}
                                />
                            );
                        })}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
}
