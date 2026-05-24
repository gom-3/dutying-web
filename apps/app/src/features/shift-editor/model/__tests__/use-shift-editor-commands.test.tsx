import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {act, renderHook} from '@/shared/util/test-utils';
import {useShiftEditorStore} from '../store';
import type {TClipboardPayload, TDutyDoc} from '../types';
import {useShiftEditorCommands} from '../use-shift-editor-commands';

function createDoc(): TDutyDoc {
    return {
        columns: ['2026-03-01', '2026-03-02', '2026-03-03'],
        rows: [
            {workerId: '2', cells: ['D', null, 'N']},
            {workerId: '1', cells: [null, 'E', null]},
        ],
        workerMeta: {
            1: {name: 'Kim'},
            2: {name: 'Lee'},
        },
        fixedCells: {},
        requestCells: {},
    };
}

describe('useShiftEditorCommands', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        window.localStorage.clear();
        useShiftEditorStore.getState().reset();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        window.localStorage.clear();
        useShiftEditorStore.getState().reset();
    });

    it('writes the selected range and records history for undo/redo', () => {
        const {result} = renderHook(() => useShiftEditorCommands());
        const selection = {type: 'range' as const, from: {row: 0, col: 0}, to: {row: 1, col: 1}};

        act(() => {
            result.current.init(createDoc(), {maxHistoryDepth: 5});
            useShiftEditorStore.getState().setSelection(selection);
            result.current.setSelectionValue('O');
        });

        const afterEdit = useShiftEditorStore.getState();

        expect(afterEdit.doc.rows.map((row) => row.cells)).toEqual([
            ['O', 'O', 'N'],
            ['O', 'O', null],
        ]);
        expect(afterEdit.history.past).toHaveLength(1);
        expect(afterEdit.history.past[0]?.selectionBefore).toEqual(selection);

        act(() => result.current.undo());

        const afterUndo = useShiftEditorStore.getState();

        expect(afterUndo.doc).toEqual(createDoc());
        expect(afterUndo.selection).toEqual(selection);
        expect(afterUndo.history.future).toHaveLength(1);

        act(() => result.current.redo());

        const afterRedo = useShiftEditorStore.getState();

        expect(afterRedo.doc.rows.map((row) => row.cells)).toEqual([
            ['O', 'O', 'N'],
            ['O', 'O', null],
        ]);
        expect(afterRedo.selection).toEqual(selection);
    });

    it('pastes payload from the selection anchor and trims cells outside document bounds', () => {
        const {result} = renderHook(() => useShiftEditorCommands());
        const payload: TClipboardPayload = {
            width: 2,
            height: 2,
            cells: [
                ['O', 'N'],
                ['E', 'D'],
            ],
        };

        act(() => {
            result.current.init(createDoc());
            useShiftEditorStore.getState().setSelection({type: 'single', anchor: {row: 1, col: 2}});
            result.current.paste(payload);
        });

        expect(useShiftEditorStore.getState().doc.rows.map((row) => row.cells)).toEqual([
            ['D', null, 'N'],
            [null, 'E', 'O'],
        ]);
        expect(useShiftEditorStore.getState().history.past).toHaveLength(1);
    });

    it('reorders rows by worker name, clears selection, and supports undo', () => {
        const {result} = renderHook(() => useShiftEditorCommands());

        act(() => {
            result.current.init(createDoc());
            useShiftEditorStore.getState().setSelection({type: 'single', anchor: {row: 1, col: 1}});
            result.current.reorderRowsByName();
        });

        const afterReorder = useShiftEditorStore.getState();

        expect(afterReorder.doc.rows.map((row) => row.workerId)).toEqual(['1', '2']);
        expect(afterReorder.selection).toBeNull();
        expect(afterReorder.history.past[0]?.tx.source).toBe('user');

        act(() => result.current.undo());

        const afterUndo = useShiftEditorStore.getState();

        expect(afterUndo.doc.rows.map((row) => row.workerId)).toEqual(['2', '1']);
        expect(afterUndo.selection).toEqual({type: 'single', anchor: {row: 1, col: 1}});
    });
});
