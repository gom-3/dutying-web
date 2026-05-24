/* eslint-disable @typescript-eslint/no-explicit-any */
import {act} from 'react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {renderHook, waitFor} from '@/shared/util/test-utils';
import {useDutyHook} from '../duty-hook';
import {useDutyStore} from '../duty-store';

const {
    mockNavigate,
    mockSetSearchParams,
    mockInvalidateQueries,
    mockSetLoading,
    mockUpdateShifts,
    mockPostShift,
    mockRefetch,
    mockShiftToDoc,
    mockDocToWardShiftsDTO,
    mockBuildWorkKeyMap,
    mockExportExcel,
    mockHandleGetAccountMe,
    mockCommands,
} = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockSetSearchParams: vi.fn(),
    mockInvalidateQueries: vi.fn(),
    mockSetLoading: vi.fn(),
    mockUpdateShifts: vi.fn(),
    mockPostShift: vi.fn(),
    mockRefetch: vi.fn(),
    mockShiftToDoc: vi.fn(),
    mockDocToWardShiftsDTO: vi.fn(),
    mockBuildWorkKeyMap: vi.fn(),
    mockExportExcel: vi.fn(),
    mockHandleGetAccountMe: vi.fn(),
    mockCommands: {
        init: vi.fn(),
        discardPersisted: vi.fn(),
        setDutyValidationInput: vi.fn(),
    },
}));

let mockSearchParams = new URLSearchParams();
let mockAuthState: {
    wardId: number | null;
    isAuth: boolean;
    _loaded: boolean;
    accountMeStatus: 'idle' | 'loading' | 'success' | 'error';
} = {
    wardId: 1,
    isAuth: true,
    _loaded: true,
    accountMeStatus: 'success',
};
let mockEditorState: any = {
    doc: {
        columns: ['2026-03-01'],
        rows: [{workerId: '1', cells: ['D']}],
        workerMeta: {'1': {name: 'Kim'}},
    },
};
let mockQueries: Record<string, any> = {};

vi.mock('@tanstack/react-query', async () => {
    const actual = await vi.importActual('@tanstack/react-query');
    const disabledQueryState = {
        data: undefined,
        isPending: false,
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
    useSearchParams: () => [mockSearchParams, mockSetSearchParams],
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

vi.mock('@/features/shift-editor', async (importOriginal) => {
    const actual = await importOriginal();

    return {
        ...actual,
        buildWorkKeyMap: (...args: unknown[]) => mockBuildWorkKeyMap(...args),
        docToWardShiftsDTO: (...args: unknown[]) => mockDocToWardShiftsDTO(...args),
        shiftToDoc: (...args: unknown[]) => mockShiftToDoc(...args),
        useShiftEditorCommands: () => mockCommands,
        useShiftExcelExport: (options: {disabled?: boolean}) => ({
            isExporting: false,
            exportExcel: () => {
                if (!options.disabled) {
                    mockExportExcel();
                }
            },
        }),
        useShiftEditorKeyBindings: () => ({onKeyDown: vi.fn(), onPasteCapture: vi.fn()}),
        useShiftEditorStore: (selector: (state: typeof mockEditorState) => unknown) => selector(mockEditorState),
    };
});

const shiftTeams = [
    {shiftTeamId: 10, name: 'A팀', nurseCnt: 0, nurses: []},
    {shiftTeamId: 20, name: 'B팀', nurseCnt: 0, nurses: []},
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
const convertedDoc = {
    columns: ['2025-07-01', '2025-07-02'],
    rows: [{workerId: '1', cells: ['D', null]}],
    workerMeta: {'1': {name: 'Kim'}},
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

describe('useDutyHook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSetSearchParams.mockReset();
        mockHandleGetAccountMe.mockResolvedValue(undefined);
        resetDutyStore();
        mockSearchParams = new URLSearchParams();
        mockAuthState = {
            wardId: 1,
            isAuth: true,
            _loaded: true,
            accountMeStatus: 'success',
        };
        mockEditorState = {
            doc: {
                columns: ['2026-03-01'],
                rows: [{workerId: '1', cells: ['D']}],
                workerMeta: {'1': {name: 'Kim'}},
                fixedCells: {},
                requestCells: {},
            },
        };
        mockBuildWorkKeyMap.mockReturnValue({});
        mockShiftToDoc.mockReturnValue(convertedDoc);
        mockDocToWardShiftsDTO.mockReturnValue([{shiftNurseId: 1, date: '2025-07-01', wardShiftTypeId: 1}]);
        setQueryState();
    });

    it('bootstraps year, month, and selected shift team from query params', async () => {
        mockSearchParams = new URLSearchParams('year=2025&month=7&shiftTeamId=20');

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.year).toBe(2025);
            expect(result.current.state.month).toBe(7);
            expect(result.current.state.currentShiftTeamId).toBe(20);
        });
    });

    it('exposes bootstrap pending state while auth context is still loading', () => {
        mockAuthState = {
            wardId: null,
            isAuth: true,
            _loaded: false,
            accountMeStatus: 'loading',
        };

        const {result} = renderHook(() => useDutyHook());

        expect(result.current.state.bootstrapStatus).toBe('pending');
    });

    it('retries auth bootstrap when wardId is missing', async () => {
        mockAuthState = {
            wardId: null,
            isAuth: true,
            _loaded: true,
            accountMeStatus: 'error',
        };

        const {result} = renderHook(() => useDutyHook());

        await act(async () => {
            result.current.handlers.retry();
        });

        expect(mockHandleGetAccountMe).toHaveBeenCalledTimes(1);
    });

    it('initializes the editor doc from fetched shift data and current month context', async () => {
        mockSearchParams = new URLSearchParams('year=2025&month=7&shiftTeamId=20');

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(mockShiftToDoc).toHaveBeenCalledWith(shift, 2025, 7);
            expect(mockCommands.init).toHaveBeenCalledWith(convertedDoc);
            expect(mockCommands.discardPersisted).toHaveBeenCalled();
            expect(result.current.state.status).toBe('success');
            expect(result.current.state.shift).toBe(shift);
        });
    });

    it('initializes an empty doc and clears persisted draft when duty query fails', async () => {
        setQueryState({
            duty: {data: undefined, isPending: false, isError: true, refetch: mockRefetch},
        });

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(mockCommands.init).toHaveBeenCalledWith({columns: [], rows: [], workerMeta: {}, fixedCells: {}, requestCells: {}});
            expect(mockCommands.discardPersisted).toHaveBeenCalled();
            expect(result.current.state.status).toBe('error');
            expect(result.current.state.shift).toBeNull();
        });
    });

    it('initializes an empty doc when the selected month has no shift data', async () => {
        setQueryState({
            duty: {data: null, isPending: false, isError: false, refetch: mockRefetch},
        });

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(mockCommands.init).toHaveBeenCalledWith({columns: [], rows: [], workerMeta: {}, fixedCells: {}, requestCells: {}});
            expect(mockCommands.discardPersisted).toHaveBeenCalled();
            expect(result.current.state.status).toBe('success');
            expect(result.current.state.shift).toBeNull();
        });
    });

    it('treats skeleton duty payload without assignments like no shift data', async () => {
        mockShiftToDoc.mockClear();

        const skeletonShift = {
            ...shift,
            divisionShiftNurses: [
                [
                    {
                        ...shift.divisionShiftNurses[0]![0]!,
                        wardShiftList: [null, null],
                    },
                ],
            ],
        };

        setQueryState({
            duty: {data: skeletonShift, isPending: false, isError: false, refetch: mockRefetch},
        });

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.status).toBe('success');
            expect(result.current.state.shift).toBeNull();
            expect(mockCommands.init).toHaveBeenCalledWith({columns: [], rows: [], workerMeta: {}, fixedCells: {}, requestCells: {}});
        });

        expect(mockShiftToDoc).not.toHaveBeenCalled();
    });

    it('restores the edit snapshot on cancel even when the current doc was mutated later', async () => {
        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.shift).toBe(shift);
        });

        mockCommands.init.mockClear();
        mockCommands.discardPersisted.mockClear();

        act(() => {
            result.current.handlers.enableEdit();
        });

        mockEditorState.doc.rows[0]!.cells[0] = null;
        mockEditorState.doc.workerMeta['1']!.name = 'Edited';

        act(() => {
            result.current.handlers.cancelEdit();
        });

        const restoredDoc = mockCommands.init.mock.calls[0]?.[0];

        expect(restoredDoc).toEqual({
            columns: ['2026-03-01'],
            rows: [{workerId: '1', cells: ['D']}],
            workerMeta: {'1': {name: 'Kim'}},
            fixedCells: {},
            requestCells: {},
        });
        expect(restoredDoc).not.toBe(mockEditorState.doc);
        expect(restoredDoc.rows[0]).not.toBe(mockEditorState.doc.rows[0]);
        expect(mockCommands.discardPersisted).toHaveBeenCalled();
        expect(useDutyStore.getState().readonly).toBe(true);
    });

    it('converts the current doc to dto and saves it through the ward api', async () => {
        mockSearchParams = new URLSearchParams('year=2025&month=7&shiftTeamId=20');
        mockUpdateShifts.mockResolvedValue(undefined);

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.currentShiftTeamId).toBe(20);
        });

        mockCommands.discardPersisted.mockClear();

        await act(async () => {
            await result.current.handlers.saveEdit();
        });

        expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
        expect(mockDocToWardShiftsDTO).toHaveBeenCalledWith(mockEditorState.doc, shift);
        expect(mockUpdateShifts).toHaveBeenCalledWith(1, [{shiftNurseId: 1, date: '2025-07-01', wardShiftTypeId: 1}]);
        expect(mockCommands.discardPersisted).toHaveBeenCalled();
        expect(mockInvalidateQueries).toHaveBeenCalledWith({
            queryKey: ['ward', 'duty', 1, 20, 2025, 7],
        });
        expect(mockSetLoading).toHaveBeenLastCalledWith(false);
        expect(useDutyStore.getState().readonly).toBe(true);
    });

    it('keeps edit mode active when saving fails while still clearing the loading state', async () => {
        mockUpdateShifts.mockRejectedValue(new Error('save failed'));

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.shift).toBe(shift);
        });

        mockCommands.discardPersisted.mockClear();
        mockInvalidateQueries.mockClear();

        act(() => {
            result.current.handlers.enableEdit();
        });

        await expect(
            act(async () => {
                await result.current.handlers.saveEdit();
            }),
        ).rejects.toThrow('save failed');

        expect(mockDocToWardShiftsDTO).toHaveBeenCalledWith(mockEditorState.doc, shift);
        expect(mockUpdateShifts).toHaveBeenCalled();
        expect(mockCommands.discardPersisted).not.toHaveBeenCalled();
        expect(mockInvalidateQueries).not.toHaveBeenCalled();
        expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
        expect(mockSetLoading).toHaveBeenLastCalledWith(false);
        expect(useDutyStore.getState().readonly).toBe(false);
    });

    it('posts the current shift and invalidates the duty query', async () => {
        mockSearchParams = new URLSearchParams('year=2025&month=7&shiftTeamId=20');
        mockPostShift.mockResolvedValue(undefined);

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.currentShiftTeamId).toBe(20);
        });

        await act(async () => {
            await result.current.handlers.postShift();
        });

        expect(mockPostShift).toHaveBeenCalledWith(1, 20, 2025, 7);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({
            queryKey: ['ward', 'duty', 1, 20, 2025, 7],
        });
    });

    it('does not invalidate the duty query when postShift fails', async () => {
        mockSearchParams = new URLSearchParams('year=2025&month=7&shiftTeamId=20');
        mockPostShift.mockRejectedValue(new Error('post failed'));

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.currentShiftTeamId).toBe(20);
        });

        mockInvalidateQueries.mockClear();

        await expect(
            act(async () => {
                await result.current.handlers.postShift();
            }),
        ).rejects.toThrow('post failed');

        expect(mockPostShift).toHaveBeenCalledWith(1, 20, 2025, 7);
        expect(mockInvalidateQueries).not.toHaveBeenCalled();
    });

    it('skips postShift when no shift team is selected', async () => {
        setQueryState({
            shiftTeams: {data: [], isPending: false, isError: false},
        });

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.currentShiftTeamId).toBeNull();
        });

        await act(async () => {
            await result.current.handlers.postShift();
        });

        expect(mockPostShift).not.toHaveBeenCalled();
        expect(mockInvalidateQueries).not.toHaveBeenCalled();
    });

    it('exports the current shift as excel with the selected month', async () => {
        mockSearchParams = new URLSearchParams('year=2025&month=7&shiftTeamId=20');

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.shift).toBe(shift);
        });

        act(() => {
            result.current.handlers.exportExcel();
        });

        expect(mockExportExcel).toHaveBeenCalledTimes(1);
    });

    it('skips excel export when there is no shift data', async () => {
        setQueryState({
            duty: {data: null, isPending: false, isError: false, refetch: mockRefetch},
        });

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.shift).toBeNull();
        });

        act(() => {
            result.current.handlers.exportExcel();
        });

        expect(mockExportExcel).not.toHaveBeenCalled();
    });

    it('navigates to the current month make page with the selected shift team', async () => {
        mockSearchParams = new URLSearchParams('year=2025&month=7&shiftTeamId=20');

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.currentShiftTeamId).toBe(20);
        });

        act(() => {
            result.current.handlers.goCurrentMonthMake();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/make?year=2025&month=7&shiftTeamId=20');
    });

    it('navigates to the next month make page and rolls the year forward in december', async () => {
        useDutyStore.setState({
            year: 2026,
            month: 12,
            shiftTeams,
            currentShiftTeamId: 20,
        });

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.currentShiftTeamId).toBe(20);
        });

        act(() => {
            result.current.handlers.goNextMonthMake();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/make?year=2027&month=1&shiftTeamId=20');
    });

    it('opens onboarding-created modal from query flag and clears the flag from url', async () => {
        mockSearchParams = new URLSearchParams('onboardingWardCreated=1');

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.showOnboardingWardCreatedModal).toBe(true);
        });

        expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

        const [nextParams, options] = mockSetSearchParams.mock.calls[0] as [URLSearchParams, {replace: boolean}];

        expect(nextParams.get('onboardingWardCreated')).toBeNull();
        expect(options).toEqual({replace: true});
    });

    it('starts next month make flow when onboarding-created modal confirm is clicked', async () => {
        mockSearchParams = new URLSearchParams('year=2026&month=3&shiftTeamId=20&onboardingWardCreated=1');

        const {result} = renderHook(() => useDutyHook());

        await waitFor(() => {
            expect(result.current.state.showOnboardingWardCreatedModal).toBe(true);
            expect(result.current.state.currentShiftTeamId).toBe(20);
        });

        act(() => {
            result.current.handlers.startNextMonthMakeFromOnboarding();
        });

        expect(result.current.state.showOnboardingWardCreatedModal).toBe(false);
        expect(mockNavigate).toHaveBeenCalledWith('/make?year=2026&month=4&shiftTeamId=20');
    });
});
