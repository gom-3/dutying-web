import {toBlob} from 'html-to-image';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {buildShiftImageFileName, downloadBlobAsFile, shiftToImage} from '../shift-to-image';

vi.mock('html-to-image', () => ({
    toBlob: vi.fn(),
}));

describe('shift-to-image', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('팀 이름과 연월을 기준으로 파일명을 만든다', () => {
        expect(buildShiftImageFileName({year: 2026, month: 3, teamName: 'ICU/1팀'})).toBe('ICU 1팀 2026년 3월 근무표.png');
        expect(buildShiftImageFileName({year: 2026, month: 3, teamName: null})).toBe('2026년 3월 근무표.png');
    });

    it('blob을 object url로 내려받는다', () => {
        const blob = new Blob(['test'], {type: 'image/png'});
        const click = vi.fn();
        const anchor = {click, href: '', download: ''};
        const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(anchor as unknown as HTMLAnchorElement);
        const createObjectURLSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:url');
        const revokeObjectURLSpy = vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {});

        downloadBlobAsFile(blob, 'duty.png');

        expect(anchor.href).toBe('blob:url');
        expect(anchor.download).toBe('duty.png');
        expect(click).toHaveBeenCalledTimes(1);
        expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
        expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:url');

        createElementSpy.mockRestore();
        createObjectURLSpy.mockRestore();
        revokeObjectURLSpy.mockRestore();
    });

    it('캡처 blob을 생성해 다운로드한다', async () => {
        const blob = new Blob(['image'], {type: 'image/png'});
        const element = document.createElement('div');

        Object.defineProperty(element, 'scrollWidth', {value: 720});
        Object.defineProperty(element, 'scrollHeight', {value: 480});
        Object.defineProperty(element, 'clientWidth', {value: 700});
        Object.defineProperty(element, 'clientHeight', {value: 460});

        vi.mocked(toBlob).mockResolvedValue(blob);

        const downloadSpy = vi
            .spyOn(document, 'createElement')
            .mockReturnValue({click: vi.fn(), href: '', download: ''} as unknown as HTMLAnchorElement);
        const createObjectURLSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:url');
        const revokeObjectURLSpy = vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {});

        await expect(shiftToImage({element, year: 2026, month: 3, teamName: '중환자실'})).resolves.toBe('중환자실 2026년 3월 근무표.png');
        expect(toBlob).toHaveBeenCalledWith(
            element,
            expect.objectContaining({
                width: 720,
                height: 480,
                pixelRatio: 2,
            }),
        );

        downloadSpy.mockRestore();
        createObjectURLSpy.mockRestore();
        revokeObjectURLSpy.mockRestore();
    });
});
