import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {renderHook} from '@/shared/util/test-utils';
import type {TClipboardPayload} from '../types';
import {useShiftEditorKeyBindings} from '../use-shift-editor-key-bindings';

const commands = {
    moveSelection: vi.fn(),
    selectAll: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    clearSelectionCells: vi.fn(),
    copy: vi.fn<() => TClipboardPayload | null>(),
    paste: vi.fn(),
    setSelectionValue: vi.fn(),
};

vi.mock('../use-shift-editor-commands', () => ({
    useShiftEditorCommands: () => commands,
}));

vi.mock('../store', () => {
    const state = {
        doc: {
            columns: ['2026-03-01'],
            rows: [{workerId: '1', cells: [null]}],
        },
        selection: {type: 'single' as const, anchor: {row: 0, col: 0}},
    };
    const useShiftEditorStore = (selector: (s: typeof state) => unknown) => selector(state);

    return {
        useShiftEditorStore: Object.assign(useShiftEditorStore, {getState: () => state}),
    };
});

function createKeyboardEvent(
    key: string,
    nativeOverrides: Partial<KeyboardEvent> = {},
): React.KeyboardEvent & {preventDefault: ReturnType<typeof vi.fn>} {
    const preventDefault = vi.fn();

    return {
        preventDefault,
        nativeEvent: {
            key,
            shiftKey: false,
            altKey: false,
            ctrlKey: false,
            metaKey: false,
            ...nativeOverrides,
        },
    } as unknown as React.KeyboardEvent & {preventDefault: ReturnType<typeof vi.fn>};
}

function createPasteEvent(text: string): React.ClipboardEvent & {preventDefault: ReturnType<typeof vi.fn>} {
    const preventDefault = vi.fn();

    return {
        preventDefault,
        clipboardData: {
            getData: vi.fn(() => text),
        },
    } as unknown as React.ClipboardEvent & {preventDefault: ReturnType<typeof vi.fn>};
}

describe('useShiftEditorKeyBindings', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('navigator', {
            clipboard: {
                writeText: vi.fn().mockResolvedValue(undefined),
                readText: vi.fn().mockResolvedValue('O\tN\nE'),
            },
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('maps arrow keys to selection movement and passes shift/meta modifiers through', async () => {
        const {result} = renderHook(() => useShiftEditorKeyBindings());
        const event = createKeyboardEvent('ArrowRight', {shiftKey: true, metaKey: true});

        await result.current.onKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(commands.moveSelection).toHaveBeenCalledWith('right', true, true);
    });

    it('handles select-all, undo/redo, and delete shortcuts', async () => {
        const {result} = renderHook(() => useShiftEditorKeyBindings());

        await result.current.onKeyDown(createKeyboardEvent('a', {ctrlKey: true}));
        await result.current.onKeyDown(createKeyboardEvent('z', {metaKey: true}));
        await result.current.onKeyDown(createKeyboardEvent('Z', {metaKey: true, shiftKey: true}));
        await result.current.onKeyDown(createKeyboardEvent('y', {ctrlKey: true}));
        await result.current.onKeyDown(createKeyboardEvent('Delete'));
        await result.current.onKeyDown(createKeyboardEvent('Backspace'));

        expect(commands.selectAll).toHaveBeenCalledTimes(1);
        expect(commands.undo).toHaveBeenCalledTimes(1);
        expect(commands.redo).toHaveBeenCalledTimes(2);
        expect(commands.clearSelectionCells).toHaveBeenCalledTimes(2);
    });

    it('runs the clear callback after Backspace and Delete clear the selected cells', async () => {
        const onClearSelectionCells = vi.fn();
        const {result} = renderHook(() => useShiftEditorKeyBindings({onClearSelectionCells}));
        const backspaceEvent = createKeyboardEvent('Backspace');
        const deleteEvent = createKeyboardEvent('Delete');

        await result.current.onKeyDown(backspaceEvent);
        await result.current.onKeyDown(deleteEvent);

        expect(commands.clearSelectionCells).toHaveBeenCalledTimes(2);
        expect(onClearSelectionCells).toHaveBeenNthCalledWith(1, {key: 'Backspace', event: backspaceEvent.nativeEvent});
        expect(onClearSelectionCells).toHaveBeenNthCalledWith(2, {key: 'Delete', event: deleteEvent.nativeEvent});
    });

    it('moves the selection with Tab / Shift+Tab like spreadsheet column navigation', async () => {
        const {result} = renderHook(() => useShiftEditorKeyBindings());

        await result.current.onKeyDown(createKeyboardEvent('Tab'));
        await result.current.onKeyDown(createKeyboardEvent('Tab', {shiftKey: true}));

        expect(commands.moveSelection).toHaveBeenNthCalledWith(1, 'right', false, false);
        expect(commands.moveSelection).toHaveBeenNthCalledWith(2, 'left', false, false);
    });

    it('interprets Korean IME keys through the work key map', async () => {
        const {result} = renderHook(() =>
            useShiftEditorKeyBindings({
                workKeyMap: {d: 'D'},
            }),
        );

        await result.current.onKeyDown(createKeyboardEvent('ㅇ'));

        expect(commands.setSelectionValue).toHaveBeenCalledWith('D');
        expect(commands.moveSelection).toHaveBeenCalledWith('right', false, false);
    });

    it('uses shifted symbol keys as work shortcuts', async () => {
        const {result} = renderHook(() =>
            useShiftEditorKeyBindings({
                workKeyMap: {_: '_11', o: 'OFF'},
            }),
        );

        await result.current.onKeyDown(createKeyboardEvent('_', {shiftKey: true}));

        expect(commands.setSelectionValue).toHaveBeenCalledWith('_11');
        expect(commands.moveSelection).toHaveBeenCalledWith('right', false, false);
    });

    it('copies and cuts selected cells through the clipboard API', async () => {
        commands.copy.mockReturnValue({
            width: 2,
            height: 2,
            cells: [
                ['D', null],
                ['N', 'O'],
            ],
        });

        const {result} = renderHook(() => useShiftEditorKeyBindings());

        await result.current.onKeyDown(createKeyboardEvent('c', {ctrlKey: true}));
        await result.current.onKeyDown(createKeyboardEvent('x', {metaKey: true}));

        expect(navigator.clipboard.writeText).toHaveBeenNthCalledWith(1, 'D\t\nN\tO');
        expect(navigator.clipboard.writeText).toHaveBeenNthCalledWith(2, 'D\t\nN\tO');
        expect(commands.clearSelectionCells).toHaveBeenCalledTimes(1);
    });

    it('pastes normalized TSV from onPasteCapture only (Ctrl+V does not use readText)', async () => {
        const {result} = renderHook(() => useShiftEditorKeyBindings());

        await result.current.onKeyDown(createKeyboardEvent('v', {ctrlKey: true}));

        expect(commands.paste).not.toHaveBeenCalled();
        expect(navigator.clipboard.readText).not.toHaveBeenCalled();

        result.current.onPasteCapture(createPasteEvent('A\tB\r\nC'));

        expect(commands.paste).toHaveBeenCalledTimes(1);
        expect(commands.paste).toHaveBeenCalledWith({
            width: 2,
            height: 2,
            cells: [
                ['A', 'B'],
                ['C', null],
            ],
        });
    });

    it('blocks keyboard and paste edits while disabled', async () => {
        const {result} = renderHook(() => useShiftEditorKeyBindings({disabled: true}));
        const keyEvent = createKeyboardEvent('d');
        const pasteEvent = createPasteEvent('D');

        await result.current.onKeyDown(keyEvent);
        result.current.onPasteCapture(pasteEvent);

        expect(keyEvent.preventDefault).not.toHaveBeenCalled();
        expect(pasteEvent.preventDefault).toHaveBeenCalled();
        expect(commands.setSelectionValue).not.toHaveBeenCalled();
        expect(commands.moveSelection).not.toHaveBeenCalled();
        expect(commands.clearSelectionCells).not.toHaveBeenCalled();
        expect(commands.paste).not.toHaveBeenCalled();
    });

    it('runs beforeHandlers before built-in bindings and stops when handled', async () => {
        const beforeHandler = vi.fn(() => true);
        const {result} = renderHook(() =>
            useShiftEditorKeyBindings({
                beforeHandlers: [beforeHandler],
            }),
        );
        const event = createKeyboardEvent('ArrowLeft');

        await result.current.onKeyDown(event);

        expect(beforeHandler).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(commands.moveSelection).not.toHaveBeenCalled();
    });
});
