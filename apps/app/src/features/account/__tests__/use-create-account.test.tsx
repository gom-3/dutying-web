import {act, renderHook} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {useCreateAccount} from '../model';

const createNurseDTO = {
    name: '홍길동',
    gender: '여' as const,
    phoneNum: '01012341234',
    employmentDate: '2024-01-01',
    isWorker: true,
    profileImg: {
        defaultProfileImgId: 1,
    },
};

describe('useCreateAccount', () => {
    it('tracks loading to success when account creation succeeds', async () => {
        let resolveSubmit: (() => void) | undefined;

        const submit = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveSubmit = resolve;
                }),
        );
        const {result} = renderHook(() =>
            useCreateAccount({
                submit,
            }),
        );

        let request: Promise<unknown>;

        act(() => {
            request = result.current.handleCreateAccount(createNurseDTO);
        });

        expect(result.current.createAccountStatus).toBe('loading');
        expect(result.current.createAccountFeedback.message).toBe('계정 정보를 저장하고 있어요.');

        await act(async () => {
            resolveSubmit?.();
            await request!;
        });

        expect(result.current.createAccountStatus).toBe('success');
        expect(result.current.createAccountFeedback.message).toBe('계정 정보를 저장했어요.');
    });

    it('marks validation failure without submitting when validation callback runs', () => {
        const submit = vi.fn();
        const {result} = renderHook(() =>
            useCreateAccount({
                submit,
            }),
        );

        act(() => {
            result.current.handleCreateAccountValidationFailure();
        });

        expect(submit).not.toHaveBeenCalled();
        expect(result.current.createAccountStatus).toBe('failure');
        expect(result.current.createAccountFeedback.message).toBe('입력한 계정 정보를 다시 확인해 주세요.');
    });

    it('classifies handled api errors as failure', async () => {
        const submit = vi.fn().mockRejectedValue({code: 400});
        const {result} = renderHook(() =>
            useCreateAccount({
                submit,
            }),
        );

        let request: Promise<unknown>;

        act(() => {
            request = result.current.handleCreateAccount(createNurseDTO);
        });

        await act(async () => {
            await request!.catch(() => undefined);
        });

        await expect(request!).rejects.toEqual({code: 400});

        expect(result.current.createAccountStatus).toBe('failure');
    });

    it('classifies unexpected errors as exception', async () => {
        const error = new Error('network');
        const submit = vi.fn().mockRejectedValue(error);
        const {result} = renderHook(() =>
            useCreateAccount({
                submit,
            }),
        );

        let request: Promise<unknown>;

        act(() => {
            request = result.current.handleCreateAccount(createNurseDTO);
        });

        await act(async () => {
            await request!.catch(() => undefined);
        });

        await expect(request!).rejects.toThrow('network');

        expect(result.current.createAccountStatus).toBe('exception');
        expect(result.current.createAccountFeedback.message).toBe('계정 생성 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.');
    });

    it('does not reset back to idle while submit is still loading', async () => {
        let resolveSubmit: (() => void) | undefined;

        const submit = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveSubmit = resolve;
                }),
        );
        const {result} = renderHook(() =>
            useCreateAccount({
                submit,
            }),
        );

        act(() => {
            void result.current.handleCreateAccount(createNurseDTO);
        });

        act(() => {
            result.current.resetCreateAccountStatus();
        });

        expect(result.current.createAccountStatus).toBe('loading');

        await act(async () => {
            resolveSubmit?.();
            await Promise.resolve();
        });
    });
});
