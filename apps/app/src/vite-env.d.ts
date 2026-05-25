/// <reference types="vite/client" />

/* eslint-disable @typescript-eslint/naming-convention */
interface ImportMetaEnv {
    readonly VITE_SERVER_URL?: string;
    readonly VITE_APP_PUBLIC_URL?: string;
    readonly VITE_APP_SITE_URL?: string;
    readonly VITE_PUBLIC_S3_BASE_URL?: string;
    readonly VITE_TERMS_URL?: string;
    readonly VITE_TERMS_OF_SERVICE_URL?: string;
    readonly VITE_PRIVACY_POLICY_URL?: string;
    readonly VITE_MEMBER_TUTORIAL_URL?: string;
    readonly VITE_REQUEST_TUTORIAL_URL?: string;
    readonly VITE_MAKE_TUTORIAL_URL?: string;
    readonly VITE_GA_TRACKING_ID?: string;
    readonly VITE_PIXEL_ID?: string;
    readonly VITE_AI_SCHEDULE_PROVIDER?: string;
    readonly VITE_BOARD_API_PROVIDER?: string;
    /** LINKED 계정 온보딩 미리보기 강제 on/off (미설정 시 접속 도메인으로 판별) */
    readonly VITE_ALLOW_ONBOARDING_PREVIEW?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
/* eslint-enable @typescript-eslint/naming-convention */
