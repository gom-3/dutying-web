import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useCallback, useEffect} from 'react';
import {type TRequestShift} from '@/entities/shift';
import {type TShiftTeam} from '@/entities/ward';
import {wardQueryOptions} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import useAuthStore from '@/features/auth/model/store';
import {WardAPI} from '@/shared/api';
import {showActionErrorFeedback, showValidationFeedback} from '@/shared/util/feedback';
import {
    findDutyRequestByFocus,
    getAdjacentRequestShiftDate,
    getRequestShiftBootstrapStatus,
    getRequestShiftMonthChangeDecision,
    getRequestShiftTypeIdAtFocus,
    shouldApplyRequestShiftResponseToStore,
    shouldApplyShiftTeamsResponseToStore,
} from './model/request-shift';
import {useRequestShiftStore} from './model/store';
import {type TFocus} from './model/types';
import {useRequestShiftChangeQueue} from './model/use-request-shift-change-queue';
import {useRequestShiftKeyboard} from './model/use-request-shift-keyboard';
import {getRequestShiftEditAvailability} from './model/utils';

const useRequestShift = (activeEffect = false) => {
    const {
        year,
        month,
        focus,
        foldedLevels,
        currentShiftTeamId,
        wardShiftTypeMap,
        readonly,
        changeStatus,
        updatingRequestId,
        syncShiftTeams,
        loadRequestShift,
        setCalendarDate,
        selectFocus,
        toggleFoldedLevel,
        enterEditMode,
        enterReadonlyMode,
        selectShiftTeam,
        startRequestChange,
        completeRequestChange,
        resetRequestChangeStatus,
        startRequestDecision,
        finishRequestDecision,
    } = useRequestShiftStore();
    const {
        state: {wardId, isAuth, _loaded, accountMeStatus},
        actions: {handleGetAccountMe},
    } = useAuth();
    const queryClient = useQueryClient();
    const shiftTeamsQueryOptions = wardQueryOptions.shiftTeams(wardId ?? 0);
    const requestListQueryOptions = wardQueryOptions.requestList(wardId ?? 0, currentShiftTeamId ?? 0, year, month);
    const requestShiftQueryOptions = wardQueryOptions.request(wardId ?? 0, currentShiftTeamId ?? 0, year, month);
    const wardConstraintQueryOptions = wardQueryOptions.constraint(wardId ?? 0, currentShiftTeamId ?? 0);
    const requestShiftQueryKey = requestShiftQueryOptions.queryKey;
    const shiftTeamQueryKey = shiftTeamsQueryOptions.queryKey;
    const wardConstraintQueryKey = wardConstraintQueryOptions.queryKey;
    const dutyRequestQueryKey = requestListQueryOptions.queryKey;
    const editAvailability = getRequestShiftEditAvailability(year, month);
    const bootstrapStatus = getRequestShiftBootstrapStatus({_loaded, isAuth, wardId, accountMeStatus});
    const {
        data: shiftTeams,
        status: shiftTeamsStatus,
        refetch: refetchShiftTeams,
    } = useQuery({
        ...shiftTeamsQueryOptions,
        queryFn: async () => {
            const requestedWardId = wardId!;
            const res = await WardAPI.getShiftTeams(requestedWardId);

            if (
                shouldApplyShiftTeamsResponseToStore({
                    requestedWardId,
                    currentWardId: useAuthStore.getState().wardId,
                })
            ) {
                syncShiftTeams(res);
            }

            return res;
        },
        enabled: !!wardId,
    });
    const {
        data: dutyRequestList,
        status: dutyRequestStatus,
        refetch: refetchDutyRequestList,
    } = useQuery({
        ...requestListQueryOptions,
        enabled: wardId !== null && currentShiftTeamId !== null,
    });
    const {
        data: requestShift,
        status: shiftStatus,
        refetch: refetchRequestShift,
    } = useQuery({
        ...requestShiftQueryOptions,
        queryFn: async (): Promise<TRequestShift> => {
            const requestedWardId = wardId!;
            const requestedShiftTeamId = currentShiftTeamId!;
            const requestedYear = year;
            const requestedMonth = month;
            const res = await WardAPI.getReqShift(requestedWardId, requestedShiftTeamId, requestedYear, requestedMonth);

            if (res === null) return null as unknown as TRequestShift;

            const currentRequestShiftState = useRequestShiftStore.getState();

            if (
                shouldApplyRequestShiftResponseToStore({
                    requestedWardId,
                    requestedShiftTeamId,
                    requestedYear,
                    requestedMonth,
                    currentWardId: useAuthStore.getState().wardId,
                    currentShiftTeamId: currentRequestShiftState.currentShiftTeamId,
                    currentYear: currentRequestShiftState.year,
                    currentMonth: currentRequestShiftState.month,
                })
            ) {
                loadRequestShift(res);
            }

            return res;
        },
        enabled: wardId !== null && currentShiftTeamId !== null,
    });
    const {changeRequestShift} = useRequestShiftChangeQueue({
        wardId,
        year,
        month,
        requestShiftQueryKey,
        wardShiftTypeMap,
        queryClient,
        startRequestChange,
        completeRequestChange,
        resetRequestChangeStatus,
    });
    const acceptRequests = useCallback(
        async (reqShiftIds: number[], isAccepted: boolean | null) => {
            if (!wardId) return false;

            if (reqShiftIds.length === 0 || useRequestShiftStore.getState().updatingRequestId !== null) return false;

            startRequestDecision(reqShiftIds.length === 1 ? reqShiftIds[0] : -1);

            try {
                const results = await Promise.allSettled(
                    reqShiftIds.map((reqShiftId) => WardAPI.acceptRequestShift(wardId, reqShiftId, isAccepted)),
                );
                const rejectedResults = results.filter((result) => result.status === 'rejected');

                if (results.length > 0) {
                    await queryClient.invalidateQueries({queryKey: requestShiftQueryKey});
                    await queryClient.invalidateQueries({queryKey: dutyRequestQueryKey});
                }

                if (rejectedResults.length > 0) {
                    showActionErrorFeedback(rejectedResults[0].reason, '신청 처리에 실패했습니다.');
                }

                return rejectedResults.length === 0;
            } finally {
                finishRequestDecision();
            }
        },
        [dutyRequestQueryKey, finishRequestDecision, queryClient, requestShiftQueryKey, startRequestDecision, wardId],
    );
    const acceptRequest = useCallback(
        async (reqShiftId: number, isAccepted: boolean | null) => {
            return acceptRequests([reqShiftId], isAccepted);
        },
        [acceptRequests],
    );
    const changeMonth = (type: 'prev' | 'next') => {
        const targetDate = getAdjacentRequestShiftDate(year, month, type);
        const decision = getRequestShiftMonthChangeDecision({
            year,
            month,
            type,
            readonly,
            targetAvailability: getRequestShiftEditAvailability(targetDate.year, targetDate.month),
        });

        if (decision.feedbackMessage) {
            showValidationFeedback(decision.feedbackMessage);
        }

        if (decision.shouldEnableReadonly) {
            enterReadonlyMode();
        }

        if (decision.shouldBlock) return false;

        setCalendarDate(decision.year, decision.month);

        return true;
    };
    const changeFocusedShift = useCallback(
        (shiftTypeId: number | null) => {
            if (!wardId || !focus || !requestShift) return;

            if (getRequestShiftTypeIdAtFocus(requestShift, focus) === shiftTypeId) return;

            const requestDutyRequest = findDutyRequestByFocus(dutyRequestList, requestShift, focus);

            if (requestDutyRequest && requestDutyRequest.wardShiftTypeId !== shiftTypeId && !confirm('신청을 거절하시겠습니까?')) return;

            if (requestDutyRequest) {
                void acceptRequest(
                    requestDutyRequest.wardReqShiftId,
                    shiftTypeId === null ? null : requestDutyRequest.wardShiftTypeId === shiftTypeId,
                );
            }

            void changeRequestShift(focus, shiftTypeId);
        },
        [acceptRequest, changeRequestShift, dutyRequestList, focus, requestShift, wardId],
    );
    const foldLevel = (level: number) => {
        if (!requestShift || !foldedLevels) return;

        toggleFoldedLevel(level);
    };

    useRequestShiftKeyboard({
        activeEffect,
        focus,
        requestShift,
        changeFocusedShift,
        setFocus: selectFocus,
    });

    const handleToggleEditMode = (targetDate?: {year: number; month: number}) => {
        const nextEditAvailability = targetDate ? getRequestShiftEditAvailability(targetDate.year, targetDate.month) : editAvailability;

        if (readonly) {
            if (!nextEditAvailability.canEdit && nextEditAvailability.validationMessage) {
                showValidationFeedback(nextEditAvailability.validationMessage);

                return false;
            }

            enterEditMode();

            return true;
        }

        enterReadonlyMode(requestShift);

        return true;
    };
    const handleCreateNextMonthShift = () => {
        const nextMonth = new Date().getMonth() + 2;
        const nextDate =
            nextMonth > 12
                ? {
                      year: year + 1,
                      month: 1,
                  }
                : {
                      year,
                      month: nextMonth,
                  };

        setCalendarDate(nextDate.year, nextDate.month);

        handleToggleEditMode(nextDate);
    };
    const retry = useCallback(async () => {
        if (wardId === null) {
            await handleGetAccountMe().catch(() => undefined);

            return;
        }

        const retryTasks: Promise<unknown>[] = [refetchShiftTeams()];

        if (currentShiftTeamId !== null) {
            retryTasks.push(refetchDutyRequestList(), refetchRequestShift());
        }

        await Promise.all(retryTasks);
    }, [currentShiftTeamId, handleGetAccountMe, refetchDutyRequestList, refetchRequestShift, refetchShiftTeams, wardId]);

    useEffect(() => {
        if (!activeEffect || !requestShift) return;

        window.dispatchEvent(new Event('resize'));
    }, [activeEffect, requestShift]);

    return {
        queryKey: {
            requestShiftQueryKey,
            shiftTeamQueryKey,
            wardConstraintQueryKey,
        },
        state: {
            year,
            month,
            bootstrapStatus,
            requestShift,
            dutyRequestList,
            focus,
            foldedLevels,
            changeStatus,
            shiftStatus,
            shiftTeamsStatus,
            dutyRequestStatus,
            wardShiftTypeMap,
            readonly,
            updatingRequestId,
            currentShiftTeam: shiftTeams?.find((shiftTeam) => shiftTeam.shiftTeamId === currentShiftTeamId) as TShiftTeam | null,
            shiftTeams,
            editAvailability,
        },
        actions: {
            changeRequestShift: (nextFocus: TFocus, shiftTypeId: number | null) => changeRequestShift(nextFocus, shiftTypeId),
            toggleEditMode: handleToggleEditMode,
            createNextMonthShift: handleCreateNextMonthShift,
            acceptRequest: (reqShiftId: number, isAccepted: boolean | null) => acceptRequest(reqShiftId, isAccepted),
            acceptRequests: (reqShiftIds: number[], isAccepted: boolean | null) => acceptRequests(reqShiftIds, isAccepted),
            foldLevel,
            changeMonth,
            retry,
            changeFocus: selectFocus,
            changeShiftTeam: (shiftTeam: TShiftTeam) => {
                if (shiftTeam.shiftTeamId === currentShiftTeamId) return false;

                selectShiftTeam(shiftTeam.shiftTeamId);

                return true;
            },
        },
    };
};

export default useRequestShift;
