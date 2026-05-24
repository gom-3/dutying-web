import {afterEach, describe, expect, it, vi} from 'vitest';
import ROUTE from '@/shared/constant/path';
import {executeLoginRedirect, getLoginRedirectDecision} from '../login-redirect';

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('getLoginRedirectDecision', () => {
    it('returns none when login should only update auth state', () => {
        const resolveRedirectTarget = vi.fn();

        expect(getLoginRedirectDecision(null, resolveRedirectTarget)).toEqual({type: 'none'});
        expect(resolveRedirectTarget).not.toHaveBeenCalled();
    });

    it('maps resolved back redirects to history-back instructions', () => {
        const resolveRedirectTarget = vi.fn().mockReturnValue('back');

        expect(getLoginRedirectDecision('/request', resolveRedirectTarget)).toEqual({type: 'history-back'});
    });

    it('maps resolved targets to replace instructions', () => {
        const resolveRedirectTarget = vi.fn().mockReturnValue('/request?month=3#calendar');

        expect(getLoginRedirectDecision('/request?month=3#calendar', resolveRedirectTarget)).toEqual({
            type: 'replace',
            href: '/request?month=3#calendar',
        });
    });

    it('falls back to the default app route when nextPageUrl is missing', () => {
        vi.stubGlobal('window', {
            location: {
                origin: 'https://app.dutying.net',
            },
            history: {
                back: vi.fn(),
            },
        });

        expect(getLoginRedirectDecision(undefined)).toEqual({
            type: 'replace',
            href: ROUTE.MAKE,
        });
    });

    it('keeps allowed app-domain subdomain redirects as in-app replace targets', () => {
        vi.stubGlobal('window', {
            location: {
                origin: 'https://app.dutying.net',
            },
            history: {
                back: vi.fn(),
            },
        });

        expect(getLoginRedirectDecision('https://app.dutying.net/request?month=3#calendar')).toEqual({
            type: 'replace',
            href: '/request?month=3#calendar',
        });
    });

    it('falls back when nextPageUrl points to the landing domain after subdomain split', () => {
        vi.stubGlobal('window', {
            location: {
                origin: 'https://app.dutying.net',
            },
            history: {
                back: vi.fn(),
            },
        });

        expect(getLoginRedirectDecision('https://dutying.net/request?month=3')).toEqual({
            type: 'replace',
            href: ROUTE.MAKE,
        });
    });
});

describe('executeLoginRedirect', () => {
    it('calls history back for history-back instructions', () => {
        const executor = {
            back: vi.fn(),
            replace: vi.fn(),
        };

        executeLoginRedirect({type: 'history-back'}, executor);

        expect(executor.back).toHaveBeenCalledTimes(1);
        expect(executor.replace).not.toHaveBeenCalled();
    });

    it('calls replace for replace instructions', () => {
        const executor = {
            back: vi.fn(),
            replace: vi.fn(),
        };

        executeLoginRedirect({type: 'replace', href: '/member'}, executor);

        expect(executor.replace).toHaveBeenCalledWith('/member');
        expect(executor.back).not.toHaveBeenCalled();
    });

    it('does nothing for none instructions', () => {
        const executor = {
            back: vi.fn(),
            replace: vi.fn(),
        };

        executeLoginRedirect({type: 'none'}, executor);

        expect(executor.back).not.toHaveBeenCalled();
        expect(executor.replace).not.toHaveBeenCalled();
    });
});
