import {useCallback, useState, type RefObject} from 'react';
import toast from 'react-hot-toast';
import {shiftToImage} from './shift-to-image';

type TUseShiftImageExportOptions = {
    targetRef: RefObject<HTMLElement | null>;
    year: number;
    month: number;
    teamName?: string | null;
    disabled?: boolean;
};

function waitForNextPaint() {
    return new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => resolve());
        });
    });
}

export function useShiftImageExport({targetRef, year, month, teamName, disabled = false}: TUseShiftImageExportOptions) {
    const [isExporting, setIsExporting] = useState(false);
    const downloadImage = useCallback(async () => {
        if (disabled || isExporting) return;

        const target = targetRef.current;

        if (!target) {
            toast.error('저장할 근무표 화면을 찾지 못했어요.');

            return;
        }

        setIsExporting(true);

        try {
            await waitForNextPaint();
            await shiftToImage({element: target, year, month, teamName});
            toast.success('근무표 이미지를 저장했어요.');
        } catch (error) {
            console.error(error);
            toast.error('근무표 이미지를 저장하지 못했어요. 다시 시도해 주세요.');
        } finally {
            setIsExporting(false);
        }
    }, [disabled, isExporting, month, targetRef, teamName, year]);

    return {isExporting, downloadImage};
}
