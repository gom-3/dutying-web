import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createScheduleValidationSnapshot} from '../schedule-violations';
import {createShiftEditorPersistence} from '../persistence';
import {type TDutyDoc, type THistoryState, type TViolation} from '../types';
import type {TAiValidation} from '@dutying/api/ward';

const storageKey = 'shift-editor:draft:test';
const mockDoc: TDutyDoc = {
    columns: ['2026-03-01'],
    rows: [{workerId: '1', cells: [null]}],
    workerMeta: {1: {name: '간호사 1'}},
    fixedCells: {},
    requestCells: {},
};
const mockHistory: THistoryState = {
    past: [],
    future: [],
    maxDepth: 50,
};
const mockValidation: TAiValidation = {
    valid: false,
    hard_constraints_violated: [],
    soft_constraints_violated: [
        {
            id: 'test',
            severity: 'SOFT',
            message: 'test violation',
            nurse_id: '1',
            period: {start_day: 1, end_day: 1},
        },
    ],
    warnings: [],
};
const mockScheduleViolations = {
    validationSnapshot: createScheduleValidationSnapshot(mockValidation, 42),
};
const mockLegacyViolations: TViolation[] = [
    {
        ruleId: 'llm.test',
        message: 'test violation',
        level: 'warning',
        cells: [{row: 0, col: 0}],
    },
];

describe('createShiftEditorPersistence', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        window.localStorage.clear();
    });

    afterEach(() => {
        vi.useRealTimers();
        window.localStorage.clear();
    });

    it('save 호출 후 debounce 시간이 지나면 localStorage에 저장해야 한다', () => {
        const persistence = createShiftEditorPersistence({
            storageKey,
            saveDebounceMs: 400,
        });

        persistence.save(mockDoc, mockHistory, mockScheduleViolations);
        vi.advanceTimersByTime(400);

        const raw = window.localStorage.getItem(storageKey);

        expect(raw).not.toBeNull();
        expect(JSON.parse(raw!)).toEqual({
            doc: mockDoc,
            history: JSON.stringify(mockHistory),
            scheduleViolations: mockScheduleViolations,
            savedAt: expect.any(Number),
        });
    });

    it('load는 저장된 persisted 데이터를 반환해야 한다', () => {
        const persistence = createShiftEditorPersistence({
            storageKey,
            saveDebounceMs: 400,
        });

        persistence.save(mockDoc, mockHistory, mockScheduleViolations);
        vi.advanceTimersByTime(400);

        expect(persistence.load()).toEqual({
            doc: mockDoc,
            history: JSON.stringify(mockHistory),
            scheduleViolations: mockScheduleViolations,
            savedAt: expect.any(Number),
        });
    });

    it('구 llmViolations 드래프트를 legacy로 마이그레이션해야 한다', () => {
        window.localStorage.setItem(
            storageKey,
            JSON.stringify({
                doc: mockDoc,
                history: JSON.stringify(mockHistory),
                llmViolations: mockLegacyViolations,
                savedAt: Date.now(),
            }),
        );

        const persistence = createShiftEditorPersistence({storageKey, saveDebounceMs: 400});
        const loaded = persistence.load();

        expect(loaded?.scheduleViolations).toEqual({
            validationSnapshot: null,
            legacyDisplayViolations: mockLegacyViolations,
        });
    });

    it('clear 호출 시 대기 중인 save 타이머도 함께 정리해야 한다', () => {
        const persistence = createShiftEditorPersistence({
            storageKey,
            saveDebounceMs: 400,
        });

        persistence.save(mockDoc, mockHistory);
        persistence.clear();

        vi.advanceTimersByTime(400);

        expect(window.localStorage.getItem(storageKey)).toBeNull();
    });

    it('dispose 호출 시 대기 중인 save 타이머를 취소해야 한다', () => {
        const persistence = createShiftEditorPersistence({
            storageKey,
            saveDebounceMs: 400,
        });

        persistence.save(mockDoc, mockHistory);
        persistence.dispose();

        vi.advanceTimersByTime(400);

        expect(window.localStorage.getItem(storageKey)).toBeNull();
    });

    it('대기 중인 타이머가 없어도 clear는 안전하게 동작해야 한다', () => {
        const persistence = createShiftEditorPersistence({
            storageKey,
            saveDebounceMs: 400,
        });

        window.localStorage.setItem(storageKey, 'stale');

        expect(() => persistence.clear()).not.toThrow();
        expect(window.localStorage.getItem(storageKey)).toBeNull();
    });
});
