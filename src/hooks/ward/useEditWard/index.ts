import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useCallback} from 'react';
import useAuth from '@/hooks/auth/useAuth';
import useEditShift from '@/hooks/shift/useEditShift';
import * as shiftTypeApi from '@/libs/api/shiftType';
import * as wardApi from '@/libs/api/ward';

const useEditWard = () => {
    const {
        state: {wardId},
    } = useAuth();
    const getWardQueryKey = ['ward', wardId];
    const getWardWaitingNursesQueryKey = ['waitingNurses', wardId];
    const queryClient = useQueryClient();
    const {
        queryKey: {shiftQueryKey},
    } = useEditShift();
    const {data: ward} = useQuery({
        queryKey: getWardQueryKey,
        queryFn: () => wardApi.getWard(wardId!),
        enabled: !!wardId,
    });
    const {data: watingNurses} = useQuery({
        queryKey: getWardWaitingNursesQueryKey,
        queryFn: () => wardApi.getWatingNurses(wardId!),
        enabled: !!wardId,
    });
    const {mutate: updateWardMutate} = useMutation({
        mutationFn: ({wardId, editWardDTO}: {wardId: number; editWardDTO: wardApi.EditWardDTO}) => wardApi.editWard(wardId, editWardDTO),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getWardQueryKey});
        },
        onError: () => {
            alert('근무 설정 수정에 실패하였습니다.');
        },
    });
    const {mutate: createShiftTypeMutate} = useMutation({
        mutationFn: ({wardId, createShiftTypeDTO}: {wardId: number; createShiftTypeDTO: shiftTypeApi.CreateShiftTypeDTO}) =>
            shiftTypeApi.createShiftType(wardId, createShiftTypeDTO),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getWardQueryKey});
        },
    });
    const {mutate: updateShiftTypeMutate} = useMutation({
        mutationFn: ({
            wardId,
            shiftTypeId,
            createShiftTypeDTO,
        }: {
            wardId: number;
            shiftTypeId: number;
            createShiftTypeDTO: shiftTypeApi.CreateShiftTypeDTO;
        }) => shiftTypeApi.updateShiftType(wardId, shiftTypeId, createShiftTypeDTO),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getWardQueryKey});
            queryClient.invalidateQueries({queryKey: shiftQueryKey});
        },
    });
    const {mutate: deleteShiftTypeMutate} = useMutation({
        mutationFn: ({wardId, shiftTypeId}: {wardId: number; shiftTypeId: number}) => shiftTypeApi.deleteShiftType(wardId, shiftTypeId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getWardQueryKey});
        },
    });
    const {mutate: approveWatingNursesMutate} = useMutation({
        mutationFn: ({wardId, waitingNurseId, shiftTeamId}: {wardId: number; waitingNurseId: number; shiftTeamId: number}) =>
            wardApi.approveWatingNurses(wardId, waitingNurseId, shiftTeamId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getWardQueryKey});
            queryClient.invalidateQueries({queryKey: getWardWaitingNursesQueryKey});
        },
    });
    const {mutate: connectWatingNursesMutate} = useMutation({
        mutationFn: ({wardId, waitingNurseId, targetNurseId}: {wardId: number; waitingNurseId: number; targetNurseId: number}) =>
            wardApi.connectWatingNurses(wardId, waitingNurseId, targetNurseId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getWardQueryKey});
            queryClient.invalidateQueries({queryKey: getWardWaitingNursesQueryKey});
        },
    });
    const {mutate: cancelWaitingMutate} = useMutation({
        mutationFn: ({wardId, nurseId}: {wardId: number; nurseId: number}) => wardApi.deleteWatingNurses(wardId, nurseId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getWardQueryKey});
            queryClient.invalidateQueries({queryKey: getWardWaitingNursesQueryKey});
        },
    });
    const editWardSetting = useCallback(
        (editWardDTO: wardApi.EditWardDTO) => {
            if (wardId) {
                updateWardMutate({wardId, editWardDTO});
            }
        },
        [updateWardMutate, wardId],
    );
    const addShiftType = useCallback(
        (createShiftTypeDTO: shiftTypeApi.CreateShiftTypeDTO) => {
            if (wardId) {
                createShiftTypeMutate({wardId, createShiftTypeDTO});
            }
        },
        [createShiftTypeMutate, wardId],
    );
    const editShiftType = useCallback(
        (shiftTypeId: number, createShiftTypeDTO: shiftTypeApi.CreateShiftTypeDTO) => {
            if (wardId) {
                updateShiftTypeMutate({wardId, shiftTypeId, createShiftTypeDTO});
            }
        },
        [updateShiftTypeMutate, wardId],
    );
    const removeShiftType = useCallback(
        (shiftTypeId: number) => {
            if (wardId) {
                deleteShiftTypeMutate({wardId, shiftTypeId});
            }
        },
        [deleteShiftTypeMutate, wardId],
    );
    const approveWatingNurses = useCallback(
        (waitingNurseId: number, shiftTeamId: number) => {
            if (wardId) {
                approveWatingNursesMutate({wardId, waitingNurseId, shiftTeamId});
            }
        },
        [approveWatingNursesMutate, wardId],
    );
    const connectWatingNurses = useCallback(
        (waitingNurseId: number, targetNurseId: number) => {
            if (wardId) {
                connectWatingNursesMutate({wardId, waitingNurseId, targetNurseId});
            }
        },
        [connectWatingNursesMutate, wardId],
    );
    const cancelWaiting = useCallback(
        (nurseId: number) => {
            if (wardId) {
                cancelWaitingMutate({wardId, nurseId});
            }
        },
        [cancelWaitingMutate, wardId],
    );

    return {
        queryKey: {
            getWardQueryKey,
            getWardWaitingNursesQueryKey,
        },
        state: {
            ward,
            watingNurses,
        },
        actions: {
            editWardSetting,
            removeShiftType,
            editShiftType,
            addShiftType,
            approveWatingNurses,
            connectWatingNurses,
            cancelWaiting,
        },
    };
};

export default useEditWard;
