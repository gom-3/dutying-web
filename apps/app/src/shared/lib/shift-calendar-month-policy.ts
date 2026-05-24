/**
 * 캘린더 기준 "이번 달"과 상대 월 오프셋 계산 (/duty, /make 공통).
 */

export function getCalendarYearMonthNow(): {year: number; month: number} {
    const d = new Date();

    return {year: d.getFullYear(), month: d.getMonth() + 1};
}

/** 오늘이 속한 달 대비 `year`/`month`가 몇 달 뒤인지 (과거면 음수). */
export function monthsAfterTodayYearMonth(year: number, month: number): number {
    const {year: y0, month: m0} = getCalendarYearMonthNow();

    return (year - y0) * 12 + (month - m0);
}

/** /duty: 조회·쿼리 허용 — 이번 달·다음 달까지(과거 달 포함, 미래는 +1칸까지). */
export function isDutyCalendarViewAllowed(year: number, month: number): boolean {
    return monthsAfterTodayYearMonth(year, month) <= 1;
}

/** /duty: 다음 달 화면에서 '다음 달' 화살표 비활성. */
export function isDutyAtMaxFutureMonth(year: number, month: number): boolean {
    return monthsAfterTodayYearMonth(year, month) >= 1;
}

/** /duty: 이번 달 화면 — "다음 달 만들기" 버튼 노출 구간. */
export function isDutyViewingThisCalendarMonth(year: number, month: number): boolean {
    return monthsAfterTodayYearMonth(year, month) === 0;
}

/**
 * /duty: 지난 달보다 이전(그보다 더 과거)인지.
 * 해당 달에 근무표가 없을 때 "생성하기"를 숨길 때 사용.
 */
export function isDutyPastStrictlyBeforeLastMonth(year: number, month: number): boolean {
    return monthsAfterTodayYearMonth(year, month) < -1;
}

/** /make: 근무표 생성 플로 — 오늘 기준 이번 달·다음 달만. */
export function isMakeShiftMonthAllowed(year: number, month: number): boolean {
    const d = monthsAfterTodayYearMonth(year, month);

    return d >= 0 && d <= 1;
}

/** /make 헤더: 이번 달보다 이전 달로 못 감. */
export function isMakeShiftMonthAtOrBeforeThisCalendarMonth(year: number, month: number): boolean {
    return monthsAfterTodayYearMonth(year, month) <= 0;
}

/** /make 헤더: 다음 달보다 이후로 못 감. */
export function isMakeShiftMonthAtOrAfterNextCalendarMonth(year: number, month: number): boolean {
    return monthsAfterTodayYearMonth(year, month) >= 1;
}
