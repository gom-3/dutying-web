import ROUTE from '@/shared/constant/path';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const getWindowOrigin = () => {
    if (typeof window === 'undefined') return undefined;

    return window.location.origin;
};
const getRuntimeUrl = (envValue: string | undefined, fallback: string) => {
    const normalized = envValue?.trim();

    if (normalized === '') {
        return trimTrailingSlash(fallback);
    }

    return trimTrailingSlash(normalized ?? fallback);
};
const INTERNAL_PATH_PATTERN = /^\/(?![\\/])/;

export const RUNTIME_CONFIG = {
    publicAppUrl: () => getRuntimeUrl(import.meta.env.VITE_APP_PUBLIC_URL, getWindowOrigin() ?? 'https://app.dutying.net'),
    serverUrl: () => getRuntimeUrl(import.meta.env.VITE_SERVER_URL, RUNTIME_CONFIG.publicAppUrl()),
    profileImageBaseUrl: () =>
        getRuntimeUrl(import.meta.env.VITE_PUBLIC_S3_BASE_URL, 'https://dutying-prod.s3.ap-northeast-2.amazonaws.com'),
    docs: {
        termsOfService: import.meta.env.VITE_TERMS_OF_SERVICE_URL ?? 'https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4',
        privacyPolicy: import.meta.env.VITE_PRIVACY_POLICY_URL ?? 'https://gom3.notion.site/5ed51c04dd5d475c868367ed05a7d903?pvs=4',
        memberTutorial: import.meta.env.VITE_MEMBER_TUTORIAL_URL ?? 'https://gom3.notion.site/befb4602f83241ed896a1700eb592b35?pvs=4',
        requestTutorial: import.meta.env.VITE_REQUEST_TUTORIAL_URL ?? 'https://gom3.notion.site/befb4602f83241ed896a1700eb592b35?pvs=4',
        makeTutorial: import.meta.env.VITE_MAKE_TUTORIAL_URL ?? 'https://gom3.notion.site/68d3ad01e68d4d6a8b4cb8c2409353a3?pvs=4',
    },
} as const;

export const sanitizeInternalPath = (path: string | null | undefined, fallback: string = ROUTE.MAKE) =>
    path && INTERNAL_PATH_PATTERN.test(path) ? path : fallback;

export const buildAppUrl = (path: string) => new URL(sanitizeInternalPath(path), `${RUNTIME_CONFIG.publicAppUrl()}/`).toString();

export const resolveSafeRedirectTarget = (target: string | null | undefined, fallback: string = ROUTE.MAKE) => {
    if (target === 'back') return 'back';

    if (!target) return fallback;

    if (INTERNAL_PATH_PATTERN.test(target)) return target;

    try {
        const redirectUrl = new URL(target);
        const allowedOrigins = [getWindowOrigin(), RUNTIME_CONFIG.publicAppUrl()].filter((origin): origin is string => Boolean(origin));

        if (!allowedOrigins.includes(redirectUrl.origin)) {
            return fallback;
        }

        return `${sanitizeInternalPath(redirectUrl.pathname, fallback)}${redirectUrl.search}${redirectUrl.hash}`;
    } catch {
        return fallback;
    }
};

export const buildAuthAuthorizeUrl = (provider: 'kakao' | 'apple', nextPath: string = ROUTE.MAKE) => {
    const url = new URL(`/oauth2/authorization/${provider}`, `${RUNTIME_CONFIG.serverUrl()}/`);

    url.searchParams.set('nextPageUrl', buildAppUrl(sanitizeInternalPath(nextPath)));

    return url.toString();
};
