import {describe, expect, it, vi} from 'vitest';
import {apiAiScheduleProvider} from '../ai-schedule-api-provider';

const {post} = vi.hoisted(() => ({post: vi.fn()}));

vi.mock('@/shared/api/llm/client', () => ({
    default: {post},
}));

describe('apiAiScheduleProvider', () => {
    it('calls /schedule/generate with shift_team_id + year_month and returns the response', async () => {
        const response = {
            generation_id: 1,
            schedule: {1: ['D', ''], 2: ['N', 'O']},
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

        post.mockResolvedValue({data: response});

        const result = await apiAiScheduleProvider.generate({
            shiftTeamId: 20,
            year: 2026,
            month: 3,
            doc: {
                columns: ['2026-03-01', '2026-03-02'],
                rows: [
                    {workerId: '1', cells: ['D', null]},
                    {workerId: '2', cells: ['N', 'O']},
                ],
                workerMeta: {
                    1: {name: 'Kim'},
                    2: {name: 'Lee'},
                },
                fixedCells: {},
                requestCells: {},
            },
        });

        expect(post).toHaveBeenCalledWith('/schedule/generate', {
            shift_team_id: 20,
            year_month: '2026-03',
        });
        expect(result).toEqual(response);
    });

    it('remaps schedule keyed by nurseId into the editor workerId space', async () => {
        const response = {
            generation_id: 2,
            schedule: {3414: ['D', 'O'], 3415: ['N', 'E']},
            validation: {valid: true, hard_constraints_violated: [], soft_constraints_violated: [], warnings: []},
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

        post.mockResolvedValue({data: response});

        const result = await apiAiScheduleProvider.generate({
            shiftTeamId: 20,
            year: 2026,
            month: 3,
            doc: {
                columns: ['2026-03-01', '2026-03-02'],
                rows: [
                    {workerId: '8753', cells: [null, null]},
                    {workerId: '8754', cells: [null, null]},
                ],
                workerMeta: {
                    8753: {name: 'Kim', nurseId: 3414},
                    8754: {name: 'Lee', nurseId: 3415},
                },
                fixedCells: {},
                requestCells: {},
            },
        });

        expect(result.schedule).toEqual({
            8753: ['D', 'O'],
            8754: ['N', 'E'],
        });
    });
});
