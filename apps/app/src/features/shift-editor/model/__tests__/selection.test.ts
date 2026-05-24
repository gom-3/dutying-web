import {describe, expect, it} from 'vitest';
import {getCellsInSelection, makeSelectAllSelection, moveSelection, moveSelectionToEdge, normalizeSelection} from '../selection';
import type {TSelection} from '../types';

const bounds = {rowCount: 2, colCount: 3};

describe('selection', () => {
    it('moves right across columns and wraps to the next row', () => {
        const selection: TSelection = {type: 'single', anchor: {row: 0, col: 2}};

        expect(moveSelection(selection, 'right', false, bounds)).toEqual({
            type: 'single',
            anchor: {row: 1, col: 0},
        });
    });

    it('keeps the current cell when movement would leave the board', () => {
        const selection: TSelection = {type: 'single', anchor: {row: 0, col: 0}};

        expect(moveSelection(selection, 'left', false, bounds)).toEqual(selection);
        expect(moveSelection(selection, 'up', false, bounds)).toEqual(selection);
    });

    it('extends a single selection into a range and keeps the original anchor', () => {
        const selection: TSelection = {type: 'single', anchor: {row: 0, col: 1}};

        expect(moveSelection(selection, 'down', true, bounds)).toEqual({
            type: 'range',
            from: {row: 0, col: 1},
            to: {row: 1, col: 1},
        });
    });

    it('collapses a range into a single selection at the moved edge', () => {
        const selection: TSelection = {
            type: 'range',
            from: {row: 1, col: 0},
            to: {row: 0, col: 1},
        };

        expect(moveSelection(selection, 'right', false, bounds)).toEqual({
            type: 'single',
            anchor: {row: 0, col: 2},
        });
    });

    it('moves to the row or column edge and preserves range anchor when extending', () => {
        const selection: TSelection = {type: 'single', anchor: {row: 1, col: 1}};

        expect(moveSelectionToEdge(selection, 'left', false, bounds)).toEqual({
            type: 'single',
            anchor: {row: 1, col: 0},
        });
        expect(moveSelectionToEdge(selection, 'up', true, bounds)).toEqual({
            type: 'range',
            from: {row: 1, col: 1},
            to: {row: 0, col: 1},
        });
    });

    it('creates select-all range only when bounds are valid', () => {
        expect(makeSelectAllSelection(bounds)).toEqual({
            type: 'range',
            from: {row: 0, col: 0},
            to: {row: 1, col: 2},
        });
        expect(makeSelectAllSelection({rowCount: 0, colCount: 3})).toBeNull();
    });

    it('normalizes reversed ranges and enumerates all cells in row-major order', () => {
        const selection: TSelection = {
            type: 'range',
            from: {row: 1, col: 2},
            to: {row: 0, col: 1},
        };

        expect(normalizeSelection(selection)).toEqual({
            top: 0,
            left: 1,
            bottom: 1,
            right: 2,
        });
        expect(getCellsInSelection(selection)).toEqual([
            {row: 0, col: 1},
            {row: 0, col: 2},
            {row: 1, col: 1},
            {row: 1, col: 2},
        ]);
    });
});
