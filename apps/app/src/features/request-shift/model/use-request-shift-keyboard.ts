import {useCallback, useEffect} from 'react';
import {events, sendEvent} from '@/analytics';
import {type TRequestShift} from '@/entities/shift';
import {type TFocus} from './types';
import {keydownEventMapper, moveFocus} from './utils';

type TUseRequestShiftKeyboardParams = {
    activeEffect: boolean;
    focus: TFocus | null;
    requestShift: TRequestShift | null | undefined;
    changeFocusedShift: (shiftTypeId: number | null) => void;
    setFocus: (focus: TFocus | null) => void;
};

export const useRequestShiftKeyboard = ({
    activeEffect,
    focus,
    requestShift,
    changeFocusedShift,
    setFocus,
}: TUseRequestShiftKeyboardParams) => {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (['Ctrl', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }

            const ctrlKey = e.ctrlKey || e.metaKey;

            if (!focus || !requestShift) return;

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                moveFocus(
                    e.key.replace('Arrow', '').toLowerCase() as 'left' | 'right' | 'up' | 'down',
                    ctrlKey,
                    requestShift,
                    focus,
                    setFocus,
                );
            }

            keydownEventMapper(
                e,
                ...requestShift.wardShiftTypes.map((shiftType) => ({
                    keys: [shiftType.shortName],
                    callback: () => {
                        changeFocusedShift(shiftType.wardShiftTypeId);
                        moveFocus('right', ctrlKey, requestShift, focus, (nextFocus) => {
                            setFocus(nextFocus);
                            sendEvent(ctrlKey ? events.requestPage.moveCellFocus : events.requestPage.moveCellFocus, e.key);
                        });
                    },
                })),
                {
                    keys: ['Backspace'],
                    callback: () => {
                        changeFocusedShift(null);
                        moveFocus('left', ctrlKey, requestShift, focus, (nextFocus) => {
                            setFocus(nextFocus);
                            sendEvent(ctrlKey ? events.requestPage.moveCellFocus : events.requestPage.moveCellFocus, e.key);
                        });
                    },
                },
                {keys: ['Delete'], callback: () => changeFocusedShift(null)},
            );
        },
        [changeFocusedShift, focus, requestShift, setFocus],
    );

    useEffect(() => {
        if (!activeEffect) return;

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeEffect, handleKeyDown]);
};
