/** @vitest-environment node */
import {describe, expect, it} from 'vitest';
import {
    getCalendarYearMonthNow,
    isDutyAtMaxFutureMonth,
    isDutyCalendarViewAllowed,
    isDutyPastStrictlyBeforeLastMonth,
    isDutyViewingThisCalendarMonth,
    isMakeShiftMonthAllowed,
    monthsAfterTodayYearMonth,
} from '../duty-month-policy';

describe('dutyMonthPolicy', () => {
    it('monthsAfterTodayYearMonth is 0 for this calendar month', () => {
        const {year, month} = getCalendarYearMonthNow();

        expect(monthsAfterTodayYearMonth(year, month)).toBe(0);
    });

    it('allows this month, next month, and past months; blocks month after next', () => {
        const {year, month} = getCalendarYearMonthNow();

        expect(isDutyCalendarViewAllowed(year, month)).toBe(true);

        const lastM = month > 1 ? month - 1 : 12;
        const lastY = month > 1 ? year : year - 1;

        expect(isDutyCalendarViewAllowed(lastY, lastM)).toBe(true);

        const nextM = month >= 12 ? 1 : month + 1;
        const nextY = month >= 12 ? year + 1 : year;

        expect(isDutyCalendarViewAllowed(nextY, nextM)).toBe(true);

        const afterNextM = nextM >= 12 ? 1 : nextM + 1;
        const afterNextY = nextM >= 12 ? nextY + 1 : nextY;

        expect(isDutyCalendarViewAllowed(afterNextY, afterNextM)).toBe(false);
    });

    it('isDutyPastStrictlyBeforeLastMonth excludes last month and this month', () => {
        const {year, month} = getCalendarYearMonthNow();
        const lastM = month > 1 ? month - 1 : 12;
        const lastY = month > 1 ? year : year - 1;
        const twoAgoM = lastM > 1 ? lastM - 1 : 12;
        const twoAgoY = lastM > 1 ? lastY : lastY - 1;

        expect(isDutyPastStrictlyBeforeLastMonth(year, month)).toBe(false);
        expect(isDutyPastStrictlyBeforeLastMonth(lastY, lastM)).toBe(false);
        expect(isDutyPastStrictlyBeforeLastMonth(twoAgoY, twoAgoM)).toBe(true);
    });

    it('isMakeShiftMonthAllowed allows only this and next calendar month', () => {
        const {year, month} = getCalendarYearMonthNow();
        const lastM = month > 1 ? month - 1 : 12;
        const lastY = month > 1 ? year : year - 1;
        const nextM = month >= 12 ? 1 : month + 1;
        const nextY = month >= 12 ? year + 1 : year;
        const afterNextM = nextM >= 12 ? 1 : nextM + 1;
        const afterNextY = nextM >= 12 ? nextY + 1 : nextY;

        expect(isMakeShiftMonthAllowed(year, month)).toBe(true);
        expect(isMakeShiftMonthAllowed(nextY, nextM)).toBe(true);
        expect(isMakeShiftMonthAllowed(lastY, lastM)).toBe(false);
        expect(isMakeShiftMonthAllowed(afterNextY, afterNextM)).toBe(false);
    });

    it('isDutyAtMaxFutureMonth is true on next month boundary', () => {
        const {year, month} = getCalendarYearMonthNow();
        const nextM = month >= 12 ? 1 : month + 1;
        const nextY = month >= 12 ? year + 1 : year;

        expect(isDutyAtMaxFutureMonth(year, month)).toBe(false);
        expect(isDutyAtMaxFutureMonth(nextY, nextM)).toBe(true);
    });

    it('isDutyViewingThisCalendarMonth matches this month only', () => {
        const {year, month} = getCalendarYearMonthNow();
        const nextM = month >= 12 ? 1 : month + 1;
        const nextY = month >= 12 ? year + 1 : year;

        expect(isDutyViewingThisCalendarMonth(year, month)).toBe(true);
        expect(isDutyViewingThisCalendarMonth(nextY, nextM)).toBe(false);
    });
});
