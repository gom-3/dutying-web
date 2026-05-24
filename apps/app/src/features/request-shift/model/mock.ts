import {type TDutyRequest, type TRequestShift} from '@/entities/shift';

export const mockDutyRequestList: TDutyRequest[] = [
    {
        wardReqShiftId: 1,
        nurseId: 1123,
        nurseName: '김민지',
        date: 10,
        requestDate: '2023-10-30T12:49:55.477Z',
        wardShiftTypeId: 299,
        wardShiftTypeShortName: 'D',
        wardShiftTypeColor: '#4DC2AD',
        isRead: true,
        isAccepted: false,
    },
    {
        wardReqShiftId: 2,
        nurseId: 1124,
        nurseName: '오하린',
        date: 12,
        requestDate: '2023-10-30T12:50:55.477Z',
        wardShiftTypeId: 300,
        wardShiftTypeShortName: 'E',
        wardShiftTypeColor: '#ff8ba5',
        isRead: true,
        isAccepted: null,
    },
    {
        wardReqShiftId: 3,
        nurseId: 1125,
        nurseName: '박하은',
        date: 12,
        requestDate: '2023-10-30T12:53:11.477Z',
        wardShiftTypeId: 300,
        wardShiftTypeShortName: 'E',
        wardShiftTypeColor: '#ff8ba5',
        isRead: true,
        isAccepted: null,
    },
    {
        wardReqShiftId: 4,
        nurseId: 1126,
        nurseName: '정서윤',
        date: 12,
        requestDate: '2023-10-30T12:55:21.477Z',
        wardShiftTypeId: 300,
        wardShiftTypeShortName: 'E',
        wardShiftTypeColor: '#ff8ba5',
        isRead: true,
        isAccepted: null,
    },
    {
        wardReqShiftId: 5,
        nurseId: 1127,
        nurseName: '이유진',
        date: 15,
        requestDate: '2023-10-30T12:58:02.477Z',
        wardShiftTypeId: 301,
        wardShiftTypeShortName: 'N',
        wardShiftTypeColor: '#3580ff',
        isRead: true,
        isAccepted: null,
    },
    {
        wardReqShiftId: 6,
        nurseId: 1128,
        nurseName: '최민서',
        date: 15,
        requestDate: '2023-10-30T13:02:44.477Z',
        wardShiftTypeId: 301,
        wardShiftTypeShortName: 'N',
        wardShiftTypeColor: '#3580ff',
        isRead: true,
        isAccepted: null,
    },
    {
        wardReqShiftId: 7,
        nurseId: 1129,
        nurseName: '한지우',
        date: 18,
        requestDate: '2023-10-30T13:08:17.477Z',
        wardShiftTypeId: 301,
        wardShiftTypeShortName: 'N',
        wardShiftTypeColor: '#3580ff',
        isRead: true,
        isAccepted: true,
    },
];

export const mockDutyRequestList2: TDutyRequest[] = [
    {
        wardReqShiftId: 101,
        nurseId: 2188,
        nurseName: '김가은',
        date: 10,
        requestDate: '2023-10-30T12:49:55.477Z',
        wardShiftTypeId: 589,
        wardShiftTypeShortName: 'D',
        wardShiftTypeColor: '#4DC2AD',
        isRead: true,
        isAccepted: null,
    },
    {
        wardReqShiftId: 102,
        nurseId: 2189,
        nurseName: '문서아',
        date: 10,
        requestDate: '2023-10-30T12:51:22.477Z',
        wardShiftTypeId: 589,
        wardShiftTypeShortName: 'D',
        wardShiftTypeColor: '#4DC2AD',
        isRead: true,
        isAccepted: null,
    },
    {
        wardReqShiftId: 103,
        nurseId: 2190,
        nurseName: '서지안',
        date: 10,
        requestDate: '2023-10-30T12:54:03.477Z',
        wardShiftTypeId: 589,
        wardShiftTypeShortName: 'D',
        wardShiftTypeColor: '#4DC2AD',
        isRead: true,
        isAccepted: null,
    },
    {
        wardReqShiftId: 104,
        nurseId: 2195,
        nurseName: '윤다인',
        date: 12,
        requestDate: '2023-10-30T12:56:55.477Z',
        wardShiftTypeId: 592,
        wardShiftTypeShortName: 'O',
        wardShiftTypeColor: '#465B7A',
        isRead: true,
        isAccepted: true,
    },
    {
        wardReqShiftId: 105,
        nurseId: 2197,
        nurseName: '백하늘',
        date: 16,
        requestDate: '2023-10-30T13:00:55.477Z',
        wardShiftTypeId: 591,
        wardShiftTypeShortName: 'N',
        wardShiftTypeColor: '#3580FF',
        isRead: true,
        isAccepted: true,
    },
    {
        wardReqShiftId: 106,
        nurseId: 2198,
        nurseName: '반예진',
        date: 16,
        requestDate: '2023-10-30T13:04:55.477Z',
        wardShiftTypeId: 591,
        wardShiftTypeShortName: 'N',
        wardShiftTypeColor: '#3580FF',
        isRead: true,
        isAccepted: null,
    },
    {
        wardReqShiftId: 107,
        nurseId: 2199,
        nurseName: '차유나',
        date: 16,
        requestDate: '2023-10-30T13:06:55.477Z',
        wardShiftTypeId: 591,
        wardShiftTypeShortName: 'N',
        wardShiftTypeColor: '#3580FF',
        isRead: true,
        isAccepted: null,
    },
];

export const getMockDutyRequestListByTeamIndex = (teamIndex: number) => {
    if (teamIndex % 3 === 0) return mockDutyRequestList;

    if (teamIndex % 3 === 1) return mockDutyRequestList2;

    return [];
};

export const linkMockDutyRequestListToRequestShift = (
    dutyRequestList: TDutyRequest[] | undefined,
    requestShift: TRequestShift | undefined,
) => {
    const shiftNurses = requestShift?.divisionShiftNurses.flatMap((division) => division).map((row) => row.shiftNurse) ?? [];

    if (!dutyRequestList || shiftNurses.length === 0) return dutyRequestList;

    return dutyRequestList.map((request, index) => {
        const shiftNurse = shiftNurses[index % shiftNurses.length];

        return {
            ...request,
            nurseId: shiftNurse.nurseId,
            nurseName: shiftNurse.name,
        };
    });
};
