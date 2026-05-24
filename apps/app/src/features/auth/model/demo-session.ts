import {sanitizeInternalPath} from '@/shared/config/runtime';
import ROUTE from '@/shared/constant/path';

export const DEMO_SESSION_DURATION_MS = 3_540_000;
export const DEMO_SESSION_EXPIRING_SOON_MS = 10 * 60 * 1000;

const DEMO_SIGNUP_REASON = 'demo-expired';

export type TDemoSessionInfo = {
    isActive: boolean;
    isExpired: boolean;
    isExpiringSoon: boolean;
    remainingMs: number;
    remainingMinutes: number;
    remainingRoundedMinutes: number;
    remainingSeconds: number;
    countdownLabel: string;
};

const toTimestamp = (demoStartDate: string | null | undefined) => {
    if (!demoStartDate) return null;

    const timestamp = new Date(demoStartDate).getTime();

    return Number.isNaN(timestamp) ? null : timestamp;
};
const formatCountdown = (minutes: number, seconds: number) => `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

export const getDemoSessionRemainingMs = (demoStartDate: string | null | undefined, now: number = Date.now()) => {
    const startedAt = toTimestamp(demoStartDate);

    if (startedAt === null) return 0;

    return Math.max(startedAt + DEMO_SESSION_DURATION_MS - now, 0);
};

export const getDemoSessionInfo = (demoStartDate: string | null | undefined, now = Date.now()): TDemoSessionInfo | null => {
    if (!demoStartDate) {
        return null;
    }

    const startedAt = toTimestamp(demoStartDate);

    if (startedAt === null) {
        return null;
    }

    const remainingMs = Math.max(startedAt + DEMO_SESSION_DURATION_MS - now, 0);
    const remainingTotalSeconds = Math.ceil(remainingMs / 1000);
    const remainingMinutes = Math.floor(remainingTotalSeconds / 60);
    const remainingSeconds = remainingTotalSeconds % 60;

    return {
        isActive: remainingMs > 0,
        isExpired: remainingMs === 0,
        isExpiringSoon: remainingMs > 0 && remainingMs <= DEMO_SESSION_EXPIRING_SOON_MS,
        remainingMs,
        remainingMinutes,
        remainingRoundedMinutes: remainingTotalSeconds > 0 ? Math.ceil(remainingTotalSeconds / 60) : 0,
        remainingSeconds,
        countdownLabel: formatCountdown(remainingMinutes, remainingSeconds),
    };
};

export const isDemoSessionExpired = (demoStartDate: string | null | undefined, now: number = Date.now()) => {
    if (!demoStartDate) return false;

    if (toTimestamp(demoStartDate) === null) return true;

    return getDemoSessionRemainingMs(demoStartDate, now) === 0;
};

export const formatDemoSessionRemainingLabel = (demoStartDate: string | null | undefined, now: number = Date.now()) => {
    const sessionInfo = getDemoSessionInfo(demoStartDate, now);

    if (!sessionInfo?.isActive) return null;

    return `듀팅 체험중 ${sessionInfo.remainingMinutes}:${String(sessionInfo.remainingSeconds).padStart(2, '0')}`;
};

export const buildDemoSignupLoginPath = (nextPath: string = ROUTE.REGISTER) => {
    const params = new URLSearchParams({
        reason: DEMO_SIGNUP_REASON,
        next: sanitizeInternalPath(nextPath, ROUTE.REGISTER),
    });

    return `${ROUTE.LOGIN}?${params.toString()}`;
};

export const getIsDemoSignupLoginReason = (search: string) => new URLSearchParams(search).get('reason') === DEMO_SIGNUP_REASON;
