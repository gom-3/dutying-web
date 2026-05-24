import {describe, expect, it} from 'vitest';
import {type TShiftTeam} from '@/entities/ward';
import {getConnectionManageResultCopy, getConnectionManageTargetLabel} from '../connection-manage';

const shiftTeams: TShiftTeam[] = [
    {
        shiftTeamId: 10,
        name: 'A팀',
        nurseCnt: 1,
        nurses: [
            {
                nurseId: 1,
                accountId: 100,
                shiftTeamId: 10,
                wardId: 20,
                name: '김간호',
                phoneNum: '01012345678',
                isConnected: true,
                nurseShiftTypes: [],
                isWorker: true,
                isDutyManager: false,
                isWardManager: false,
                gender: '여',
                employmentDate: '2021-08-01',
                memo: '',
                isDeleted: false,
                divisionNum: 0,
                priority: 1,
            },
        ],
    },
    {
        shiftTeamId: 20,
        name: 'B팀',
        nurseCnt: 0,
        nurses: [],
    },
];

describe('getConnectionManageTargetLabel', () => {
    it('returns nurse and team label for link mode', () => {
        expect(
            getConnectionManageTargetLabel({
                connectMode: 'link',
                shiftTeams,
                toLinkNurseId: 1,
                toAddShiftTeamId: null,
            }),
        ).toBe('김간호 · A팀');
    });

    it('returns team label for add mode', () => {
        expect(
            getConnectionManageTargetLabel({
                connectMode: 'add',
                shiftTeams,
                toLinkNurseId: null,
                toAddShiftTeamId: 20,
            }),
        ).toBe('B팀');
    });

    it('returns null when the requested target no longer exists', () => {
        expect(
            getConnectionManageTargetLabel({
                connectMode: 'link',
                shiftTeams,
                toLinkNurseId: 999,
                toAddShiftTeamId: null,
            }),
        ).toBeNull();
    });
});

describe('getConnectionManageResultCopy', () => {
    it('explains linked account continuity on success', () => {
        expect(
            getConnectionManageResultCopy({
                submitStatus: 'success',
                connectMode: 'link',
                waitingNurseName: '박신청',
                targetLabel: '김간호 · A팀',
            }).description,
        ).toContain('이어서 확인할 수 있어요');
    });

    it('guides retry and recovery on add failure', () => {
        expect(
            getConnectionManageResultCopy({
                submitStatus: 'error',
                connectMode: 'add',
                waitingNurseName: '박신청',
                targetLabel: 'B팀',
            }).description,
        ).toContain('다시 시도하거나 이전 단계로 돌아가');
    });

    it('keeps the loading copy specific to add mode', () => {
        expect(
            getConnectionManageResultCopy({
                submitStatus: 'loading',
                connectMode: 'add',
                waitingNurseName: '박신청',
                targetLabel: 'B팀',
            }).description,
        ).toContain('팀과 관계 변경이 반영될 때까지');
    });

    it('falls back to safe labels when waiting nurse information is missing', () => {
        const result = getConnectionManageResultCopy({
            submitStatus: 'error',
            connectMode: 'link',
        });

        expect(result.title).toBe('기존 계정과 연결하지 못했어요');
        expect(result.description).toContain('선택한 간호사 계정');
    });
});
