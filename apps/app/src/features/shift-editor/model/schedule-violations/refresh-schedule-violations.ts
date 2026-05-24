import type {TAiValidation} from '@dutying/api/ward';
import type {TDutyDoc} from '../types';

export type TRefreshScheduleViolationsParams = {
    doc: TDutyDoc;
    shiftTeamId: number;
    year: number;
    month: number;
    /** 직전 generate 응답 id — 재검증 API가 생기면 전달 */
    generationId?: number;
};

/**
 * 재진입·수동 편집 후 서버에서 제약 위반을 다시 계산한다.
 *
 * @returns 갱신된 validation. 아직 API가 없으면 `null`(호출부는 기존 스냅샷 유지).
 */
export async function refreshScheduleViolations(_params: TRefreshScheduleViolationsParams): Promise<TAiValidation | null> {
    // TODO: POST /llm/schedule/validate (가칭) 등 재검증 API 연동
    return null;
}
