import {useQueries} from '@tanstack/react-query';
import {useMemo} from 'react';
import {type TDutyRequest} from '@/entities/shift';
import {type TShiftTeam} from '@/entities/ward';
import {wardQueryKeys} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import {WardAPI} from '@/shared/api';
import {FORCE_MOCK_DUTY_REQUEST_LIST, getMockDutyRequestListByTeamIndex} from './mock';
import {countPendingDutyRequests} from './pending-request-count';
import {useRequestShiftStore} from './store';

export const useTotalPendingRequestCount = (shiftTeams: TShiftTeam[] | undefined) => {
    const {
        state: {wardId},
    } = useAuth();
    const year = useRequestShiftStore((state) => state.year);
    const month = useRequestShiftStore((state) => state.month);
    const teamPendingRequestCountQueries = useQueries({
        queries: (shiftTeams ?? []).map((shiftTeam, teamIndex) => ({
            queryKey: wardQueryKeys.requestList(wardId ?? 0, shiftTeam.shiftTeamId, year, month),
            queryFn: async (): Promise<TDutyRequest[]> =>
                FORCE_MOCK_DUTY_REQUEST_LIST
                    ? getMockDutyRequestListByTeamIndex(teamIndex)
                    : WardAPI.getRequestList(wardId!, shiftTeam.shiftTeamId, year, month),
            enabled: !!wardId,
            select: countPendingDutyRequests,
        })),
    });

    return useMemo(
        () => teamPendingRequestCountQueries.reduce((total, query) => total + (query.data ?? 0), 0),
        [teamPendingRequestCountQueries],
    );
};
