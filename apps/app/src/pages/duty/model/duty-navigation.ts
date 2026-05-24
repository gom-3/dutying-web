import ROUTE from '@/shared/constant/path';

export function getNextYearMonth(year: number, month: number) {
    return {
        year: month === 12 ? year + 1 : year,
        month: month === 12 ? 1 : month + 1,
    };
}

type TYearMonthShiftTeamParams = {
    year: number;
    month: number;
    shiftTeamId: number | null;
};

export function buildMakeShiftPath({year, month, shiftTeamId}: TYearMonthShiftTeamParams) {
    const params = new URLSearchParams({
        year: String(year),
        month: String(month),
    });

    if (shiftTeamId !== null) {
        params.set('shiftTeamId', String(shiftTeamId));
    }

    return `${ROUTE.MAKE}?${params.toString()}`;
}

/** 확정 근무표 보기(/duty) — 쿼리는 duty 훅과 동일하게 year, month, shiftTeamId(선택). */
export function buildDutyPath({year, month, shiftTeamId}: TYearMonthShiftTeamParams) {
    const params = new URLSearchParams({
        year: String(year),
        month: String(month),
    });

    if (shiftTeamId !== null) {
        params.set('shiftTeamId', String(shiftTeamId));
    }

    return `${ROUTE.DUTY}?${params.toString()}`;
}
