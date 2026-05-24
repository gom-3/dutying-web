import {type TCreateShiftTypeDTO, type TEditWardDTO} from '@dutying/api/ward';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useCallback, useMemo} from 'react';
import toast from 'react-hot-toast';
import {wardQueryKeys, wardQueryOptions} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import {WardAPI} from '@/shared/api';
import {showActionErrorFeedback} from '@/shared/util/feedback';

const useEditWard = () => {
    const {
        state: {wardId},
    } = useAuth();
    const wardQueryKey = wardQueryKeys.id(wardId ?? 0);
    const wardWaitingNursesQueryKey = wardQueryKeys.waitingNurses(wardId ?? 0);
    const wardQueryOptionsValue = wardQueryOptions.id(wardId ?? 0);
    const wardWaitingNursesQueryOptions = wardQueryOptions.waitingNurses(wardId ?? 0);
    const queryClient = useQueryClient();
    const shiftQueryKey = wardQueryKeys.shift();
    const {data: ward} = useQuery({
        ...wardQueryOptionsValue,
        enabled: !!wardId,
    });
    const {data: watingNurses} = useQuery({
        ...wardWaitingNursesQueryOptions,
        enabled: !!wardId,
    });
    const waitingNursesForView = useMemo(() => {
        if (watingNurses?.length) {
            return watingNurses;
        }

        if (!import.meta.env.DEV) {
            return watingNurses;
        }

        return [
            {
                waitingNurseId: 999001,
                nurseId: 999001,
                name: '테스트 간호사',
                gender: '여',
                phoneNum: '01012345678',
                employmentDate: null,
                profileImgUrl: '',
            },
        ];
    }, [watingNurses]);
    const editWardSetting = useCallback(
        async (editWardDTO: TEditWardDTO) => {
            if (!wardId) return;

            try {
                await WardAPI.editWard(wardId, editWardDTO);
                await queryClient.invalidateQueries({queryKey: wardQueryKey});
            } catch (error) {
                showActionErrorFeedback(error, '근무 설정을 수정하지 못했어요.');
            }
        },
        [queryClient, wardId, wardQueryKey],
    );
    const addShiftType = useCallback(
        async (createShiftTypeDTO: TCreateShiftTypeDTO) => {
            if (!wardId) return;

            await WardAPI.createShiftType(wardId, createShiftTypeDTO);
            await queryClient.invalidateQueries({queryKey: wardQueryKey});
        },
        [queryClient, wardId, wardQueryKey],
    );
    const editShiftType = useCallback(
        async (shiftTypeId: number, createShiftTypeDTO: TCreateShiftTypeDTO) => {
            if (!wardId) return;

            await WardAPI.updateShiftType(wardId, shiftTypeId, createShiftTypeDTO);
            await queryClient.invalidateQueries({queryKey: wardQueryKey});
            await queryClient.invalidateQueries({queryKey: shiftQueryKey});
        },
        [queryClient, shiftQueryKey, wardId, wardQueryKey],
    );
    const removeShiftType = useCallback(
        async (shiftTypeId: number) => {
            if (!wardId) return;

            await WardAPI.deleteShiftType(wardId, shiftTypeId);
            await queryClient.invalidateQueries({queryKey: wardQueryKey});
        },
        [queryClient, wardId, wardQueryKey],
    );
    const approveWaitingNurses = useCallback(
        async (waitingNurseId: number, shiftTeamId: number) => {
            if (!wardId) return;

            try {
                await WardAPI.approveWaitingNurses(wardId, waitingNurseId, shiftTeamId);
                await queryClient.invalidateQueries({queryKey: wardQueryKey});
                await queryClient.invalidateQueries({queryKey: wardWaitingNursesQueryKey});

                toast.success('선택한 팀에 간호사를 추가했어요.');

                return true;
            } catch (error) {
                showActionErrorFeedback(error, '팀을 추가하지 못했어요.');

                return false;
            }
        },
        [queryClient, wardId, wardQueryKey, wardWaitingNursesQueryKey],
    );
    const connectWaitingNurses = useCallback(
        async (waitingNurseId: number, targetNurseId: number) => {
            if (!wardId) return;

            try {
                await WardAPI.connectWaitingNurses(wardId, waitingNurseId, targetNurseId);
                await queryClient.invalidateQueries({queryKey: wardQueryKey});
                await queryClient.invalidateQueries({queryKey: wardWaitingNursesQueryKey});

                toast.success('기존 간호사 계정과 연결했어요.');

                return true;
            } catch (error) {
                showActionErrorFeedback(error, '기존 간호사 계정에 연결하지 못했어요.');

                return false;
            }
        },
        [queryClient, wardId, wardQueryKey, wardWaitingNursesQueryKey],
    );
    const cancelWaiting = useCallback(
        async (nurseId: number) => {
            if (!wardId) return;

            await WardAPI.deleteWaitingNurses(wardId, nurseId);
            await queryClient.invalidateQueries({queryKey: wardQueryKey});
            await queryClient.invalidateQueries({queryKey: wardWaitingNursesQueryKey});
        },
        [queryClient, wardId, wardQueryKey, wardWaitingNursesQueryKey],
    );

    return {
        queryKey: {
            getWardQueryKey: wardQueryKey,
            getWardWaitingNursesQueryKey: wardWaitingNursesQueryKey,
        },
        state: {
            ward,
            watingNurses: waitingNursesForView,
        },
        actions: {
            editWardSetting,
            removeShiftType,
            editShiftType,
            addShiftType,
            approveWaitingNurses,
            connectWaitingNurses,
            cancelWaiting,
        },
    };
};

export default useEditWard;
