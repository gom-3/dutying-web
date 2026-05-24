import {describe, expect, it} from 'vitest';
import {buildDutyPath, buildMakeShiftPath, getNextYearMonth} from '../duty-navigation';

describe('dutyNavigation', () => {
    it('builds the make page path with the selected shift team', () => {
        expect(buildMakeShiftPath({year: 2026, month: 3, shiftTeamId: 20})).toBe('/make?year=2026&month=3&shiftTeamId=20');
    });

    it('omits shiftTeamId when no team is selected', () => {
        expect(buildMakeShiftPath({year: 2026, month: 3, shiftTeamId: null})).toBe('/make?year=2026&month=3');
    });

    it('builds the duty page path with the selected shift team', () => {
        expect(buildDutyPath({year: 2026, month: 3, shiftTeamId: 20})).toBe('/duty?year=2026&month=3&shiftTeamId=20');
    });

    it('omits shiftTeamId on duty path when no team is selected', () => {
        expect(buildDutyPath({year: 2026, month: 3, shiftTeamId: null})).toBe('/duty?year=2026&month=3');
    });

    it('rolls over to january of the next year', () => {
        expect(getNextYearMonth(2026, 12)).toEqual({year: 2027, month: 1});
    });
});
