import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@/shared/util/test-utils';
import {DutyManagementMonthTeamHeader} from '../ui';

const defaultProps = {
    year: 2026,
    month: 5,
    prevLabel: 'Previous month',
    nextLabel: 'Next month',
    currentShiftTeamId: 1,
    onPrevMonth: vi.fn(),
    onNextMonth: vi.fn(),
    onSelectShiftTeam: vi.fn(),
    emptyLabel: 'No teams',
    formatMonthLabel: (year: number, month: number) => `${year}-${month}`,
};

describe('DutyManagementMonthTeamHeader', () => {
    it('hides the team switcher when there is only one team', () => {
        render(
            <DutyManagementMonthTeamHeader
                {...defaultProps}
                shiftTeams={[{shiftTeamId: 1, name: 'Solo'}]}
                teamTone="darkSegmented"
            />,
        );

        expect(screen.queryByRole('button', {name: 'Solo'})).not.toBeInTheDocument();
    });

    it('shows the team switcher when there are multiple teams', () => {
        render(
            <DutyManagementMonthTeamHeader
                {...defaultProps}
                shiftTeams={[
                    {shiftTeamId: 1, name: 'Alpha'},
                    {shiftTeamId: 2, name: 'Beta'},
                ]}
                teamTone="darkSegmented"
            />,
        );

        expect(screen.getByRole('button', {name: 'Alpha'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Beta'})).toBeInTheDocument();
    });
});
