import {type TWorkspaceScheduleResponse} from '@dutying/api/ward';
import {useQuery} from '@tanstack/react-query';
import {useEffect, useMemo, useRef, useState} from 'react';
import {type TShift} from '@/entities';
import {wardQueryOptions} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import {
    buildWardShiftTypeMaps,
    buildWorkKeyMap,
    getShiftEditorDraftStorageKey,
    isDutyShiftFullyAssigned,
    shiftToDoc,
    workspaceCellsToFixedCells,
    type TCellValue,
    type TDutyDoc,
    type TShiftEditorKeyBindingsOptions,
    useShiftEditorCommands,
    useShiftEditorKeyBindings,
    useShiftEditorStore,
    useViolationMap,
} from '@/features/shift-editor';
import WardAPI from '@/shared/api/ward';
import {isMakeShiftTeamReadyForWard, useMakeShiftStore} from '../../../model/make-shift-store';

function isSameDutyDocShape(a: TDutyDoc, b: TDutyDoc): boolean {
    if (a.columns.length !== b.columns.length || a.rows.length !== b.rows.length) return false;

    for (let i = 0; i < a.columns.length; i += 1) {
        if (a.columns[i] !== b.columns[i]) return false;
    }

    for (let i = 0; i < a.rows.length; i += 1) {
        if (a.rows[i]?.workerId !== b.rows[i]?.workerId) return false;
    }

    return true;
}

function getPreviousYearMonth(year: number, month: number): {year: number; month: number} {
    return month === 1 ? {year: year - 1, month: 12} : {year, month: month - 1};
}

function mergeLastCells(persisted: TCellValue[] | undefined, base: TCellValue[] | undefined): TCellValue[] | undefined {
    if (!persisted) return base?.slice();

    if (!base || base.length === 0) return persisted.slice();

    return base.map((_cell, index) => persisted[index] ?? null);
}

function rebasePersistedCell(cell: TCellValue, baseCell: TCellValue, currentShortNames: Set<string>): TCellValue {
    if (cell === null || currentShortNames.has(cell)) return cell;

    return baseCell;
}

function rebaseDocRowsToCurrentShiftTypes(doc: TDutyDoc, baseDoc: TDutyDoc, currentShortNames: Set<string>): TDutyDoc | null {
    let changed = false;

    const rows = doc.rows.map((row, rowIdx) => {
        const baseRow = baseDoc.rows[rowIdx];
        const cells = row.cells.map((cell, colIdx) => {
            const nextCell = rebasePersistedCell(cell, baseRow?.cells[colIdx] ?? null, currentShortNames);

            if (nextCell !== cell) changed = true;

            return nextCell;
        });

        return changed ? {...row, cells} : row;
    });

    if (!changed) return null;

    return {
        ...doc,
        rows,
    };
}

function deriveRequestCells(
    shift: TShift | undefined,
    requestShifts: TWorkspaceScheduleResponse['requestShifts'] | undefined,
): Map<string, string> {
    if (!shift || !requestShifts) return new Map();

    const idToShortName = new Map<number, string>();
    const workerIds = new Set<string>();

    for (const t of shift.wardShiftTypes) {
        idToShortName.set(t.wardShiftTypeId, t.shortName);
    }

    for (const division of shift.divisionShiftNurses) {
        for (const row of division) {
            if (!row.shiftNurse.isWorker) continue;

            workerIds.add(String(row.shiftNurse.shiftNurseId));
        }
    }

    const result = new Map<string, string>();

    for (const requestShift of requestShifts) {
        if (requestShift.isAccepted !== true) continue;

        const workerId = String(requestShift.shiftNurseId);

        if (!workerIds.has(workerId)) continue;

        const shortName = idToShortName.get(requestShift.wardShiftTypeId) ?? requestShift.shiftCode;

        if (shortName) {
            result.set(`${workerId}|${requestShift.date}`, shortName);
        }
    }

    return result;
}

type TUseDutyEditorStepOptions = {
    onContextChanged?: () => void;
    hydratePreviousLastShifts?: boolean;
    editorInputDisabled?: boolean;
    onClearSelectionCells?: TShiftEditorKeyBindingsOptions['onClearSelectionCells'];
};

export function focusEditorWithoutScrolling(editor: HTMLDivElement | null) {
    editor?.focus({preventScroll: true});
}

export function useDutyEditorStep({
    onContextChanged,
    hydratePreviousLastShifts = false,
    editorInputDisabled = false,
    onClearSelectionCells,
}: TUseDutyEditorStepOptions = {}) {
    const {
        state: {wardId},
    } = useAuth();
    const year = useMakeShiftStore((s) => s.year);
    const month = useMakeShiftStore((s) => s.month);
    const currentShiftTeamId = useMakeShiftStore((s) => s.currentShiftTeamId);
    const storeWardId = useMakeShiftStore((s) => s.wardId);
    const shiftTeams = useMakeShiftStore((s) => s.shiftTeams);
    const shiftTeamsStatus = useMakeShiftStore((s) => s.shiftTeamsStatus);
    const enabled = isMakeShiftTeamReadyForWard({wardId: storeWardId, shiftTeams, shiftTeamsStatus}, wardId, currentShiftTeamId);
    const dutyQuery = useQuery({
        ...wardQueryOptions.duty(wardId ?? -1, currentShiftTeamId ?? -1, year, month),
        enabled,
    });
    const workspaceQuery = useQuery({
        queryKey: ['ward', wardId, 'shift-team', currentShiftTeamId, 'schedule-workspace', year, month],
        queryFn: () => WardAPI.getWorkspaceSchedule(wardId ?? -1, currentShiftTeamId ?? -1, year, month),
        enabled,
    });
    const previousYearMonth = useMemo(() => getPreviousYearMonth(year, month), [year, month]);
    const previousDutyQuery = useQuery({
        ...wardQueryOptions.duty(wardId ?? -1, currentShiftTeamId ?? -1, previousYearMonth.year, previousYearMonth.month),
        enabled: enabled && hydratePreviousLastShifts,
    });
    const previousConfirmedShift =
        hydratePreviousLastShifts && previousDutyQuery.data && isDutyShiftFullyAssigned(previousDutyQuery.data)
            ? previousDutyQuery.data
            : null;
    const setRulesHash = useShiftEditorStore((s) => s.setRulesHash);
    const editorDoc = useShiftEditorStore((s) => s.doc);
    const commands = useShiftEditorCommands();
    const editorRef = useRef<HTMLDivElement>(null);
    const workKeyMap = useMemo(() => buildWorkKeyMap(dutyQuery.data), [dutyQuery.data]);
    const {onKeyDown, onPasteCapture} = useShiftEditorKeyBindings({
        workKeyMap,
        disabled: editorInputDisabled,
        onClearSelectionCells,
    });
    const {violationMap, teamViolations} = useViolationMap(editorDoc);
    const hydratedContextKeyRef = useRef<string | null>(null);
    const initialHydrationDoneRef = useRef(false);
    const lastHydratedDutyDataRef = useRef<typeof dutyQuery.data | null>(null);
    const hydratedDraftRevisionRef = useRef<number | null>(null);
    const currentContextKey = `${wardId ?? 'none'}:${currentShiftTeamId ?? 'none'}:${year}:${month}`;
    const [hydratedEditorContextKey, setHydratedEditorContextKey] = useState<string | null>(null);
    const isHydratingLastShifts = hydratePreviousLastShifts && previousDutyQuery.isLoading;
    const isHydratingWorkspace = enabled && workspaceQuery.isLoading && workspaceQuery.data === undefined;
    const isWaitingForEditorSources = isHydratingLastShifts || isHydratingWorkspace;
    const isAwaitingEditorHydration =
        enabled && dutyQuery.data !== undefined && !isWaitingForEditorSources && hydratedEditorContextKey !== currentContextKey;
    const isHydratingEditor = isWaitingForEditorSources || isAwaitingEditorHydration;

    useEffect(() => {
        if (workspaceQuery.data?.rulesHash) {
            setRulesHash(workspaceQuery.data.rulesHash);
        }
    }, [workspaceQuery.data?.rulesHash, setRulesHash]);

    useEffect(() => {
        if (!dutyQuery.data || wardId === null || currentShiftTeamId === null || isWaitingForEditorSources) return;

        const nextPersistenceKey = getShiftEditorDraftStorageKey({wardId, shiftTeamId: currentShiftTeamId, year, month});
        const currentPersistenceKey = commands.getCurrentPersistenceKey();

        if (currentPersistenceKey !== nextPersistenceKey) {
            commands.setPersistenceKey(nextPersistenceKey);
        }

        const hasContextChanged = hydratedContextKeyRef.current !== currentContextKey;
        const hasDutyDataChanged = lastHydratedDutyDataRef.current !== dutyQuery.data;
        const isStoreEmpty = editorDoc.columns.length === 0;
        const hasLocalChangesSinceHydration =
            !hasContextChanged &&
            initialHydrationDoneRef.current &&
            hydratedDraftRevisionRef.current !== null &&
            useShiftEditorStore.getState().draftRevision > hydratedDraftRevisionRef.current;
        const baseDoc = shiftToDoc(dutyQuery.data, year, month, {previousConfirmedShift});
        const currentShortNames = new Set(buildWardShiftTypeMaps(dutyQuery.data).shortNameToType.keys());

        if (!hasContextChanged && hasDutyDataChanged && hasLocalChangesSinceHydration && !isStoreEmpty) {
            const rebasedDoc = rebaseDocRowsToCurrentShiftTypes(editorDoc, baseDoc, currentShortNames);

            if (rebasedDoc) {
                commands.hydrate({
                    doc: rebasedDoc,
                    history: JSON.stringify(useShiftEditorStore.getState().history),
                    scheduleViolations: {validationSnapshot: null},
                    savedAt: Date.now(),
                });
                commands.persistImmediate();
            }

            lastHydratedDutyDataRef.current = dutyQuery.data;
            setHydratedEditorContextKey(currentContextKey);

            return;
        }

        if (!hasContextChanged && !hasDutyDataChanged && !isStoreEmpty && initialHydrationDoneRef.current) {
            setHydratedEditorContextKey(currentContextKey);

            return;
        }

        const workspaceFixedCells = workspaceQuery.data ? workspaceCellsToFixedCells(workspaceQuery.data.wardShiftBase) : {};
        const requestValueMap = deriveRequestCells(dutyQuery.data, workspaceQuery.data?.requestShifts);
        const requestCells: Record<string, true> = {};

        for (const [key, value] of requestValueMap.entries()) {
            requestCells[key] = true;

            const [workerId, date] = key.split('|');
            const row = baseDoc.rows.find((r) => r.workerId === workerId);
            const colIdx = baseDoc.columns.indexOf(date!);

            if (row && colIdx !== -1 && row.cells[colIdx] === null) {
                row.cells[colIdx] = value;
            }
        }

        const nextDoc: TDutyDoc = {...baseDoc, fixedCells: {...workspaceFixedCells}, requestCells};
        const persisted = commands.getPersisted();

        if (persisted && isSameDutyDocShape(persisted.doc, nextDoc)) {
            const mergedRows = persisted.doc.rows.map((row, rowIdx) => {
                const baseRow = baseDoc.rows[rowIdx];

                return {
                    ...row,
                    lastCells: mergeLastCells(row.lastCells, baseRow?.lastCells),
                    cells: row.cells.map((cell, colIdx) => {
                        const date = persisted.doc.columns[colIdx];

                        if (!date) return cell;

                        const key = `${row.workerId}|${date}`;
                        const requestValue = requestValueMap.get(key);

                        if (requestValue !== undefined) return requestValue;

                        if (persisted.doc.requestCells[key] === true && !requestCells[key]) {
                            return baseRow?.cells[colIdx] ?? null;
                        }

                        return rebasePersistedCell(cell, baseRow?.cells[colIdx] ?? null, currentShortNames);
                    }),
                };
            });

            commands.hydrate({
                ...persisted,
                doc: {
                    ...persisted.doc,
                    rows: mergedRows,
                    fixedCells: persisted.doc.fixedCells ?? {},
                    requestCells,
                },
            });

            commands.persistImmediate();
        } else {
            commands.init(nextDoc);
        }

        if (workspaceQuery.data?.rulesHash) {
            setRulesHash(workspaceQuery.data.rulesHash);
        }

        if (hasContextChanged) onContextChanged?.();

        hydratedContextKeyRef.current = currentContextKey;
        lastHydratedDutyDataRef.current = dutyQuery.data;
        initialHydrationDoneRef.current = true;
        hydratedDraftRevisionRef.current = useShiftEditorStore.getState().draftRevision;
        setHydratedEditorContextKey(currentContextKey);
    }, [
        commands,
        currentContextKey,
        currentShiftTeamId,
        dutyQuery.data,
        workspaceQuery.data,
        isWaitingForEditorSources,
        month,
        onContextChanged,
        previousConfirmedShift,
        setRulesHash,
        wardId,
        year,
        editorDoc.columns.length,
    ]);

    const focusEditor = () => {
        focusEditorWithoutScrolling(editorRef.current);
    };

    return {
        dutyQuery,
        editorDoc,
        editorRef,
        onKeyDown,
        onPasteCapture,
        violationMap,
        teamViolations,
        focusEditor,
        isHydratingLastShifts,
        isHydratingEditor,
    };
}
