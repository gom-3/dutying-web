import {describe, expect, it} from 'vitest';
import type {TWardConstraint} from '@/entities';
import {applyBoardToWardConstraint, buildInitialDutyRuleBoard, buildRuleLevelByKeyFromBoard} from '../duty-constraints';
import type {TDutyRuleBoard} from '../types';

function createWardConstraint(overrides: Partial<TWardConstraint> = {}): TWardConstraint {
    return {
        maxContinuousWork: true,
        maxContinuousWorkVal: 5,
        minNightInterval: true,
        minNightIntervalVal: 3,
        maxContinuousNight: false,
        maxContinuousNightVal: 3,
        minContinuousNight: true,
        minContinuousNightVal: 2,
        minOffAssignAfterNight: false,
        minOffAssignAfterNightVal: 2,
        excludeCertainWorkTypes: true,
        excludeNightBeforeReqOff: false,
        ...overrides,
    };
}

describe('duty constraint combinations', () => {
    it('splits active rules into error, warning, and excluded buckets with level overrides applied', () => {
        const board = buildInitialDutyRuleBoard(createWardConstraint(), {
            minNightInterval: 'warning',
            minContinuousNight: 'error',
        });

        expect(board).toEqual({
            error: ['maxContinuousWork', 'minContinuousNight'],
            warning: ['minNightInterval', 'excludeCertainWorkTypes'],
            excluded: ['maxContinuousNight', 'minOffAssignAfterNight', 'excludeNightBeforeReqOff'],
        });
    });

    it('builds level maps from mixed buckets and lets warning membership override duplicated error entries', () => {
        const board: TDutyRuleBoard = {
            error: ['maxContinuousWork', 'minNightInterval'],
            warning: ['minNightInterval', 'excludeCertainWorkTypes'],
            excluded: ['maxContinuousNight'],
        };

        expect(buildRuleLevelByKeyFromBoard(board)).toEqual({
            maxContinuousWork: 'error',
            minNightInterval: 'warning',
            excludeCertainWorkTypes: 'warning',
        });
    });

    it('applies enabled buckets back to ward constraints while preserving numeric thresholds', () => {
        const initial = createWardConstraint({
            maxContinuousWorkVal: 6,
            minNightIntervalVal: 4,
            maxContinuousNightVal: 5,
            minContinuousNightVal: 3,
            minOffAssignAfterNightVal: 3,
        });
        const board: TDutyRuleBoard = {
            error: ['maxContinuousNight'],
            warning: ['minOffAssignAfterNight', 'excludeNightBeforeReqOff'],
            excluded: ['maxContinuousWork', 'minNightInterval', 'minContinuousNight', 'excludeCertainWorkTypes'],
        };

        expect(applyBoardToWardConstraint(board, initial)).toEqual({
            ...initial,
            maxContinuousWork: false,
            minNightInterval: false,
            maxContinuousNight: true,
            minContinuousNight: false,
            minOffAssignAfterNight: true,
            excludeCertainWorkTypes: false,
            excludeNightBeforeReqOff: true,
        });
    });

    it('treats error and warning buckets as enabled even when the same rule is also listed in excluded', () => {
        const board: TDutyRuleBoard = {
            error: ['maxContinuousWork'],
            warning: ['excludeCertainWorkTypes'],
            excluded: ['maxContinuousWork', 'excludeCertainWorkTypes', 'minNightInterval'],
        };

        expect(applyBoardToWardConstraint(board, createWardConstraint())).toMatchObject({
            maxContinuousWork: true,
            excludeCertainWorkTypes: true,
            minNightInterval: false,
        });
    });
});
