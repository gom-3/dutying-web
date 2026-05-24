import {describe, expect, it} from 'vitest';
import {applyOperation, invertOperation} from '../operation';
import type {TDutyDoc, TOperation} from '../types';

function createDoc(): TDutyDoc {
    return {
        columns: ['2026-03-01', '2026-03-02', '2026-03-03'],
        rows: [
            {workerId: '1', cells: ['D', null, 'N']},
            {workerId: '2', cells: ['O', 'E', null]},
        ],
        workerMeta: {
            1: {name: 'Kim'},
            2: {name: 'Lee'},
        },
        fixedCells: {},
        requestCells: {},
    };
}

describe('operation', () => {
    it('applies setCells only to changed cells within bounds', () => {
        const doc = createDoc();
        const op: TOperation = {
            kind: 'setCells',
            cells: [
                {row: 0, col: 1, prev: null, next: 'D'},
                {row: 1, col: 5, prev: null, next: 'N'},
            ],
        };
        const nextDoc = applyOperation(doc, op);

        expect(nextDoc.rows[0]?.cells).toEqual(['D', 'D', 'N']);
        expect(nextDoc.rows[1]?.cells).toEqual(['O', 'E', null]);
        expect(nextDoc.rows[0]).not.toBe(doc.rows[0]);
        expect(nextDoc.rows[1]?.cells).toEqual(doc.rows[1]?.cells);
    });

    it('restores the previous document when applying an inverted setCells operation', () => {
        const doc = createDoc();
        const op: TOperation = {
            kind: 'setCells',
            cells: [
                {row: 0, col: 0, prev: 'D', next: 'E'},
                {row: 1, col: 2, prev: null, next: 'N'},
            ],
        };
        const nextDoc = applyOperation(doc, op);
        const restoredDoc = applyOperation(nextDoc, invertOperation(op));

        expect(restoredDoc).toEqual(doc);
    });

    it('reorders rows only when nextOrder covers every row', () => {
        const doc = createDoc();
        const reordered = applyOperation(doc, {
            kind: 'reorderRows',
            prevOrder: [0, 1],
            nextOrder: [1, 0],
        });
        const invalid = applyOperation(doc, {
            kind: 'reorderRows',
            prevOrder: [0, 1],
            nextOrder: [1],
        });

        expect(reordered.rows.map((row) => row.workerId)).toEqual(['2', '1']);
        expect(applyOperation(reordered, invertOperation({kind: 'reorderRows', prevOrder: [0, 1], nextOrder: [1, 0]}))).toEqual(doc);
        expect(invalid).toBe(doc);
    });

    it('ignores reorder operations with duplicate row indexes', () => {
        const doc = createDoc();
        const invalid = applyOperation(doc, {
            kind: 'reorderRows',
            prevOrder: [0, 1],
            nextOrder: [0, 0],
        });

        expect(invalid).toBe(doc);
    });
});
