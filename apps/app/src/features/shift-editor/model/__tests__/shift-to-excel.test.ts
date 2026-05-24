import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type TShift} from '@/entities/shift';
import {buildShiftExcelFileName, shiftToExcel} from '../shift-to-excel';

const shift = {
    lastDays: [],
    days: [
        {day: 1, dayType: 'workday'},
        {day: 2, dayType: 'saturday'},
        {day: 3, dayType: 'holiday'},
    ],
    wardShiftTypes: [
        {
            wardShiftTypeId: 1,
            name: 'Day',
            shortName: 'D',
            startTime: '07:00',
            endTime: '15:00',
            color: '#fff',
            isDefault: true,
            isOff: false,
            isCounted: true,
            classification: 'DAY',
        },
        {
            wardShiftTypeId: 2,
            name: 'Night',
            shortName: 'N',
            startTime: '22:00',
            endTime: '07:00',
            color: '#000',
            isDefault: false,
            isOff: false,
            isCounted: true,
            classification: 'NIGHT',
        },
        {
            wardShiftTypeId: 3,
            name: '오프',
            shortName: 'O',
            startTime: '00:00',
            endTime: '00:00',
            color: '#ccc',
            isDefault: false,
            isOff: true,
            isCounted: false,
            classification: 'OFF',
        },
    ],
    divisionShiftNurses: [
        [
            {
                shiftNurse: {
                    shiftNurseId: 1,
                    name: 'Kim',
                    carried: 0,
                    divisionNum: 0,
                    priority: 0,
                    isWorker: true,
                    nurseId: 100,
                },
                lastWardShiftList: [1, 2],
                lastWardReqShiftList: [],
                wardShiftList: [1, 3, 2],
                wardReqShiftList: [],
            },
            {
                shiftNurse: {
                    shiftNurseId: 2,
                    name: 'Lee',
                    carried: 0,
                    divisionNum: 0,
                    priority: 1,
                    isWorker: true,
                    nurseId: 101,
                },
                lastWardShiftList: [3],
                lastWardReqShiftList: [],
                wardShiftList: [null, 3, 1],
                wardReqShiftList: [],
            },
        ],
    ],
} satisfies TShift;

describe('shift-to-excel', () => {
    const click = vi.fn();
    const createObjectURL = vi.fn(() => 'blob:url');
    const revokeObjectURL = vi.fn();
    const anchor = {click, href: '', download: ''} as unknown as HTMLAnchorElement;

    beforeEach(() => {
        vi.clearAllMocks();
        anchor.href = '';
        anchor.download = '';

        vi.spyOn(document, 'createElement').mockReturnValue(anchor);
        Object.defineProperty(window.URL, 'createObjectURL', {
            value: createObjectURL,
            configurable: true,
        });
        Object.defineProperty(window.URL, 'revokeObjectURL', {
            value: revokeObjectURL,
            configurable: true,
        });
    });

    it('월 기준 파일명을 만든다', () => {
        expect(buildShiftExcelFileName(3)).toBe('3월 근무표.xlsx');
    });

    it('근무표 workbook을 만들고 같은 이름으로 다운로드한다', async () => {
        const workbook = await shiftToExcel(3, shift);
        const worksheet = workbook.getWorksheet('3월 근무표');

        expect(worksheet).toBeDefined();
        expect(worksheet?.getRow(1).getCell(1).value).toBe('3월 근무표');

        expect(worksheet?.getRow(2).getCell(1).value).toBe('이름');
        expect(worksheet?.getRow(2).getCell(2).value).toBe('전달 근무');
        expect(worksheet?.getRow(2).getCell(3).value).toBe(1);
        expect(worksheet?.getRow(2).getCell(4).value).toBe(2);
        expect(worksheet?.getRow(2).getCell(5).value).toBe(3);
        expect(worksheet?.getRow(2).getCell(3).font?.color?.argb).toBe('FF000000');
        expect(worksheet?.getRow(2).getCell(4).font?.color?.argb).toBe('FF2029FA');
        expect(worksheet?.getRow(2).getCell(5).font?.color?.argb).toBe('FFFA2D12');

        expect(worksheet?.getRow(3).getCell(1).value).toBe('Kim');
        expect(worksheet?.getRow(3).getCell(2).value).toBe('DN');
        expect(worksheet?.getRow(3).getCell(3).value).toBe('D');
        expect(worksheet?.getRow(3).getCell(4).value).toBe('O');
        expect(worksheet?.getRow(3).getCell(5).value).toBe('N');
        expect(worksheet?.getRow(3).getCell(6).value).toBe(1);
        expect(worksheet?.getRow(3).getCell(7).value).toBe(1);
        expect(worksheet?.getRow(3).getCell(8).value).toBe(1);
        expect(worksheet?.getRow(3).getCell(9).value).toBe(1);

        expect(worksheet?.getRow(4).getCell(1).value).toBe('Lee');
        expect(worksheet?.getRow(4).getCell(2).value).toBe('O');
        expect(worksheet?.getRow(4).getCell(3).value).toBe('');
        expect(worksheet?.getRow(4).getCell(4).value).toBe('O');
        expect(worksheet?.getRow(4).getCell(5).value).toBe('D');
        expect(worksheet?.getRow(4).getCell(6).value).toBe(1);
        expect(worksheet?.getRow(4).getCell(7).value).toBe(0);
        expect(worksheet?.getRow(4).getCell(8).value).toBe(1);
        expect(worksheet?.getRow(4).getCell(9).value).toBe(1);

        expect(worksheet?.getRow(5).getCell(2).value).toBe('Day');
        expect(worksheet?.getRow(5).getCell(3).value).toBe(1);
        expect(worksheet?.getRow(5).getCell(4).value).toBe(0);
        expect(worksheet?.getRow(5).getCell(5).value).toBe(1);
        expect(worksheet?.getRow(6).getCell(2).value).toBe('Night');
        expect(worksheet?.getRow(6).getCell(3).value).toBe(0);
        expect(worksheet?.getRow(6).getCell(4).value).toBe(0);
        expect(worksheet?.getRow(6).getCell(5).value).toBe(1);
        expect(worksheet?.getRow(7).getCell(2).value).toBe('오프');
        expect(worksheet?.getRow(7).getCell(3).value).toBe(0);
        expect(worksheet?.getRow(7).getCell(4).value).toBe(2);
        expect(worksheet?.getRow(7).getCell(5).value).toBe(0);

        expect(createObjectURL).toHaveBeenCalledTimes(1);
        expect(click).toHaveBeenCalledTimes(1);
        expect(anchor.download).toBe('3월 근무표.xlsx');
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:url');
    });
});
