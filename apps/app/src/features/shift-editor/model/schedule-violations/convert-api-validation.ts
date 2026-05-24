import type {TAiConstraintViolation, TAiValidation} from '@dutying/api/ward';
import type {TCellPos, TDutyDoc, TViolation} from '../types';

function formatViolationMessage(item: TAiConstraintViolation): string {
    const title = item.title?.trim();

    if (title && title !== item.message) return `${title}: ${item.message}`;

    return item.message;
}

function resolveDayRange(item: TAiConstraintViolation): {startDay: number; endDay: number} | null {
    if (item.period) {
        return {startDay: item.period.start_day, endDay: item.period.end_day};
    }

    const days = item.affected_days;

    if (!days || days.length === 0) return null;

    return {startDay: Math.min(...days), endDay: Math.max(...days)};
}

function dayRangeToCells(row: number, startDay: number, endDay: number, colCount: number): TCellPos[] {
    const cells: TCellPos[] = [];

    for (let day = startDay; day <= endDay; day += 1) {
        const col = day - 1;

        if (col < 0 || col >= colCount) continue;

        cells.push({row, col});
    }

    return cells;
}

function findRowIndexByNurseId(doc: TDutyDoc, nurseId: string): number | null {
    for (let row = 0; row < doc.rows.length; row += 1) {
        const workerId = doc.rows[row]?.workerId;

        if (!workerId) continue;

        const meta = doc.workerMeta[workerId];

        if (workerId === nurseId || String(meta?.nurseId ?? '') === nurseId) return row;
    }

    return null;
}

function toViolation(
    item: TAiConstraintViolation,
    level: TViolation['level'],
    cells: TCellPos[],
    scope: TViolation['scope'],
): TViolation | null {
    if (cells.length === 0) return null;

    return {
        ruleId: `llm.${item.id}`,
        message: formatViolationMessage(item),
        level,
        cells,
        scope,
    };
}

function violationFromApiItem(doc: TDutyDoc, item: TAiConstraintViolation, level: TViolation['level']): TViolation[] {
    const range = resolveDayRange(item);

    if (!range) return [];

    const nurseId = item.nurse_id?.trim();

    if (nurseId) {
        const row = findRowIndexByNurseId(doc, nurseId);

        if (row === null) return [];

        const cells = dayRangeToCells(row, range.startDay, range.endDay, doc.columns.length);
        const violation = toViolation(item, level, cells, 'nurse');

        return violation ? [violation] : [];
    }

    const cells = dayRangeToCells(0, range.startDay, range.endDay, doc.columns.length);
    const violation = toViolation(item, level, cells, 'team');

    return violation ? [violation] : [];
}

/** API validation → 캘린더 표시용 TViolation[] (현재 doc 행/열에 맞춰 매핑) */
export function violationsFromApiValidation(validation: TAiValidation, doc: TDutyDoc): TViolation[] {
    const hard = validation.hard_constraints_violated.flatMap((item) => violationFromApiItem(doc, item, 'error'));
    const soft = validation.soft_constraints_violated.flatMap((item) => violationFromApiItem(doc, item, 'warning'));

    return [...hard, ...soft];
}
