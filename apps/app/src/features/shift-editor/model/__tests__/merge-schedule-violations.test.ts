import {describe, expect, it} from 'vitest';
import {mergeServerScheduleViolations} from '../merge-schedule-violations';
import {buildViolationMapAll} from '../validator';
import type {TDutyDoc, TViolation} from '../types';

const doc: TDutyDoc = {
    columns: ['2026-05-01', '2026-05-02', '2026-05-03'],
    rows: [{workerId: '10', cells: ['D', 'E', 'N']}],
    workerMeta: {10: {name: 'Kim'}},
    fixedCells: {},
    requestCells: {},
};

const v = (partial: Partial<TViolation> & Pick<TViolation, 'ruleId' | 'cells'>): TViolation => ({
    message: partial.message ?? partial.ruleId,
    level: partial.level ?? 'error',
    ...partial,
});

describe('mergeServerScheduleViolations', () => {
    it('returns all non-empty violations without deduping', () => {
        const input = [
            v({ruleId: 'llm.hard-a', cells: [{row: 0, col: 0}]}),
            v({ruleId: 'llm.hard-b', cells: [{row: 0, col: 0}]}),
            v({ruleId: 'llm.soft-a', level: 'warning', cells: [{row: 0, col: 0}]}),
            v({ruleId: 'llm.empty', cells: []}),
        ];

        expect(mergeServerScheduleViolations(input)).toHaveLength(3);
    });
});

describe('buildViolationMapAll', () => {
    it('keeps every violation even when they share the same start cell', () => {
        const map = buildViolationMapAll(
            [
                v({ruleId: 'llm.hard-a', cells: [{row: 0, col: 1}]}),
                v({ruleId: 'llm.soft-a', level: 'warning', cells: [{row: 0, col: 1}]}),
            ],
            doc,
        );

        expect(map.size).toBe(2);
        expect(map.get('10,1,llm.hard-a')).toBeDefined();
        expect(map.get('10,1,llm.soft-a')).toBeDefined();
    });
});
