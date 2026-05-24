import type {TAiScheduleResponse, TLlmGenerateScheduleDTO} from '@dutying/api/ward';
import type {TDutyDoc} from '@/features/shift-editor';
import llmAxiosInstance from '@/shared/api/llm/client';
import type {TAiScheduleProvider} from './ai-schedule-contract';

const toYearMonth = (year: number, month: number) => `${year}-${month.toString().padStart(2, '0')}`;

type TLlmFailureEnvelope = {
    status: 'failed';
    error?: string;
    error_type?: string;
};

const isLlmFailure = (data: unknown): data is TLlmFailureEnvelope =>
    typeof data === 'object' && data !== null && (data as {status?: unknown}).status === 'failed';

const isAiScheduleSuccess = (data: unknown): data is TAiScheduleResponse =>
    typeof data === 'object' &&
    data !== null &&
    typeof (data as {schedule?: unknown}).schedule === 'object' &&
    (data as {schedule?: unknown}).schedule !== null;

/**
 * LLM 서버는 schedule을 nurseId로 키잉해서 반환한다.
 * 에디터 doc은 shiftNurseId를 workerId로 사용하므로 doc.workerMeta의
 * nurseId 정보를 이용해 키를 shiftNurseId로 다시 매핑한다.
 */
function remapScheduleByWorkerId(schedule: Record<string, string[]>, doc: TDutyDoc): Record<string, string[]> {
    const responseKeys = Object.keys(schedule);
    const docWorkerIds = new Set(doc.rows.map((row) => row.workerId));
    const alreadyMatches = responseKeys.every((key) => docWorkerIds.has(key));

    if (alreadyMatches) return schedule;

    const remapped: Record<string, string[]> = {};

    for (const row of doc.rows) {
        const meta = doc.workerMeta[row.workerId];
        const candidateKey = meta?.nurseId != null ? String(meta.nurseId) : row.workerId;
        const values = schedule[candidateKey] ?? schedule[row.workerId];

        if (values) remapped[row.workerId] = values;
    }

    return remapped;
}

export const apiAiScheduleProvider: TAiScheduleProvider = {
    generate: async ({shiftTeamId, year, month, doc}) => {
        const payload: TLlmGenerateScheduleDTO = {
            shift_team_id: shiftTeamId,
            year_month: toYearMonth(year, month),
        };

        const {data} = await llmAxiosInstance.post<TAiScheduleResponse | TLlmFailureEnvelope>('/schedule/generate', payload);

        if (isLlmFailure(data)) {
            throw new Error(data.error ?? data.error_type ?? 'AI 자동 채우기에 실패했습니다.');
        }

        if (!isAiScheduleSuccess(data)) {
            throw new Error('AI 자동 채우기 응답 형식이 올바르지 않습니다.');
        }

        return {...data, schedule: remapScheduleByWorkerId(data.schedule, doc)};
    },
};
