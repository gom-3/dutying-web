/** 프로덕션 앱 도메인 — 여기서는 LINKED 계정 온보딩 미리보기 불가 */
const PRODUCTION_APP_HOSTS = new Set(['app.dutying.net']);

function getAppHostname(): string | null {
    if (typeof window === 'undefined') return null;

    return window.location.hostname;
}

/**
 * 접속 중인 앱 도메인이 dev/staging/로컬/프리뷰인지 판별한다.
 * Vercel env 없이 `window.location.hostname`만 사용한다.
 */
export function isNonProductionAppDomain(hostname: string = getAppHostname() ?? ''): boolean {
    if (!hostname) return false;
    if (PRODUCTION_APP_HOSTS.has(hostname)) return false;

    if (hostname === 'localhost') return true;
    if (hostname.endsWith('.vercel.app')) return true;
    if (hostname.endsWith('.local')) return true;
    if (hostname.startsWith('local.')) return true;
    if (hostname === 'dev.dutying.net') return true;
    if (hostname.startsWith('staging.')) return true;

    return false;
}

/**
 * 온보딩 병동 생성 UI를 WARD_SELECT_PENDING이 아닌 계정(LINKED 등)에서도 열 수 있게 한다.
 *
 * - 로컬 dev server: `import.meta.env.DEV`
 * - 그 외: **접속 도메인**이 프로덕션(`app.dutying.net`)이 아니면 허용
 * - 명시 override: `VITE_ALLOW_ONBOARDING_PREVIEW=true|false`
 */
export function isOnboardingWardCreatePreviewAllowed(): boolean {
    const override = import.meta.env.VITE_ALLOW_ONBOARDING_PREVIEW;

    if (override === 'true') return true;
    if (override === 'false') return false;

    const hostname = getAppHostname();

    if (hostname && PRODUCTION_APP_HOSTS.has(hostname)) return false;

    return import.meta.env.DEV || isNonProductionAppDomain(hostname ?? '');
}
