import {useQueries, useQuery, useQueryClient} from '@tanstack/react-query';
import {useCallback, useEffect, useMemo} from 'react';
import {type TDutyRequest, type TRequestShift} from '@/entities/shift';
import {type TShiftTeam} from '@/entities/ward';
import {wardQueryKeys, wardQueryOptions} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import {WardAPI} from '@/shared/api';
import {showActionErrorFeedback, showValidationFeedback} from '@/shared/util/feedback';
import {getMockDutyRequestListByTeamIndex, linkMockDutyRequestListToRequestShift, mockDutyRequestList} from './model/mock';
import {
    createInitialFoldedLevels,
    createWardShiftTypeMap,
    findDutyRequestByFocus,
    getAdjacentRequestShiftDate,
    getRequestShiftBootstrapStatus,
    getRequestShiftMonthChangeDecision,
    getRequestShiftTypeIdAtFocus,
    shouldResetFoldedLevelsOnRequestLoad,
    shouldSyncFoldedLevelsLength,
} from './model/request-shift';
import {useRequestShiftStore} from './model/store';
import {type TFocus} from './model/types';
import {useRequestShiftChangeQueue} from './model/use-request-shift-change-queue';
import {useRequestShiftKeyboard} from './model/use-request-shift-keyboard';
import {getRequestShiftEditAvailability} from './model/utils';

const FORCE_MOCK_DUTY_REQUEST_LIST = true;
const useRequestShift = (activeEffect = false) => {
    const {
        year,
        month,
        focus,
        foldedLevels,
        currentShiftTeamId,
        oldCurrentShiftTeamId,
        wardShiftTypeMap,
        readonly,
        changeStatus,
        updatingRequestId,
        setState,
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
            const res = await WardAPI.getShiftTeams(wardId!);

            if (res.length === 0) {
                setState('currentShiftTeamId', null);

                return res;
            }

            if (currentShiftTeamId) {
                if (res.every((shiftTeam) => shiftTeam.shiftTeamId !== currentShiftTeamId)) {
                    setState('currentShiftTeamId', res[0].shiftTeamId);
                }
            } else {
                setState('currentShiftTeamId', res[0].shiftTeamId);
            }

            return res;
        },
        enabled: !!wardId,
    });
    const currentShiftTeamIndex = useMemo(
        () => (shiftTeams ?? []).findIndex((shiftTeam) => shiftTeam.shiftTeamId === currentShiftTeamId),
        [currentShiftTeamId, shiftTeams],
    );
    const teamPendingRequestCountQueries = useQueries({
        queries: (shiftTeams ?? []).map((shiftTeam, teamIndex) => ({
            queryKey: wardQueryKeys.requestList(wardId ?? 0, shiftTeam.shiftTeamId, year, month),
            queryFn: async () =>
                FORCE_MOCK_DUTY_REQUEST_LIST
                    ? getMockDutyRequestListByTeamIndex(teamIndex)
                    : WardAPI.getRequestList(wardId!, shiftTeam.shiftTeamId, year, month),
            enabled: wardId !== null,
            select: (requests: TDutyRequest[]) => requests.filter((request) => request.isAccepted === null).length,
        })),
    });
    const teamPendingRequestCountByTeamId = useMemo(
        () =>
            (shiftTeams ?? []).reduce<Record<number, number>>((acc, shiftTeam, index) => {
                acc[shiftTeam.shiftTeamId] = teamPendingRequestCountQueries[index]?.data ?? 0;

                return acc;
            }, {}),
        [shiftTeams, teamPendingRequestCountQueries],
    );
    const {
        data: dutyRequestList,
        status: dutyRequestStatus,
        refetch: refetchDutyRequestList,
    } = useQuery({
        ...requestListQueryOptions,
        queryFn: async () =>
            FORCE_MOCK_DUTY_REQUEST_LIST
                ? getMockDutyRequestListByTeamIndex(Math.max(currentShiftTeamIndex, 0))
                : WardAPI.getRequestList(wardId!, currentShiftTeamId!, year, month),
        enabled: wardId !== null && currentShiftTeamId !== null,
    });
    const {
        data: requestShift,
        status: shiftStatus,
        refetch: refetchRequestShift,
    } = useQuery({
        ...requestShiftQueryOptions,
        queryFn: async (): Promise<TRequestShift> => {
            const res = await WardAPI.getReqShift(wardId!, currentShiftTeamId!, year, month);

            if (res === null) return null as unknown as TRequestShift;

            if (
                shouldResetFoldedLevelsOnRequestLoad({
                    foldedLevels,
                    previousShiftTeamId: oldCurrentShiftTeamId,
                    currentShiftTeamId,
                })
            ) {
                setState('foldedLevels', createInitialFoldedLevels(res));
                setState('oldCurrentShiftTeamId', currentShiftTeamId);
            }

            return res;
        },
        enabled: wardId !== null && currentShiftTeamId !== null,
    });
    const linkedDutyRequestList = useMemo(
        () => (FORCE_MOCK_DUTY_REQUEST_LIST ? linkMockDutyRequestListToRequestShift(dutyRequestList, requestShift) : dutyRequestList),
        [dutyRequestList, requestShift],
    );
    const {changeRequestShift} = useRequestShiftChangeQueue({
        wardId,
        year,
        month,
        requestShiftQueryKey,
        wardShiftTypeMap,
        queryClient,
        setChangeStatus: (status) => setState('changeStatus', status),
    });
    const acceptRequests = useCallback(
        async (reqShiftIds: number[], isAccepted: boolean | null) => {
            if (!wardId) return false;

            if (reqShiftIds.length === 0 || useRequestShiftStore.getState().updatingRequestId !== null) return false;

            setState('updatingRequestId', reqShiftIds.length === 1 ? reqShiftIds[0] : -1);

            try {
                if (FORCE_MOCK_DUTY_REQUEST_LIST) {
                    queryClient.setQueryData<typeof mockDutyRequestList>(dutyRequestQueryKey, (current) =>
                        (current ?? mockDutyRequestList).map((request) =>
                            reqShiftIds.includes(request.wardReqShiftId) ? {...request, isAccepted} : request,
                        ),
                    );

                    return true;
                }

                const results = await Promise.allSettled(
                    reqShiftIds.map((reqShiftId) => WardAPI.acceptRequestShift(wardId, reqShiftId, isAccepted)),
                );
                const rejectedResults = results.filter((result) => result.status === 'rejected');

                if (results.length > 0) {
                    await queryClient.invalidateQueries({queryKey: requestShiftQueryKey});
                    await queryClient.invalidateQueries({queryKey: dutyRequestQueryKey});
                    await queryClient.invalidateQueries({queryKey: [...wardQueryKeys.all(), 'duty', wardId]});
                }

                if (rejectedResults.length > 0) {
                    showActionErrorFeedback(rejectedResults[0].reason, '신청을 처리하지 못했어요.');
                }

                return rejectedResults.length === 0;
            } finally {
                setState('updatingRequestId', null);
            }
        },
        [dutyRequestQueryKey, queryClient, requestShiftQueryKey, setState, wardId],
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
            setState('readonly', true);
        }

        if (decision.shouldBlock) return false;

        setState('year', decision.year);
        setState('month', decision.month);

        return true;
    };
    const changeFocusedShift = useCallback(
        (shiftTypeId: number | null) => {
            if (!wardId || !focus || !requestShift) return;

            if (getRequestShiftTypeIdAtFocus(requestShift, focus) === shiftTypeId) return;

            const requestDutyRequest = findDutyRequestByFocus(linkedDutyRequestList, requestShift, focus);

            if (requestDutyRequest && requestDutyRequest.wardShiftTypeId !== shiftTypeId && !confirm('신청을 거절할까요?')) return;

            if (requestDutyRequest) {
                void acceptRequest(
                    requestDutyRequest.wardReqShiftId,
                    shiftTypeId === null ? null : requestDutyRequest.wardShiftTypeId === shiftTypeId,
                );
            }

            void changeRequestShift(focus, shiftTypeId);
        },
        [acceptRequest, changeRequestShift, focus, linkedDutyRequestList, requestShift, wardId],
    );
    const foldLevel = (level: number) => {
        if (!requestShift || !foldedLevels) return;

        setState(
            'foldedLevels',
            foldedLevels.map((isFolded, index) => (index === level ? !isFolded : isFolded)),
        );
    };

    useRequestShiftKeyboard({
        activeEffect,
        focus,
        requestShift,
        changeFocusedShift,
        setFocus: (nextFocus) => setState('focus', nextFocus),
    });

    const handleToggleEditMode = (targetDate?: {year: number; month: number}) => {
        const nextEditAvailability = targetDate ? getRequestShiftEditAvailability(targetDate.year, targetDate.month) : editAvailability;

        if (readonly) {
            if (!nextEditAvailability.canEdit && nextEditAvailability.validationMessage) {
                showValidationFeedback(nextEditAvailability.validationMessage);

                return false;
            }

            setState('readonly', false);

            return true;
        }

        setState('readonly', true);
        setState('focus', null);

        if (requestShift) {
            setState('foldedLevels', createInitialFoldedLevels(requestShift));
        }

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

        if (nextMonth > 12) {
            setState('year', year + 1);
            setState('month', 1);
        } else {
            setState('month', nextMonth);
        }

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

        if (
            shouldSyncFoldedLevelsLength({
                foldedLevels,
                requestShift,
            })
        ) {
            setState('foldedLevels', createInitialFoldedLevels(requestShift));
        }

        setState('wardShiftTypeMap', createWardShiftTypeMap(requestShift));
    }, [activeEffect, foldedLevels, requestShift, setState]);

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
            dutyRequestList: linkedDutyRequestList,
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
            teamPendingRequestCountByTeamId,
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
            changeFocus: (nextFocus: TFocus | null) => setState('focus', nextFocus),
            changeShiftTeam: (shiftTeam: TShiftTeam) => {
                if (shiftTeam.shiftTeamId === currentShiftTeamId) return false;

                setState('currentShiftTeamId', shiftTeam.shiftTeamId);

                return true;
            },
        },
    };
};

export default useRequestShift;
