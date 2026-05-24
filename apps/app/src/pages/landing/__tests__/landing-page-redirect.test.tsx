import {beforeEach, describe, expect, it, vi} from 'vitest';
import useAuth from '@/features/auth';
import ROUTE from '@/shared/constant/path';
import {render} from '@/shared/util/test-utils';
import LandingPageRedirect, {getLandingRedirectPath} from '../landing-page-redirect';

vi.mock('@/features/auth', () => ({
    default: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe('getLandingRedirectPath', () => {
    it('returns make for authenticated users', () => {
        expect(getLandingRedirectPath(true)).toBe(ROUTE.MAKE);
    });

    it('returns login for unauthenticated users', () => {
        expect(getLandingRedirectPath(false)).toBe(ROUTE.LOGIN);
    });
});

describe('LandingPageRedirect', () => {
    const replaceSpy = vi.fn();

    beforeEach(() => {
        mockedUseAuth.mockReset();
        replaceSpy.mockReset();
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                ...window.location,
                replace: replaceSpy,
            },
        });
    });

    it('does not redirect until auth hydration is loaded', () => {
        mockedUseAuth.mockReturnValue({
            state: {
                isAuth: true,
                _loaded: false,
            },
        } as never);

        render(<LandingPageRedirect />);

        expect(replaceSpy).not.toHaveBeenCalled();
    });

    it('redirects after auth hydration is loaded', () => {
        mockedUseAuth.mockReturnValue({
            state: {
                isAuth: true,
                _loaded: true,
            },
        } as never);

        render(<LandingPageRedirect />);

        expect(replaceSpy).toHaveBeenCalledWith(ROUTE.MAKE);
    });

    it('sends unauthenticated users to login once hydration is loaded', () => {
        mockedUseAuth.mockReturnValue({
            state: {
                isAuth: false,
                _loaded: true,
            },
        } as never);

        render(<LandingPageRedirect />);

        expect(replaceSpy).toHaveBeenCalledWith(ROUTE.LOGIN);
    });
});
