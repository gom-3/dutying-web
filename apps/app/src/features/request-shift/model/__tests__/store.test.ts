import {afterEach, describe, expect, it} from 'vitest';
import {type TRequestShift} from '@/entities/shift';
import {type TShiftTeam} from '@/entities/ward';
import {useRequestShiftStore} from '../store';

const shiftTeamsFixture: TShiftTeam[] = [{shiftTeamId: 1, name: 'A팀'} as TShiftTeam, {shiftTeamId: 2, name: 'B팀'} as TShiftTeam];
const requestShiftFixture: TRequestShift = {
    days: [{day: 1, dayType: 'workday'}],
    wardShiftTypes: [
        {
            wardShiftTypeId: 11,
            name: 'Day',
            shortName: 'D',
            startTime: '07:00',
            endTime: '15:00',
            color: '#111111',
            isDefault: true,
            isOff: false,
            isCounted: true,
            classification: 'DAY',
        },
    ],
    divisionShiftNurses: [
        [
            {
                shiftNurse: {
                    shiftNurseId: 101,
                    nurseId: 1001,
                    name: '황인서',
                    carried: 0,
                    divisionNum: 1,
                    priority: 1,
                    isWorker: true,
                },
                carry: 0,
                wardReqShiftList: [11],
            },
        ],
        [
            {
                shiftNurse: {
                    shiftNurseId: 102,
                    nurseId: 1002,
                    name: '김간호',
                    carried: 0,
                    divisionNum: 2,
                    priority: 2,
                    isWorker: true,
                },
                carry: 0,
                wardReqShiftList: [null],
            },
        ],
    ],
};

describe('useRequestShiftStore', () => {
    afterEach(() => {
        localStorage.clear();
        useRequestShiftStore.getState().reset();
    });

    it('keeps the current shift team when still available and falls back when it is removed', () => {
        useRequestShiftStore.getState().selectShiftTeam(2);
        useRequestShiftStore.getState().syncShiftTeams(shiftTeamsFixture);

        expect(useRequestShiftStore.getState().currentShiftTeamId).toBe(2);

        useRequestShiftStore.getState().syncShiftTeams([{shiftTeamId: 1, name: 'A팀'} as TShiftTeam]);

        expect(useRequestShiftStore.getState().currentShiftTeamId).toBe(1);

        useRequestShiftStore.getState().syncShiftTeams([]);

        expect(useRequestShiftStore.getState().currentShiftTeamId).toBeNull();
    });

    it('loads request shift data into folded levels and derived ward shift type state', () => {
        useRequestShiftStore.getState().selectShiftTeam(2);
        useRequestShiftStore.getState().loadRequestShift(requestShiftFixture);

        expect(useRequestShiftStore.getState()).toMatchObject({
            foldedLevels: [false, false],
            oldCurrentShiftTeamId: 2,
        });
        expect(useRequestShiftStore.getState().wardShiftTypeMap?.get(11)?.shortName).toBe('D');
    });

    it('expresses edit mode and request processing transitions through explicit actions', () => {
        useRequestShiftStore.getState().selectFocus({
            shiftNurseId: 101,
            shiftNurseName: '황인서',
            day: 0,
        });

        useRequestShiftStore.getState().enterEditMode();
        useRequestShiftStore.getState().startRequestChange();
        useRequestShiftStore.getState().startRequestDecision(301);

        expect(useRequestShiftStore.getState()).toMatchObject({
            readonly: false,
            changeStatus: 'loading',
            updatingRequestId: 301,
        });

        useRequestShiftStore.getState().enterReadonlyMode(requestShiftFixture);
        useRequestShiftStore.getState().completeRequestChange('success');
        useRequestShiftStore.getState().finishRequestDecision();
        useRequestShiftStore.getState().resetRequestChangeStatus();

        expect(useRequestShiftStore.getState()).toMatchObject({
            readonly: true,
            focus: null,
            foldedLevels: [false, false],
            changeStatus: 'idle',
            updatingRequestId: null,
        });
    });
});
