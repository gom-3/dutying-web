import {describe, expect, it} from 'vitest';
import {type TNurse} from '@/entities/nurse';
import {type TShiftTeam} from '@/entities/ward';
import {createMoveNurseOrderPayload} from '../shift-team-list';

const createNurse = (params: Partial<TNurse> & Pick<TNurse, 'nurseId' | 'shiftTeamId' | 'divisionNum' | 'priority' | 'name'>): TNurse => ({
    nurseId: params.nurseId,
    accountId: params.accountId ?? null,
    shiftTeamId: params.shiftTeamId,
    wardId: params.wardId ?? 20,
    name: params.name,
    phoneNum: params.phoneNum ?? '01012345678',
    isConnected: params.isConnected ?? true,
    nurseShiftTypes: params.nurseShiftTypes ?? [],
    isWorker: params.isWorker ?? true,
    isDutyManager: params.isDutyManager ?? false,
    isWardManager: params.isWardManager ?? false,
    gender: params.gender ?? '여',
    employmentDate: params.employmentDate ?? '2021-08-01',
    memo: params.memo ?? '',
    isDeleted: params.isDeleted ?? false,
    divisionNum: params.divisionNum,
    priority: params.priority,
});
const createShiftTeams = (): TShiftTeam[] => [
    {
        shiftTeamId: 10,
        name: 'A팀',
        nurseCnt: 3,
        nurses: [
            createNurse({nurseId: 1, shiftTeamId: 10, divisionNum: 1, priority: 100, name: '김하나'}),
            createNurse({nurseId: 2, shiftTeamId: 10, divisionNum: 1, priority: 200, name: '김둘'}),
            createNurse({nurseId: 3, shiftTeamId: 10, divisionNum: 2, priority: 300, name: '김셋'}),
        ],
    },
    {
        shiftTeamId: 20,
        name: 'B팀',
        nurseCnt: 1,
        nurses: [createNurse({nurseId: 4, shiftTeamId: 20, divisionNum: 1, priority: 150, name: '박넷'})],
    },
];

describe('createMoveNurseOrderPayload', () => {
    it('returns null when the nurse is dropped in the same position', () => {
        expect(
            createMoveNurseOrderPayload({
                shiftTeams: createShiftTeams(),
                sourceDroppableId: '10,1',
                destinationDroppableId: '10,1',
                sourceIndex: 0,
                destinationIndex: 0,
                draggableId: '1',
            }),
        ).toBeNull();
    });

    it('recomputes priorities when moving down within the same division', () => {
        expect(
            createMoveNurseOrderPayload({
                shiftTeams: createShiftTeams(),
                sourceDroppableId: '10,1',
                destinationDroppableId: '10,1',
                sourceIndex: 0,
                destinationIndex: 1,
                draggableId: '1',
            }),
        ).toEqual({
            nurseId: 1,
            sourceShiftTeamId: 10,
            destinationShiftTeamId: 10,
            divisionNum: 1,
            prevPriority: 200,
            nextPriority: 2224,
        });
    });

    it('creates a cross-team payload when appending to another team', () => {
        expect(
            createMoveNurseOrderPayload({
                shiftTeams: createShiftTeams(),
                sourceDroppableId: '10,1',
                destinationDroppableId: '20,1',
                sourceIndex: 0,
                destinationIndex: 1,
                draggableId: '1',
            }),
        ).toEqual({
            nurseId: 1,
            sourceShiftTeamId: 10,
            destinationShiftTeamId: 20,
            divisionNum: 1,
            prevPriority: 150,
            nextPriority: 2174,
        });
    });

    it('normalizes division 0 drops into the first division insertion payload', () => {
        expect(
            createMoveNurseOrderPayload({
                shiftTeams: createShiftTeams(),
                sourceDroppableId: '10,1',
                destinationDroppableId: '20,0',
                sourceIndex: 0,
                destinationIndex: 0,
                draggableId: '1',
            }),
        ).toEqual({
            nurseId: 1,
            sourceShiftTeamId: 10,
            destinationShiftTeamId: 20,
            divisionNum: 1,
            prevPriority: 0,
            nextPriority: 2024,
        });
    });

    it('returns null when the destination team cannot be resolved', () => {
        expect(
            createMoveNurseOrderPayload({
                shiftTeams: createShiftTeams(),
                sourceDroppableId: '10,1',
                destinationDroppableId: '999,1',
                sourceIndex: 0,
                destinationIndex: 0,
                draggableId: '1',
            }),
        ).toBeNull();
    });
});
