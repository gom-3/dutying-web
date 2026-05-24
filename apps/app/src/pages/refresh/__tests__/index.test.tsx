import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import useRefresh, {REFRESH_DEMO_EXPIRED_REDIRECT_ERROR} from '@/features/refresh';
import ROUTE from '@/shared/constant/path';
import {render, waitFor} from '@/shared/util/test-utils';
import RefreshPage from '../index';

vi.mock('@/features/refresh', () => ({
    default: vi.fn(),
    REFRESH_DEMO_EXPIRED_REDIRECT_ERROR: 'refresh_demo_expired_redirect',
}));

vi.mock('@/shared/hook/use-typed-translation', () => ({
    useTypedTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const mockedUseRefresh = vi.mocked(useRefresh);

describe('RefreshPage', () => {
    const refreshSpy = vi.fn();
    const replaceSpy = vi.fn();

    beforeEach(() => {
        refreshSpy.mockReset();
        replaceSpy.mockReset();
        mockedUseRefresh.mockReset();
        mockedUseRefresh.mockReturnValue({
            refresh: refreshSpy,
        } as never);
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                ...window.location,
                replace: replaceSpy,
            },
        });
    });

    it('redirects to the requested internal path after refresh succeeds', async () => {
        refreshSpy.mockResolvedValue(undefined);

        render(
            <MemoryRouter initialEntries={['/refresh?next=%2Fmember%3Ftab%3Dprofile']}>
                <Routes>
                    <Route path={ROUTE.REFRESH} element={<RefreshPage />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(replaceSpy).toHaveBeenCalledWith('/member?tab=profile');
        });
    });

    it('falls back to make when the next path is external', async () => {
        refreshSpy.mockResolvedValue(undefined);

        render(
            <MemoryRouter initialEntries={['/refresh?next=https%3A%2F%2Fevil.example%2Fphish']}>
                <Routes>
                    <Route path={ROUTE.REFRESH} element={<RefreshPage />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(replaceSpy).toHaveBeenCalledWith(ROUTE.MAKE);
        });
    });

    it('falls back to make when the next path is protocol-relative', async () => {
        refreshSpy.mockResolvedValue(undefined);

        render(
            <MemoryRouter initialEntries={['/refresh?next=%2F%2Fevil.example%2Fphish']}>
                <Routes>
                    <Route path={ROUTE.REFRESH} element={<RefreshPage />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(replaceSpy).toHaveBeenCalledWith(ROUTE.MAKE);
        });
    });

    it('returns to the landing root when refresh fails', async () => {
        refreshSpy.mockRejectedValue(new Error('expired'));

        render(
            <MemoryRouter initialEntries={['/refresh?next=%2Fmake']}>
                <Routes>
                    <Route path={ROUTE.REFRESH} element={<RefreshPage />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(replaceSpy).toHaveBeenCalledWith(ROUTE.ROOT);
        });
    });

    it('does not overwrite the demo-expired signup redirect when refresh already redirected', async () => {
        refreshSpy.mockRejectedValue(new Error(REFRESH_DEMO_EXPIRED_REDIRECT_ERROR));

        render(
            <MemoryRouter initialEntries={['/refresh?next=%2Fmake']}>
                <Routes>
                    <Route path={ROUTE.REFRESH} element={<RefreshPage />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(refreshSpy).toHaveBeenCalled();
        });

        expect(replaceSpy).not.toHaveBeenCalled();
    });
});
