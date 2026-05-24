import {act} from 'react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {wardQueryKeys} from '@/entities/ward/model/queries';
import {renderHook} from '@/shared/util/test-utils';
import useEditWard from '..';

const {mockInvalidateQueries, mockApproveWaitingNurses, mockConnectWaitingNurses, mockToastSuccess, mockToastError} = vi.hoisted(() => ({
    mockInvalidateQueries: vi.fn(),
    mockApproveWaitingNurses: vi.fn(),
    mockConnectWaitingNurses: vi.fn(),
    mockToastSuccess: vi.fn(),
    mockToastError: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
    const actual = await vi.importActual('@tanstack/react-query');

    return {
        ...actual,
        useQuery: vi.fn(() => ({data: undefined})),
        useQueryClient: vi.fn(() => ({
            invalidateQueries: mockInvalidateQueries,
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

vi.mock('@/shared/api', () => ({
    WardAPI: {
        approveWaitingNurses: mockApproveWaitingNurses,
        connectWaitingNurses: mockConnectWaitingNurses,
    },
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: mockToastSuccess,
        error: mockToastError,
    },
}));

describe('useEditWard', () => {
    beforeEach(() => {
        mockInvalidateQueries.mockReset();
        mockApproveWaitingNurses.mockReset();
        mockConnectWaitingNurses.mockReset();
        mockToastSuccess.mockReset();
        mockToastError.mockReset();
    });

    it('returns true and invalidates ward queries after approving a waiting nurse', async () => {
        mockApproveWaitingNurses.mockResolvedValue(undefined);

        const {result} = renderHook(() => useEditWard());

        let isSuccess: boolean | undefined;

        await act(async () => {
            isSuccess = await result.current.actions.approveWaitingNurses(7, 20);
        });

        expect(isSuccess).toBe(true);
        expect(mockApproveWaitingNurses).toHaveBeenCalledWith(1, 7, 20);
        expect(mockInvalidateQueries).toHaveBeenNthCalledWith(1, {queryKey: wardQueryKeys.id(1)});
        expect(mockInvalidateQueries).toHaveBeenNthCalledWith(2, {queryKey: wardQueryKeys.waitingNurses(1)});
        expect(mockToastSuccess).toHaveBeenCalledWith('선택한 팀에 간호사를 추가했어요.');
        expect(mockToastError).not.toHaveBeenCalled();
    });

    it('returns false without showing an error toast when approveWaitingNurses rejects with a handled API code', async () => {
        mockApproveWaitingNurses.mockRejectedValue({code: 400});

        const {result} = renderHook(() => useEditWard());

        let isSuccess: boolean | undefined;

        await act(async () => {
            isSuccess = await result.current.actions.approveWaitingNurses(7, 20);
        });

        expect(isSuccess).toBe(false);
        expect(mockInvalidateQueries).not.toHaveBeenCalled();
        expect(mockToastSuccess).not.toHaveBeenCalled();
        expect(mockToastError).not.toHaveBeenCalled();
    });

    it('returns false and surfaces a generic feedback toast when connectWaitingNurses rejects with an unknown error shape', async () => {
        mockConnectWaitingNurses.mockRejectedValue({response: {status: 500}});

        const {result} = renderHook(() => useEditWard());

        let isSuccess: boolean | undefined;

        await act(async () => {
            isSuccess = await result.current.actions.connectWaitingNurses(7, 99);
        });

        expect(isSuccess).toBe(false);
        expect(mockConnectWaitingNurses).toHaveBeenCalledWith(1, 7, 99);
        expect(mockInvalidateQueries).not.toHaveBeenCalled();
        expect(mockToastSuccess).not.toHaveBeenCalled();
        expect(mockToastError).toHaveBeenCalledWith('기존 간호사 계정에 연결하지 못했어요.');
    });
});
