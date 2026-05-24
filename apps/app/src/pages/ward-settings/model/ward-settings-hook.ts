import {type TCreateShiftTypeDTO} from '@dutying/api/ward';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {type TShiftTeam, type TWardShiftType} from '@/entities/ward';
import {wardQueryKeys, wardQueryOptions} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import {WardAPI} from '@/shared/api';
import {showActionErrorFeedback} from '@/shared/util/feedback';

export type TWardSettingsTab = 'shiftTypes' | 'constraints';
type TQueryStatus = 'idle' | 'pending' | 'error' | 'success';

function normalizeShiftTypes(input: unknown): TWardShiftType[] {
    if (Array.isArray(input)) return input as TWardShiftType[];

    if (input && typeof input === 'object') {
        const maybe = input as {shiftTypes?: unknown; wardShiftTypes?: unknown};

        if (Array.isArray(maybe.shiftTypes)) return maybe.shiftTypes as TWardShiftType[];
        if (Array.isArray(maybe.wardShiftTypes)) return maybe.wardShiftTypes as TWardShiftType[];
    }

    return [];
}

export function useWardSettings() {
    const {
        state: {wardId},
    } = useAuth();
    const queryClient = useQueryClient();
    const [currentTab, setCurrentTab] = useState<TWardSettingsTab>('shiftTypes');
    const [currentShiftTeamId, setCurrentShiftTeamId] = useState<number | null>(null);
    const shiftTypesQuery = useQuery({
        ...wardQueryOptions.shiftTypes(wardId ?? -1),
        enabled: wardId !== null,
        staleTime: 1000 * 60 * 5,
    });
    const shiftTeamsQuery = useQuery({
        ...wardQueryOptions.shiftTeams(wardId ?? -1),
        enabled: wardId !== null,
        staleTime: 1000 * 60 * 5,
    });
    useEffect(() => {
        if (!shiftTeamsQuery.data) {
            setCurrentShiftTeamId(null);

            return;
        }

        setCurrentShiftTeamId((prevShiftTeamId) => {
            if (prevShiftTeamId !== null && shiftTeamsQuery.data.some((team) => team.shiftTeamId === prevShiftTeamId)) {
                return prevShiftTeamId;
            }

            return shiftTeamsQuery.data[0]?.shiftTeamId ?? null;
        });
    }, [shiftTeamsQuery.data]);

    const invalidateShiftTypeQueries = async () => {
        if (!wardId) return;

        await Promise.all([
            queryClient.invalidateQueries({queryKey: wardQueryKeys.shiftTypes(wardId)}),
            queryClient.invalidateQueries({queryKey: wardQueryKeys.id(wardId)}),
            queryClient.invalidateQueries({queryKey: wardQueryKeys.shift()}),
        ]);
    };
    const addShiftType = async (payload: TCreateShiftTypeDTO) => {
        if (!wardId) return;

        try {
            await WardAPI.createShiftType(wardId, payload);
            await invalidateShiftTypeQueries();
        } catch (error) {
            showActionErrorFeedback(error, '근무 유형을 추가하지 못했어요.');
        }
    };
    const updateShiftType = async (shiftTypeId: number, payload: TCreateShiftTypeDTO) => {
        if (!wardId) return;

        try {
            await WardAPI.updateShiftType(wardId, shiftTypeId, payload);
            await invalidateShiftTypeQueries();
        } catch (error) {
            showActionErrorFeedback(error, '근무 유형을 수정하지 못했어요.');
        }
    };
    const deleteShiftType = async (shiftTypeId: number) => {
        if (!wardId) return;

        try {
            const latest = await shiftTypesQuery.refetch();
            const latestShiftTypes = normalizeShiftTypes(latest.data);
            const exists = latestShiftTypes.some((shiftType) => shiftType.wardShiftTypeId === shiftTypeId);

            if (!exists) {
                showActionErrorFeedback(new Error('shift type not found'), '이미 삭제했거나 최신 목록에서 찾을 수 없는 근무 유형이에요.');
                return;
            }

            await WardAPI.deleteShiftType(wardId, shiftTypeId);
            await invalidateShiftTypeQueries();
        } catch (error) {
            await shiftTypesQuery.refetch();
            showActionErrorFeedback(error, '근무 유형을 삭제하지 못했어요.');
        }
    };
    const retryShiftTypes = async () => {
        await shiftTypesQuery.refetch();
    };
    const retryShiftTeams = async () => {
        await shiftTeamsQuery.refetch();
    };
    const selectTab = (tab: TWardSettingsTab) => {
        setCurrentTab(tab);
        if (tab === 'shiftTypes') {
            void shiftTypesQuery.refetch();
        }
    };
    const shiftTypesStatus: TQueryStatus = shiftTypesQuery.isPending ? 'pending' : shiftTypesQuery.isError ? 'error' : 'success';
    const shiftTeamsStatus: TQueryStatus = shiftTeamsQuery.isPending ? 'pending' : shiftTeamsQuery.isError ? 'error' : 'success';

    return {
        state: {
            wardId,
            currentTab,
            shiftTypes: normalizeShiftTypes(shiftTypesQuery.data),
            shiftTypesStatus,
            shiftTeams: shiftTeamsQuery.data ?? [],
            shiftTeamsStatus,
            currentShiftTeamId,
        },
        actions: {
            selectTab,
            selectShiftTeam: setCurrentShiftTeamId,
            addShiftType,
            updateShiftType,
            deleteShiftType,
            retryShiftTypes,
            retryShiftTeams,
        },
    };
}

export type TWardSettingsState = ReturnType<typeof useWardSettings>['state'];
export type TWardSettingsActions = ReturnType<typeof useWardSettings>['actions'];
export type TWardSettingsShiftType = TWardShiftType;
export type TWardSettingsShiftTeam = TShiftTeam;
