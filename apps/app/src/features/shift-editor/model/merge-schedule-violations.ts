import type {TViolation} from './types';

/** 서버 validation 위반을 그대로 반환한다 (빈 cells만 제외). */
export function mergeServerScheduleViolations(violations: TViolation[]): TViolation[] {
    return violations.filter((violation) => violation.cells.length > 0);
}

/** @deprecated mergeServerScheduleViolations 사용 */
export function mergeScheduleViolations(_frontendViolations: TViolation[], llmViolations: TViolation[]): TViolation[] {
    return mergeServerScheduleViolations(llmViolations);
}
