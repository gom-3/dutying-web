import {type RefObject, useEffect} from 'react';
import {type TFocus} from '@/features/request-shift/model/types';

type TUseRequestCalendarFocusScrollParams = {
    focus: TFocus | null;
    focusedCellRef: RefObject<HTMLElement | null>;
    containerRef: RefObject<HTMLDivElement | null>;
};

export const useRequestCalendarFocusScroll = ({focus, focusedCellRef, containerRef}: TUseRequestCalendarFocusScrollParams) => {
    useEffect(() => {
        if (!focus) return;

        const focusRect = focusedCellRef.current?.getBoundingClientRect();
        const container = containerRef.current;

        if (!focusRect || !container) return;

        if (focusRect.x + focusRect.width - container.offsetLeft > container.clientWidth) {
            container.scroll({
                left: focusRect.left + container.scrollLeft,
            });
        }

        if (focusRect.x - container.offsetLeft < 0) {
            container.scroll({left: 0});
        }

        if (focusRect.y + focusRect.height - container.offsetTop > container.clientHeight) {
            container.scroll({
                top: focusRect.top + container.scrollTop,
            });
        }

        if (focusRect.y - container.offsetTop < 0) {
            container.scroll({top: focusRect.top + window.scrollY - 132});
        }
    }, [containerRef, focus, focusedCellRef]);
};
