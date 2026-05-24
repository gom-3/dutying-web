import {describe, expect, it} from 'vitest';
import {type TRequestShift} from '@/entities/shift';
import {type TWardShiftType} from '@/entities/ward';
import {
    createRequestCalendarCellFocus,
    getDutyRequestStatusDescription,
    getMoveNurseOrderPayload,
    getRequestCalendarCellState,
    getRequestCalendarDivisionAction,
    getRequestFocus,
} from '../utils';

const createRequestShift = (): TRequestShift => ({
    days: [],
    wardShiftTypes: [],
    divisionShiftNurses: [
        [
            {
                shiftNurse: {
                    shiftNurseId: 11,
                    nurseId: 101,
                    name: '간호사 1',
                    carried: 0,
                    isWorker: true,
                    divisionNum: 1,
                    priority: 100,
                },
                carry: 0,
                wardReqShiftList: [],
            },
            {
                shiftNurse: {
                    shiftNurseId: 12,
                    nurseId: 102,
                    name: '간호사 2',
                    carried: 0,
                    isWorker: true,
                    divisionNum: 1,
                    priority: 200,
                },
                carry: 0,
                wardReqShiftList: [],
            },
            {
                shiftNurse: {
                    shiftNurseId: 13,
                    nurseId: 103,
                    name: '간호사 3',
                    carried: 0,
                    isWorker: true,
                    divisionNum: 1,
                    priority: 300,
                },
                carry: 0,
                wardReqShiftList: [],
            },
        ],
        [
            {
                shiftNurse: {
                    shiftNurseId: 21,
                    nurseId: 201,
                    name: '간호사 4',
                    carried: 0,
                    isWorker: true,
                    divisionNum: 2,
                    priority: 400,
                },
                carry: 0,
                wardReqShiftList: [],
            },
            {
                shiftNurse: {
                    shiftNurseId: 22,
                    nurseId: 202,
                    name: '간호사 5',
                    carried: 0,
                    isWorker: true,
                    divisionNum: 2,
                    priority: 500,
                },
                carry: 0,
                wardReqShiftList: [],
            },
        ],
    ],
});

describe('request-calendar utils', () => {
    it('같은 division 안에서 아래로 이동할 때 다음 우선순위를 기준으로 계산한다', () => {
        const requestShift = createRequestShift();
        const payload = getMoveNurseOrderPayload({
            source: {droppableId: '0', index: 0},
            destination: {droppableId: '0', index: 2},
            draggableId: '11',
            requestShift,
            type: 'DEFAULT',
            reason: 'DROP',
            mode: 'FLUID',
            combine: null,
        });

        expect(payload).toEqual({
            nurseId: 101,
            destinationDivisionNum: 1,
            prevPriority: 300,
            nextPriority: 2324,
        });
    });

    it('다른 division으로 이동할 때 이전 행 우선순위를 기준으로 계산한다', () => {
        const requestShift = createRequestShift();
        const payload = getMoveNurseOrderPayload({
            source: {droppableId: '0', index: 1},
            destination: {droppableId: '1', index: 1},
            draggableId: '12',
            requestShift,
            type: 'DEFAULT',
            reason: 'DROP',
            mode: 'FLUID',
            combine: null,
        });

        expect(payload).toEqual({
            nurseId: 102,
            destinationDivisionNum: 2,
            prevPriority: 400,
            nextPriority: 500,
        });
    });

    it('신청 내역에서 포커스 가능한 간호사를 찾으면 focus 객체를 반환한다', () => {
        const focus = getRequestFocus(
            {
                wardReqShiftId: 1,
                nurseId: 101,
                nurseName: '김간호',
                date: 3,
                requestDate: '2026-03-01',
                wardShiftTypeId: 9,
                wardShiftTypeShortName: 'D',
                wardShiftTypeColor: '#000000',
                isRead: false,
                isAccepted: null,
            },
            new Map([[101, 11]]),
        );

        expect(focus).toEqual({
            shiftNurseName: '김간호',
            shiftNurseId: 11,
            day: 2,
        });
    });

    it('매칭되는 간호사가 없으면 focus를 만들지 않는다', () => {
        const focus = getRequestFocus(
            {
                wardReqShiftId: 1,
                nurseId: 999,
                nurseName: '김간호',
                date: 3,
                requestDate: '2026-03-01',
                wardShiftTypeId: 9,
                wardShiftTypeShortName: 'D',
                wardShiftTypeColor: '#000000',
                isRead: false,
                isAccepted: null,
            },
            new Map([[101, 11]]),
        );

        expect(focus).toBeNull();
    });

    it('미확인 신청은 수정 모드에서 달력 이동 안내를 보여준다', () => {
        const description = getDutyRequestStatusDescription({
            isAccepted: null,
            readonly: false,
            requestFocus: {
                shiftNurseName: '김간호',
                shiftNurseId: 11,
                day: 2,
            },
        });

        expect(description).toBe('이름을 누르면 해당 날짜로 이동해 검토할 수 있어요.');
    });

    it('달력 위치를 찾을 수 없는 신청은 예외 안내를 보여준다', () => {
        const description = getDutyRequestStatusDescription({
            isAccepted: null,
            readonly: true,
            requestFocus: null,
        });

        expect(description).toBe('현재 팀에 연결된 간호사 정보가 없어 달력 위치로는 바로 이동할 수 없어요.');
    });

    it('셀 선택용 focus 객체를 일관된 형태로 만든다', () => {
        expect(
            createRequestCalendarCellFocus({
                shiftNurseName: '김간호',
                shiftNurseId: 11,
                day: 4,
            }),
        ).toEqual({
            shiftNurseName: '김간호',
            shiftNurseId: 11,
            day: 4,
        });
    });

    it('요청만 있는 셀 상태를 계산한다', () => {
        const dayShiftType = {
            wardShiftTypeId: 9,
            name: '데이',
            shortName: 'D',
            color: '#000000',
        } as TWardShiftType;

        expect(
            getRequestCalendarCellState({
                currentShiftTypeId: null,
                requestDutyRequest: {
                    wardReqShiftId: 1,
                    nurseId: 101,
                    nurseName: '김간호',
                    date: 3,
                    requestDate: '2026-03-01',
                    wardShiftTypeId: 9,
                    wardShiftTypeShortName: 'D',
                    wardShiftTypeColor: '#000000',
                    isRead: false,
                    isAccepted: null,
                },
                focus: {
                    shiftNurseName: '김간호',
                    shiftNurseId: 11,
                    day: 2,
                },
                shiftNurseId: 11,
                day: 2,
                wardShiftTypeMap: new Map([[9, dayShiftType]]),
            }),
        ).toEqual({
            isFocused: true,
            shiftType: dayShiftType,
            isOnlyRequest: true,
        });
    });

    it('행 위치에 따라 분할 조정 액션을 결정한다', () => {
        expect(
            getRequestCalendarDivisionAction({
                readonly: false,
                rowIndex: 0,
                rowCount: 3,
                level: 0,
                divisionCount: 2,
            }),
        ).toBe('create');

        expect(
            getRequestCalendarDivisionAction({
                readonly: false,
                rowIndex: 2,
                rowCount: 3,
                level: 0,
                divisionCount: 2,
            }),
        ).toBe('delete');

        expect(
            getRequestCalendarDivisionAction({
                readonly: true,
                rowIndex: 0,
                rowCount: 3,
                level: 0,
                divisionCount: 2,
            }),
        ).toBeNull();
    });
});
