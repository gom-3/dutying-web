import {Draggable} from '@hello-pangea/dnd';
import {type ComponentProps, type RefObject, useMemo} from 'react';
import {type TWardShiftType, type TShift} from '@/entities';
import ShiftBadge from '@/entities/shift/ui/shift-badge';
import {type TDutyDoc, type TSelection} from '@/features/shift-editor/model';
import {DragIcon, MinusIcon, PlusIcon2} from '@/shared/assets/svg';
import RequestLayer from '../request-layer';
import {type TLayerFlags, type TShiftCalendarFocus} from '../types';
import ViolationLayer from '../violation-layer';
import {SHIFT_CALENDAR_DAY_GRID_CLASSNAME} from './shift-calendar-layout';
import {getWeekendCellBg} from './shift-calendar-utils';

type TViolationItem = ComponentProps<typeof ViolationLayer>['violation'];

type TShiftCalendarRowProps = {
    row: TShift['divisionShiftNurses'][number][number];
    rowIndex: number;
    rowsLength: number;
    level: number;
    shift: TShift;
    readonly: boolean;
    enableDragAndDrop: boolean;
    enableDivisionManagement: boolean;
    onEditDivision?: (opts: {shiftNurseId: number; level: number; direction: 1 | -1}) => void;
    onSelectNurse?: (nurseId: number | null) => void;
    onUpdateCarry?: (shiftNurseId: number, nextCarry: number) => void;
    doc: TDutyDoc;
    docRowIndex: number;
    docRow: TDutyDoc['rows'][number] | undefined;
    getCellShiftType: (rowIndex: number, colIndex: number) => TWardShiftType | null;
    idToType: Map<number, TWardShiftType>;
    shortNameToType: Map<string, TWardShiftType>;
    selection: TSelection | null;
    selectionRect: {top: number; left: number; bottom: number; right: number} | null;
    effectiveFocus: TShiftCalendarFocus | null;
    layerFlags: TLayerFlags;
    violations?: Map<string, TViolationItem>;
    separateWeekendColor: boolean;
    focusedCellRef: RefObject<HTMLParagraphElement | null>;
    onCellClick: (rowIndex: number, colIndex: number) => void;
    gridTemplateColumns: string;
};

export function ShiftCalendarRow({
    row,
    rowIndex,
    rowsLength,
    level,
    shift,
    readonly,
    enableDragAndDrop,
    enableDivisionManagement,
    onEditDivision,
    onSelectNurse,
    onUpdateCarry,
    docRowIndex,
    docRow,
    doc,
    getCellShiftType,
    idToType,
    selection,
    selectionRect,
    effectiveFocus,
    layerFlags,
    violations,
    separateWeekendColor,
    focusedCellRef,
    onCellClick,
    gridTemplateColumns,
}: TShiftCalendarRowProps) {
    const isRowFocused = effectiveFocus?.shiftNurseId === row.shiftNurse.shiftNurseId;
    const getCountByNurse = (wardShiftTypeId: number) =>
        docRow?.cells.filter((_current: string | null, index: number) => {
            const shiftType = getCellShiftType(docRowIndex, index);

            return shiftType?.wardShiftTypeId === wardShiftTypeId;
        }).length ?? 0;
    const getOffCount = () =>
        docRow?.cells.filter((_current: string | null, i: number) => {
            const shiftType = getCellShiftType(docRowIndex, i);
            const day = shift.days[i];

            return Boolean(shiftType?.isOff) && day?.dayType !== 'workday';
        }).length ?? 0;

    const violationLayersSorted = useMemo(() => {
        if (!violations) return [];

        const items: {j: number; violation: TViolationItem}[] = [];

        for (let j = 0; j < doc.columns.length; j += 1) {
            const violation = violations.get(`${row.shiftNurse.shiftNurseId},${j}`);

            if (violation) items.push({j, violation});
        }

        items.sort((a, b) => {
            const pa = a.violation.level === 'error' ? 1 : 0;
            const pb = b.violation.level === 'error' ? 1 : 0;

            if (pa !== pb) return pa - pb;

            return a.j - b.j;
        });

        return items;
    }, [violations, doc.columns, row.shiftNurse.shiftNurseId]);

    return (
        <Draggable
            draggableId={row.shiftNurse.shiftNurseId.toString()}
            index={rowIndex}
            key={row.shiftNurse.shiftNurseId}
            isDragDisabled={readonly || !enableDragAndDrop}
        >
            {(provided) => (
                <div
                    data-shift-calendar-row
                    data-row-index={rowIndex}
                    className={`relative grid h-8 w-full min-w-0 items-center gap-x-2 ${
                        rowIndex === 0
                            ? rowIndex === rowsLength - 1
                                ? 'rounded-[1.25rem]'
                                : 'rounded-t-[1.25rem]'
                            : rowIndex === rowsLength - 1
                              ? 'rounded-b-[1.25rem]'
                              : ''
                    } ${isRowFocused ? 'bg-main-4' : 'bg-white'}`}
                    ref={provided.innerRef}
                    {...(() => {
                        // DnD가 주입하는 style(transform/transition 등)이 있고,
                        // 이 style을 그대로 펼치면 우리가 설정한 gridTemplateColumns가 덮여씌워져
                        // row가 단일 컬럼으로 풀려 "세로로 겹쳐 보이는" 문제가 생깁니다.
                        // => style 병합으로 해결합니다.
                        const {style: draggableStyle, ...draggableProps} = provided.draggableProps;
                        return {
                            ...draggableProps,
                            ...provided.dragHandleProps,
                            style: {
                                ...(draggableStyle ?? {}),
                                gridTemplateColumns,
                                gridAutoFlow: 'column',
                                maxWidth: '100%',
                            },
                        };
                    })()}
                >
                    {!readonly && enableDragAndDrop ? (
                        <DragIcon className="pointer-events-none absolute top-1/2 left-[-20px] h-6 w-6 -translate-y-1/2" />
                    ) : null}
                    <div
                        className="min-w-0 truncate text-center font-apple text-[clamp(11px,0.75vw,14px)] font-normal text-sub-1"
                        onClick={() => {
                            onSelectNurse?.(row.shiftNurse.nurseId);
                        }}
                    >
                        {row.shiftNurse.name}
                    </div>
                    <div className="text-center font-apple text-[clamp(11px,0.75vw,14px)] text-sub-1">
                        {readonly || !onUpdateCarry ? (
                            <div className="h-7 w-7 cursor-default rounded-[.3125rem] border-[.0313rem] bg-main-bg font-poppins text-[clamp(11px,0.78vw,15px)] text-sub-2 outline-none focus:bg-main-4">
                                {row.shiftNurse.carried}
                            </div>
                        ) : (
                            <button
                                className="h-7 w-7 rounded-[.3125rem] border-[.0313rem] bg-main-bg font-poppins text-[clamp(11px,0.78vw,15px)] text-sub-2 outline-none focus:bg-main-4"
                                onKeyDown={(e) => {
                                    e.preventDefault();

                                    if (e.key === 'ArrowUp') onUpdateCarry(row.shiftNurse.shiftNurseId, row.shiftNurse.carried + 1);

                                    if (e.key === 'ArrowDown') onUpdateCarry(row.shiftNurse.shiftNurseId, row.shiftNurse.carried - 1);
                                }}
                            >
                                {row.shiftNurse.carried}
                            </button>
                        )}
                    </div>
                    {/* 전달 근무 배지: 줄바꿈되면 세로로 쌓여 보이므로 nowrap 유지 */}
                    <div className="flex min-w-0 flex-nowrap justify-center gap-[.125rem] overflow-hidden">
                        {row.lastWardShiftList.map((current, j) => (
                            <ShiftBadge
                                key={j}
                                shiftType={current != null ? idToType.get(current) : null}
                                className="h-5 w-5 text-[0.8125rem]"
                            />
                        ))}
                    </div>
                    <div
                        className={`relative ${SHIFT_CALENDAR_DAY_GRID_CLASSNAME}`}
                        style={{gridTemplateColumns: `repeat(${doc.columns.length}, minmax(0, 1fr))`}}
                    >
                        {doc.columns.map((_date, j) => {
                            const request = row.wardReqShiftList[j] ?? null;
                            const dayType = shift.days[j]?.dayType ?? 'workday';
                            const weekendBg = getWeekendCellBg(dayType, separateWeekendColor);
                            const shiftType = getCellShiftType(docRowIndex, j);
                            const isSelected =
                                selection?.type === 'single' && selection.anchor.row === docRowIndex && selection.anchor.col === j;
                            const isInRange =
                                selectionRect !== null &&
                                docRowIndex >= selectionRect.top &&
                                docRowIndex <= selectionRect.bottom &&
                                j >= selectionRect.left &&
                                j <= selectionRect.right;
                            const isFocused = isRowFocused && effectiveFocus?.day === j;
                            const selectionClass = !readonly && (isSelected || isInRange) ? 'outline-[.125rem] outline-main-1' : undefined;

                            return (
                                <div
                                    key={j}
                                    className={`group relative flex h-full min-w-0 items-center justify-center px-[.125rem] ${weekendBg} ${
                                        effectiveFocus?.day === j ? 'bg-main-4' : ''
                                    }`}
                                    style={{gridRow: 1, gridColumn: j + 1}}
                                    onClick={() => onCellClick(docRowIndex, j)}
                                >
                                    {!readonly && request !== null && shiftType && (
                                        <RequestLayer
                                            isAccept={request === shiftType.wardShiftTypeId}
                                            request={idToType.get(request)!}
                                            showCheck={layerFlags.check}
                                            showSlash={layerFlags.slash}
                                        />
                                    )}
                                    <ShiftBadge
                                        id={rowIndex === 0 && j === 0 ? 'cell_sample' : undefined}
                                        shiftType={shiftType}
                                        isOnlyRequest={shiftType === null && request !== null}
                                        className={`z-10 ${readonly ? 'cursor-default' : 'cursor-pointer'} ${
                                            isFocused ? 'outline-[.125rem] outline-main-1' : ''
                                        } ${selectionClass ?? ''}`}
                                        forwardRef={isFocused ? focusedCellRef : null}
                                    />
                                </div>
                            );
                        })}
                        {!readonly &&
                            layerFlags.fault &&
                            violationLayersSorted.map(({j, violation}) => {
                                const colSpan = violation.cells.length;

                                return (
                                    <div
                                        key={`vio-${row.shiftNurse.shiftNurseId}-${j}`}
                                        className={`pointer-events-none min-h-0 min-w-0 ${
                                            violation.level === 'error' ? 'z-[32]' : 'z-[22]'
                                        }`}
                                        style={{
                                            gridRow: 1,
                                            gridColumn: `${j + 1} / ${j + 1 + colSpan}`,
                                        }}
                                    >
                                        <ViolationLayer violation={violation} spanningCell />
                                    </div>
                                );
                            })}
                    </div>
                    <div id="count_by_nurse" className="relative flex shrink-0 items-center gap-1.5 px-2.5 text-center">
                        {shift.wardShiftTypes
                            .filter((x) => x.isCounted)
                            .map((wardShiftType) => (
                                <div
                                    key={wardShiftType.wardShiftTypeId}
                                    className="flex h-5 w-5 shrink-0 items-center justify-center font-poppins text-[clamp(10px,0.72vw,15px)] tabular-nums leading-none text-sub-2"
                                >
                                    {getCountByNurse(wardShiftType.wardShiftTypeId)}
                                </div>
                            ))}
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center font-poppins text-[clamp(10px,0.72vw,15px)] tabular-nums leading-none text-sub-2">
                            {getOffCount()}
                        </div>
                    </div>
                    {enableDivisionManagement && onEditDivision && !readonly && (
                        <>
                            {rowIndex !== rowsLength - 1 ? (
                                <>
                                    <div
                                        className="group peer absolute bottom-0 z-10 flex h-6 w-6 translate-x-[-80%] translate-y-[50%] items-center justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditDivision({
                                                shiftNurseId: row.shiftNurse.shiftNurseId,
                                                level,
                                                direction: 1,
                                            });
                                        }}
                                    >
                                        <PlusIcon2 className="invisible h-5 w-5 group-hover:visible" />
                                    </div>
                                    <div className="invisible absolute bottom-0 h-[.0938rem] w-full bg-sub-2.5 peer-hover:visible" />
                                </>
                            ) : (
                                level !== shift.divisionShiftNurses.length - 1 && (
                                    <div
                                        className="absolute bottom-0 z-10 flex h-6 w-6 translate-x-[-65%] translate-y-[calc(50%+.1563rem)] items-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditDivision({
                                                shiftNurseId: row.shiftNurse.shiftNurseId,
                                                level,
                                                direction: -1,
                                            });
                                        }}
                                    >
                                        <MinusIcon className="h-5 w-5 opacity-0 hover:opacity-100" />
                                    </div>
                                )
                            )}
                        </>
                    )}
                </div>
            )}
        </Draggable>
    );
}
