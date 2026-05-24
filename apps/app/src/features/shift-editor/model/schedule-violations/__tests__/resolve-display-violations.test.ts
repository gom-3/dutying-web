import {describe, expect, it} from 'vitest';
import type {TAiValidation} from '@dutying/api/ward';
import type {TDutyDoc, TViolation} from '../../types';
import {createScheduleValidationSnapshot, resolveScheduleDisplayViolations} from '../resolve-display-violations';

const doc: TDutyDoc = {
    columns: ['2026-05-01', '2026-05-02', '2026-05-03'],
    rows: [{workerId: '1', cells: ['D', 'N', 'O']}],
    workerMeta: {1: {name: 'Kim', nurseId: 10}},
    fixedCells: {},
    requestCells: {},
};

const validation: TAiValidation = {
    valid: false,
    hard_constraints_violated: [],
    soft_constraints_violated: [
        {
            id: 'test',
            severity: 'SOFT',
            message: 'msg',
            nurse_id: '10',
            period: {start_day: 1, end_day: 2},
        },
    ],
    warnings: [],
};

describe('resolveScheduleDisplayViolations', () => {
    it('re-derives cells from snapshot when doc rows change', () => {
        const snapshot = createScheduleValidationSnapshot(validation);
        const reorderedDoc: TDutyDoc = {
            ...doc,
            rows: [{workerId: '99', cells: ['O', 'D', 'N']}],
            workerMeta: {99: {name: 'Other', nurseId: 10}},
        };

        const violations = resolveScheduleDisplayViolations(reorderedDoc, snapshot, []);

        expect(violations[0]?.cells).toEqual([
            {row: 0, col: 0},
            {row: 0, col: 1},
        ]);
    });

    it('uses legacy display violations when snapshot is absent', () => {
        const legacy: TViolation[] = [
            {
                ruleId: 'legacy',
                message: 'cached',
                level: 'warning',
                cells: [{row: 0, col: 0}],
            },
        ];

        expect(resolveScheduleDisplayViolations(doc, null, legacy)).toEqual(legacy);
    });
});
