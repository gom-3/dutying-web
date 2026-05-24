import type {TAiScheduleResponse} from '@dutying/api/ward';
import type {TDutyDoc} from '@/features/shift-editor';
import type {TAiScheduleProvider} from './ai-schedule-contract';

export function generateMockAiSchedule(doc: TDutyDoc): TAiScheduleResponse {
    const patterns = ['D', 'D', 'E', 'E', 'N', 'N', 'O', 'O'];
    const schedule: Record<string, string[]> = {};

    doc.rows.forEach((row, idx) => {
        schedule[row.workerId] = doc.columns.map((_, colIdx) => patterns[(colIdx + idx) % patterns.length]!);
    });

    return {
        generation_id: Date.now(),
        schedule,
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
        llm_model: 'mock',
        generation_time_ms: 0,
        created_at: new Date().toISOString(),
    };
}

export const mockAiScheduleProvider: TAiScheduleProvider = {
    generate: async ({doc}) => generateMockAiSchedule(doc),
};
