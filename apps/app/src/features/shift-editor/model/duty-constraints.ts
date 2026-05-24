import {type TWardConstraint} from '@/entities';
import type {TI18nKey} from '@/shared/hook/use-typed-translation';
import type {TDutyRuleBoard, TDutyRuleKey, TDutyRuleLevel, TDutyRuleLevelByKey} from './types';

type TConstraintBooleanKey = {
    [K in keyof TWardConstraint]: TWardConstraint[K] extends boolean ? K : never;
}[keyof TWardConstraint];

type TConstraintNumberKey = {
    [K in keyof TWardConstraint]: TWardConstraint[K] extends number ? K : never;
}[keyof TWardConstraint];

export const DUTY_RULE_KEYS: TDutyRuleKey[] = [
    'maxContinuousWork',
    'minNightInterval',
    'maxContinuousNight',
    'minContinuousNight',
    'minOffAssignAfterNight',
    'excludeCertainWorkTypes',
    'excludeNightBeforeReqOff',
];

export type TDutyRuleMeta = {
    labelKey: TI18nKey;
    booleanField: TConstraintBooleanKey;
    valueField?: TConstraintNumberKey;
    valueOptions?: number[];
    kind: 'maxDays' | 'minDays' | 'daysOnly' | 'noValue';
    defaultLevel: TDutyRuleLevel;
};

export const DUTY_RULE_META: Record<TDutyRuleKey, TDutyRuleMeta> = {
    maxContinuousWork: {
        labelKey: 'page.makeShift.constraints.rule.maxContinuousWork.label',
        booleanField: 'maxContinuousWork',
        valueField: 'maxContinuousWorkVal',
        valueOptions: [3, 4, 5, 6],
        kind: 'maxDays',
        defaultLevel: 'error',
    },
    minNightInterval: {
        labelKey: 'page.makeShift.constraints.rule.minNightInterval.label',
        booleanField: 'minNightInterval',
        valueField: 'minNightIntervalVal',
        valueOptions: [3, 4, 5, 6, 7],
        kind: 'minDays',
        defaultLevel: 'error',
    },
    maxContinuousNight: {
        labelKey: 'page.makeShift.constraints.rule.maxContinuousNight.label',
        booleanField: 'maxContinuousNight',
        valueField: 'maxContinuousNightVal',
        valueOptions: [3, 4, 5],
        kind: 'maxDays',
        defaultLevel: 'error',
    },
    minContinuousNight: {
        labelKey: 'page.makeShift.constraints.rule.minContinuousNight.label',
        booleanField: 'minContinuousNight',
        valueField: 'minContinuousNightVal',
        valueOptions: [2, 3, 4, 5],
        kind: 'minDays',
        defaultLevel: 'warning',
    },
    minOffAssignAfterNight: {
        labelKey: 'page.makeShift.constraints.rule.minOffAssignAfterNight.label',
        booleanField: 'minOffAssignAfterNight',
        valueField: 'minOffAssignAfterNightVal',
        valueOptions: [2, 3],
        kind: 'daysOnly',
        defaultLevel: 'warning',
    },
    excludeCertainWorkTypes: {
        labelKey: 'page.makeShift.constraints.rule.excludeCertainWorkTypes.label',
        booleanField: 'excludeCertainWorkTypes',
        kind: 'noValue',
        defaultLevel: 'warning',
    },
    excludeNightBeforeReqOff: {
        labelKey: 'page.makeShift.constraints.rule.excludeNightBeforeReqOff.label',
        booleanField: 'excludeNightBeforeReqOff',
        kind: 'noValue',
        defaultLevel: 'warning',
    },
};

export function buildInitialDutyRuleBoard(wardConstraint: TWardConstraint, levelByKey?: TDutyRuleLevelByKey): TDutyRuleBoard {
    const board: TDutyRuleBoard = {error: [], warning: [], excluded: []};

    for (const key of DUTY_RULE_KEYS) {
        const meta = DUTY_RULE_META[key];
        const isActive = Boolean(wardConstraint[meta.booleanField]);

        if (!isActive) {
            board.excluded.push(key);

            continue;
        }

        const level = levelByKey?.[key] ?? meta.defaultLevel;

        if (level === 'error') board.error.push(key);
        else board.warning.push(key);
    }

    return board;
}

export function buildRuleLevelByKeyFromBoard(board: TDutyRuleBoard): TDutyRuleLevelByKey {
    const next: TDutyRuleLevelByKey = {};

    for (const k of board.error) next[k] = 'error';

    for (const k of board.warning) next[k] = 'warning';

    return next;
}

export function applyBoardToWardConstraint(board: TDutyRuleBoard, wardConstraint: TWardConstraint): TWardConstraint {
    const enabled = new Set<TDutyRuleKey>(board.error.concat(board.warning));
    const next = {...wardConstraint} as TWardConstraint;

    for (const key of DUTY_RULE_KEYS) {
        const {booleanField} = DUTY_RULE_META[key];

        next[booleanField] = enabled.has(key);
    }

    return next;
}
