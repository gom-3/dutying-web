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

/** 기존 /duty 링크는 같은 쿼리 맥락으로 근무표 만들기 flow에 진입한다. */
export function buildDutyPath({year, month, shiftTeamId}: TYearMonthShiftTeamParams) {
    return buildMakeShiftPath({year, month, shiftTeamId});
}
