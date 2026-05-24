import type {TDutyDoc, TViolation} from '../types';
import {violationsFromApiValidation} from './convert-api-validation';
import type {TScheduleValidationSnapshot, TScheduleViolationPersisted} from './types';

export function createScheduleValidationSnapshot(
    validation: TScheduleValidationSnapshot['validation'],
    generationId?: number,
): TScheduleValidationSnapshot {
    return {
        validation,
        generationId,
        capturedAt: Date.now(),
    };
}

/**
 * 스냅샷이 있으면 현재 doc 기준으로 재변환(행 매핑·팀 열 span 갱신).
 * 없으면 구 드래프트 legacy 캐시를 그대로 쓴다.
 */
export function resolveScheduleDisplayViolations(
    doc: TDutyDoc,
    validationSnapshot: TScheduleValidationSnapshot | null,
    legacyDisplayViolations: TViolation[],
): TViolation[] {
    if (validationSnapshot) {
        return violationsFromApiValidation(validationSnapshot.validation, doc);
    }

    return legacyDisplayViolations;
}

export function toScheduleViolationPersisted(
    validationSnapshot: TScheduleValidationSnapshot | null,
    legacyDisplayViolations: TViolation[],
): TScheduleViolationPersisted {
    if (validationSnapshot) {
        return {validationSnapshot};
    }

    if (legacyDisplayViolations.length > 0) {
        return {validationSnapshot: null, legacyDisplayViolations};
    }

    return {validationSnapshot: null};
}

/** 구 TPersisted.llmViolations 필드 → 신규 persisted 형태 */
export function migratePersistedViolations(persisted: {
    scheduleViolations?: TScheduleViolationPersisted;
    llmViolations?: TViolation[];
}): TScheduleViolationPersisted {
    if (persisted.scheduleViolations) {
        return persisted.scheduleViolations;
    }

    if (persisted.llmViolations && persisted.llmViolations.length > 0) {
        return {validationSnapshot: null, legacyDisplayViolations: persisted.llmViolations};
    }

    return {validationSnapshot: null};
}
