const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const getRuntimeOrigin = (value: string | undefined, fallback: string) => {
    const normalized = value?.trim();

    if (normalized === '') {
        return stripTrailingSlash(fallback);
    }

    return stripTrailingSlash(normalized ?? fallback);
};

type SiteEnv = {
    PUBLIC_MARKETING_SITE_URL?: string;
    PUBLIC_APP_SITE_URL?: string;
    PUBLIC_DOCS_SITE_URL?: string;
    PUBLIC_TERMS_URL?: string;
};

const readSiteEnv = (): SiteEnv => ({
    PUBLIC_MARKETING_SITE_URL: import.meta.env.PUBLIC_MARKETING_SITE_URL,
    PUBLIC_APP_SITE_URL: import.meta.env.PUBLIC_APP_SITE_URL,
    PUBLIC_DOCS_SITE_URL: import.meta.env.PUBLIC_DOCS_SITE_URL,
    PUBLIC_TERMS_URL: import.meta.env.PUBLIC_TERMS_URL,
});

export const createSiteConfig = (env: SiteEnv = readSiteEnv()) => {
    const marketingOrigin = getRuntimeOrigin(env.PUBLIC_MARKETING_SITE_URL, 'https://dutying.net');
    const appOrigin = getRuntimeOrigin(env.PUBLIC_APP_SITE_URL, 'https://app.dutying.net');
    const docsOrigin = getRuntimeOrigin(env.PUBLIC_DOCS_SITE_URL, 'https://docs.dutying.net');
    const termsUrl = env.PUBLIC_TERMS_URL ?? 'https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4';

    return {
        productName: 'Dutying',
        marketingOrigin,
        appOrigin,
        docsOrigin,
        legal: {
            terms: termsUrl,
        },
        appLinks: {
            home: appOrigin,
            login: `${appOrigin}/login`,
            makeEntry: `${appOrigin}/login?next=%2Fmake`,
            make: `${appOrigin}/make`,
            register: `${appOrigin}/register`,
        },
        docsLinks: {
            home: docsOrigin,
        },
    };
};

export const createLandingPrimaryCtas = (config: ReturnType<typeof createSiteConfig>) => [
    {label: '근무표 작성 체험하기', href: config.appLinks.makeEntry},
    {label: '근무표 만들기', href: config.appLinks.make},
];

export const siteConfig = createSiteConfig(readSiteEnv());
export const landingPrimaryCtas = createLandingPrimaryCtas(siteConfig);
