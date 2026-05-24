import {describe, expect, it} from 'vitest';
import type {TWardConstraint} from '@/entities';
import type {TDutyDoc, TDutyValidationInput} from '../types';
import {buildViolationMap, createDutyValidator} from '../validator';

function createWardConstraint(overrides: Partial<TWardConstraint> = {}): TWardConstraint {
    return {
        maxContinuousWork: false,
        maxContinuousWorkVal: 5,
        minNightInterval: false,
        minNightIntervalVal: 3,
        maxContinuousNight: false,
        maxContinuousNightVal: 3,
        minContinuousNight: false,
        minContinuousNightVal: 2,
        minOffAssignAfterNight: false,
        minOffAssignAfterNightVal: 2,
        excludeCertainWorkTypes: false,
        excludeNightBeforeReqOff: false,
        ...overrides,
    };
}

function createDoc(rowCells: Array<string | null>): TDutyDoc {
    return {
        columns: rowCells.map((_, index) => `2026-03-${String(index + 1).padStart(2, '0')}`),
        rows: [{workerId: 'worker-1', cells: rowCells}],
        workerMeta: {'worker-1': {name: 'Kim'}},
        fixedCells: {},
        requestCells: {},
    };
}

function validate(rowCells: Array<string | null>, input: Partial<TDutyValidationInput> = {}) {
    const doc = createDoc(rowCells);
    const validator = createDutyValidator({
        wardConstraint: createWardConstraint(),
        ...input,
    });
    const violations = validator(doc);

    return {doc, violations};
}

describe('validator combinations', () => {
    it('keeps warning-only combinations non-blocking while reporting every matched warning rule', () => {
        const {violations} = validate(['N', 'O', 'D'], {
            wardConstraint: createWardConstraint({
                minOffAssignAfterNight: true,
                minOffAssignAfterNightVal: 2,
                excludeCertainWorkTypes: true,
            }),
        });

        expect(
            violations.map((violation) => ({
                ruleId: violation.ruleId,
                level: violation.level,
                cells: violation.cells,
            })),
        ).toEqual([
            {
                ruleId: 'duty.minOffAssignAfterNight',
                level: 'warning',
                cells: [
                    {row: 0, col: 0},
                    {row: 0, col: 1},
                    {row: 0, col: 2},
                ],
            },
            {
                ruleId: 'duty.excludeCertainWorkTypes',
                level: 'warning',
                cells: [
                    {row: 0, col: 0},
                    {row: 0, col: 1},
                    {row: 0, col: 2},
                ],
            },
        ]);
        expect(violations.every((violation) => violation.level === 'warning')).toBe(true);
    });

    it('reports requested-off warnings without leaking unrelated warning rules', () => {
        const {violations} = validate(['N', null, 'D'], {
            wardConstraint: createWardConstraint({
                excludeNightBeforeReqOff: true,
                minOffAssignAfterNight: true,
                minOffAssignAfterNightVal: 2,
            }),
            mode: {
                requestedOffByRow: [[false, true, false]],
            },
        });

        expect(violations).toEqual([
            {
                ruleId: 'duty.excludeNightBeforeReqOff',
                message: '신청 오프 전날에는 나이트 근무를 권장하지 않습니다.',
                level: 'warning',
                cells: [
                    {row: 0, col: 0},
                    {row: 0, col: 1},
                ],
            },
        ]);
    });

    it('preserves blocking violations when error and warning rules overlap on the same cells', () => {
        const {violations} = validate(['N', 'D', 'E'], {
            wardConstraint: createWardConstraint({
                maxContinuousWork: true,
                maxContinuousWorkVal: 2,
                minOffAssignAfterNight: true,
                minOffAssignAfterNightVal: 2,
                excludeCertainWorkTypes: true,
            }),
        });

        expect(violations.map((violation) => violation.ruleId)).toEqual([
            'duty.maxContinuousWork',
            'duty.minOffAssignAfterNight',
            'duty.excludeCertainWorkTypes',
        ]);

        const map = buildViolationMap(violations, createDoc(['N', 'D', 'E']));

        expect(map.get('worker-1,0')).toMatchObject({
            ruleId: 'duty.maxContinuousWork',
            level: 'error',
            cells: [
                {row: 0, col: 0},
                {row: 0, col: 1},
                {row: 0, col: 2},
            ],
        });
    });

    it('lets rule-level overrides downgrade blocking rules while keeping other active errors intact', () => {
        const {doc, violations} = validate(['D', 'N', 'N', 'N'], {
            wardConstraint: createWardConstraint({
                maxContinuousWork: true,
                maxContinuousWorkVal: 3,
                maxContinuousNight: true,
                maxContinuousNightVal: 2,
            }),
            ruleLevelByKey: {
                maxContinuousWork: 'warning',
            },
        });

        expect(violations.map((violation) => ({ruleId: violation.ruleId, level: violation.level}))).toEqual([
            {ruleId: 'duty.maxContinuousWork', level: 'warning'},
            {ruleId: 'duty.maxContinuousNight', level: 'error'},
        ]);

        const map = buildViolationMap(violations, doc);

        expect(map.get('worker-1,0')).toMatchObject({
            ruleId: 'duty.maxContinuousWork',
            level: 'warning',
        });
        expect(map.get('worker-1,1')).toMatchObject({
            ruleId: 'duty.maxContinuousNight',
            level: 'error',
        });
    });
});
