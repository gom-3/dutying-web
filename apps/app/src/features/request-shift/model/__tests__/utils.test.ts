import {describe, expect, it} from 'vitest';
import {getRequestShiftEditAvailability} from '../utils';

describe('useRequestShift utils', () => {
    const now = new Date('2026-03-21T09:00:00+09:00');

    it('지난달부터 다음 달까지는 수정 가능으로 판단한다', () => {
        expect(getRequestShiftEditAvailability(2026, 2, now)).toMatchObject({
            canEdit: true,
            status: 'editable',
        });
        expect(getRequestShiftEditAvailability(2026, 3, now)).toMatchObject({
            canEdit: true,
            status: 'editable',
        });
        expect(getRequestShiftEditAvailability(2026, 4, now)).toMatchObject({
            canEdit: true,
            status: 'editable',
        });
    });

    it('두 달 전 달력은 조회 전용으로 판단한다', () => {
        expect(getRequestShiftEditAvailability(2026, 1, now)).toMatchObject({
            canEdit: false,
            status: 'lockedPast',
            validationMessage: '두 달 전 신청 근무는 수정할 수 없습니다.',
        });
    });

    it('두 달 뒤 달력은 아직 작성할 수 없는 상태로 판단한다', () => {
        expect(getRequestShiftEditAvailability(2026, 5, now)).toMatchObject({
            canEdit: false,
            status: 'lockedFuture',
            validationMessage: '두 달 뒤 신청 근무는 아직 수정할 수 없습니다.',
        });
    });
});
