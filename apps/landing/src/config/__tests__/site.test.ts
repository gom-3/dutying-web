import {describe, expect, it} from 'vitest';
import {createLandingPrimaryCtas, createSiteConfig} from '../site';

describe('createSiteConfig', () => {
    it('falls back to the production dutying domains', () => {
        const config = createSiteConfig({});

        expect(config.marketingOrigin).toBe('https://dutying.net');
        expect(config.appOrigin).toBe('https://app.dutying.net');
        expect(config.docsOrigin).toBe('https://docs.dutying.net');
        expect(config.legal.terms).toBe('https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4');
        expect(config.appLinks).toEqual({
            home: 'https://app.dutying.net',
            login: 'https://app.dutying.net/login',
            makeEntry: 'https://app.dutying.net/login?next=%2Fmake',
            make: 'https://app.dutying.net/make',
            register: 'https://app.dutying.net/register',
        });
    });

    it('trims trailing slashes from overridden origins before composing links', () => {
        const config = createSiteConfig({
            PUBLIC_MARKETING_SITE_URL: 'https://preview.dutying.net///',
            PUBLIC_APP_SITE_URL: 'https://preview.app.dutying.net//',
            PUBLIC_DOCS_SITE_URL: 'https://preview.docs.dutying.net//',
        });

        expect(config.marketingOrigin).toBe('https://preview.dutying.net');
        expect(config.docsLinks.home).toBe('https://preview.docs.dutying.net');
        expect(config.appLinks.login).toBe('https://preview.app.dutying.net/login');
        expect(config.appLinks.makeEntry).toBe('https://preview.app.dutying.net/login?next=%2Fmake');
    });

    it('falls back safely when env overrides are blank strings', () => {
        const config = createSiteConfig({
            PUBLIC_MARKETING_SITE_URL: '   ',
            PUBLIC_APP_SITE_URL: '',
        });

        expect(config.marketingOrigin).toBe('https://dutying.net');
        expect(config.appOrigin).toBe('https://app.dutying.net');
        expect(config.appLinks.login).toBe('https://app.dutying.net/login');
    });
});

describe('createLandingPrimaryCtas', () => {
    it('keeps the web CTA entrypoints pinned to the app login and make routes', () => {
        const ctas = createLandingPrimaryCtas(
            createSiteConfig({
                PUBLIC_APP_SITE_URL: 'https://staging.app.dutying.net/',
            }),
        );

        expect(ctas).toEqual([
            {label: '근무표 작성 체험하기', href: 'https://staging.app.dutying.net/login?next=%2Fmake'},
            {label: '근무표 만들기', href: 'https://staging.app.dutying.net/make'},
        ]);
    });
});
