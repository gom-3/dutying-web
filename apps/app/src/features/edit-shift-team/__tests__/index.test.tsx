/* eslint-disable @typescript-eslint/no-explicit-any */
import {act} from 'react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {renderHook} from '@/shared/util/test-utils';
import useEditShiftTeam from '..';
import useEditNurseStore from '../model/store';

const ward = {
    shiftTeams: [
        {
            shiftTeamId: 10,
            name: 'A팀',
            nurses: [{nurseId: 11, name: '김하나', divisionNum: 1, priority: 1000}],
        },
    ],
} as any;
const {
    mockInvalidateQueries,
    mockCancelQueries,
    mockGetQueryData,
    mockSetQueryData,
    mockUpdateNurse,
    mockAddNurseIntoShiftTeam,
    mockRemoveNurseFromShiftTeam,
    mockToastSuccess,
    mockToastError,
} = vi.hoisted(() => ({
    mockInvalidateQueries: vi.fn(),
    mockCancelQueries: vi.fn(),
    mockGetQueryData: vi.fn(),
    mockSetQueryData: vi.fn(),
    mockUpdateNurse: vi.fn(),
    mockAddNurseIntoShiftTeam: vi.fn(),
    mockRemoveNurseFromShiftTeam: vi.fn(),
    mockToastSuccess: vi.fn(),
    mockToastError: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
    const actual = await vi.importActual('@tanstack/react-query');

    return {
        ...actual,
        useQuery: vi.fn(() => ({data: ward})),
        useQueryClient: vi.fn(() => ({
            invalidateQueries: mockInvalidateQueries,
            cancelQueries: mockCancelQueries,
            getQueryData: mockGetQueryData,
            setQueryData: mockSetQueryData,
        })),
    };
});

vi.mock('@/features/auth', () => ({
    default: () => ({
        state: {
            wardId: 1,
        },
    }),
}));

vi.mock('@/features/request-shift', () => ({
    default: () => ({
        queryKey: {
            requestShiftQueryKey: ['ward', 'requestShift'],
        },
    }),
}));

vi.mock('@/shared/api', () => ({
    NurseAPI: {
        updateNurse: mockUpdateNurse,
    },
    WardAPI: {
        addNurseIntoShiftTeam: mockAddNurseIntoShiftTeam,
        removeNurseFromShiftTeam: mockRemoveNurseFromShiftTeam,
    },
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: mockToastSuccess,
        error: mockToastError,
    },
}));

describe('useEditShiftTeam', () => {
    beforeEach(() => {
        useEditNurseStore.getState().reset();
        mockInvalidateQueries.mockReset();
        mockCancelQueries.mockReset();
        mockGetQueryData.mockReset();
        mockSetQueryData.mockReset();
        mockUpdateNurse.mockReset();
        mockAddNurseIntoShiftTeam.mockReset();
        mockRemoveNurseFromShiftTeam.mockReset();
        mockToastSuccess.mockReset();
        mockToastError.mockReset();
    });

    it('keeps the draft dirty and exposes an error save status when updateNurse fails with an unknown error shape', async () => {
        useEditNurseStore.getState().selectNurse(11, 'create');
        useEditNurseStore.getState().setNurseDraftDirty(true);
        mockUpdateNurse.mockRejectedValue({response: {status: 500}});

        const {result} = renderHook(() => useEditShiftTeam());

        let isSuccess: boolean | undefined;

        await act(async () => {
            isSuccess = await result.current.actions.updateNurse(11, {name: '김하나'} as any);
        });

        expect(isSuccess).toBe(false);
        expect(result.current.state.nurseSaveStatus).toBe('error');
        expect(result.current.state.isNurseDraftDirty).toBe(true);
        expect(result.current.state.selectedNurseDrawerMode).toBe('create');
        expect(mockToastError).toHaveBeenCalledWith('간호사 정보를 수정하지 못했어요.');
        expect(mockInvalidateQueries).not.toHaveBeenCalled();
    });

    it('resets the adding flag after addNurse fails', async () => {
        mockAddNurseIntoShiftTeam.mockRejectedValue(new Error('network'));

        const {result} = renderHook(() => useEditShiftTeam());

        await act(async () => {
            await result.current.actions.addNurse(10);
        });

        expect(result.current.state.isAddingNurse).toBe(false);
        expect(result.current.state.selectedNurse).toBeUndefined();
        expect(mockToastError).toHaveBeenCalledWith('간호사를 추가하지 못했어요.');
        expect(mockToastSuccess).not.toHaveBeenCalled();
    });

    it('keeps the adding flag on until ward invalidation finishes after addNurse succeeds', async () => {
        let resolveInvalidate: (() => void) | undefined;

        mockAddNurseIntoShiftTeam.mockResolvedValue({
            nurseId: 22,
        });
        mockInvalidateQueries.mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    resolveInvalidate = resolve;
                }),
        );

        const {result} = renderHook(() => useEditShiftTeam());

        let actionPromise: Promise<void> | undefined;

        await act(async () => {
            actionPromise = result.current.actions.addNurse(10);
            await Promise.resolve();
        });

        expect(result.current.state.isAddingNurse).toBe(true);
        expect(useEditNurseStore.getState().selectedNurseId).toBe(22);
        expect(result.current.state.selectedNurseDrawerMode).toBe('create');

        await act(async () => {
            resolveInvalidate?.();
            await actionPromise;
        });

        expect(result.current.state.isAddingNurse).toBe(false);
        expect(mockToastSuccess).toHaveBeenCalledWith('간호사를 추가했어요. 이름과 연락처를 확인한 뒤 저장해 주세요.', {
            position: 'bottom-center',
        });
    });

    it('resets the deleting flag and preserves the current selection after deleteNurse fails', async () => {
        useEditNurseStore.getState().selectNurse(11);
        mockRemoveNurseFromShiftTeam.mockRejectedValue({message: 'server error'});

        const {result} = renderHook(() => useEditShiftTeam());

        await act(async () => {
            await result.current.actions.deleteNurse(10, 11);
        });

        expect(result.current.state.isDeletingNurse).toBe(false);
        expect(result.current.state.selectedNurse?.nurseId).toBe(11);
        expect(mockToastError).toHaveBeenCalledWith('간호사를 삭제하지 못했어요.');
        expect(mockToastSuccess).not.toHaveBeenCalled();
    });

    it('keeps the deleting flag on until ward invalidation finishes after deleteNurse succeeds', async () => {
        let resolveInvalidate: (() => void) | undefined;

        useEditNurseStore.getState().selectNurse(11);
        mockRemoveNurseFromShiftTeam.mockResolvedValue(undefined);
        mockInvalidateQueries.mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    resolveInvalidate = resolve;
                }),
        );

        const {result} = renderHook(() => useEditShiftTeam());

        let actionPromise: Promise<void> | undefined;

        await act(async () => {
            actionPromise = result.current.actions.deleteNurse(10, 11);
            await Promise.resolve();
        });

        expect(result.current.state.isDeletingNurse).toBe(true);
        expect(result.current.state.selectedNurse).toBeUndefined();

        await act(async () => {
            resolveInvalidate?.();
            await actionPromise;
        });

        expect(result.current.state.isDeletingNurse).toBe(false);
        expect(mockToastSuccess).toHaveBeenCalledWith('간호사를 삭제했어요.');
    });
});
