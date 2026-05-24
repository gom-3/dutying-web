import {act} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {renderHook, waitFor} from '@/shared/util/test-utils';
import useConnectionManageController from '../use-connection-manage-controller';

const waitingNurse = {
    waitingNurseId: 1,
    nurseId: 11,
    name: '박신청',
    gender: '여',
    phoneNum: '01012345678',
    employmentDate: '2024-01-01',
    profileImgUrl: '',
};

describe('useConnectionManageController', () => {
    it('enters the error state when link mode completes without a selected nurse', async () => {
        const connectWaitingNurses = vi.fn();
        const approveWaitingNurses = vi.fn();
        const {result} = renderHook(() =>
            useConnectionManageController({
                open: true,
                approveWaitingNurses,
                connectWaitingNurses,
            }),
        );

        act(() => {
            result.current.actions.handleSelectWaitingNurse(waitingNurse);
        });

        await act(async () => {
            await result.current.actions.handleCompleteSelection();
        });

        expect(result.current.state.step).toBe(3);
        expect(result.current.state.submitStatus).toBe('error');
        expect(connectWaitingNurses).not.toHaveBeenCalled();
        expect(approveWaitingNurses).not.toHaveBeenCalled();
    });

    it('submits add mode through approveWaitingNurses and stores a success result', async () => {
        const connectWaitingNurses = vi.fn();
        const approveWaitingNurses = vi.fn().mockResolvedValue(true);
        const {result} = renderHook(() =>
            useConnectionManageController({
                open: true,
                approveWaitingNurses,
                connectWaitingNurses,
            }),
        );

        act(() => {
            result.current.actions.handleSelectWaitingNurse(waitingNurse);
            result.current.actions.setConnectMode('add');
            result.current.actions.setToAddShiftTeamId(20);
        });

        await act(async () => {
            await result.current.actions.handleCompleteSelection();
        });

        expect(approveWaitingNurses).toHaveBeenCalledWith(1, 20);
        expect(connectWaitingNurses).not.toHaveBeenCalled();
        expect(result.current.state.step).toBe(3);
        expect(result.current.state.submitStatus).toBe('success');
    });

    it('enters the error state when add mode completes without a selected team', async () => {
        const connectWaitingNurses = vi.fn();
        const approveWaitingNurses = vi.fn();
        const {result} = renderHook(() =>
            useConnectionManageController({
                open: true,
                approveWaitingNurses,
                connectWaitingNurses,
            }),
        );

        act(() => {
            result.current.actions.handleSelectWaitingNurse(waitingNurse);
            result.current.actions.setConnectMode('add');
        });

        await act(async () => {
            await result.current.actions.handleCompleteSelection();
        });

        expect(result.current.state.step).toBe(3);
        expect(result.current.state.submitStatus).toBe('error');
        expect(connectWaitingNurses).not.toHaveBeenCalled();
        expect(approveWaitingNurses).not.toHaveBeenCalled();
    });

    it('clears selected targets when returning to method selection', () => {
        const {result} = renderHook(() =>
            useConnectionManageController({
                open: true,
                approveWaitingNurses: vi.fn(),
                connectWaitingNurses: vi.fn(),
            }),
        );

        act(() => {
            result.current.actions.handleSelectWaitingNurse(waitingNurse);
            result.current.actions.setConnectMode('add');
            result.current.actions.setToLinkNurseId(99);
            result.current.actions.setToAddShiftTeamId(20);
            result.current.actions.goToMethodSelection();
        });

        expect(result.current.state.step).toBe(1);
        expect(result.current.state.toLinkNurseId).toBeNull();
        expect(result.current.state.toAddShiftTeamId).toBeNull();
        expect(result.current.state.submitStatus).toBe('idle');
    });

    it('reinitializes when the modal is closed', () => {
        const {result, rerender} = renderHook(
            ({open}) =>
                useConnectionManageController({
                    open,
                    approveWaitingNurses: vi.fn(),
                    connectWaitingNurses: vi.fn(),
                }),
            {
                initialProps: {open: true},
            },
        );

        act(() => {
            result.current.actions.handleSelectWaitingNurse(waitingNurse);
            result.current.actions.setToLinkNurseId(99);
        });

        rerender({open: false});

        expect(result.current.state.step).toBe(0);
        expect(result.current.state.currentWaitingNurse).toBeNull();
        expect(result.current.state.toLinkNurseId).toBeNull();
        expect(result.current.state.submitStatus).toBe('idle');
    });

    it('ignores stale submit completion after the flow is reset', async () => {
        let resolveConnect: ((value: boolean | undefined) => void) | null = null;

        const connectWaitingNurses = vi.fn(
            () =>
                new Promise<boolean | undefined>((resolve) => {
                    resolveConnect = resolve;
                }),
        );
        const approveWaitingNurses = vi.fn();
        const {result} = renderHook(() =>
            useConnectionManageController({
                open: true,
                approveWaitingNurses,
                connectWaitingNurses,
            }),
        );

        act(() => {
            result.current.actions.handleSelectWaitingNurse(waitingNurse);
            result.current.actions.setToLinkNurseId(99);
        });

        let submitPromise: Promise<void> | undefined;

        act(() => {
            submitPromise = result.current.actions.handleCompleteSelection();
        });

        expect(result.current.state.submitStatus).toBe('loading');

        act(() => {
            result.current.actions.initialize();
        });

        await act(async () => {
            resolveConnect?.(true);
            await submitPromise;
        });

        expect(result.current.state.step).toBe(0);
        expect(result.current.state.submitStatus).toBe('idle');
    });

    it('stores an error result when connectWaitingNurses resolves false in link mode', async () => {
        const connectWaitingNurses = vi.fn().mockResolvedValue(false);
        const approveWaitingNurses = vi.fn();
        const {result} = renderHook(() =>
            useConnectionManageController({
                open: true,
                approveWaitingNurses,
                connectWaitingNurses,
            }),
        );

        act(() => {
            result.current.actions.handleSelectWaitingNurse(waitingNurse);
            result.current.actions.setToLinkNurseId(99);
        });

        await act(async () => {
            await result.current.actions.handleCompleteSelection();
        });

        expect(connectWaitingNurses).toHaveBeenCalledWith(1, 99);
        expect(approveWaitingNurses).not.toHaveBeenCalled();
        expect(result.current.state.step).toBe(3);
        expect(result.current.state.submitStatus).toBe('error');
    });

    it('retries the current selection after a failed submit and stores the later success result', async () => {
        const connectWaitingNurses = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
        const {result} = renderHook(() =>
            useConnectionManageController({
                open: true,
                approveWaitingNurses: vi.fn(),
                connectWaitingNurses,
            }),
        );

        act(() => {
            result.current.actions.handleSelectWaitingNurse(waitingNurse);
            result.current.actions.setToLinkNurseId(99);
        });

        await act(async () => {
            await result.current.actions.handleCompleteSelection();
        });

        expect(result.current.state.submitStatus).toBe('error');

        await act(async () => {
            result.current.actions.retryCompleteSelection();
        });

        expect(connectWaitingNurses).toHaveBeenNthCalledWith(1, 1, 99);
        expect(connectWaitingNurses).toHaveBeenNthCalledWith(2, 1, 99);

        await waitFor(() => {
            expect(result.current.state.submitStatus).toBe('success');
        });
    });
});
