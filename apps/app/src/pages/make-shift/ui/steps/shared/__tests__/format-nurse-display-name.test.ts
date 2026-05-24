import {describe, expect, it} from 'vitest';
import {formatNurseDisplayName} from '../format-nurse-display-name';

describe('formatNurseDisplayName', () => {
    it('4자 이하면 그대로 반환한다', () => {
        expect(formatNurseDisplayName('김민')).toBe('김민');
        expect(formatNurseDisplayName('홍길동')).toBe('홍길동');
    });

    it('4자 초과면 4자 + 말줄임을 반환한다', () => {
        expect(formatNurseDisplayName('박서연지희')).toBe('박서연지…');
        expect(formatNurseDisplayName('  김철수영희  ')).toBe('김철수영…');
    });
});
