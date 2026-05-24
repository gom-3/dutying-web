import {useMemo} from 'react';
import {resolveScheduleDisplayViolations} from './schedule-violations';
import {useShiftEditorStore} from './store';
import type {TDutyDoc, TViolation} from './types';

/** 현재 doc + validation 스냅샷(또는 legacy)으로 표시용 위반 목록을 계산한다. */
export function useScheduleDisplayViolations(doc?: TDutyDoc): TViolation[] {
    const storeDoc = useShiftEditorStore((s) => s.doc);
    const validationSnapshot = useShiftEditorStore((s) => s.scheduleValidationSnapshot);
    const legacyDisplayViolations = useShiftEditorStore((s) => s.legacyDisplayViolations);
    const resolvedDoc = doc ?? storeDoc;

    return useMemo(
        () => resolveScheduleDisplayViolations(resolvedDoc, validationSnapshot, legacyDisplayViolations),
        [resolvedDoc, validationSnapshot, legacyDisplayViolations],
    );
}
