import {migratePersistedViolations} from './schedule-violations';
import type {TScheduleViolationPersisted} from './schedule-violations';
import type {TDutyDoc, THistoryState, TPersisted} from './types';

export type TDraftSaveStatus = 'idle' | 'saving' | 'saved';

export type TShiftEditorPersistence = {
    readonly storageKey: string;
    saveDebounceMs: number;
    save: (doc: TDutyDoc, history: THistoryState, scheduleViolations?: TScheduleViolationPersisted) => void;
    saveImmediate: (doc: TDutyDoc, history: THistoryState, scheduleViolations?: TScheduleViolationPersisted) => void;
    load: () => TPersisted | null;
    clear: () => void;
    setStorageKey: (key: string) => void;
    dispose: () => void;
};

function serializeHistory(history: THistoryState): string {
    return JSON.stringify(history);
}

function deserializeHistory(raw: string): THistoryState | null {
    try {
        return JSON.parse(raw) as THistoryState;
    } catch {
        return null;
    }
}

const emptyScheduleViolations: TScheduleViolationPersisted = {validationSnapshot: null};

export function createShiftEditorPersistence(opts: {
    storageKey: string;
    saveDebounceMs?: number;
    onStatusChange?: (status: TDraftSaveStatus) => void;
}): TShiftEditorPersistence {
    const {saveDebounceMs = 1500, onStatusChange} = opts;

    let currentKey = opts.storageKey;
    let timer: number | null = null;
    let pending: {doc: TDutyDoc; history: THistoryState; scheduleViolations: TScheduleViolationPersisted; key: string} | null = null;

    const emitStatus = (status: TDraftSaveStatus) => {
        onStatusChange?.(status);
    };

    const saveNow = (doc: TDutyDoc, history: THistoryState, scheduleViolations: TScheduleViolationPersisted, key: string) => {
        const persisted: TPersisted = {
            doc,
            history: serializeHistory(history),
            scheduleViolations,
            savedAt: Date.now(),
        };

        window.localStorage.setItem(key, JSON.stringify(persisted));
    };

    const cancelTimer = () => {
        if (timer !== null) {
            window.clearTimeout(timer);
            timer = null;
        }
    };

    const flushPending = () => {
        cancelTimer();

        if (pending) {
            saveNow(pending.doc, pending.history, pending.scheduleViolations, pending.key);
            pending = null;
            emitStatus('saved');
        }
    };

    return {
        get storageKey() {
            return currentKey;
        },
        saveDebounceMs,
        save: (doc, history, scheduleViolations = emptyScheduleViolations) => {
            pending = {doc, history, scheduleViolations, key: currentKey};
            cancelTimer();
            emitStatus('saving');

            timer = window.setTimeout(() => {
                if (pending) saveNow(pending.doc, pending.history, pending.scheduleViolations, pending.key);

                pending = null;
                timer = null;
                emitStatus('saved');
            }, saveDebounceMs);
        },
        saveImmediate: (doc, history, scheduleViolations = emptyScheduleViolations) => {
            cancelTimer();
            pending = null;
            saveNow(doc, history, scheduleViolations, currentKey);
            emitStatus('saved');
        },
        load: () => {
            const raw = window.localStorage.getItem(currentKey);

            if (!raw) return null;

            try {
                const parsed = JSON.parse(raw) as TPersisted;

                if (!parsed || typeof parsed !== 'object') return null;

                if (typeof parsed.history !== 'string') return null;

                const hist = deserializeHistory(parsed.history);

                if (!hist) return null;

                if (!parsed.doc || typeof parsed.doc !== 'object') return null;

                const scheduleViolations = migratePersistedViolations(parsed);

                return {
                    ...parsed,
                    doc: {
                        ...parsed.doc,
                        fixedCells: parsed.doc.fixedCells ?? {},
                        requestCells: parsed.doc.requestCells ?? {},
                    },
                    scheduleViolations,
                };
            } catch {
                return null;
            }
        },
        clear: () => {
            cancelTimer();
            pending = null;
            window.localStorage.removeItem(currentKey);
            emitStatus('idle');
        },
        setStorageKey: (nextKey) => {
            if (nextKey === currentKey) return;

            flushPending();
            currentKey = nextKey;
        },
        dispose: () => {
            cancelTimer();
            pending = null;
        },
    };
}
