export type TTutorialDismissKind = 'make' | 'request' | 'member';

const STORAGE_VERSION = 1;
const PREFIX = 'dutying.tutorial.dismissed';

function storageKey(kind: TTutorialDismissKind, accountId: number): string {
    return `${PREFIX}.${kind}.v${STORAGE_VERSION}.${accountId}`;
}

export function isTutorialDismissedForAccount(kind: TTutorialDismissKind, accountId: number): boolean {
    try {
        return globalThis.localStorage?.getItem(storageKey(kind, accountId)) === '1';
    } catch {
        return false;
    }
}

export function setTutorialDismissedForAccount(kind: TTutorialDismissKind, accountId: number): void {
    try {
        globalThis.localStorage?.setItem(storageKey(kind, accountId), '1');
    } catch {
        // 비공개 모드, 저장소 거부 등 — 튜토리얼만 스킵 불가할 수 있음
    }
}
