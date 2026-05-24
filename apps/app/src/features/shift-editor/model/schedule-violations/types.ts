import type {TAiValidation} from '@dutying/api/ward';
import type {TViolation} from '../types';

/**
 * 서버 `validation` 응답 스냅샷.
 * 재진입·수동 편집 후 `refreshScheduleViolations`로 갱신할 예정 — UI는 항상 snapshot + 현재 doc으로 재변환한다.
 */
export type TScheduleValidationSnapshot = {
    validation: TAiValidation;
    generationId?: number;
    capturedAt: number;
};

/** localStorage 드래프트에 함께 보관하는 위반 상태 */
export type TScheduleViolationPersisted = {
    validationSnapshot: TScheduleValidationSnapshot | null;
    /**
     * 구 드래프트(`llmViolations`만 있던 시절) 호환용.
     * snapshot이 있으면 무시하고 재변환한다.
     */
    legacyDisplayViolations?: TViolation[];
};
