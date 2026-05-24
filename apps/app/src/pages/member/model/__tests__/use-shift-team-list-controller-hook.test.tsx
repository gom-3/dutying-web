import {type TShiftTeam} from '@dutying/domain';
import {act} from 'react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {renderHook} from '@/shared/util/test-utils';
import useShiftTeamListController from '../use-shift-team-list-controller-hook';

const {mockSendEvent, outsideHandlers} = vi.hoisted(() => ({
    mockSendEvent: vi.fn(),
    outsideHandlers: [] as Array<() => void>,
}));

vi.mock('@/analytics', () => ({
    events: {
        memberPage: {
            moveNurseFocus: 'memberPage.moveNurseFocus',
            moveNurse: 'memberPage.moveNurse',
        },
    },
    sendEvent: mockSendEvent,
}));

vi.mock('react-cool-onclickoutside', () => ({
    default: (handler: () => void) => {
        outsideHandlers.push(handler);

        return vi.fn();
    },
}));

const shiftTeams = [
    {
        shiftTeamId: 10,
        name: 'A팀',
        nurses: [
            {nurseId: 1, name: '김하나', divisionNum: 1, priority: 1000},
            {nurseId: 2, name: '김둘', divisionNum: 2, priority: 1000},
        ],
    },
    {
        shiftTeamId: 20,
        name: 'B팀',
        nurses: [{nurseId: 3, name: '박셋', divisionNum: 1, priority: 1000}],
    },
] as TShiftTeam[];

describe('useShiftTeamListController', () => {
    beforeEach(() => {
        outsideHandlers.length = 0;
        mockSendEvent.mockReset();
    });

    it('moves focus to the first nurse in the next team when ArrowDown is pressed at the end of a team', () => {
        const selectNurse = vi.fn();
        const {unmount} = renderHook(() =>
            useShiftTeamListController({
                shiftTeams,
                selectedNurse: shiftTeams[0].nurses[1],
                selectNurse,
                moveNurseOrder: vi.fn(),
                updateShiftTeam: vi.fn(),
            }),
        );
        const event = new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true});
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

        document.dispatchEvent(event);

        expect(selectNurse).toHaveBeenCalledWith(3);
        expect(preventDefaultSpy).toHaveBeenCalledOnce();
        expect(mockSendEvent).toHaveBeenCalledWith('memberPage.moveNurseFocus');

        unmount();
    });

    it('moves focus to the last nurse in the previous team when ArrowUp is pressed at the start of a team', () => {
        const selectNurse = vi.fn();
        const {unmount} = renderHook(() =>
            useShiftTeamListController({
                shiftTeams,
                selectedNurse: shiftTeams[1].nurses[0],
                selectNurse,
                moveNurseOrder: vi.fn(),
                updateShiftTeam: vi.fn(),
            }),
        );

        document.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp', bubbles: true}));

        expect(selectNurse).toHaveBeenCalledWith(2);
        expect(mockSendEvent).toHaveBeenCalledWith('memberPage.moveNurseFocus');

        unmount();
    });

    it('ignores keyboard focus movement while the event target is an editable input', () => {
        const selectNurse = vi.fn();
        const {unmount} = renderHook(() =>
            useShiftTeamListController({
                shiftTeams,
                selectedNurse: shiftTeams[0].nurses[0],
                selectNurse,
                moveNurseOrder: vi.fn(),
                updateShiftTeam: vi.fn(),
            }),
        );
        const input = document.createElement('input');

        document.body.append(input);
        input.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}));

        expect(selectNurse).not.toHaveBeenCalled();
        expect(mockSendEvent).not.toHaveBeenCalled();

        input.remove();
        unmount();
    });

    it('clears the selected nurse when the list click-away handler runs', () => {
        const selectNurse = vi.fn();

        renderHook(() =>
            useShiftTeamListController({
                shiftTeams,
                selectedNurse: shiftTeams[0].nurses[0],
                selectNurse,
                moveNurseOrder: vi.fn(),
                updateShiftTeam: vi.fn(),
            }),
        );

        act(() => {
            outsideHandlers[0]?.();
        });

        expect(selectNurse).toHaveBeenCalledWith(null);
    });

    it('closes the open shift team menu when the menu click-away handler runs', () => {
        const {result} = renderHook(() =>
            useShiftTeamListController({
                shiftTeams,
                selectedNurse: shiftTeams[0].nurses[0],
                selectNurse: vi.fn(),
                moveNurseOrder: vi.fn(),
                updateShiftTeam: vi.fn(),
            }),
        );

        act(() => {
            result.current.actions.setOpenMenuShiftTeamId(10);
        });

        expect(result.current.state.openMenuShiftTeamId).toBe(10);

        act(() => {
            outsideHandlers[1]?.();
        });

        expect(result.current.state.openMenuShiftTeamId).toBeNull();
    });

    it('submits the pending shift team name edit when the name click-away handler runs', () => {
        const updateShiftTeam = vi.fn();
        const {result} = renderHook(() =>
            useShiftTeamListController({
                shiftTeams,
                selectedNurse: shiftTeams[0].nurses[0],
                selectNurse: vi.fn(),
                moveNurseOrder: vi.fn(),
                updateShiftTeam,
            }),
        );

        act(() => {
            result.current.actions.startEditingShiftTeam(10, 'A팀');
            result.current.actions.changeEditShiftTeamName('A팀 수정');
        });

        act(() => {
            outsideHandlers[outsideHandlers.length - 1]?.();
        });

        expect(updateShiftTeam).toHaveBeenCalledWith(10, {name: 'A팀 수정'});
        expect(result.current.state.editShiftTeam).toBeNull();
    });
});
