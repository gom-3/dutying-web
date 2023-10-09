/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  UpdateNurseDTO,
  updateNurse as patchNurse,
  updateNurseOrder,
  updateNurseShiftType,
  updateNurseShiftTypeRequest,
  updateShiftTeamDivision,
} from '@libs/api/nurse';
import useEditNurseStore from './store';
import { shallow } from 'zustand/shallow';
import {
  UpdateShiftTeamDTO,
  addNurseIntoShiftTeam,
  createShiftTeam,
  deleteShiftTeam,
  removeNurseFromShiftTeam,
  updateShiftTeam,
} from '@libs/api/shiftTeam';
import { getWard } from '@libs/api/ward';
import { produce } from 'immer';
import useEditShift from '@hooks/shift/useEditShift';
import useAuth from '@hooks/auth/useAuth';

const useEditShiftTeam = () => {
  const [selectedNurseId, setState] = useEditNurseStore(
    (state) => [state.selectedNurseId, state.setState],
    shallow
  );

  const {
    state: { wardId },
  } = useAuth();

  const queryClient = useQueryClient();
  const getWardQueryKey = ['ward', wardId];
  const {
    queryKey: { shiftQueryKey },
  } = useEditShift();
  const { data: ward } = useQuery(getWardQueryKey, () => getWard(wardId!), {
    enabled: wardId !== null,
  });

  const { mutate: updateNurseMutate } = useMutation(
    ({ nurseId, updateNurseDTO }: { nurseId: number; updateNurseDTO: UpdateNurseDTO }) =>
      patchNurse(nurseId, updateNurseDTO),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
        queryClient.invalidateQueries(shiftQueryKey);
      },
      onError: (error) => {
        console.log(error);
        alert('간호사 정보 수정이 실패했습니다.');
      },
    }
  );

  const { mutate: addNurseMutate } = useMutation(
    ({ wardId, shiftTeamId }: { wardId: number; shiftTeamId: number }) =>
      addNurseIntoShiftTeam(wardId, shiftTeamId, {
        name: `간호사${Math.floor(Math.random() * 10000)}`,
        phoneNum: '01012345678',
        gender: '여',
        isWorker: true,
        employmentDate: '2021-08-01',
        isDutyManager: false,
        isWardManager: false,
        memo: '',
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(getWardQueryKey),
      onError: (error) => {
        console.log(error);
        alert('간호사 추가에 실패했습니다.');
      },
    }
  );

  const { mutate: deleteNurseMutate } = useMutation(
    ({ wardId, nurseId, shiftTeamId }: { wardId: number; nurseId: number; shiftTeamId: number }) =>
      removeNurseFromShiftTeam(wardId, shiftTeamId, nurseId),
    {
      onSuccess: () => queryClient.invalidateQueries(getWardQueryKey),
    }
  );

  const { mutate: updateNurseShiftTypeMutate } = useMutation(
    ({
      nurseId,
      nurseShiftTypeId,
      change,
    }: {
      nurseId: number;
      nurseShiftTypeId: number;
      change: updateNurseShiftTypeRequest;
    }) => updateNurseShiftType(nurseId, nurseShiftTypeId, change),
    {
      onSuccess: () => queryClient.invalidateQueries(getWardQueryKey),
    }
  );

  const { mutate: createShiftTeamMutate } = useMutation(
    (wardId: number) => createShiftTeam(wardId),
    {
      onSuccess: () => queryClient.invalidateQueries(getWardQueryKey),
    }
  );

  const { mutate: deleteShiftTeamMutate } = useMutation(
    ({ wardId, shiftTeamId }: { wardId: number; shiftTeamId: number }) =>
      deleteShiftTeam(wardId, shiftTeamId),
    {
      onSuccess: () => queryClient.invalidateQueries(getWardQueryKey),
    }
  );

  const { mutate: editDivisionMutate } = useMutation(
    ({
      shiftTeamId,
      prevPriority,
      changeValue,
      patchYearMonth,
    }: {
      shiftTeamId: number;
      prevPriority: number;
      changeValue: number;
      patchYearMonth: string;
    }) => updateShiftTeamDivision(shiftTeamId, prevPriority, changeValue, patchYearMonth),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
        queryClient.invalidateQueries(shiftQueryKey);
      },
    }
  );

  const { mutate: moveNurseOrderMutate } = useMutation(
    ({
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
    }) =>
      updateNurseOrder(
        nurseId,
        shiftTeamId,
        nextShiftTeamId,
        divisionNum,
        prevPriority,
        nextPriority,
        patchYearMonth
      ),
    {
      onMutate: async ({
        nurseId,
        shiftTeamId,
        nextShiftTeamId,
        prevPriority,
        nextPriority,
        divisionNum,
      }) => {
        await queryClient.cancelQueries(getWardQueryKey);
        await queryClient.cancelQueries(shiftQueryKey);
        const oldWard = queryClient.getQueryData<Ward>(getWardQueryKey);
        const oldShift = queryClient.getQueryData<Shift>(shiftQueryKey);
        oldWard &&
          queryClient.setQueryData<Ward>(
            getWardQueryKey,
            produce(oldWard, (draft) => {
              const sourceNurses = draft.shiftTeams.find(
                (shiftTeam) => shiftTeam.shiftTeamId === shiftTeamId
              )!.nurses;
              const nurse = sourceNurses.find((nurse) => nurse.nurseId === nurseId)!;

              sourceNurses.splice(
                sourceNurses.findIndex((x) => x.nurseId === nurseId),
                1
              );
              const destinationNurses = draft.shiftTeams.find(
                (shiftTeam) => shiftTeam.shiftTeamId === nextShiftTeamId
              )!.nurses;

              const index = destinationNurses.findIndex((x) => x.priority === nextPriority);
              destinationNurses.splice(index === -1 ? 0 : index, 0, {
                ...nurse,
                divisionNum,
                priority: (prevPriority + nextPriority) / 2,
              });
            })
          );

        oldShift &&
          queryClient.setQueryData<Shift>(
            shiftQueryKey,
            produce(oldShift, (draft) => {
              const sourceRows = draft.divisionShiftNurses.find((x) =>
                x.some((y) => y.shiftNurse.nurseId === nurseId)
              );
              if (sourceRows === undefined) return;
              const row = sourceRows.find((x) => x.shiftNurse.nurseId === nurseId)!;

              sourceRows.splice(
                sourceRows.findIndex((x) => x.shiftNurse.nurseId === nurseId),
                1
              );

              let desticationRow = draft.divisionShiftNurses.find((x) =>
                x.some((y) => y.shiftNurse.priority === prevPriority)
              );

              if (desticationRow) {
                const index = desticationRow.findIndex(
                  (x) => x.shiftNurse.priority === prevPriority
                );
                desticationRow.splice(index === -1 ? 0 : index + 1, 0, row);
              } else {
                desticationRow = draft.divisionShiftNurses.find((x) =>
                  x.some((y) => y.shiftNurse.priority === nextPriority)
                )!;
                const index = desticationRow.findIndex(
                  (x) => x.shiftNurse.priority === nextPriority
                );
                desticationRow.splice(index === -1 ? 0 : index, 0, row);
              }
            })
          );

        return { oldWard, oldShift };
      },
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
        queryClient.invalidateQueries(['shift']);
      },
      onError: (_, __, context) => {
        if (
          context === undefined ||
          context.oldShift === undefined ||
          context.oldWard === undefined
        )
          return;
        queryClient.setQueryData(getWardQueryKey, context.oldWard);
        queryClient.setQueryData(['shift'], context.oldShift);
      },
    }
  );

  const { mutate: updateShiftTeamMutate } = useMutation(
    ({
      wardId,
      shiftTeamId,
      updateShiftTeamDTO,
    }: {
      wardId: number;
      shiftTeamId: number;
      updateShiftTeamDTO: UpdateShiftTeamDTO;
    }) => updateShiftTeam(wardId, shiftTeamId, updateShiftTeamDTO),
    {
      onMutate: ({ shiftTeamId, updateShiftTeamDTO }) => {
        const oldWard = queryClient.getQueryData<Ward>(getWardQueryKey);
        if (!oldWard) return;

        queryClient.setQueryData<Ward>(
          getWardQueryKey,
          produce(oldWard, (draft) => {
            const shiftTeam = draft.shiftTeams.find(
              (shiftTeam) => shiftTeam.shiftTeamId === shiftTeamId
            )!;
            shiftTeam.name = updateShiftTeamDTO.name;
          })
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
      },
    }
  );

  return {
    state: {
      ward,
      selectedNurse: ward?.shiftTeams
        ?.flatMap((x) => x.nurses)
        .find((nurse) => nurse.nurseId === selectedNurseId),
      shiftTeams: ward?.shiftTeams,
    },
    actions: {
      addNurse: (shiftTeamId: number) => wardId && addNurseMutate({ wardId, shiftTeamId }),
      deleteNurse: (shiftTeamId: number, nurseId: number) =>
        wardId && deleteNurseMutate({ wardId, nurseId, shiftTeamId }),
      selectNurse: (nurseId: number | null) => setState('selectedNurseId', nurseId),
      updateNurse: (nurseId: number, updateNurseDTO: UpdateNurseDTO) =>
        updateNurseMutate({ nurseId, updateNurseDTO }),
      updateNurseShift: (
        nurseId: number,
        nurseShiftTypeId: number,
        change: updateNurseShiftTypeRequest
      ) => updateNurseShiftTypeMutate({ nurseId, nurseShiftTypeId, change }),
      createShiftTeam: () => wardId && createShiftTeamMutate(wardId),
      deleteShiftTeam: (shiftTeamId: number) =>
        wardId && deleteShiftTeamMutate({ wardId, shiftTeamId }),
      editDivision: (
        shiftTeamId: number,
        prevPriority: number,
        changeValue: number,
        patchYearMonth: string
      ) => editDivisionMutate({ shiftTeamId, prevPriority, changeValue, patchYearMonth }),
      moveNurseOrder: (
        nurseId: number,
        shiftTeamId: number,
        nextShiftTeamId: number,
        divisionNum: number,
        prevPriority: number,
        nextPriority: number,
        patchYearMonth: string
      ) =>
        moveNurseOrderMutate({
          nurseId,
          shiftTeamId,
          nextShiftTeamId,
          divisionNum,
          prevPriority,
          nextPriority,
          patchYearMonth,
        }),
      updateShiftTeam: (shiftTeamId: number, updateShiftTeamDTO: UpdateShiftTeamDTO) =>
        wardId && updateShiftTeamMutate({ wardId, shiftTeamId, updateShiftTeamDTO }),
    },
  };
};

export default useEditShiftTeam;
