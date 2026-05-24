import {describe, expect, it} from 'vitest';
import ROUTE from '@/shared/constant/path';
import {buildDemoSignupLoginPath, formatDemoSessionRemainingLabel, getDemoSessionRemainingMs, isDemoSessionExpired} from '../demo-session';

describe('demo-session', () => {
    it('calculates remaining time within the demo window', () => {
        expect(getDemoSessionRemainingMs('2026-03-25T00:00:00.000Z', new Date('2026-03-25T00:30:00.000Z').getTime())).toBeGreaterThan(0);
    });

    it('treats the demo as expired once the duration passes', () => {
        expect(isDemoSessionExpired('2026-03-25T00:00:00.000Z', new Date('2026-03-25T01:00:00.000Z').getTime())).toBe(true);
    });

    it('formats the remaining label with padded seconds', () => {
        expect(formatDemoSessionRemainingLabel('2026-03-25T00:00:00.000Z', new Date('2026-03-25T00:58:01.000Z').getTime())).toBe(
            '듀팅 체험중 0:59',
        );
    });

    it('builds the login path for the demo conversion flow', () => {
        expect(buildDemoSignupLoginPath()).toBe(`${ROUTE.LOGIN}?reason=demo-expired&next=%2Fregister`);
    });
});
