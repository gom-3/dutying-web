import {type TUpdateNurseDTO, type TUpdateNurseShiftTypeRequest} from '@dutying/api/nurse';
import {type TUpdateShiftTeamDTO} from '@dutying/api/ward';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {produce} from 'immer';
import {useCallback} from 'react';
import toast from 'react-hot-toast';
import {type TRequestShift, type TShift} from '@/entities/shift';
import {type TWard} from '@/entities/ward';
import {wardQueryKeys, wardQueryOptions} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import useRequestShift from '@/features/request-shift';
import {NurseAPI, WardAPI} from '@/shared/api';
import {showActionErrorFeedback} from '@/shared/util/feedback';
import useEditNurseStore from './model/store';

const useEditShiftTeam = () => {
    const {
        selectedNurseId,
        selectedNurseDrawerMode,
        isNurseDraftDirty,
        nurseSaveStatus,
        isAddingNurse,
        isDeletingNurse,
        beginAddingNurse,
        completeAddingNurse,
        finishAddingNurse,
        beginDeletingNurse,
        completeDeletingNurse,
        finishDeletingNurse,
        selectNurse: selectNurseState,
        beginSavingNurse,
        completeSavingNurse,
        failSavingNurse,
        setNurseDraftDirty: setNurseDraftDirtyState,
    } = useEditNurseStore();
    const {
        state: {wardId},
    } = useAuth();
    const queryClient = useQueryClient();
    const wardQueryKey = wardQueryKeys.id(wardId ?? 0);
    const wardQueryOptionsValue = wardQueryOptions.id(wardId ?? 0);
    const shiftQueryKey = wardQueryKeys.shift();
    const {
        queryKey: {requestShiftQueryKey},
    } = useRequestShift();
    const {data: ward} = useQuery({
        ...wardQueryOptionsValue,
        enabled: !!wardId,
    });
    const invalidateWard = useCallback(async () => {
        await queryClient.invalidateQueries({queryKey: wardQueryKey});
    }, [queryClient, wardQueryKey]);
    const invalidateWardShiftAndRequest = useCallback(async () => {
        await queryClient.invalidateQueries({queryKey: wardQueryKey});
        await queryClient.invalidateQueries({queryKey: shiftQueryKey});
        await queryClient.invalidateQueries({queryKey: requestShiftQueryKey});
        if (wardId) {
            await queryClient.invalidateQueries({queryKey: [...wardQueryKeys.all(), 'shiftTeamNurses', wardId]});
        }
    }, [queryClient, requestShiftQueryKey, shiftQueryKey, wardId, wardQueryKey]);
    const addNurse = useCallback(
        async (shiftTeamId: number) => {
            if (!wardId) return;

            beginAddingNurse();

            try {
                const nurse = await WardAPI.addNurseIntoShiftTeam(wardId, shiftTeamId, {
                    name: `간호사${Math.floor(Math.random() * 10000)}`,
                    phoneNum: '01012345678',
                    gender: '여',
                    isWorker: true,
                    employmentDate: '2021-08-01',
                    isDutyManager: false,
                    isWardManager: false,
                    memo: '',
                });

                const oldWard = queryClient.getQueryData<TWard>(wardQueryKey);

                if (oldWard) {
                    queryClient.setQueryData<TWard>(
                        wardQueryKey,
                        produce(oldWard, (draft) => {
                            const targetShiftTeam = draft.shiftTeams.find((shiftTeam) => shiftTeam.shiftTeamId === shiftTeamId);

                            if (!targetShiftTeam) return;

                            const alreadyExists = targetShiftTeam.nurses.some((existingNurse) => existingNurse.nurseId === nurse.nurseId);

                            if (alreadyExists) return;

                            const seedShiftTypes = targetShiftTeam.nurses[0]?.nurseShiftTypes ?? [];
                            const seedPriority = targetShiftTeam.nurses[targetShiftTeam.nurses.length - 1]?.priority ?? 0;

                            targetShiftTeam.nurses.push({
                                accountId: null,
                                shiftTeamId,
                                wardId,
                                name: nurse.name ?? '',
                                phoneNum: nurse.phoneNum ?? '',
                                isConnected: nurse.isConnected ?? false,
                                nurseShiftTypes:
                                    nurse.nurseShiftTypes ??
                                    seedShiftTypes.map((shiftType) => ({
                                        nurseShiftTypeId: shiftType.nurseShiftTypeId,
                                        name: shiftType.name,
                                        shortName: shiftType.shortName,
                                        isPossible: shiftType.isPossible,
                                        isPreferred: shiftType.isPreferred,
                                    })),
                                isWorker: nurse.isWorker ?? true,
                                isDutyManager: nurse.isDutyManager ?? false,
                                isWardManager: nurse.isWardManager ?? false,
                                gender: nurse.gender ?? '',
                                employmentDate: nurse.employmentDate ?? '',
                                memo: nurse.memo ?? '',
                                isDeleted: nurse.isDeleted ?? false,
                                divisionNum: nurse.divisionNum ?? 1,
                                priority: nurse.priority ?? seedPriority + 1,
                                nurseId: nurse.nurseId,
                            });

                            targetShiftTeam.nurseCnt = Math.max(targetShiftTeam.nurseCnt ?? 0, targetShiftTeam.nurses.length);
                        }),
                    );
                }

                completeAddingNurse(nurse.nurseId);

                toast.success('간호사를 추가했어요. 이름과 연락처를 확인한 뒤 저장해 주세요.', {position: 'bottom-center'});
                await invalidateWard();
            } catch (error) {
                showActionErrorFeedback(error, '간호사를 추가하지 못했어요.');
            } finally {
                finishAddingNurse();
            }
        },
        [beginAddingNurse, completeAddingNurse, finishAddingNurse, invalidateWard, queryClient, wardId, wardQueryKey],
    );
    const deleteNurse = useCallback(
        async (shiftTeamId: number, nurseId: number) => {
            if (!wardId) return;

            beginDeletingNurse();

            try {
                await WardAPI.removeNurseFromShiftTeam(wardId, shiftTeamId, nurseId);
                completeDeletingNurse();
                toast.success('간호사를 삭제했어요.');
                await invalidateWard();
            } catch (error) {
                showActionErrorFeedback(error, '간호사를 삭제하지 못했어요.');
            } finally {
                finishDeletingNurse();
            }
        },
        [beginDeletingNurse, completeDeletingNurse, finishDeletingNurse, invalidateWard, wardId],
    );
    const disconnectNurse = useCallback(
        async (nurseId: number) => {
            if (!wardId) return false;

            beginSavingNurse();

            await queryClient.cancelQueries({queryKey: wardQueryKey});
            await queryClient.cancelQueries({queryKey: shiftQueryKey});
            await queryClient.cancelQueries({queryKey: requestShiftQueryKey});

            const oldWard = queryClient.getQueryData<TWard>(wardQueryKey);
            const oldShift = queryClient.getQueryData<TShift>(shiftQueryKey);
            const oldReqShift = queryClient.getQueryData<TRequestShift>(requestShiftQueryKey);

            if (oldWard) {
                queryClient.setQueryData<TWard>(
                    wardQueryKey,
                    produce(oldWard, (draft) => {
                        draft.shiftTeams.forEach((shiftTeam) => {
                            shiftTeam.nurses.forEach((nurse) => {
                                if (nurse.nurseId !== nurseId) return;
                                nurse.isConnected = false;
                            });
                        });
                    }),
                );
            }

            try {
                await NurseAPI.unConnectNurse(nurseId);
                completeSavingNurse();
                await invalidateWardShiftAndRequest();
                toast.success('연동을 끊었어요.');
                return true;
            } catch (error) {
                if (oldWard) queryClient.setQueryData(wardQueryKey, oldWard);
                if (oldShift) queryClient.setQueryData(shiftQueryKey, oldShift);
                if (oldReqShift) queryClient.setQueryData(requestShiftQueryKey, oldReqShift);

                failSavingNurse();
                showActionErrorFeedback(error, '연동을 끊지 못했어요.');
                return false;
            }
        },
        [
            beginSavingNurse,
            completeSavingNurse,
            failSavingNurse,
            invalidateWardShiftAndRequest,
            queryClient,
            requestShiftQueryKey,
            shiftQueryKey,
            wardId,
            wardQueryKey,
        ],
    );
    const selectNurse = useCallback(
        (nurseId: number | null, mode: 'create' | 'edit' = 'edit') => {
            if (selectedNurseId === nurseId) {
                return true;
            }

            selectNurseState(nurseId, mode);

            return true;
        },
        [selectNurseState, selectedNurseId],
    );
    const updateNurse = useCallback(
        async (nurseId: number, updateNurseDTO: TUpdateNurseDTO) => {
            beginSavingNurse();

            await queryClient.cancelQueries({queryKey: wardQueryKey});
            await queryClient.cancelQueries({queryKey: shiftQueryKey});
            await queryClient.cancelQueries({queryKey: requestShiftQueryKey});

            const oldWard = queryClient.getQueryData<TWard>(wardQueryKey);
            const oldShift = queryClient.getQueryData<TShift>(shiftQueryKey);
            const oldReqShift = queryClient.getQueryData<TRequestShift>(requestShiftQueryKey);

            if (oldWard) {
                queryClient.setQueryData<TWard>(
                    wardQueryKey,
                    produce(oldWard, (draft) => {
                        draft.shiftTeams.forEach((shiftTeam) => {
                            shiftTeam.nurses.forEach((nurse) => {
                                if (nurse.nurseId !== nurseId) return;

                                Object.assign(nurse, updateNurseDTO);
                            });
                        });
                    }),
                );
            }

            try {
                await NurseAPI.updateNurse(nurseId, updateNurseDTO);
                completeSavingNurse();

                await invalidateWardShiftAndRequest();

                return true;
            } catch (error) {
                if (oldWard) queryClient.setQueryData(wardQueryKey, oldWard);
                if (oldShift) queryClient.setQueryData(shiftQueryKey, oldShift);
                if (oldReqShift) queryClient.setQueryData(requestShiftQueryKey, oldReqShift);

                failSavingNurse();

                showActionErrorFeedback(error, '간호사 정보를 수정하지 못했어요.');

                return false;
            }
        },
        [
            beginSavingNurse,
            completeSavingNurse,
            failSavingNurse,
            invalidateWardShiftAndRequest,
            queryClient,
            requestShiftQueryKey,
            shiftQueryKey,
            wardQueryKey,
        ],
    );
    const updateNurseShift = useCallback(
        async (nurseId: number, nurseShiftTypeId: number, change: TUpdateNurseShiftTypeRequest) => {
            await queryClient.cancelQueries({queryKey: wardQueryKey});
            await queryClient.cancelQueries({queryKey: shiftQueryKey});
            await queryClient.cancelQueries({queryKey: requestShiftQueryKey});

            const oldWard = queryClient.getQueryData<TWard>(wardQueryKey);
            const oldShift = queryClient.getQueryData<TShift>(shiftQueryKey);
            const oldReqShift = queryClient.getQueryData<TRequestShift>(requestShiftQueryKey);

            if (oldWard) {
                queryClient.setQueryData<TWard>(
                    wardQueryKey,
                    produce(oldWard, (draft) => {
                        draft.shiftTeams.forEach((shiftTeam) => {
                            shiftTeam.nurses.forEach((nurse) => {
                                if (nurse.nurseId !== nurseId) return;

                                const targetShiftType = nurse.nurseShiftTypes.find(
                                    (shiftType) => shiftType.nurseShiftTypeId === nurseShiftTypeId,
                                );

                                if (!targetShiftType) return;

                                if (typeof change.isPossible === 'boolean') {
                                    targetShiftType.isPossible = change.isPossible;
                                }

                                if (typeof change.isPrefer === 'boolean') {
                                    targetShiftType.isPreferred = change.isPrefer;
                                }
                            });
                        });
                    }),
                );
            }

            try {
                await NurseAPI.updateNurseShiftType(nurseId, nurseShiftTypeId, change);
                await invalidateWardShiftAndRequest();
            } catch (error) {
                if (oldWard) queryClient.setQueryData(wardQueryKey, oldWard);
                if (oldShift) queryClient.setQueryData(shiftQueryKey, oldShift);
                if (oldReqShift) queryClient.setQueryData(requestShiftQueryKey, oldReqShift);

                showActionErrorFeedback(error, '가능한 근무 유형을 저장하지 못했어요.');
            }
        },
        [invalidateWardShiftAndRequest, queryClient, requestShiftQueryKey, shiftQueryKey, wardQueryKey],
    );
    const createShiftTeam = useCallback(async () => {
        if (!wardId) return;

        const createdShiftTeam = await WardAPI.createShiftTeam(wardId);
        await invalidateWard();
        return createdShiftTeam;
    }, [invalidateWard, wardId]);
    const deleteShiftTeam = useCallback(
        async (shiftTeamId: number) => {
            if (!wardId) return;

            await WardAPI.deleteShiftTeam(wardId, shiftTeamId);
            await invalidateWard();
        },
        [invalidateWard, wardId],
    );
    const editDivision = useCallback(
        async (shiftTeamId: number, prevPriority: number, changeValue: number, patchYearMonth: string) => {
            await NurseAPI.updateShiftTeamDivision(shiftTeamId, prevPriority, changeValue, patchYearMonth);
            await invalidateWardShiftAndRequest();
        },
        [invalidateWardShiftAndRequest],
    );
    const moveNurseOrder = useCallback(
        async (
            nurseId: number,
            shiftTeamId: number,
            nextShiftTeamId: number,
            divisionNum: number,
            prevPriority: number,
            nextPriority: number,
            patchYearMonth: string,
        ) => {
            await queryClient.cancelQueries({queryKey: wardQueryKey});
            await queryClient.cancelQueries({queryKey: shiftQueryKey});
            await queryClient.cancelQueries({queryKey: requestShiftQueryKey});

            const oldWard = queryClient.getQueryData<TWard>(wardQueryKey);
            const oldShift = queryClient.getQueryData<TShift>(shiftQueryKey);
            const oldReqShift = queryClient.getQueryData<TRequestShift>(requestShiftQueryKey);

            if (oldWard) {
                queryClient.setQueryData<TWard>(
                    wardQueryKey,
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
                queryClient.setQueryData<TShift>(
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
                queryClient.setQueryData<TRequestShift>(
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

            try {
                await NurseAPI.updateNurseOrder(
                    nurseId,
                    shiftTeamId,
                    nextShiftTeamId,
                    divisionNum,
                    prevPriority,
                    nextPriority,
                    patchYearMonth,
                );
                await invalidateWardShiftAndRequest();
            } catch {
                if (!oldShift || !oldReqShift || !oldWard) return;

                queryClient.setQueryData(wardQueryKey, oldWard);
                queryClient.setQueryData(shiftQueryKey, oldShift);
                queryClient.setQueryData(requestShiftQueryKey, oldReqShift);
            }
        },
        [invalidateWardShiftAndRequest, queryClient, requestShiftQueryKey, shiftQueryKey, wardQueryKey],
    );
    const updateShiftTeam = useCallback(
        async (shiftTeamId: number, updateShiftTeamDTO: TUpdateShiftTeamDTO) => {
            if (!wardId) return;

            const oldWard = queryClient.getQueryData<TWard>(wardQueryKey);

            if (oldWard) {
                queryClient.setQueryData<TWard>(
                    wardQueryKey,
                    produce(oldWard, (draft) => {
                        const shiftTeam = draft.shiftTeams.find((shiftTeam) => shiftTeam.shiftTeamId === shiftTeamId)!;

                        shiftTeam.name = updateShiftTeamDTO.name;
                    }),
                );
            }

            try {
                await WardAPI.updateShiftTeam(wardId, shiftTeamId, updateShiftTeamDTO);
            } finally {
                await invalidateWard();
            }
        },
        [invalidateWard, queryClient, wardId, wardQueryKey],
    );
    const setNurseDraftDirty = useCallback(
        (isDirty: boolean) => {
            setNurseDraftDirtyState(isDirty);
        },
        [setNurseDraftDirtyState],
    );

    return {
        state: {
            ward,
            selectedNurse: ward?.shiftTeams?.flatMap((x) => x.nurses).find((nurse) => nurse.nurseId === selectedNurseId),
            shiftTeams: ward?.shiftTeams,
            selectedNurseDrawerMode,
            isNurseDraftDirty,
            nurseSaveStatus,
            isAddingNurse,
            isDeletingNurse,
        },
        actions: {
            addNurse,
            deleteNurse,
            selectNurse,
            updateNurse,
            updateNurseShift,
            disconnectNurse,
            createShiftTeam,
            deleteShiftTeam,
            editDivision,
            moveNurseOrder,
            updateShiftTeam,
            setNurseDraftDirty,
        },
    };
};

export default useEditShiftTeam;


