/* eslint-disable @typescript-eslint/no-explicit-any */
import {act} from 'react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {useShiftEditorCommands, useShiftEditorStore, type TDutyDoc} from '@/features/shift-editor';
import {renderHook} from '@/shared/util/test-utils';
import {useDutyHook} from '../duty-hook';
import {useDutyStore} from '../duty-store';

const SHIFT_EDITOR_STORAGE_KEY = 'shift-editor:draft';
const {mockNavigate, mockInvalidateQueries, mockSetLoading, mockUpdateShifts, mockPostShift, mockRefetch, mockHandleGetAccountMe} =
    vi.hoisted(() => ({
        mockNavigate: vi.fn(),
        mockInvalidateQueries: vi.fn(),
        mockSetLoading: vi.fn(),
        mockUpdateShifts: vi.fn(),
        mockPostShift: vi.fn(),
        mockRefetch: vi.fn(),
        mockHandleGetAccountMe: vi.fn(),
    }));

let mockSearchParams = new URLSearchParams();
let mockAuthState = {
    wardId: 1,
    isAuth: true,
    _loaded: true,
    accountMeStatus: 'success' as const,
};
let mockQueries: Record<string, any> = {};

vi.mock('@/features/shift-editor', async () => {
    const actual = await vi.importActual('@/features/shift-editor');

    return {
        ...actual,
        useShiftEditorKeyBindings: () => ({
            onKeyDown: vi.fn(),
            onPasteCapture: vi.fn(),
        }),
    };
});

vi.mock('@tanstack/react-query', async () => {
    const actual = await vi.importActual('@tanstack/react-query');
    const disabledQueryState = {
        data: undefined,
        isPending: true,
        isError: false,
        refetch: mockRefetch,
    };

    return {
        ...actual,
        useQuery: vi.fn((options: {queryKey: unknown[]; enabled?: boolean}) => {
            if (options.enabled === false) return disabledQueryState;

            return mockQueries[String(options.queryKey[1])] ?? disabledQueryState;
        }),
        useQueryClient: vi.fn(() => ({invalidateQueries: mockInvalidateQueries})),
    };
});

vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams, vi.fn()],
}));

vi.mock('@/features/auth', () => ({
    default: () => ({
        state: mockAuthState,
        actions: {
            handleGetAccountMe: mockHandleGetAccountMe,
        },
    }),
}));

vi.mock('@/features/loading', () => ({
    default: () => ({
        setLoading: mockSetLoading,
    }),
}));

vi.mock('@/shared/api/ward', () => ({
    default: {
        updateShifts: mockUpdateShifts,
        postShift: mockPostShift,
    },
}));

const shiftTeams = [
    {shiftTeamId: 10, name: 'A팀'},
    {shiftTeamId: 20, name: 'B팀'},
];
const shift = {
    lastDays: [],
    days: [
        {day: 1, dayType: 'workday'},
        {day: 2, dayType: 'holiday'},
    ],
    wardShiftTypes: [
        {
            wardShiftTypeId: 1,
            name: 'Day',
            shortName: 'D',
            startTime: '07:00',
            endTime: '15:00',
            color: '#fff',
            isDefault: true,
            isOff: false,
            isCounted: true,
            classification: 'DAY',
        },
    ],
    divisionShiftNurses: [
        [
            {
                shiftNurse: {
                    shiftNurseId: 1,
                    name: 'Kim',
                    carried: 0,
                    divisionNum: 0,
                    priority: 0,
                    isWorker: true,
                    nurseId: 100,
                },
                lastWardShiftList: [],
                lastWardReqShiftList: [],
                wardShiftList: [1, null],
                wardReqShiftList: [],
            },
        ],
    ],
};
const initializedDoc: TDutyDoc = {
    columns: ['2025-07-01', '2025-07-02'],
    rows: [{workerId: '1', cells: ['D', null]}],
    workerMeta: {'1': {name: 'Kim', nurseId: 100}},
    fixedCells: {},
    requestCells: {},
};

function resetDutyStore() {
    useDutyStore.setState({
        year: 2026,
        month: 3,
        shiftTeams: [],
        currentShiftTeamId: null,
        readonly: true,
        shift: null,
        status: 'idle',
    });
}

function setQueryState(overrides?: Partial<typeof mockQueries>) {
    mockQueries = {
        shiftTeams: {data: shiftTeams, isPending: false, isError: false},
        duty: {data: shift, isPending: false, isError: false, refetch: mockRefetch},
        ...overrides,
    };
}

function seedPersistedDraft(doc: TDutyDoc, history = {past: [{id: 'stale'}], future: [], maxDepth: 200}) {
    window.localStorage.setItem(
        SHIFT_EDITOR_STORAGE_KEY,
        JSON.stringify({
            doc,
            history: JSON.stringify(history),
            savedAt: 123,
        }),
    );
}

function readPersistedDraft() {
    const raw = window.localStorage.getItem(SHIFT_EDITOR_STORAGE_KEY);

    return raw ? JSON.parse(raw) : null;
}

function advancePersistenceDebounce() {
    act(() => {
        vi.advanceTimersByTime(1600);
    });
}

async function flushHookEffects(cycles = 3) {
    for (let i = 0; i < cycles; i += 1) {
        await act(async () => {
            await Promise.resolve();
        });
    }
}

type TDutyHookRender = {
    result: {
        current: ReturnType<typeof useDutyHook>;
    };
};

type TEditorCommandsRender = {
    result: {
        current: ReturnType<typeof useShiftEditorCommands>;
    };
};

describe('useDutyHook integration', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        mockHandleGetAccountMe.mockResolvedValue(undefined);
        window.localStorage.clear();
        resetDutyStore();
        useShiftEditorStore.getState().reset();
        mockAuthState = {
            wardId: 1,
            isAuth: true,
            _loaded: true,
            accountMeStatus: 'success',
        };
        mockSearchParams = new URLSearchParams('year=2025&month=7&shiftTeamId=20');
        setQueryState();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        window.localStorage.clear();
        resetDutyStore();
        useShiftEditorStore.getState().reset();
    });

    it('initializes the editor store from fetched duty data and discards any stale persisted draft', async () => {
        seedPersistedDraft({
            columns: ['stale'],
            rows: [{workerId: '99', cells: ['N']}],
            workerMeta: {'99': {name: 'Stale'}},
            fixedCells: {},
            requestCells: {},
        });

        let duty!: TDutyHookRender;

        await act(async () => {
            duty = renderHook(() => useDutyHook());
        });
        await flushHookEffects();

        expect(duty.result.current.state.status).toBe('success');
        expect(duty.result.current.state.doc).toEqual(initializedDoc);
        expect(useShiftEditorStore.getState().doc).toEqual(initializedDoc);
        expect(window.localStorage.getItem(SHIFT_EDITOR_STORAGE_KEY)).toBeNull();

        advancePersistenceDebounce();

        expect(readPersistedDraft()).toBeNull();
    });

    it('restores the pre-edit snapshot into the real editor store and clears the persisted draft on cancel', async () => {
        let duty!: TDutyHookRender;
        let editor!: TEditorCommandsRender;

        await act(async () => {
            duty = renderHook(() => useDutyHook());
            editor = renderHook(() => useShiftEditorCommands());
        });
        await flushHookEffects();

        expect(duty.result.current.state.doc).toEqual(initializedDoc);

        act(() => {
            duty.result.current.handlers.enableEdit();
            useShiftEditorStore.getState().setSelection({type: 'single', anchor: {row: 0, col: 1}});
            editor.result.current.setSelectionValue('D');
        });

        advancePersistenceDebounce();

        expect(useShiftEditorStore.getState().doc.rows[0]?.cells).toEqual(['D', 'D']);
        expect(readPersistedDraft()?.doc.rows[0]?.cells).toEqual(['D', 'D']);

        act(() => {
            duty.result.current.handlers.cancelEdit();
        });

        expect(useShiftEditorStore.getState().doc).toEqual(initializedDoc);
        expect(window.localStorage.getItem(SHIFT_EDITOR_STORAGE_KEY)).toBeNull();
        expect(useDutyStore.getState().readonly).toBe(true);
    });

    it('saves the latest editor store state through the ward api and removes the draft after save', async () => {
        mockUpdateShifts.mockResolvedValue(undefined);

        let duty!: TDutyHookRender;
        let editor!: TEditorCommandsRender;

        await act(async () => {
            duty = renderHook(() => useDutyHook());
            editor = renderHook(() => useShiftEditorCommands());
        });
        await flushHookEffects();

        expect(duty.result.current.state.currentShiftTeamId).toBe(20);

        act(() => {
            duty.result.current.handlers.enableEdit();
            useShiftEditorStore.getState().setSelection({type: 'single', anchor: {row: 0, col: 1}});
            editor.result.current.setSelectionValue('D');
        });

        advancePersistenceDebounce();

        expect(readPersistedDraft()?.doc.rows[0]?.cells).toEqual(['D', 'D']);

        await act(async () => {
            await duty.result.current.handlers.saveEdit();
        });

        expect(mockUpdateShifts).toHaveBeenCalledWith(1, [
            {shiftNurseId: 1, date: '2025-07-01', wardShiftTypeId: 1},
            {shiftNurseId: 1, date: '2025-07-02', wardShiftTypeId: 1},
        ]);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({
            queryKey: ['ward', 'duty', 1, 20, 2025, 7],
        });
        expect(window.localStorage.getItem(SHIFT_EDITOR_STORAGE_KEY)).toBeNull();
        expect(useDutyStore.getState().readonly).toBe(true);
        expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
        expect(mockSetLoading).toHaveBeenLastCalledWith(false);
    });

    it('resets the editor store to empty and drops persisted drafts when the duty query fails', async () => {
        seedPersistedDraft({
            columns: ['2025-07-01'],
            rows: [{workerId: '1', cells: ['D']}],
            workerMeta: {'1': {name: 'Kim'}},
            fixedCells: {},
            requestCells: {},
        });
        setQueryState({
            duty: {data: undefined, isPending: false, isError: true, refetch: mockRefetch},
        });

        let duty!: TDutyHookRender;

        await act(async () => {
            duty = renderHook(() => useDutyHook());
        });
        await flushHookEffects();

        expect(duty.result.current.state.status).toBe('error');
        expect(duty.result.current.state.doc).toEqual({columns: [], rows: [], workerMeta: {}, fixedCells: {}, requestCells: {}});
        expect(useShiftEditorStore.getState().doc).toEqual({columns: [], rows: [], workerMeta: {}, fixedCells: {}, requestCells: {}});
        expect(window.localStorage.getItem(SHIFT_EDITOR_STORAGE_KEY)).toBeNull();
    });
});
