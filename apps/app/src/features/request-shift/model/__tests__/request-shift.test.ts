import {describe, expect, it} from 'vitest';
import type {TDutyRequest, TRequestShift} from '@/entities/shift';
import {
    createInitialFoldedLevels,
    createWardShiftTypeMap,
    findDutyRequestByFocus,
    getAdjacentRequestShiftDate,
    getRequestShiftBootstrapStatus,
    getRequestShiftChangeEventMessage,
    getRequestShiftMonthChangeDecision,
    getRequestShiftTypeIdAtFocus,
    shouldResetFoldedLevelsOnRequestLoad,
    shouldSyncFoldedLevelsLength,
} from '../request-shift';
import {getRequestShiftEditAvailability} from '../utils';

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
        {
            wardShiftTypeId: 12,
            name: 'Night',
            shortName: 'N',
            startTime: '22:00',
            endTime: '07:00',
            color: '#222222',
            isDefault: false,
            isOff: false,
            isCounted: true,
            classification: 'NIGHT',
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
const dutyRequestFixture: TDutyRequest[] = [
    {
        wardReqShiftId: 301,
        nurseId: 1001,
        nurseName: '황인서',
        date: 0,
        requestDate: '2026-03-20T00:00:00.000Z',
        wardShiftTypeId: 12,
        wardShiftTypeShortName: 'N',
        wardShiftTypeColor: '#222222',
        isRead: true,
        isAccepted: null,
    },
];

describe('useRequestShift model', () => {
    const now = new Date('2026-03-21T09:00:00+09:00');

    it('bootstrap 상태를 인증/병동 상태에 따라 계산한다', () => {
        expect(
            getRequestShiftBootstrapStatus({
                _loaded: false,
                isAuth: false,
                wardId: null,
                accountMeStatus: 'idle',
            }),
        ).toBe('pending');

        expect(
            getRequestShiftBootstrapStatus({
                _loaded: true,
                isAuth: true,
                wardId: null,
                accountMeStatus: 'error',
            }),
        ).toBe('error');

        expect(
            getRequestShiftBootstrapStatus({
                _loaded: true,
                isAuth: true,
                wardId: 10,
                accountMeStatus: 'success',
            }),
        ).toBe('success');
    });

    it('folded level 초기화와 동기화 조건을 계산한다', () => {
        expect(createInitialFoldedLevels(requestShiftFixture)).toEqual([false, false]);
        expect(
            shouldResetFoldedLevelsOnRequestLoad({
                foldedLevels: [false],
                previousShiftTeamId: 1,
                currentShiftTeamId: 2,
            }),
        ).toBe(true);
        expect(
            shouldSyncFoldedLevelsLength({
                foldedLevels: [false],
                requestShift: requestShiftFixture,
            }),
        ).toBe(true);
    });

    it('월 이동 정책을 순수 계산으로 분리한다', () => {
        expect(getAdjacentRequestShiftDate(2026, 1, 'prev')).toEqual({year: 2025, month: 12});
        expect(getAdjacentRequestShiftDate(2026, 12, 'next')).toEqual({year: 2027, month: 1});

        expect(
            getRequestShiftMonthChangeDecision({
                year: 2026,
                month: 2,
                type: 'prev',
                readonly: false,
                targetAvailability: getRequestShiftEditAvailability(2026, 1, now),
            }),
        ).toMatchObject({
            year: 2026,
            month: 1,
            shouldEnableReadonly: true,
            shouldBlock: false,
        });

        expect(
            getRequestShiftMonthChangeDecision({
                year: 2026,
                month: 4,
                type: 'next',
                readonly: true,
                targetAvailability: getRequestShiftEditAvailability(2026, 5, now),
            }),
        ).toMatchObject({
            year: 2026,
            month: 5,
            shouldEnableReadonly: false,
            shouldBlock: true,
        });
    });

    it('포커스 기준 현재 신청근무와 duty request를 찾는다', () => {
        const focus = {
            shiftNurseId: 101,
            shiftNurseName: '황인서',
            day: 0,
        };

        expect(getRequestShiftTypeIdAtFocus(requestShiftFixture, focus)).toBe(11);
        expect(findDutyRequestByFocus(dutyRequestFixture, requestShiftFixture, focus)?.wardReqShiftId).toBe(301);
    });

    it('변경 analytics 문구와 shift type map을 생성한다', () => {
        const wardShiftTypeMap = createWardShiftTypeMap(requestShiftFixture);

        expect(wardShiftTypeMap.get(11)?.shortName).toBe('D');
        expect(
            getRequestShiftChangeEventMessage({
                focus: {
                    shiftNurseId: 101,
                    shiftNurseName: '황인서',
                    day: 0,
                },
                prevShiftType: wardShiftTypeMap.get(11) ?? null,
                nextShiftType: wardShiftTypeMap.get(12) ?? null,
            }),
        ).toBe('황인서 / 1일 | D → N');
    });
});
