const STORAGE_KEY = 'preferredShiftTeamId';

export function setPreferredShiftTeamId(shiftTeamId: number) {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(STORAGE_KEY, String(shiftTeamId));
}

export function getPreferredShiftTeamId(): number | null {
    if (typeof window === 'undefined') return null;

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const parsed = Number(raw);

    return Number.isFinite(parsed) ? parsed : null;
}
