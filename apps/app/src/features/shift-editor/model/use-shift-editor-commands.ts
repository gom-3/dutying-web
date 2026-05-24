import type {TAiValidation} from '@dutying/api/ward';
import toast from 'react-hot-toast';
import {type TWardConstraint} from '@/entities';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import {copySelection, pastePayload} from './clipboard';
import {useShiftEditorDraftStatusStore} from './draft-status-store';
import {applyBoardToWardConstraint, buildInitialDutyRuleBoard, buildRuleLevelByKeyFromBoard} from './duty-constraints';
import {applyOperation, invertOperation} from './operation';
import {createShiftEditorPersistence} from './persistence';
import {
    createScheduleValidationSnapshot,
    migratePersistedViolations,
    toScheduleViolationPersisted,
    type TScheduleViolationPersisted,
} from './schedule-violations';
import {getCellsInSelection, makeSelectAllSelection, moveSelection as moveSelectionModel, moveSelectionToEdge} from './selection';
import {useShiftEditorStore} from './store';
import type {
    TCellPos,
    TCellValue,
    TClipboardPayload,
    TDutyDoc,
    TDutyRuleBoard,
    TDutyValidationInput,
    THistoryEntry,
    THistoryState,
    TOperation,
    TPersisted,
    TSetCellsOp,
    TTransaction,
    TTxSource,
    TViolation,
} from './types';
const DEFAULT_STORAGE_KEY = 'shift-editor:draft';
const DRAFT_SAVE_DEBOUNCE_MS = 1500;
const persistence = createShiftEditorPersistence({
    storageKey: DEFAULT_STORAGE_KEY,
    saveDebounceMs: DRAFT_SAVE_DEBOUNCE_MS,
    onStatusChange: (status) => useShiftEditorDraftStatusStore.getState().setStatus(status),
});

export function getShiftEditorDraftStorageKey(ctx: {wardId: number; shiftTeamId: number; year: number; month: number}): string {
    return `${DEFAULT_STORAGE_KEY}:${ctx.wardId}:${ctx.shiftTeamId}:${ctx.year}:${ctx.month}`;
}

function invertOps(ops: TOperation[]): TOperation[] {
    return ops
        .slice()
        .reverse()
        .map((op) => invertOperation(op));
}

function pushHistory(history: THistoryState, entry: THistoryEntry): THistoryState {
    const nextPast = history.past.concat(entry);
    const trimmedPast = nextPast.length > history.maxDepth ? nextPast.slice(nextPast.length - history.maxDepth) : nextPast;

    return {past: trimmedPast, future: [], maxDepth: history.maxDepth};
}

function scheduleViolationsFromState(state: {
    scheduleValidationSnapshot: ReturnType<typeof useShiftEditorStore.getState>['scheduleValidationSnapshot'];
    legacyDisplayViolations: TViolation[];
}): TScheduleViolationPersisted {
    return toScheduleViolationPersisted(state.scheduleValidationSnapshot, state.legacyDisplayViolations);
}

function persistDoc(doc: TDutyDoc, history: THistoryState, scheduleViolations: TScheduleViolationPersisted) {
    persistence.save(doc, history, scheduleViolations);
}

function persistDocImmediate(doc: TDutyDoc, history: THistoryState, scheduleViolations: TScheduleViolationPersisted) {
    persistence.saveImmediate(doc, history, scheduleViolations);
}

/**
 * undo/redo 시 고정근무/신청근무로 잠긴 셀은 건너뛴다.
 * 고정근무와 신청근무가 AI 자동 채우기 등 일반 편집보다 우선순위가 높기 때문이다.
 */
function filterOpAgainstLocks(op: TOperation, doc: TDutyDoc): TOperation {
    if (op.kind !== 'setCells') return op;

    const filteredCells = op.cells.filter(({row, col}) => {
        const r = doc.rows[row];

        if (!r) return false;

        const key = `${r.workerId}|${doc.columns[col]}`;

        return !(doc.fixedCells[key] === true || doc.requestCells[key] === true);
    });

    return {...op, cells: filteredCells};
}

/**
 * UI는 상태를 store에서 읽고, 변경은 이 command 훅에서만 수행하는 것을 권장.
 * (store 메서드를 직접 호출하지 않고 이 훅으로만 접근하는 “약한 규칙”)
 */
export function useShiftEditorCommands() {
    const {t} = useTypedTranslation();
    const setDutyValidationInput = useShiftEditorStore((s) => s.setDutyValidationInput);
    const setDutyRuleBoard = useShiftEditorStore((s) => s.setDutyRuleBoard);
    const setDoc = useShiftEditorStore((s) => s.setDoc);
    const setHistory = useShiftEditorStore((s) => s.setHistory);
    const setSelection = useShiftEditorStore((s) => s.setSelection);
    const setScheduleValidationSnapshot = useShiftEditorStore((s) => s.setScheduleValidationSnapshot);
    const setLegacyDisplayViolations = useShiftEditorStore((s) => s.setLegacyDisplayViolations);
    const reset = useShiftEditorStore((s) => s.reset);
    const getState = () => useShiftEditorStore.getState();
    const notifyFixedLocked = () => toast.error(t('page.makeShift.fixedShifts.lockedToast'));
    const notifyRequestLocked = () => toast.error(t('page.makeShift.requests.lockedToast'));
    const cmdSetCells = (cells: TCellPos[], value: TCellValue, source: TTxSource = 'user') => {
        const {doc, history, dutyValidationInput, selection, editorMode} = getState();

        if (cells.length === 0) return;

        const changed: Array<{row: number; col: number; prev: TCellValue; next: TCellValue}> = [];
        const fixedDelta: Array<{key: string; prev: boolean; next: boolean}> = [];

        let skippedByFixed = 0;
        let skippedByRequest = 0;

        for (const {row, col} of cells) {
            if (row < 0 || row >= doc.rows.length || col < 0 || col >= doc.columns.length) continue;

            const r = doc.rows[row];

            if (!r) continue;

            const key = `${r.workerId}|${doc.columns[col]}`;
            const prev = r.cells[col] ?? null;
            const prevFixed = doc.fixedCells[key] === true;
            const prevRequest = doc.requestCells[key] === true;

            if (prevRequest) {
                skippedByRequest += 1;
                continue;
            }

            if (editorMode !== 'fixed' && prevFixed) {
                skippedByFixed += 1;
                continue;
            }

            const cellChanged = prev !== value;
            const nextFixed = editorMode === 'fixed' ? value !== null : prevFixed;
            const fixedChanged = prevFixed !== nextFixed;

            if (!cellChanged && !fixedChanged) continue;

            if (cellChanged) changed.push({row, col, prev, next: value});
            if (fixedChanged) fixedDelta.push({key, prev: prevFixed, next: nextFixed});
        }

        if (source === 'user') {
            if (skippedByRequest > 0) notifyRequestLocked();
            else if (skippedByFixed > 0) notifyFixedLocked();
        }

        if (changed.length === 0 && fixedDelta.length === 0) return;

        const tx: TTransaction<TOperation> = {
            ops: [{kind: 'setCells', cells: changed, fixedDelta: fixedDelta.length > 0 ? fixedDelta : undefined}],
            source,
            timestamp: Date.now(),
        };
        const inverseOps = invertOps(tx.ops);
        const nextDoc = tx.ops.reduce((d, op) => applyOperation(d, op), doc);

        setDoc(nextDoc);

        if (editorMode !== 'fixed') {
            const entry: THistoryEntry = {tx, inverseOps, selectionBefore: selection, selectionAfter: selection};
            const nextHistory = pushHistory(history, entry);

            setHistory(nextHistory);
            persistDoc(nextDoc, nextHistory, scheduleViolationsFromState(getState()));
        } else {
            persistDocImmediate(nextDoc, history, scheduleViolationsFromState(getState()));
        }
    };
    const cmdSetSelectionValue = (value: TCellValue, source?: TTxSource) => {
        const {selection} = getState();

        if (!selection) return;

        const cells = getCellsInSelection(selection);

        cmdSetCells(cells, value, source ?? 'user');
    };

    return {
        init: (doc: TDutyDoc, opts?: {maxHistoryDepth?: number}) => {
            const {dutyValidationInput, dutyRuleBoard} = getState();

            reset(opts);

            setDutyValidationInput(dutyValidationInput);
            setDutyRuleBoard(dutyRuleBoard);

            const {history} = getState();
            const nextHistory: THistoryState = {...history, past: [], future: [], maxDepth: opts?.maxHistoryDepth ?? history.maxDepth};

            setDoc(doc);
            setSelection(null);
            setHistory(nextHistory);
            setScheduleValidationSnapshot(null);
            setLegacyDisplayViolations([]);
            persistDoc(doc, nextHistory, {validationSnapshot: null});
        },
        getPersisted: (): TPersisted | null => persistence.load(),
        hydrate: (persisted: TPersisted) => {
            const {dutyValidationInput, history: currentHistory} = getState();

            let nextHistory: THistoryState | null = null;

            try {
                nextHistory = JSON.parse(persisted.history) as THistoryState;
            } catch {
                nextHistory = null;
            }

            const appliedHistory = nextHistory ?? currentHistory;

            setDoc(persisted.doc);
            setSelection(null);
            setHistory(appliedHistory);
            const scheduleViolations =
                persisted.scheduleViolations ?? migratePersistedViolations(persisted);

            setScheduleValidationSnapshot(scheduleViolations.validationSnapshot);
            setLegacyDisplayViolations(scheduleViolations.legacyDisplayViolations ?? []);
        },
        discardPersisted: () => persistence.clear(),
        setPersistenceKey: (key: string) => persistence.setStorageKey(key),
        getCurrentPersistenceKey: () => persistence.storageKey,
        persistImmediate: () => {
            const {doc, history} = getState();

            persistDocImmediate(doc, history, scheduleViolationsFromState(getState()));
        },
        /** AI generate 등 서버 validation 스냅샷 저장 — 표시는 현재 doc 기준으로 재변환 */
        setScheduleValidationFromApi: (validation: TAiValidation, generationId?: number) => {
            const snapshot = createScheduleValidationSnapshot(validation, generationId);

            setScheduleValidationSnapshot(snapshot);
            setLegacyDisplayViolations([]);

            const {doc, history} = getState();

            persistDocImmediate(doc, history, {validationSnapshot: snapshot});
        },
        setDutyValidationInput: (input: TDutyValidationInput | null) => {
            const {doc} = getState();

            setDutyValidationInput(input);

            // constraints board는 input을 기반으로 UI에서 드래그/편집하기 쉽도록 별도로 유지한다.
            // - 기존 board가 없을 때만 초기화 (사용자가 이미 정렬/제외를 바꾼 경우 유지)
            const {dutyRuleBoard} = getState();

            if (input && !dutyRuleBoard) {
                setDutyRuleBoard(buildInitialDutyRuleBoard(input.wardConstraint, input.ruleLevelByKey));
            }
        },
        setDutyRuleBoard: (board: TDutyRuleBoard) => {
            const {dutyValidationInput} = getState();

            setDutyRuleBoard(board);

            if (!dutyValidationInput) return;

            const nextWardConstraint = applyBoardToWardConstraint(board, dutyValidationInput.wardConstraint);
            const nextRuleLevelByKey = buildRuleLevelByKeyFromBoard(board);
            const nextInput: TDutyValidationInput = {
                ...dutyValidationInput,
                wardConstraint: nextWardConstraint,
                ruleLevelByKey: nextRuleLevelByKey,
            };
            // validation도 즉시 재계산 (규칙 활성/레벨 변경 반영)
            const {doc} = getState();

            setDutyValidationInput(nextInput);
        },
        setWardConstraint: (wardConstraint: TWardConstraint) => {
            const {dutyValidationInput, doc} = getState();

            if (!dutyValidationInput) return;

            const nextInput: TDutyValidationInput = {
                ...dutyValidationInput,
                wardConstraint,
            };

            setDutyValidationInput(nextInput);
        },
        select: (cell: TCellPos) => setSelection({type: 'single', anchor: cell}),
        clearSelection: () => setSelection(null),
        moveSelection: (dir: 'up' | 'down' | 'left' | 'right', extend: boolean, moveEnd?: boolean) => {
            const {doc, selection} = getState();
            const bounds = {rowCount: doc.rows.length, colCount: doc.columns.length};
            const next = moveEnd ? moveSelectionToEdge(selection, dir, extend, bounds) : moveSelectionModel(selection, dir, extend, bounds);

            setSelection(next);
        },
        selectAll: () => {
            const {doc} = getState();
            const sel = makeSelectAllSelection({rowCount: doc.rows.length, colCount: doc.columns.length});

            setSelection(sel);
        },
        setCells: cmdSetCells,
        setSelectionValue: cmdSetSelectionValue,
        clearSelectionCells: (source?: TTxSource) => cmdSetSelectionValue(null, source),
        resetAutofilled: (source: TTxSource = 'user') => {
            const {doc, history, dutyValidationInput, selection} = getState();
            const changed: TSetCellsOp['cells'] = [];

            for (let rowIdx = 0; rowIdx < doc.rows.length; rowIdx += 1) {
                const row = doc.rows[rowIdx];

                if (!row) continue;

                for (let col = 0; col < doc.columns.length; col += 1) {
                    const key = `${row.workerId}|${doc.columns[col]}`;

                    if (doc.fixedCells[key] === true) continue;
                    if (doc.requestCells[key] === true) continue;

                    const prev = row.cells[col] ?? null;

                    if (prev === null) continue;

                    changed.push({row: rowIdx, col, prev, next: null});
                }
            }

            if (changed.length === 0) return;

            const tx: TTransaction<TOperation> = {
                ops: [{kind: 'setCells', cells: changed}],
                source,
                timestamp: Date.now(),
            };
            const inverseOps = invertOps(tx.ops);
            const nextDoc = tx.ops.reduce((d, op) => applyOperation(d, op), doc);
            const entry: THistoryEntry = {tx, inverseOps, selectionBefore: selection, selectionAfter: selection};
            const nextHistory = pushHistory(history, entry);

            setDoc(nextDoc);
            setHistory(nextHistory);

            persistDoc(nextDoc, nextHistory, scheduleViolationsFromState(getState()));
        },
        applySchedule: (schedule: Record<string, TCellValue[]>, source: TTxSource = 'ai') => {
            const {doc, history, dutyValidationInput, selection} = getState();
            const changed: TSetCellsOp['cells'] = [];

            for (let rowIdx = 0; rowIdx < doc.rows.length; rowIdx += 1) {
                const row = doc.rows[rowIdx];

                if (!row) continue;

                const values = schedule[row.workerId];

                if (!values) continue;

                for (let col = 0; col < Math.min(values.length, doc.columns.length); col += 1) {
                    const key = `${row.workerId}|${doc.columns[col]}`;

                    if (doc.fixedCells[key] === true) continue;
                    if (doc.requestCells[key] === true) continue;

                    const prev = row.cells[col] ?? null;
                    const next = values[col] ?? null;

                    if (prev === next) continue;

                    changed.push({row: rowIdx, col, prev, next});
                }
            }

            if (changed.length === 0) return;

            const tx: TTransaction<TOperation> = {
                ops: [{kind: 'setCells', cells: changed}],
                source,
                timestamp: Date.now(),
            };
            const inverseOps = invertOps(tx.ops);
            const nextDoc = tx.ops.reduce((d, op) => applyOperation(d, op), doc);
            const entry: THistoryEntry = {tx, inverseOps, selectionBefore: selection, selectionAfter: selection};
            const nextHistory = pushHistory(history, entry);

            setDoc(nextDoc);
            setHistory(nextHistory);

            persistDoc(nextDoc, nextHistory, scheduleViolationsFromState(getState()));
        },
        reorderRowsByName: (source: TTxSource = 'user') => {
            const {doc, history, dutyValidationInput, selection} = getState();

            if (doc.rows.length <= 1) return;

            const prevOrder = doc.rows.map((_, idx) => idx);
            const nextOrder = prevOrder
                .slice()
                .sort((a, b) =>
                    (doc.workerMeta[doc.rows[a]!.workerId]?.name ?? '').localeCompare(doc.workerMeta[doc.rows[b]!.workerId]?.name ?? ''),
                );

            if (prevOrder.every((v, i) => v === nextOrder[i])) return;

            const tx: TTransaction<TOperation> = {
                ops: [{kind: 'reorderRows', prevOrder, nextOrder}],
                source,
                timestamp: Date.now(),
            };
            const inverseOps = invertOps(tx.ops);
            const nextDoc = tx.ops.reduce((d, op) => applyOperation(d, op), doc);
            const entry: THistoryEntry = {tx, inverseOps, selectionBefore: selection, selectionAfter: null};
            const nextHistory = pushHistory(history, entry);

            setDoc(nextDoc);
            setSelection(null);
            setHistory(nextHistory);

            persistDoc(nextDoc, nextHistory, scheduleViolationsFromState(getState()));
        },
        copy: (): TClipboardPayload | null => {
            const {doc, selection} = getState();

            return copySelection(doc, selection);
        },
        paste: (payload: TClipboardPayload, source: TTxSource = 'user') => {
            const {doc, selection, history, dutyValidationInput, editorMode} = getState();

            if (!selection) return;

            const rawOp = pastePayload(payload, selection, doc);

            if (rawOp.cells.length === 0) return;

            let filteredCells = rawOp.cells;
            let skippedByRequest = 0;

            {
                const kept: typeof rawOp.cells = [];

                for (const cell of rawOp.cells) {
                    const r = doc.rows[cell.row];

                    if (!r) continue;

                    const key = `${r.workerId}|${doc.columns[cell.col]}`;

                    if (doc.requestCells[key] === true) {
                        skippedByRequest += 1;
                        continue;
                    }

                    kept.push(cell);
                }

                filteredCells = kept;
            }

            if (editorMode !== 'fixed') {
                const kept: typeof filteredCells = [];

                let skippedByFixed = 0;

                for (const cell of filteredCells) {
                    const r = doc.rows[cell.row];

                    if (!r) continue;

                    const key = `${r.workerId}|${doc.columns[cell.col]}`;

                    if (doc.fixedCells[key] === true) {
                        skippedByFixed += 1;
                        continue;
                    }

                    kept.push(cell);
                }

                filteredCells = kept;

                if (source === 'user') {
                    if (skippedByRequest > 0) notifyRequestLocked();
                    else if (skippedByFixed > 0) notifyFixedLocked();
                }
            } else if (source === 'user' && skippedByRequest > 0) {
                notifyRequestLocked();
            }

            const fixedDelta: Array<{key: string; prev: boolean; next: boolean}> = [];

            if (editorMode === 'fixed') {
                for (const cell of filteredCells) {
                    const r = doc.rows[cell.row];

                    if (!r) continue;

                    const key = `${r.workerId}|${doc.columns[cell.col]}`;
                    const prevFixed = doc.fixedCells[key] === true;
                    const nextFixed = cell.next !== null;

                    if (prevFixed !== nextFixed) fixedDelta.push({key, prev: prevFixed, next: nextFixed});
                }
            }

            if (filteredCells.length === 0 && fixedDelta.length === 0) return;

            const op: TSetCellsOp = {
                kind: 'setCells',
                cells: filteredCells,
                fixedDelta: fixedDelta.length > 0 ? fixedDelta : undefined,
            };
            const tx: TTransaction<TOperation> = {ops: [op], source, timestamp: Date.now()};
            const inverseOps = invertOps(tx.ops);
            const nextDoc = applyOperation(doc, op);

            setDoc(nextDoc);

            if (editorMode !== 'fixed') {
                const entry: THistoryEntry = {tx, inverseOps, selectionBefore: selection, selectionAfter: selection};
                const nextHistory = pushHistory(history, entry);

                setHistory(nextHistory);
                persistDoc(nextDoc, nextHistory, scheduleViolationsFromState(getState()));
            } else {
                persistDocImmediate(nextDoc, history, scheduleViolationsFromState(getState()));
            }
        },
        undo: () => {
            const {doc, history, dutyValidationInput, selection} = getState();
            const entry = history.past[history.past.length - 1];

            if (!entry) return;

            const nextDoc = entry.inverseOps.reduce((d, op) => applyOperation(d, filterOpAgainstLocks(op, d)), doc);
            const nextHistory: THistoryState = {
                past: history.past.slice(0, -1),
                future: history.future.concat(entry),
                maxDepth: history.maxDepth,
            };

            setDoc(nextDoc);
            setHistory(nextHistory);
            setSelection(entry.selectionBefore ?? selection);

            persistDoc(nextDoc, nextHistory, scheduleViolationsFromState(getState()));
        },
        redo: () => {
            const {doc, history, dutyValidationInput, selection} = getState();
            const entry = history.future[history.future.length - 1];

            if (!entry) return;

            const nextDoc = entry.tx.ops.reduce((d, op) => applyOperation(d, filterOpAgainstLocks(op, d)), doc);
            const nextPast = history.past.concat(entry);
            const trimmedPast = nextPast.length > history.maxDepth ? nextPast.slice(nextPast.length - history.maxDepth) : nextPast;
            const nextHistory: THistoryState = {
                past: trimmedPast,
                future: history.future.slice(0, -1),
                maxDepth: history.maxDepth,
            };

            setDoc(nextDoc);
            setHistory(nextHistory);
            setSelection(entry.selectionAfter ?? selection);

            persistDoc(nextDoc, nextHistory, scheduleViolationsFromState(getState()));
        },
    };
}
