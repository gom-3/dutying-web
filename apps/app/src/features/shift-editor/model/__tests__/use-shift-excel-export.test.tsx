import {act} from 'react';
import toast from 'react-hot-toast';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type TShift} from '@/entities/shift';
import {renderHook, waitFor} from '@/shared/util/test-utils';
import {useShiftExcelExport} from '../use-shift-excel-export';

const mockShiftToExcel = vi.fn();

vi.mock('../shift-to-excel', () => ({
    shiftToExcel: (...args: unknown[]) => mockShiftToExcel(...args),
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const shift = {
    lastDays: [],
    days: [{day: 1, dayType: 'workday'}],
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
                lastWardShiftList: [],
                lastWardReqShiftList: [],
                wardShiftList: [1],
                wardReqShiftList: [],
            },
        ],
    ],
} satisfies TShift;

describe('useShiftExcelExport', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('엑셀 저장 성공 시 진행 상태와 성공 토스트를 노출한다', async () => {
        let resolveExport: (() => void) | null = null;

        const exportPromise = new Promise<void>((resolve) => {
            resolveExport = resolve;
        });

        mockShiftToExcel.mockReturnValue(exportPromise);

        const {result} = renderHook(() => useShiftExcelExport({month: 3, shift}));

        let pendingExport!: Promise<void>;

        act(() => {
            pendingExport = result.current.exportExcel();
        });

        await waitFor(() => {
            expect(result.current.isExporting).toBe(true);
        });

        await act(async () => {
            resolveExport?.();
            await pendingExport;
        });

        expect(mockShiftToExcel).toHaveBeenCalledWith(3, shift);
        expect(result.current.isExporting).toBe(false);
        expect(toast.success).toHaveBeenCalledWith('근무표 엑셀 파일을 저장했어요.');
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('엑셀 저장 실패 시 에러 토스트를 노출한다', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        mockShiftToExcel.mockRejectedValue(new Error('write failed'));

        const {result} = renderHook(() => useShiftExcelExport({month: 3, shift}));

        await act(async () => {
            await result.current.exportExcel();
        });

        expect(result.current.isExporting).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith('근무표 엑셀 파일을 저장하지 못했어요. 다시 시도해 주세요.');
    });

    it('disabled 상태에서는 엑셀 저장을 건너뛴다', async () => {
        const {result} = renderHook(() => useShiftExcelExport({month: 3, shift, disabled: true}));

        await act(async () => {
            await result.current.exportExcel();
        });

        expect(mockShiftToExcel).not.toHaveBeenCalled();
        expect(toast.success).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
    });
});
