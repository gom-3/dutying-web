import {describe, expect, it} from 'vitest';
import {
    canConfirmAiAutofill,
    getAiAutofillActionLabel,
    getAiAutofillStatusDescription,
    getAiAutofillStatusTone,
} from '../ai-autofill-state';

describe('ai-autofill-state', () => {
    it('loading 동안에는 확정을 막아야 한다', () => {
        expect(canConfirmAiAutofill('idle')).toBe(true);
        expect(canConfirmAiAutofill('loading')).toBe(false);
        expect(canConfirmAiAutofill('error')).toBe(true);
        expect(canConfirmAiAutofill('success')).toBe(true);
    });

    it('에러 상태에서는 재시도 액션을 노출해야 한다', () => {
        expect(getAiAutofillActionLabel('idle', false)).toBe('firstFill');
        expect(getAiAutofillActionLabel('idle', true)).toBe('action');
        expect(getAiAutofillActionLabel('success', false)).toBe('firstFill');
        expect(getAiAutofillActionLabel('success', true)).toBe('action');
        expect(getAiAutofillActionLabel('loading', false)).toBe('generating');
        expect(getAiAutofillActionLabel('error', false)).toBe('retry');
    });

    it('상태별 톤을 구분해야 한다', () => {
        expect(getAiAutofillStatusTone('idle')).toBe('neutral');
        expect(getAiAutofillStatusTone('loading')).toBe('progress');
        expect(getAiAutofillStatusTone('success')).toBe('success');
        expect(getAiAutofillStatusTone('error')).toBe('danger');
    });

    it('실패 상태 문구는 현재 편집본 유지와 재시도 가능성을 포함해야 한다', () => {
        const description = getAiAutofillStatusDescription('error', true);

        expect(description.primaryKey).toBe('page.makeShift.aiRefill.description.error');
        expect(description.draftKey).toBe('page.makeShift.aiRefill.draft.saved');
    });
});
