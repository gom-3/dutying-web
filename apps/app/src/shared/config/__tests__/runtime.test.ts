import {describe, expect, it, vi} from 'vitest';
import ROUTE from '@/shared/constant/path';
import {buildAppUrl, buildAuthAuthorizeUrl, resolveSafeRedirectTarget, sanitizeInternalPath} from '../runtime';

describe('sanitizeInternalPath', () => {
    it('keeps app-relative paths', () => {
        expect(sanitizeInternalPath('/member?tab=profile')).toBe('/member?tab=profile');
    });

    it('falls back for absolute urls', () => {
        expect(sanitizeInternalPath('https://evil.example/steal')).toBe(ROUTE.MAKE);
    });
});

describe('resolveSafeRedirectTarget', () => {
    it('accepts same-origin absolute redirect and converts it to app-relative path', () => {
        vi.stubGlobal('window', {
            location: {
                origin: 'https://app.dutying.net',
            },
        });

        expect(resolveSafeRedirectTarget('https://app.dutying.net/request?month=3#header')).toBe('/request?month=3#header');
    });

    it('rejects cross-origin redirects', () => {
        vi.stubGlobal('window', {
            location: {
                origin: 'https://app.dutying.net',
            },
        });

        expect(resolveSafeRedirectTarget('https://evil.example/request')).toBe(ROUTE.MAKE);
    });

    it('accepts redirects that match the configured public app origin in local development', () => {
        vi.stubEnv('VITE_APP_PUBLIC_URL', 'https://app.dutying.net');
        vi.stubGlobal('window', {
            location: {
                origin: 'https://local.app.dutying.net:3000',
            },
        });

        expect(resolveSafeRedirectTarget('https://app.dutying.net/login?next=%2Fmake#cta')).toBe('/login?next=%2Fmake#cta');
    });

    it('rejects protocol-relative redirect targets', () => {
        expect(resolveSafeRedirectTarget('//evil.example/phish')).toBe(ROUTE.MAKE);
    });

    it('rejects same-origin redirects whose normalized path becomes protocol-relative', () => {
        vi.stubGlobal('window', {
            location: {
                origin: 'https://app.dutying.net',
            },
        });

        expect(resolveSafeRedirectTarget('https://app.dutying.net//evil.example')).toBe(ROUTE.MAKE);
        expect(resolveSafeRedirectTarget('https://app.dutying.net/\\evil.example')).toBe(ROUTE.MAKE);
    });

    it('rejects landing-domain redirects after domain split', () => {
        vi.stubGlobal('window', {
            location: {
                origin: 'https://app.dutying.net',
            },
        });

        expect(resolveSafeRedirectTarget('https://dutying.net/request')).toBe(ROUTE.MAKE);
    });

    it('rejects docs-domain redirects after domain split', () => {
        vi.stubGlobal('window', {
            location: {
                origin: 'https://app.dutying.net',
            },
        });

        expect(resolveSafeRedirectTarget('https://docs.dutying.net/request')).toBe(ROUTE.MAKE);
    });

    it('rejects slash-backslash redirect targets', () => {
        expect(resolveSafeRedirectTarget('/\\evil.example')).toBe(ROUTE.MAKE);
    });
});

describe('buildAppUrl', () => {
    it('uses the configured public app url and strips trailing slashes', () => {
        vi.stubEnv('VITE_APP_PUBLIC_URL', 'https://staging.app.dutying.net///');

        expect(buildAppUrl('/member')).toBe('https://staging.app.dutying.net/member');
    });
});

describe('buildAuthAuthorizeUrl', () => {
    it('sanitizes invalid nextPath before building auth url', () => {
        vi.stubEnv('VITE_SERVER_URL', 'https://api.dutying.net');
        vi.stubEnv('VITE_APP_PUBLIC_URL', 'https://app.dutying.net');

        const url = new URL(buildAuthAuthorizeUrl('kakao', 'https://evil.example/phish'));

        expect(url.origin).toBe('https://api.dutying.net');
        expect(url.searchParams.get('nextPageUrl')).toBe('https://app.dutying.net/make');
    });

    it('falls back when env urls are blank strings', () => {
        vi.stubEnv('VITE_SERVER_URL', '   ');
        vi.stubEnv('VITE_APP_PUBLIC_URL', 'https://app.dutying.net');

        const url = new URL(buildAuthAuthorizeUrl('apple', ROUTE.REQUEST));

        expect(url.origin).toBe('https://app.dutying.net');
        expect(url.searchParams.get('nextPageUrl')).toBe('https://app.dutying.net/request');
    });
});
