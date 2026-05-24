import type {TDutyDoc, TOperation, TReorderRowsOp, TSetCellsOp} from './types';

export function invertSetCellsOp(op: TSetCellsOp): TSetCellsOp {
    return {
        kind: 'setCells',
        cells: op.cells.map((cell) => ({
            row: cell.row,
            col: cell.col,
            prev: cell.next,
            next: cell.prev,
        })),
        fixedDelta: op.fixedDelta?.map((d) => ({key: d.key, prev: d.next, next: d.prev})),
    };
}

export function invertReorderRowsOp(op: TReorderRowsOp): TReorderRowsOp {
    return {
        kind: 'reorderRows',
        prevOrder: op.nextOrder,
        nextOrder: op.prevOrder,
    };
}

export function invertOperation(op: TOperation): TOperation {
    switch (op.kind) {
        case 'setCells':
            return invertSetCellsOp(op);
        case 'reorderRows':
            return invertReorderRowsOp(op);
    }
}

function applySetCellsOp(doc: TDutyDoc, op: TSetCellsOp): TDutyDoc {
    const hasCellChanges = op.cells.length > 0;
    const hasFixedDelta = !!op.fixedDelta && op.fixedDelta.length > 0;

    if (!hasCellChanges && !hasFixedDelta) return doc;

    // 필요한 row만 얕은 복사 (cells는 row마다 복사)
    const nextRows = doc.rows.slice();
    const touchedRows = new Set<number>();

    for (const {row} of op.cells) touchedRows.add(row);

    for (const rowIdx of touchedRows) {
        const row = nextRows[rowIdx];

        if (!row) continue;

        nextRows[rowIdx] = {...row, cells: row.cells.slice()};
    }

    for (const {row, col, next} of op.cells) {
        const r = nextRows[row];

        if (!r) continue;

        if (col < 0 || col >= r.cells.length) continue;

        r.cells[col] = next;
    }

    let nextFixedCells = doc.fixedCells;

    if (hasFixedDelta) {
        nextFixedCells = {...doc.fixedCells};

        for (const {key, next} of op.fixedDelta!) {
            if (next) nextFixedCells[key] = true;
            else delete nextFixedCells[key];
        }
    }

    return {...doc, rows: nextRows, fixedCells: nextFixedCells};
}

function applyReorderRowsOp(doc: TDutyDoc, op: TReorderRowsOp): TDutyDoc {
    if (op.prevOrder.length !== doc.rows.length || op.nextOrder.length !== doc.rows.length) return doc;

    if (new Set(op.prevOrder).size !== op.prevOrder.length || new Set(op.nextOrder).size !== op.nextOrder.length) return doc;

    const prevIndexByRow = new Map(op.prevOrder.map((rowIdx, position) => [rowIdx, position]));
    const nextRows = op.nextOrder.map((rowIdx) => {
        const currentPosition = prevIndexByRow.get(rowIdx);

        if (currentPosition === undefined) return null;

        return doc.rows[currentPosition] ?? null;
    });

    if (nextRows.some((row) => row === null)) return doc;

    return {...doc, rows: nextRows as TDutyDoc['rows']};
}

export function applyOperation(doc: TDutyDoc, op: TOperation): TDutyDoc {
    switch (op.kind) {
        case 'setCells':
            return applySetCellsOp(doc, op);
        case 'reorderRows':
            return applyReorderRowsOp(doc, op);
    }
}
