import {describe, expect, it} from 'vitest';
import {shouldAutoSelectVisibleNurse} from '../detail-panel-selection';

describe('shouldAutoSelectVisibleNurse', () => {
    it('상세 패널을 수동으로 닫은 뒤에는 자동 재선택하지 않아야 한다', () => {
        expect(
            shouldAutoSelectVisibleNurse({
                activeShiftTeamId: 3,
                isDetailPanelDismissed: true,
                selectedShiftTeamId: null,
                visibleNurseCount: 4,
            }),
        ).toBe(false);
    });

    it('현재 팀에 선택된 간호사가 없으면 첫 간호사를 자동 선택해야 한다', () => {
        expect(
            shouldAutoSelectVisibleNurse({
                activeShiftTeamId: 3,
                isDetailPanelDismissed: false,
                selectedShiftTeamId: null,
                visibleNurseCount: 4,
            }),
        ).toBe(true);
    });

    it('선택된 간호사가 다른 팀에 속하면 현재 팀으로 맞춰 자동 선택해야 한다', () => {
        expect(
            shouldAutoSelectVisibleNurse({
                activeShiftTeamId: 3,
                isDetailPanelDismissed: false,
                selectedShiftTeamId: 2,
                visibleNurseCount: 2,
            }),
        ).toBe(true);
    });

    it('이미 현재 팀 간호사가 선택되어 있으면 자동 재선택하지 않아야 한다', () => {
        expect(
            shouldAutoSelectVisibleNurse({
                activeShiftTeamId: 3,
                isDetailPanelDismissed: false,
                selectedShiftTeamId: 3,
                visibleNurseCount: 2,
            }),
        ).toBe(false);
    });
});
