import {normalizeSelection} from './selection';
import type {TClipboardPayload, TDutyDoc, TSelection, TSetCellsOp} from './types';

export function copySelection(doc: TDutyDoc, selection: TSelection | null): TClipboardPayload | null {
    if (!selection) return null;

    const {top, left, bottom, right} = normalizeSelection(selection);
    const height = bottom - top + 1;
    const width = right - left + 1;
    const cells: TClipboardPayload['cells'] = [];

    for (let r = 0; r < height; r++) {
        const row: TClipboardPayload['cells'][number] = [];

        for (let c = 0; c < width; c++) {
            row.push(doc.rows[top + r]?.cells[left + c] ?? null);
        }

        cells.push(row);
    }

    return {width, height, cells};
}

export function pastePayload(payload: TClipboardPayload, selection: TSelection, doc: TDutyDoc): TSetCellsOp {
    const rect = selection.type === 'single' ? null : normalizeSelection(selection);
    const startRow = selection.type === 'single' ? selection.anchor.row : rect!.top;
    const startCol = selection.type === 'single' ? selection.anchor.col : rect!.left;
    const cells: TSetCellsOp['cells'] = [];

    for (let r = 0; r < payload.height; r++) {
        for (let c = 0; c < payload.width; c++) {
            const row = startRow + r;
            const col = startCol + c;

            if (row >= doc.rows.length || col >= doc.columns.length) continue; // 자동 자르기

            const prev = doc.rows[row]?.cells[col] ?? null;
            const next = payload.cells[r]?.[c] ?? null;

            if (prev !== next) {
                cells.push({row, col, prev, next});
            }
        }
    }

    return {kind: 'setCells', cells};
}
