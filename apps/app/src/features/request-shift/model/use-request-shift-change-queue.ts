import {type QueryClient} from '@tanstack/react-query';
import {produce} from 'immer';
import {useCallback, useEffect, useRef} from 'react';
import {events, sendEvent} from '@/analytics';
import {type TRequestShift} from '@/entities/shift';
import {type TWardShiftType} from '@/entities/ward';
import {wardQueryKeys} from '@/entities/ward/model/queries';
import {WardAPI} from '@/shared/api';
import {getRequestShiftChangeEventMessage, getRequestShiftTypeIdAtFocus} from './request-shift';
import {type TFocus} from './types';

type TChangeStatus = 'idle' | 'loading' | 'success' | 'error';

type TUseRequestShiftChangeQueueParams = {
    wardId: number | null;
    year: number;
    month: number;
    requestShiftQueryKey: readonly unknown[];
    wardShiftTypeMap: Map<number, TWardShiftType> | null;
    queryClient: QueryClient;
    setChangeStatus: (status: TChangeStatus) => void;
};

const CHANGE_STATUS_RESET_DELAY = 2400;

export const useRequestShiftChangeQueue = ({
    wardId,
    year,
    month,
    requestShiftQueryKey,
    wardShiftTypeMap,
    queryClient,
    setChangeStatus,
}: TUseRequestShiftChangeQueueParams) => {
    const changeStatusResetTimerRef = useRef<number | null>(null);
    const requestShiftChangeQueueRef = useRef<Array<{focus: TFocus; shiftTypeId: number | null}>>([]);
    const isProcessingRequestShiftQueueRef = useRef(false);
    const clearChangeStatusResetTimer = useCallback(() => {
        if (changeStatusResetTimerRef.current !== null) {
            window.clearTimeout(changeStatusResetTimerRef.current);
            changeStatusResetTimerRef.current = null;
        }
    }, []);
    const setChangeStatusWithAutoReset = useCallback(
        (status: TChangeStatus) => {
            clearChangeStatusResetTimer();
            setChangeStatus(status);

            if (status === 'loading' || status === 'idle') return;

            changeStatusResetTimerRef.current = window.setTimeout(() => {
                setChangeStatus('idle');
                changeStatusResetTimerRef.current = null;
            }, CHANGE_STATUS_RESET_DELAY);
        },
        [clearChangeStatusResetTimer, setChangeStatus],
    );
    const applyRequestShiftChangeToCache = useCallback(
        (focus: TFocus, shiftTypeId: number | null) => {
            const currentShift = queryClient.getQueryData<TRequestShift>(requestShiftQueryKey);

            if (!currentShift) return;

            const currentShiftTypeId = getRequestShiftTypeIdAtFocus(currentShift, focus);

            if (currentShiftTypeId === undefined || currentShiftTypeId === shiftTypeId) return;

            if (wardShiftTypeMap) {
                sendEvent(
                    events.requestPage.changeShift,
                    getRequestShiftChangeEventMessage({
                        focus,
                        prevShiftType: currentShiftTypeId ? (wardShiftTypeMap.get(currentShiftTypeId) ?? null) : null,
                        nextShiftType: shiftTypeId ? (wardShiftTypeMap.get(shiftTypeId) ?? null) : null,
                    }),
                );
            }

            queryClient.setQueryData<TRequestShift>(
                requestShiftQueryKey,
                produce(currentShift, (draft) => {
                    const row = draft.divisionShiftNurses
                        .flatMap((division) => division)
                        .find((draftRow) => draftRow.shiftNurse.shiftNurseId === focus.shiftNurseId);

                    if (!row) return;

                    row.wardReqShiftList[focus.day] = shiftTypeId;
                }),
            );
        },
        [queryClient, requestShiftQueryKey, wardShiftTypeMap],
    );
    const flushRequestShiftChangeQueue = useCallback(async () => {
        if (isProcessingRequestShiftQueueRef.current || !wardId) return;

        isProcessingRequestShiftQueueRef.current = true;
        setChangeStatusWithAutoReset('loading');

        let hasError = false;

        while (requestShiftChangeQueueRef.current.length > 0) {
            const nextChange = requestShiftChangeQueueRef.current.shift();

            if (!nextChange) continue;

            try {
                await WardAPI.updateReqShift(
                    wardId,
                    year,
                    month,
                    nextChange.focus.day + 1,
                    nextChange.focus.shiftNurseId,
                    nextChange.shiftTypeId,
                );
            } catch {
                hasError = true;
            }
        }

        await queryClient.invalidateQueries({queryKey: [...wardQueryKeys.all(), 'duty', wardId]});

        if (hasError) {
            await queryClient.invalidateQueries({queryKey: requestShiftQueryKey});
            setChangeStatusWithAutoReset('error');
        } else {
            setChangeStatusWithAutoReset('success');
        }

        isProcessingRequestShiftQueueRef.current = false;

        if (requestShiftChangeQueueRef.current.length > 0) {
            void flushRequestShiftChangeQueue();
        }
    }, [month, queryClient, requestShiftQueryKey, setChangeStatusWithAutoReset, wardId, year]);
    const changeRequestShift = useCallback(
        async (focus: TFocus, shiftTypeId: number | null) => {
            if (!wardId) return;

            await queryClient.cancelQueries({queryKey: requestShiftQueryKey});
            applyRequestShiftChangeToCache(focus, shiftTypeId);
            requestShiftChangeQueueRef.current.push({focus, shiftTypeId});

            void flushRequestShiftChangeQueue();
        },
        [applyRequestShiftChangeToCache, flushRequestShiftChangeQueue, queryClient, requestShiftQueryKey, wardId],
    );

    useEffect(
        () => () => {
            clearChangeStatusResetTimer();
        },
        [clearChangeStatusResetTimer],
    );

    return {
        changeRequestShift,
    };
};
