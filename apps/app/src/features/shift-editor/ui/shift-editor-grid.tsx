import {useMemo} from 'react';
import {useScheduleDisplayViolations, useShiftEditorCommands, useShiftEditorKeyBindings, useShiftEditorStore} from '../model';
import {normalizeSelection} from '../model/selection';

export function ShiftEditorGrid() {
    const doc = useShiftEditorStore((s) => s.doc);
    const selection = useShiftEditorStore((s) => s.selection);
    const violations = useScheduleDisplayViolations();
    const commands = useShiftEditorCommands();
    const {onKeyDown, onPasteCapture} = useShiftEditorKeyBindings({
        // TODO: 사용자별 주입 지점 (예: settings)
        workKeyMap: {d: 'D', e: 'E', n: 'N', o: 'O'},
    });
    const violationSet = useMemo(() => {
        const set = new Set<string>();

        for (const v of violations) {
            for (const c of v.cells) set.add(`${c.row}:${c.col}`);
        }

        return set;
    }, [violations]);
    const selectionRect = useMemo(() => {
        if (!selection) return null;

        return normalizeSelection(selection);
    }, [selection]);

    return (
        <div className="flex w-full flex-col gap-2 overflow-auto outline-none" tabIndex={0} onKeyDown={onKeyDown} onPasteCapture={onPasteCapture}>
            <div className="flex items-center gap-2">
                <button
                    className="box-border h-9 rounded-lg px-3 py-0 font-apple text-sm leading-none text-sub-2.5"
                    onClick={() => commands.undo()}
                    type="button"
                >
                    Undo
                </button>
                <button
                    className="box-border h-9 rounded-lg px-3 py-0 font-apple text-sm leading-none text-sub-2.5"
                    onClick={() => commands.redo()}
                    type="button"
                >
                    Redo
                </button>
                <button
                    className="box-border h-9 rounded-lg px-3 py-0 font-apple text-sm leading-none text-white"
                    onClick={() => commands.setSelectionValue('D')}
                    type="button"
                >
                    선택에 D 입력
                </button>
                <button
                    className="box-border h-9 rounded-lg px-3 py-0 font-apple text-sm leading-none text-sub-2.5"
                    onClick={() => commands.clearSelectionCells()}
                    type="button"
                >
                    선택 지우기
                </button>
            </div>

            <table className="min-w-max border-collapse font-apple text-xs">
                <thead>
                    <tr>
                        <th className="sticky left-0 z-10 bg-white px-2 py-1 text-left text-sub-2.5">이름</th>
                        {doc.columns.map((c) => (
                            <th key={c} className="px-2 py-1 text-sub-2.5">
                                {c.slice(-2)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {doc.rows.map((row, r) => (
                        <tr key={row.workerId}>
                            <td className="sticky left-0 z-10 bg-white px-2 py-1 text-left text-sub-2.5">
                                {doc.workerMeta[row.workerId]?.name ?? row.workerId}
                            </td>
                            {row.cells.map((value, col) => {
                                const isSelected =
                                    selection?.type === 'single' && selection.anchor.row === r && selection.anchor.col === col;
                                const isInRange =
                                    selectionRect !== null &&
                                    r >= selectionRect.top &&
                                    r <= selectionRect.bottom &&
                                    col >= selectionRect.left &&
                                    col <= selectionRect.right;
                                const hasViolation = violationSet.has(`${r}:${col}`);

                                return (
                                    <td
                                        key={col}
                                        className={`cursor-pointer border border-sub-5 px-2 py-1 text-center ${
                                            isSelected ? 'bg-main-4' : isInRange ? 'bg-main-4' : 'bg-white'
                                        } ${hasViolation ? 'text-red-600' : 'text-sub-1'}`}
                                        onClick={() => commands.select({row: r, col})}
                                    >
                                        {value ?? ''}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
