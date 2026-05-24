import {act, renderHook} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {AccountAPI, AuthAPI} from '@/shared/api';
import useAuth from '../index';
import useAuthStore from '../model/store';

const {
    mockNavigate,
    mockResetRequestShiftState,
    mockSetLoading,
    mockInitTutorial,
    mockSendEvent,
    mockExecuteLoginRedirect,
    mockGetLoginRedirectDecision,
    setAccessTokenMock,
} = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockResetRequestShiftState: vi.fn(),
    mockSetLoading: vi.fn(),
    mockInitTutorial: vi.fn(),
    mockSendEvent: vi.fn(),
    mockExecuteLoginRedirect: vi.fn(),
    mockGetLoginRedirectDecision: vi.fn(() => ({type: 'none'})),
    setAccessTokenMock: vi.fn(),
}));

vi.mock('react-router', () => ({
    useLocation: () => ({pathname: '/request'}),
    useNavigate: () => mockNavigate,
}));

vi.mock('@/analytics', () => ({
    events: {
        auth: {
            login: 'login',
            logut: 'logout',
        },
    },
    sendEvent: (...args: unknown[]) => mockSendEvent(...args),
}));

vi.mock('@/features/request-shift/model/store', () => ({
    useRequestShiftStore: (selector: (state: {resetState: () => void}) => unknown) =>
        selector({
            resetState: mockResetRequestShiftState,
        }),
}));

vi.mock('@/features/loading', () => ({
    default: () => ({
        setLoading: mockSetLoading,
    }),
}));

vi.mock('@/features/tutorial', () => ({
    default: () => ({
        initTutorial: mockInitTutorial,
    }),
}));

vi.mock('@/shared/api/client', () => ({
    setAccessToken: (...args: unknown[]) => setAccessTokenMock(...args),
}));

vi.mock('@/shared/api', () => ({
    AccountAPI: {
        getAccountMe: vi.fn(),
    },
    AuthAPI: {
        demoStart: vi.fn(),
    },
}));

vi.mock('../loginRedirect', () => ({
    executeLoginRedirect: mockExecuteLoginRedirect,
    getLoginRedirectDecision: mockGetLoginRedirectDecision,
}));

describe('useAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        useAuthStore.setState({
            accountMe: {accountId: 9, wardId: 99, nurseId: 19} as never,
            accountMeStatus: 'success',
            isAuth: true,
            isDemoExpired: false,
            accessToken: 'old-token',
            accountId: 9,
            nurseId: 19,
            wardId: 99,
            demoStartDate: '2026-03-01T00:00:00.000Z',
            _loaded: true,
        });
    });

    it('clears stale identity fields when login starts a new bootstrap', () => {
        const {result} = renderHook(() => useAuth());

        act(() => {
            result.current.actions.handleLogin('new-token', null);
        });

        expect(useAuthStore.getState()).toMatchObject({
            accountMe: null,
            accountMeStatus: 'loading',
            accessToken: 'new-token',
            accountId: null,
            nurseId: null,
            wardId: null,
            demoStartDate: null,
            isAuth: true,
        });
    });

    it('preserves demoStartDate when login is used for token refresh', () => {
        const {result} = renderHook(() => useAuth());

        act(() => {
            result.current.actions.handleLogin('refreshed-token', null, {preserveDemoStartDate: true});
        });

        expect(useAuthStore.getState()).toMatchObject({
            accountMe: null,
            accountMeStatus: 'loading',
            accessToken: 'refreshed-token',
            accountId: null,
            nurseId: null,
            wardId: null,
            demoStartDate: '2026-03-01T00:00:00.000Z',
            isAuth: true,
        });
    });

    it('preserves stale identity fields and rethrows when account bootstrap fails', async () => {
        vi.mocked(AccountAPI.getAccountMe).mockRejectedValueOnce(new Error('boom'));

        const {result} = renderHook(() => useAuth());

        await expect(
            act(async () => {
                await result.current.actions.handleGetAccountMe();
            }),
        ).rejects.toThrow('boom');

        expect(useAuthStore.getState()).toMatchObject({
            accountMe: {accountId: 9, wardId: 99, nurseId: 19},
            accountMeStatus: 'error',
            accountId: 9,
            nurseId: 19,
            wardId: 99,
        });
    });

    it('marks the demo session as expired during bootstrap instead of logging out', async () => {
        useAuthStore.setState({
            demoStartDate: '2026-02-01T00:00:00.000Z',
            isDemoExpired: false,
        });

        vi.mocked(AccountAPI.getAccountMe).mockResolvedValueOnce({accountId: 9, wardId: 99, nurseId: 19} as never);

        await act(async () => {
            renderHook(() => useAuth(true));
            await Promise.resolve();
        });

        expect(useAuthStore.getState()).toMatchObject({
            isAuth: true,
            accessToken: 'old-token',
            isDemoExpired: true,
        });
        expect(mockResetRequestShiftState).not.toHaveBeenCalled();
    });

    it('turns loading off again when demo bootstrap fails', async () => {
        vi.mocked(AuthAPI.demoStart).mockRejectedValueOnce(new Error('demo failed'));

        const {result} = renderHook(() => useAuth());

        await expect(
            act(async () => {
                await result.current.actions.demoTry();
            }),
        ).rejects.toThrow('demo failed');

        expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
        expect(mockSetLoading).toHaveBeenNthCalledWith(2, false);
    });

    it('turns loading off again when tutorial initialization fails during demo bootstrap', async () => {
        mockInitTutorial.mockImplementationOnce(() => {
            throw new Error('tutorial failed');
        });

        const {result} = renderHook(() => useAuth());

        await expect(
            act(async () => {
                await result.current.actions.demoTry();
            }),
        ).rejects.toThrow('tutorial failed');

        expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
        expect(mockSetLoading).toHaveBeenNthCalledWith(2, false);
        expect(AuthAPI.demoStart).not.toHaveBeenCalled();
    });

    it('syncs the api client token before navigating after demo bootstrap', async () => {
        vi.mocked(AuthAPI.demoStart).mockResolvedValueOnce({
            accessToken: 'demo-token',
            accountResDto: {
                accountId: 12,
                nurseId: 34,
                wardId: 56,
            },
        } as never);

        const {result} = renderHook(() => useAuth());

        await act(async () => {
            await result.current.actions.demoTry();
        });

        expect(useAuthStore.getState()).toMatchObject({
            accountMe: null,
            accessToken: 'demo-token',
            accountId: 12,
            nurseId: 34,
            wardId: 56,
            isAuth: true,
            isDemoExpired: false,
        });
        expect(setAccessTokenMock).toHaveBeenCalledWith('demo-token');
        expect(mockNavigate).toHaveBeenCalled();
        expect(setAccessTokenMock.mock.invocationCallOrder[0]).toBeLessThan(mockNavigate.mock.invocationCallOrder[0]);
    });
});
