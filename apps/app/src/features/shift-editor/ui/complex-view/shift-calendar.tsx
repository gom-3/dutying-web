import {cn} from '@dutying/utils/style';
import {DragDropContext, type DropResult} from '@hello-pangea/dnd';
import {type ComponentProps, useEffect, useMemo, useRef} from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import {type TWardShiftType, type TShift} from '@/entities';
import {useUIConfigStore} from '@/entities/ui/useUIConfig/store';
import {type TDutyDoc, useShiftEditorCommands, useShiftEditorStore} from '@/features/shift-editor/model';
import {normalizeSelection} from '@/features/shift-editor/model/selection';
import CountDutyByDay from './count-duty-by-day';
import {ShiftCalendarDivision} from './shift-calendar/shift-calendar-division';
import {ShiftCalendarHeader} from './shift-calendar/shift-calendar-header';
import {SHIFT_CALENDAR_GRID_TEMPLATE_COLUMNS} from './shift-calendar/shift-calendar-layout';
import {type TLayerFlags, type TShiftCalendarFocus} from './types';
import type ViolationLayer from './violation-layer';

type TViolationItem = ComponentProps<typeof ViolationLayer>['violation'];

interface IShiftCalendarProps {
    shift: TShift;
    doc: TDutyDoc;
    readonly?: boolean;
    onCellClick?: (rowIndex: number, colIndex: number) => void;
    disableInitialSelection?: boolean;
    focus?: TShiftCalendarFocus | null;
    showLayer?: TLayerFlags;
    violations?: Map<string, TViolationItem>;
    foldedLevels?: boolean[];
    onToggleFoldLevel?: (level: number) => void;
    onUpdateCarry?: (shiftNurseId: number, nextCarry: number) => void;
    onSelectNurse?: (nurseId: number | null) => void;
    enableDragAndDrop?: boolean;
    onDragEnd?: (result: DropResult) => void;
    enableDivisionManagement?: boolean;
    onEditDivision?: (opts: {shiftNurseId: number; level: number; direction: 1 | -1}) => void;
    clearSelectionOnClickAway?: boolean;
    exportMode?: boolean;
    /** 일별 합계를 일자 헤더 바로 아래에 두어 본문과 동일 가로 기준으로 맞춤 */
    showCountByDay?: boolean;
}

function ShiftCalendar({
    shift,
    doc,
    readonly = false,
    onCellClick,
    disableInitialSelection = false,
    focus,
    showLayer,
    violations,
    foldedLevels,
    onToggleFoldLevel,
    onUpdateCarry,
    onSelectNurse,
    enableDragAndDrop = false,
    onDragEnd,
    enableDivisionManagement = false,
    onEditDivision,
    clearSelectionOnClickAway = true,
    exportMode: _exportMode = false,
    showCountByDay = false,
}: IShiftCalendarProps) {
    const {separateWeekendColor, shiftTypeColorStyle} = useUIConfigStore();
    const commands = useShiftEditorCommands();
    const selection = useShiftEditorStore((s) => s.selection);
    const focusedCellRef = useRef<HTMLParagraphElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const didClearInitialSelection = useRef(false);
    const clickAwayRef = useOnclickOutside(() => {
        if (!clearSelectionOnClickAway) return;

        commands.clearSelection();
        onSelectNurse?.(null);
    });
    const {idToType, shortNameToType} = useMemo(() => {
        const idMap = new Map<number, TWardShiftType>();
        const shortNameMap = new Map<string, TWardShiftType>();

        for (const t of shift.wardShiftTypes) {
            idMap.set(t.wardShiftTypeId, t);
            shortNameMap.set(t.shortName, t);
        }

        return {idToType: idMap, shortNameToType: shortNameMap};
    }, [shift.wardShiftTypes]);
    const workerRowMap = useMemo(() => {
        const map = new Map<string, {row: TDutyDoc['rows'][number]; index: number}>();

        doc.rows.forEach((row, index) => {
            map.set(row.workerId, {row, index});
        });

        return map;
    }, [doc]);
    const divisions = useMemo(
        () =>
            shift.divisionShiftNurses.map((division) => ({
                rows: division.filter((x) => x.shiftNurse.isWorker),
            })),
        [shift.divisionShiftNurses],
    );
    const selectionRect = useMemo(() => {
        if (!selection) return null;

        return normalizeSelection(selection);
    }, [selection]);
    const derivedFocus = useMemo(() => {
        if (selection?.type !== 'single') return null;

        const workerId = doc.rows[selection.anchor.row]?.workerId;
        const shiftNurseId = workerId ? Number(workerId) : NaN;

        if (!workerId || Number.isNaN(shiftNurseId)) return null;

        return {shiftNurseId, day: selection.anchor.col};
    }, [doc.rows, selection]);
    const effectiveFocus = focus ?? derivedFocus;
    const layerFlags: TLayerFlags = showLayer ?? {fault: false, check: false, slash: false};
    const gridTemplateColumns = SHIFT_CALENDAR_GRID_TEMPLATE_COLUMNS;

    useEffect(() => {
        if (!effectiveFocus) return;

        const focusRect = focusedCellRef.current?.getBoundingClientRect();
        const container = containerRef.current;

        if (!focusRect || !container) return;

        if (focusRect.y + focusRect.height - container.offsetTop > container.clientHeight) {
            window.scroll({top: focusRect.top + container.scrollTop});
        }

        if (focusRect.y - container.offsetTop < 0) {
            window.scroll({top: focusRect.top + window.scrollY - 132});
        }
    }, [effectiveFocus]);

    useEffect(() => {
        if (!disableInitialSelection || didClearInitialSelection.current) return;

        if (selection?.type === 'single' && selection.anchor.row === 0 && selection.anchor.col === 0) {
            commands.clearSelection();
            didClearInitialSelection.current = true;
        }
    }, [commands, disableInitialSelection, selection]);

    const handleDragEnd = (result: DropResult) => {
        if (!enableDragAndDrop || readonly) return;

        onDragEnd?.(result);
    };
    const handleCellClick = (rowIndex: number, colIndex: number) => {
        if (readonly) return;

        commands.select({row: rowIndex, col: colIndex});
        onCellClick?.(rowIndex, colIndex);
    };
    const getCellShiftType = (rowIndex: number, colIndex: number): TWardShiftType | null => {
        const cell = doc.rows[rowIndex]?.cells[colIndex] ?? null;

        if (cell === null || cell === '') return null;

        return shortNameToType.get(cell) ?? null;
    };

    return (
        <div id="calendar" ref={clickAwayRef} className={cn('flex w-full flex-col overflow-visible')}>
            {/* 헤더/로우가 동일한 padding 기준선을 공유해야 정렬이 정확히 맞습니다. */}
            <div>
                <ShiftCalendarHeader
                    shift={shift}
                    effectiveFocusDay={effectiveFocus?.day}
                    separateWeekendColor={separateWeekendColor}
                    shiftTypeColorStyle={shiftTypeColorStyle}
                    gridTemplateColumns={gridTemplateColumns}
                />
                {showCountByDay && (
                    <div className="z-20 w-full min-w-0">
                        <CountDutyByDay shift={shift} doc={doc} gridTemplateColumns={gridTemplateColumns} variant="underDateHeader" />
                    </div>
                )}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div
                        className="-mt-4 flex flex-col gap-px overflow-visible pt-4 pb-4"
                        ref={containerRef}
                    >
                        {divisions.map((division, level) => (
                            <ShiftCalendarDivision
                                key={level}
                                level={level}
                                rows={division.rows}
                                shift={shift}
                                readonly={readonly}
                                folded={Boolean(foldedLevels?.[level])}
                                enableDragAndDrop={enableDragAndDrop}
                                enableDivisionManagement={enableDivisionManagement}
                                onToggleFoldLevel={onToggleFoldLevel}
                                onEditDivision={onEditDivision}
                                onSelectNurse={onSelectNurse}
                                onUpdateCarry={onUpdateCarry}
                                workerRowMap={workerRowMap}
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
                                onCellClick={handleCellClick}
                                gridTemplateColumns={gridTemplateColumns}
                            />
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}

export default ShiftCalendar;
