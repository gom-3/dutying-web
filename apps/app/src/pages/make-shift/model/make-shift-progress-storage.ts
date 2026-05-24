import {type TMakeShiftStep} from './make-shift-store';

const LEGACY_DRAFT_STEP_KEY = 'make-shift:draft-step';

export function buildMakeShiftDraftKey(wardId: number, shiftTeamId: number, year: number, month: number): string {
    return `make-shift:draft-step:${wardId}:${shiftTeamId}:${year}:${month}`;
}

export function buildMakeShiftMaxKey(wardId: number, shiftTeamId: number, year: number, month: number): string {
    return `make-shift:max-step:${wardId}:${shiftTeamId}:${year}:${month}`;
}

function parseStep(raw: string | null): TMakeShiftStep | null {
    if (!raw) return null;

    const n = Number(raw);

    return n >= 1 && n <= 6 ? (n as TMakeShiftStep) : null;
}

/** 예전 단일 키에서 읽기 (마이그레이션용). */
export function loadLegacyDraftStep(): TMakeShiftStep | null {
    if (typeof window === 'undefined') return null;

    return parseStep(window.localStorage.getItem(LEGACY_DRAFT_STEP_KEY));
}

export function clearLegacyDraftStep(): void {
    if (typeof window === 'undefined') return;

    window.localStorage.removeItem(LEGACY_DRAFT_STEP_KEY);
}

export function loadDraftStep(wardId: number, shiftTeamId: number, year: number, month: number): TMakeShiftStep | null {
    if (typeof window === 'undefined') return null;

    return parseStep(window.localStorage.getItem(buildMakeShiftDraftKey(wardId, shiftTeamId, year, month)));
}

export function saveDraftStep(wardId: number, shiftTeamId: number, year: number, month: number, step: TMakeShiftStep): void {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(buildMakeShiftDraftKey(wardId, shiftTeamId, year, month), String(step));
}

/**
 * 아직 없으면 1 — 첫 진입 시 1단계만 이동 가능.
 */
export function loadMaxReachedStep(wardId: number, shiftTeamId: number, year: number, month: number): TMakeShiftStep {
    if (typeof window === 'undefined') return 1;

    const v = parseStep(window.localStorage.getItem(buildMakeShiftMaxKey(wardId, shiftTeamId, year, month)));

    return v ?? 1;
}

export function saveMaxReachedStep(wardId: number, shiftTeamId: number, year: number, month: number, step: TMakeShiftStep): void {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(buildMakeShiftMaxKey(wardId, shiftTeamId, year, month), String(step));
}

export function bumpMaxReachedStep(wardId: number, shiftTeamId: number, year: number, month: number, step: TMakeShiftStep): TMakeShiftStep {
    const prev = loadMaxReachedStep(wardId, shiftTeamId, year, month);
    const next = Math.max(prev, step) as TMakeShiftStep;

    saveMaxReachedStep(wardId, shiftTeamId, year, month, next);

    return next;
}

export function clearMakeShiftProgress(wardId: number, shiftTeamId: number, year: number, month: number): void {
    if (typeof window === 'undefined') return;

    window.localStorage.removeItem(buildMakeShiftDraftKey(wardId, shiftTeamId, year, month));
    window.localStorage.removeItem(buildMakeShiftMaxKey(wardId, shiftTeamId, year, month));
}
