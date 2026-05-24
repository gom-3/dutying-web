import {koToEn} from '@dutying/utils/ko-to-en';
import {useCallback, useMemo} from 'react';
import {useShiftEditorStore} from './store';
import type {TClipboardPayload, TWorkKeyMap} from './types';
import {useShiftEditorCommands} from './use-shift-editor-commands';

export type TShiftEditorKeyBindingsOptions = {
    /**
     * 사용자별 근무 키 매핑 주입.
     * 예) { d: "D", e: "E", n: "N", o: "O" }
     */
    workKeyMap?: TWorkKeyMap;
    /**
     * ctrl/cmd 없이도 x/c/v로 잘라내기/복사/붙여넣기 허용 여부.
     * 기본은 false (근무키 입력과 충돌 방지).
     */
    allowUnmodifiedClipboardShortcuts?: boolean;
    /**
     * 기본 바인딩보다 먼저 실행되는 커스텀 핸들러.
     * true를 리턴하면 이벤트를 소비(handled)한 것으로 간주.
     */
    beforeHandlers?: Array<(e: KeyboardEvent) => boolean>;
};

function isMetaOrCtrl(e: KeyboardEvent): boolean {
    return e.metaKey || e.ctrlKey;
}

function normalizeKey(key: string): string {
    // 한글 IME 입력도 영문 키로 normalize (예: 'ㅇ' -> 'd')
    const normalized = key.length === 1 ? koToEn(key) : key;

    return normalized.length === 1 ? normalized.toLowerCase() : normalized;
}

function toDirection(key: string): 'left' | 'right' | 'up' | 'down' | null {
    switch (key) {
        case 'ArrowLeft':
            return 'left';
        case 'ArrowRight':
            return 'right';
        case 'ArrowUp':
            return 'up';
        case 'ArrowDown':
            return 'down';
        default:
            return null;
    }
}

function payloadToTSV(payload: TClipboardPayload): string {
    return payload.cells.map((row) => row.map((v) => v ?? '').join('\t')).join('\n');
}

function tsvToPayload(text: string): TClipboardPayload {
    const rows = text
        .replace(/\r/g, '')
        .split('\n')
        .filter((x) => x.length > 0)
        .map((line) => line.split('\t').map((cell) => cell.trim()));
    const height = rows.length;
    const width = Math.max(0, ...rows.map((r) => r.length));
    const cells = rows.map((r) => {
        const row: (string | null)[] = [];

        for (let i = 0; i < width; i++) {
            const raw = r[i];
            row.push(raw !== undefined && raw !== '' ? raw : null);
        }

        return row;
    });

    return {width, height, cells};
}

export function useShiftEditorKeyBindings(opts: TShiftEditorKeyBindingsOptions = {}) {
    const commands = useShiftEditorCommands();
    const doc = useShiftEditorStore((s) => s.doc);
    const workKeyMap = useMemo(() => {
        const map: TWorkKeyMap = opts.workKeyMap ?? {d: 'D', e: 'E', n: 'N', o: 'O'};
        // normalize keys once
        const normalized: TWorkKeyMap = {};

        for (const [k, v] of Object.entries(map)) normalized[k.toLowerCase()] = v;

        return normalized;
    }, [opts.workKeyMap]);
    const allowUnmodifiedClipboardShortcuts = opts.allowUnmodifiedClipboardShortcuts ?? false;
    const beforeHandlers = opts.beforeHandlers ?? [];
    const onKeyDown = useCallback(
        async (e: React.KeyboardEvent) => {
            // react 이벤트 -> native로 변환해서 공통 로직 사용
            const native = e.nativeEvent as KeyboardEvent;

            for (const handler of beforeHandlers) {
                if (handler(native)) {
                    e.preventDefault();

                    return;
                }
            }

            const key = normalizeKey(native.key);
            const dir = toDirection(native.key);
            const mod = isMetaOrCtrl(native);

            // Tab: 엑셀처럼 오른쪽 셀(Shift+Tab은 왼쪽)
            if (native.key === 'Tab') {
                e.preventDefault();
                commands.moveSelection(native.shiftKey ? 'left' : 'right', false, false);

                return;
            }

            // 방향키 이동 / Shift+방향키 범위 / Ctrl(Cmd)+방향키 끝까지
            if (dir) {
                e.preventDefault();
                commands.moveSelection(dir, native.shiftKey, mod);

                return;
            }

            // 전체 선택
            if (mod && key === 'a') {
                e.preventDefault();
                commands.selectAll();

                return;
            }

            // undo / redo
            if (mod && key === 'z') {
                e.preventDefault();

                if (native.shiftKey) commands.redo();
                else commands.undo();

                return;
            }

            if (mod && key === 'y') {
                e.preventDefault();
                commands.redo();

                return;
            }

            // delete/backspace -> 선택 지우기
            if (key === 'Backspace' || key === 'Delete') {
                e.preventDefault();
                commands.clearSelectionCells();

                return;
            }

            // clipboard: 복사/잘라내기만 키다운에서 처리. 붙여넣기는 onPaste(clipboardData)만 사용한다.
            // (readText는 권한/HTTP 컨텍스트에 따라 실패해 일부 칸만 반영되는 증상이 난다.)
            const allowPlain = allowUnmodifiedClipboardShortcuts && !native.altKey && !native.shiftKey && !mod;
            const usePlainCopyCut = allowPlain && (key === 'c' || key === 'x');
            const useModCopyCut = mod && (key === 'c' || key === 'x');

            if (useModCopyCut || usePlainCopyCut) {
                if (key === 'c') {
                    e.preventDefault();

                    const payload = commands.copy();

                    if (!payload) return;

                    const text = payloadToTSV(payload);

                    try {
                        await navigator.clipboard.writeText(text);
                    } catch {
                        // 권한/HTTPS 이슈 시 무시 (onCopy 이벤트 기반으로 개선 가능)
                    }

                    return;
                }

                if (key === 'x') {
                    e.preventDefault();

                    const payload = commands.copy();

                    if (!payload) return;

                    const text = payloadToTSV(payload);

                    try {
                        await navigator.clipboard.writeText(text);
                    } catch {
                        // ignore
                    }

                    commands.clearSelectionCells();

                    return;
                }
            }

            if (allowPlain && key === 'v') {
                // 수정 없이 v만 허용할 때는 붙여넣기를 onPaste에 맡김
                return;
            }

            // 사용자 근무 키 입력 (modifier 없이)
            if (!mod && !native.altKey && !native.shiftKey && key.length === 1) {
                const value = workKeyMap[key];

                if (value !== undefined) {
                    e.preventDefault();
                    const selBefore = useShiftEditorStore.getState().selection;

                    commands.setSelectionValue(value);

                    // 단일 셀: 엑셀처럼 입력 후 오른쪽 칸으로 이동
                    if (selBefore?.type === 'single') {
                        commands.moveSelection('right', false, false);
                    }
                }
            }

            // eslint용: doc 참조 (keybinding은 bounds가 필요할 때 확장 대비)
            void doc;
        },
        [allowUnmodifiedClipboardShortcuts, beforeHandlers, commands, doc, workKeyMap],
    );
    const onPaste = useCallback(
        (e: React.ClipboardEvent) => {
            const text = e.clipboardData.getData('text');

            if (!text) return;

            e.preventDefault();
            commands.paste(tsvToPayload(text));
        },
        [commands],
    );

    /** 포커스가 에디터 자식(일자 셀 버튼 등)에 있어도 먼저 가로채기 위해 컨테이너에 연결한다. */
    const onPasteCapture = onPaste;

    return {onKeyDown, onPaste, onPasteCapture};
}
