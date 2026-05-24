import type {TDutyDoc} from '@/features/shift-editor/model';

/**
 * `fixedCells`가 아닌 일자는 null로 두어 캘린더에서만 ‘고정 근무’를 보이게 할 때 사용.
 */
export function maskDutyDocNonFixedCells(doc: TDutyDoc): TDutyDoc {
    return {
        ...doc,
        rows: doc.rows.map((row) => ({
            ...row,
            cells: row.cells.map((cell, colIdx) => {
                const date = doc.columns[colIdx];
                if (!date) return cell;

                const key = `${row.workerId}|${date}`;

                return doc.fixedCells[key] === true ? cell : null;
            }),
        })),
    };
}
