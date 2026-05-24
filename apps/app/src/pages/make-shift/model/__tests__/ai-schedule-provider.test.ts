import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {TAiScheduleRequest} from '../ai-schedule-contract';
import {requestAiSchedule} from '../ai-schedule-provider';

const {apiGenerate, mockGenerate} = vi.hoisted(() => ({
    apiGenerate: vi.fn(),
    mockGenerate: vi.fn(),
}));

vi.mock('../ai-schedule-api-provider', () => ({
    apiAiScheduleProvider: {
        generate: apiGenerate,
    },
}));

vi.mock('../ai-schedule-mock', () => ({
    mockAiScheduleProvider: {
        generate: mockGenerate,
    },
}));

const request: TAiScheduleRequest = {
    shiftTeamId: 2,
    year: 2026,
    month: 3,
    doc: {
        columns: ['2026-03-01'],
        rows: [{workerId: '1', cells: ['D']}],
        workerMeta: {1: {name: '간호사 1'}},
        fixedCells: {},
        requestCells: {},
    },
};
const response = {
    generation_id: 1,
    schedule: {1: ['D']},
    validation: {
        valid: true,
        hard_constraints_violated: [],
        soft_constraints_violated: [],
        warnings: [],
    },
    metrics: {
        night_shift_counts: {},
        weekend_shift_counts: {},
        fairness_score: 0,
        satisfaction_estimate: 0,
        constraint_violations: 0,
        revision_estimate: 0,
    },
    explainable_reasons: [],
    status: 'GENERATED',
    llm_model: 'gpt',
    generation_time_ms: 100,
    created_at: '2026-03-21T00:00:00.000Z',
};

describe('requestAiSchedule', () => {
    beforeEach(() => {
        vi.unstubAllEnvs();
        apiGenerate.mockReset();
        mockGenerate.mockReset();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('uses api provider by default', async () => {
        apiGenerate.mockResolvedValue(response);

        const result = await requestAiSchedule(request);

        expect(apiGenerate).toHaveBeenCalledWith(request);
        expect(mockGenerate).not.toHaveBeenCalled();
        expect(result).toEqual({ok: true, response});
    });

    it('uses mock provider only when feature flag is explicitly set', async () => {
        vi.stubEnv('VITE_AI_SCHEDULE_PROVIDER', 'mock');
        mockGenerate.mockResolvedValue(response);

        const result = await requestAiSchedule(request);

        expect(mockGenerate).toHaveBeenCalledWith(request);
        expect(apiGenerate).not.toHaveBeenCalled();
        expect(result).toEqual({ok: true, response});
    });

    it('returns the provider error message for retry UX', async () => {
        apiGenerate.mockRejectedValue(new Error('AI 생성 실패'));

        const result = await requestAiSchedule(request);

        expect(result).toEqual({ok: false, message: 'AI 생성 실패'});
    });
});
