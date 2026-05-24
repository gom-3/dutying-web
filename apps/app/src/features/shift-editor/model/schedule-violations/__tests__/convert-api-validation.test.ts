import {describe, expect, it} from 'vitest';
import type {TAiValidation} from '@dutying/api/ward';
import type {TDutyDoc} from '../../types';
import {violationsFromApiValidation} from '../convert-api-validation';

const doc: TDutyDoc = {
    columns: Array.from({length: 5}, (_, i) => `2026-05-0${i + 1}`),
    rows: [
        {workerId: '8753', cells: ['D', 'N', 'O', 'E', 'D']},
        {workerId: '8754', cells: ['E', 'D', 'D', 'N', 'O']},
    ],
    workerMeta: {
        8753: {name: 'Kim', nurseId: 3414},
        8754: {name: 'Lee', nurseId: 3415},
    },
    fixedCells: {},
    requestCells: {},
};

describe('violationsFromApiValidation', () => {
    it('maps nurse-specific soft violations to warning level with nurse row', () => {
        const validation: TAiValidation = {
            valid: false,
            hard_constraints_violated: [],
            soft_constraints_violated: [
                {
                    id: 'L2_MIN_OFF_AFTER_NIGHT:3414',
                    severity: 'SOFT',
                    title: '야간 후 휴무 부족',
                    message: 'off days after night shift are insufficient',
                    nurse_id: '3414',
                    period: {start_day: 2, end_day: 4},
                },
            ],
            warnings: [],
        };

        const violations = violationsFromApiValidation(validation, doc);

        expect(violations).toEqual([
            {
                ruleId: 'llm.L2_MIN_OFF_AFTER_NIGHT:3414',
                message: '야간 후 휴무 부족: off days after night shift are insufficient',
                level: 'warning',
                scope: 'nurse',
                cells: [
                    {row: 0, col: 1},
                    {row: 0, col: 2},
                    {row: 0, col: 3},
                ],
            },
        ]);
    });

    it('maps team hard violations to a single division-column overlay', () => {
        const validation: TAiValidation = {
            valid: false,
            hard_constraints_violated: [
                {
                    id: 'L3_MIN_STAFF_SHORTAGE:E:2026-05-03',
                    severity: 'HARD',
                    title: '필요 인원 부족',
                    message: 'E shift staffing is low',
                    nurse_id: null,
                    affected_days: [3],
                },
            ],
            soft_constraints_violated: [],
            warnings: [],
        };

        const violations = violationsFromApiValidation(validation, doc);

        expect(violations).toHaveLength(1);
        expect(violations[0]).toMatchObject({
            level: 'error',
            scope: 'team',
            cells: [{row: 0, col: 2}],
        });
    });
});
