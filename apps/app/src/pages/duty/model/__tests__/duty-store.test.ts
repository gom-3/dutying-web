import {describe, expect, it, beforeEach} from 'vitest';
import {useDutyStore} from '../duty-store';

describe('useDutyStore', () => {
    beforeEach(() => {
        useDutyStore.setState({
            year: 2026,
            month: 3,
            shiftTeams: [],
            currentShiftTeamId: null,
            readonly: true,
            shift: null,
            status: 'idle',
        });
    });

    it('clamps month when setting year and month directly', () => {
        useDutyStore.getState().setYearMonth({year: 2025, month: 15});

        expect(useDutyStore.getState()).toMatchObject({year: 2025, month: 12});

        useDutyStore.getState().setYearMonth({year: 2025, month: 0});

        expect(useDutyStore.getState()).toMatchObject({year: 2025, month: 1});
    });

    it('moves to previous year when going before January', () => {
        useDutyStore.setState({year: 2026, month: 1});

        useDutyStore.getState().goPrevMonth();

        expect(useDutyStore.getState()).toMatchObject({year: 2025, month: 12});
    });

    it('moves to next year when going after December', () => {
        useDutyStore.setState({year: 2026, month: 12});

        useDutyStore.getState().goNextMonth();

        expect(useDutyStore.getState()).toMatchObject({year: 2027, month: 1});
    });
});
