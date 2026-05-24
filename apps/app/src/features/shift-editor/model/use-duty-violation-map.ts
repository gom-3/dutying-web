import {useMemo} from 'react';
import {mergeServerScheduleViolations} from './merge-schedule-violations';
import {useScheduleDisplayViolations} from './use-schedule-display-violations';
import type {TDutyDoc, TViolation} from './types';
import {buildViolationMapAll} from './validator';

export type TScheduleViolationView = {
    violationMap: Map<string, TViolation>;
    teamViolations: TViolation[];
};

/**
 * 서버(LLM API) validation 위반을 캘린더용으로 변환.
 * - nurse: 행·일자 span
 * - team: division 일자 열 전체 span (별도 오버레이)
 */
export function useViolationMap(doc: TDutyDoc): TScheduleViolationView {
    const displayViolations = useScheduleDisplayViolations(doc);

    return useMemo(() => {
        const all = mergeServerScheduleViolations(displayViolations);
        const teamViolations = all.filter((violation) => violation.scope === 'team');
        const nurseViolations = all.filter((violation) => violation.scope !== 'team');

        return {
            violationMap: buildViolationMapAll(nurseViolations, doc),
            teamViolations,
        };
    }, [displayViolations, doc]);
}
