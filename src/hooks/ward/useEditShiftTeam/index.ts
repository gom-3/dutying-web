import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {produce} from 'immer';
import {useCallback} from 'react';
import useAuth from '@/hooks/auth/useAuth';
import useEditShift from '@/hooks/shift/useEditShift';
import useRequestShift from '@/hooks/shift/useRequestShift';
import * as nurseApi from '@/libs/api/nurse';
import * as shiftTeamApi from '@/libs/api/shiftTeam';
import {getWard} from '@/libs/api/ward';
import {type RequestShift, type Shift} from '@/types/shift';
import {type Ward} from '@/types/ward';
import useEditNurseStore from './store';

const useEditShiftTeam = () => {
    const {selectedNurseId, setState} = useEditNurseStore();
    const {
        state: {wardId},
    } = useAuth();
    const queryClient = useQueryClient();
    const getWardQueryKey = ['ward', wardId];
    const {
        queryKey: {shiftQueryKey},
    } = useEditShift();
    const {
        queryKey: {requestShiftQueryKey},
    } = useRequestShift();
    const {data: ward} = useQuery({
        queryKey: getWardQueryKey,
        queryFn: () => getWard(wardId!),
        enabled: !!wardId,
    });
    const {mutate: updateNurseMutate} = useMutation({
        mutationFn: ({nurseId, updateNurseDTO}: {nurseId: number; updateNurseDTO: nurseApi.UpdateNurseDTO}) =>
            nurseApi.updateNurse(nurseId, updateNurseDTO),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getWardQueryKey});
            queryClient.invalidateQueries({queryKey: shiftQueryKey});
            queryClient.invalidateQueries({queryKey: requestShiftQueryKey});
        },
        onError: () => {
            alert('간호사 정보 수정이 실패했습니다.');
        },
    });
    const {mutate: addNurseMutate} = useMutation({
        mutationFn: ({wardId, shiftTeamId}: {wardId: number; shiftTeamId: number}) =>
            shiftTeamApi.addNurseIntoShiftTeam(wardId, shiftTeamId, {
                name: `간호사${Math.floor(Math.random() * 10000)}`,
                phoneNum: '01012345678',
                gender: '여',
                isWorker: true,
                employmentDate: '2021-08-01',
                isDutyManager: false,
                isWardManager: false,
                memo: '',
            }),
        onSuccess: () => queryClient.invalidateQueries({queryKey: getWardQueryKey}),
        onError: () => {
            alert('간호사 추가에 실패했습니다.');
        },
    });
    const {mutate: deleteNurseMutate} = useMutation({
        mutationFn: ({wardId, nurseId, shiftTeamId}: {wardId: number; nurseId: number; shiftTeamId: number}) =>
            shiftTeamApi.removeNurseFromShiftTeam(wardId, shiftTeamId, nurseId),
        onSuccess: () => queryClient.invalidateQueries({queryKey: getWardQueryKey}),
    });
    const {mutate: updateNurseShiftTypeMutate} = useMutation({
        mutationFn: ({
            nurseId,
            nurseShiftTypeId,
            change,
        }: {
            nurseId: number;
            nurseShiftTypeId: number;
            change: nurseApi.updateNurseShiftTypeRequest;
        }) => nurseApi.updateNurseShiftType(nurseId, nurseShiftTypeId, change),
        onSuccess: () => queryClient.invalidateQueries({queryKey: getWardQueryKey}),
    });
    const {mutate: createShiftTeamMutate} = useMutation({
        mutationFn: (wardId: number) => shiftTeamApi.createShiftTeam(wardId),
        onSuccess: () => queryClient.invalidateQueries({queryKey: getWardQueryKey}),
    });
    const {mutate: deleteShiftTeamMutate} = useMutation({
        mutationFn: ({wardId, shiftTeamId}: {wardId: number; shiftTeamId: number}) => shiftTeamApi.deleteShiftTeam(wardId, shiftTeamId),
        onSuccess: () => queryClient.invalidateQueries({queryKey: getWardQueryKey}),
    });
    const {mutate: editDivisionMutate} = useMutation({
        mutationFn: ({
            shiftTeamId,
            prevPriority,
            changeValue,
            patchYearMonth,
        }: {
            shiftTeamId: number;
            prevPriority: number;
            changeValue: number;
            patchYearMonth: string;
        }) => nurseApi.updateShiftTeamDivision(shiftTeamId, prevPriority, changeValue, patchYearMonth),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getWardQueryKey});
            queryClient.invalidateQueries({queryKey: shiftQueryKey});
            queryClient.invalidateQueries({queryKey: requestShiftQueryKey});
        },
    });
    const {mutate: moveNurseOrderMutate} = useMutation({
        mutationFn: ({
            nurseId,
            shiftTeamId,
            nextShiftTeamId,
            divisionNum,
            prevPriority,
            nextPriority,
            patchYearMonth,
        }: {
            nurseId: number;
            shiftTeamId: number;
            nextShiftTeamId: number;
            divisionNum: number;
            prevPriority: number;
            nextPriority: number;
            patchYearMonth: string;
        }) => nurseApi.updateNurseOrder(nurseId, shiftTeamId, nextShiftTeamId, divisionNum, prevPriority, nextPriority, patchYearMonth),
        onMutate: async ({nurseId, shiftTeamId, nextShiftTeamId, prevPriority, nextPriority, divisionNum}) => {
            await queryClient.cancelQueries({queryKey: getWardQueryKey});
            await queryClient.cancelQueries({queryKey: shiftQueryKey});
            await queryClient.cancelQueries({queryKey: requestShiftQueryKey});

            const oldWard = queryClient.getQueryData<Ward>(getWardQueryKey);
            const oldShift = queryClient.getQueryData<Shift>(shiftQueryKey);
            const oldReqShift = queryClient.getQueryData<RequestShift>(requestShiftQueryKey);

            if (oldWard) {
                queryClient.setQueryData<Ward>(
                    getWardQueryKey,
                    produce(oldWard, (draft) => {
                        const sourceNurses = draft.shiftTeams.find((shiftTeam) => shiftTeam.shiftTeamId === shiftTeamId)!.nurses;
                        const nurse = sourceNurses.find((nurse) => nurse.nurseId === nurseId)!;

                        sourceNurses.splice(
                            sourceNurses.findIndex((x) => x.nurseId === nurseId),
                            1,
                        );

                        const destinationNurses = draft.shiftTeams.find((shiftTeam) => shiftTeam.shiftTeamId === nextShiftTeamId)!.nurses;
                        const index = destinationNurses.findIndex((x) => x.priority === nextPriority);

                        destinationNurses.splice(index === -1 ? 0 : index, 0, {
                            ...nurse,
                            divisionNum,
                            priority: (prevPriority + nextPriority) / 2,
                        });
                    }),
                );
            }

            if (oldShift) {
                queryClient.setQueryData<Shift>(
                    shiftQueryKey,
                    produce(oldShift, (draft) => {
                        const sourceRows = draft.divisionShiftNurses.find((x) => x.some((y) => y.shiftNurse.nurseId === nurseId));

                        if (sourceRows === undefined) return;

                        const row = sourceRows.find((x) => x.shiftNurse.nurseId === nurseId)!;

                        sourceRows.splice(
                            sourceRows.findIndex((x) => x.shiftNurse.nurseId === nurseId),
                            1,
                        );

                        let desticationRow = draft.divisionShiftNurses.find((x) => x.some((y) => y.shiftNurse.priority === prevPriority));

                        if (desticationRow) {
                            const index = desticationRow.findIndex((x) => x.shiftNurse.priority === prevPriority);

                            desticationRow.splice(index === -1 ? 0 : index + 1, 0, row);
                        } else {
                            desticationRow = draft.divisionShiftNurses.find((x) => x.some((y) => y.shiftNurse.priority === nextPriority));

                            if (desticationRow) {
                                const index = desticationRow.findIndex((x) => x.shiftNurse.priority === nextPriority);

                                desticationRow.splice(index === -1 ? 0 : index, 0, row);
                            }
                        }
                    }),
                );
            }

            if (oldReqShift) {
                queryClient.setQueryData<RequestShift>(
                    requestShiftQueryKey,
                    produce(oldReqShift, (draft) => {
                        const sourceRows = draft.divisionShiftNurses.find((x) => x.some((y) => y.shiftNurse.nurseId === nurseId));

                        if (sourceRows === undefined) return;

                        const row = sourceRows.find((x) => x.shiftNurse.nurseId === nurseId)!;

                        sourceRows.splice(
                            sourceRows.findIndex((x) => x.shiftNurse.nurseId === nurseId),
                            1,
                        );

                        let desticationRow = draft.divisionShiftNurses.find((x) => x.some((y) => y.shiftNurse.priority === prevPriority));

                        if (desticationRow) {
                            const index = desticationRow.findIndex((x) => x.shiftNurse.priority === prevPriority);

                            desticationRow.splice(index === -1 ? 0 : index + 1, 0, row);
                        } else {
                            desticationRow = draft.divisionShiftNurses.find((x) => x.some((y) => y.shiftNurse.priority === nextPriority));

                            if (desticationRow) {
                                const index = desticationRow.findIndex((x) => x.shiftNurse.priority === nextPriority);

                                desticationRow.splice(index === -1 ? 0 : index, 0, row);
                            }
                        }
                    }),
                );
            }

            return {oldWard, oldShift, oldReqShift};
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getWardQueryKey});
            queryClient.invalidateQueries({queryKey: shiftQueryKey});
            queryClient.invalidateQueries({queryKey: requestShiftQueryKey});
        },
        onError: (_, __, context) => {
            if (context?.oldShift === undefined || context.oldReqShift === undefined || context.oldWard === undefined) return;

            queryClient.setQueryData(getWardQueryKey, context.oldWard);
            queryClient.setQueryData(shiftQueryKey, context.oldShift);
            queryClient.setQueryData(requestShiftQueryKey, context.oldReqShift);
        },
    });
    const {mutate: updateShiftTeamMutate} = useMutation({
        mutationFn: ({
            wardId,
            shiftTeamId,
            updateShiftTeamDTO,
        }: {
            wardId: number;
            shiftTeamId: number;
            updateShiftTeamDTO: shiftTeamApi.UpdateShiftTeamDTO;
        }) => shiftTeamApi.updateShiftTeam(wardId, shiftTeamId, updateShiftTeamDTO),
        onMutate: ({shiftTeamId, updateShiftTeamDTO}) => {
            const oldWard = queryClient.getQueryData<Ward>(getWardQueryKey);

            if (!oldWard) return;

            queryClient.setQueryData<Ward>(
                getWardQueryKey,
                produce(oldWard, (draft) => {
                    const shiftTeam = draft.shiftTeams.find((shiftTeam) => shiftTeam.shiftTeamId === shiftTeamId)!;

                    shiftTeam.name = updateShiftTeamDTO.name;
                }),
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getWardQueryKey});
        },
    });
    const addNurse = useCallback(
        (shiftTeamId: number) => {
            if (wardId) {
                addNurseMutate({wardId, shiftTeamId});
            }
        },
        [wardId, addNurseMutate],
    );
    const deleteNurse = useCallback(
        (shiftTeamId: number, nurseId: number) => {
            if (wardId) {
                deleteNurseMutate({wardId, nurseId, shiftTeamId});
            }
        },
        [wardId, deleteNurseMutate],
    );
    const selectNurse = useCallback(
        (nurseId: number | null) => {
            setState('selectedNurseId', nurseId);
        },
        [setState],
    );
    const updateNurse = useCallback(
        (nurseId: number, updateNurseDTO: nurseApi.UpdateNurseDTO) => {
            updateNurseMutate({nurseId, updateNurseDTO});
        },
        [updateNurseMutate],
    );
    const updateNurseShift = useCallback(
        (nurseId: number, nurseShiftTypeId: number, change: nurseApi.updateNurseShiftTypeRequest) => {
            updateNurseShiftTypeMutate({nurseId, nurseShiftTypeId, change});
        },
        [updateNurseShiftTypeMutate],
    );
    const createShiftTeam = useCallback(() => {
        if (wardId) {
            createShiftTeamMutate(wardId);
        }
    }, [wardId, createShiftTeamMutate]);
    const deleteShiftTeam = useCallback(
        (shiftTeamId: number) => {
            if (wardId) {
                deleteShiftTeamMutate({wardId, shiftTeamId});
            }
        },
        [wardId, deleteShiftTeamMutate],
    );
    const editDivision = useCallback(
        (shiftTeamId: number, prevPriority: number, changeValue: number, patchYearMonth: string) => {
            editDivisionMutate({shiftTeamId, prevPriority, changeValue, patchYearMonth});
        },
        [editDivisionMutate],
    );
    const moveNurseOrder = useCallback(
        (
            nurseId: number,
            shiftTeamId: number,
            nextShiftTeamId: number,
            divisionNum: number,
            prevPriority: number,
            nextPriority: number,
            patchYearMonth: string,
        ) => {
            moveNurseOrderMutate({
                nurseId,
                shiftTeamId,
                nextShiftTeamId,
                divisionNum,
                prevPriority,
                nextPriority,
                patchYearMonth,
            });
        },
        [moveNurseOrderMutate],
    );
    const updateShiftTeam = useCallback(
        (shiftTeamId: number, updateShiftTeamDTO: shiftTeamApi.UpdateShiftTeamDTO) => {
            if (wardId) {
                updateShiftTeamMutate({wardId, shiftTeamId, updateShiftTeamDTO});
            }
        },
        [updateShiftTeamMutate, wardId],
    );

    return {
        state: {
            ward,
            selectedNurse: ward?.shiftTeams?.flatMap((x) => x.nurses).find((nurse) => nurse.nurseId === selectedNurseId),
            shiftTeams: ward?.shiftTeams,
        },
        actions: {
            addNurse,
            deleteNurse,
            selectNurse,
            updateNurse,
            updateNurseShift,
            createShiftTeam,
            deleteShiftTeam,
            editDivision,
            moveNurseOrder,
            updateShiftTeam,
        },
    };
};

export default useEditShiftTeam;
