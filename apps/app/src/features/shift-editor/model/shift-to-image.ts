import {toBlob} from 'html-to-image';

type TBuildShiftImageFileNameOptions = {
    year: number;
    month: number;
    teamName?: string | null;
};

type TShiftToImageOptions = TBuildShiftImageFileNameOptions & {
    element: HTMLElement;
};

function sanitizeFileNameSegment(value: string) {
    return value
        .replace(/[\\/:*?"<>|]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function buildShiftImageFileName({year, month, teamName}: TBuildShiftImageFileNameOptions) {
    const safeTeamName = teamName ? sanitizeFileNameSegment(teamName) : '';
    const baseName = `${year}년 ${month}월 근무표`;

    return safeTeamName ? `${safeTeamName} ${baseName}.png` : `${baseName}.png`;
}

export function downloadBlobAsFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = fileName;
    anchor.click();

    window.URL.revokeObjectURL(url);
}

export async function shiftToImage({element, year, month, teamName}: TShiftToImageOptions) {
    const blob = await toBlob(element, {
        backgroundColor: '#FDFCFE',
        cacheBust: true,
        pixelRatio: 2,
        width: Math.max(element.scrollWidth, element.clientWidth),
        height: Math.max(element.scrollHeight, element.clientHeight),
    });

    if (!blob) {
        throw new Error('SHIFT_IMAGE_EXPORT_FAILED');
    }

    const fileName = buildShiftImageFileName({year, month, teamName});

    downloadBlobAsFile(blob, fileName);

    return fileName;
}
