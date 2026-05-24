import {describe, expect, it} from 'vitest';
import {formatShiftDuration} from '../utils';

describe('formatShiftDuration', () => {
    it('같은 날 근무 시간을 시간 단위로 표시한다', () => {
        expect(formatShiftDuration('07:00', '15:00')).toBe('8h');
    });

    it('자정을 넘는 근무 시간을 계산한다', () => {
        expect(formatShiftDuration('23:00', '07:00')).toBe('8h');
    });

    it('정수가 아닌 근무 시간도 보존한다', () => {
        expect(formatShiftDuration('07:30', '16:00')).toBe('8.5h');
    });

    it('잘못된 시각 형식은 무효 처리한다', () => {
        expect(formatShiftDuration('25:99', '07:00')).toBe('-');
        expect(formatShiftDuration('07:00:00', '15:00')).toBe('-');
    });
});
