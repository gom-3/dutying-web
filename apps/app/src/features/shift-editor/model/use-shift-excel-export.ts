import {useCallback, useState} from 'react';
import toast from 'react-hot-toast';
import {type TShift} from '@/entities/shift';
import {shiftToExcel} from './shift-to-excel';

type TUseShiftExcelExportOptions = {
    month: number;
    shift: TShift | null;
    disabled?: boolean;
};

export function useShiftExcelExport({month, shift, disabled = false}: TUseShiftExcelExportOptions) {
    const [isExporting, setIsExporting] = useState(false);
    const exportExcel = useCallback(async () => {
        if (disabled || isExporting || !shift) return;

        setIsExporting(true);

        try {
            await shiftToExcel(month, shift);
            toast.success('근무표 엑셀 파일을 저장했어요.');
        } catch (error) {
            console.error(error);
            toast.error('근무표 엑셀 파일을 저장하지 못했어요. 다시 시도해 주세요.');
        } finally {
            setIsExporting(false);
        }
    }, [disabled, isExporting, month, shift]);

    return {isExporting, exportExcel};
}
