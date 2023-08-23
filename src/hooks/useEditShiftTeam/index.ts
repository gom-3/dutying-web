/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  UpdateNurseDTO,
  addNurseIntoShiftTeam,
  updateNurse as patchNurse,
  removeNurseFromShiftTeam,
  updateNurseShiftType,
  updateNurseShiftTypeRequest,
} from '@libs/api/nurse';
import useEditNurseStore from './store';
import { shallow } from 'zustand/shallow';
import {
  UpdateShiftTeamDTO,
  createShiftTeam,
  getWard,
  updateNurseOrder,
  updateShiftTeam,
  updateShiftTeamDivision,
} from '@libs/api/ward';
import useGlobalStore from 'store';
import { produce } from 'immer';

const useEditShiftTeam = () => {
  const [selectedNurseId, setState] = useEditNurseStore(
    (state) => [state.selectedNurseId, state.setState],
    shallow
  );

  const { wardId } = useGlobalStore();

  const queryClient = useQueryClient();
  const getWardQueryKey = ['ward', wardId];
  const { data: ward } = useQuery(getWardQueryKey, () => getWard(wardId!), {
    enabled: wardId !== null,
  });

  const { mutate: updateNurseMutate } = useMutation(
    ({ nurseId, updateNurseDTO }: { nurseId: number; updateNurseDTO: UpdateNurseDTO }) =>
      patchNurse(nurseId, updateNurseDTO),
    {
      onSuccess: () => queryClient.invalidateQueries(getWardQueryKey),
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
        workStartDate: '2023-08-01',
        workEndDate: '2023-12-31',
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

  const { mutate: editDivisionMutate } = useMutation(
    ({
      shiftTeamId,
      prevPriority,
      changeValue,
    }: {
      shiftTeamId: number;
      prevPriority: number;
      changeValue: number;
    }) => updateShiftTeamDivision(shiftTeamId, prevPriority, changeValue)
  );

  const { mutate: moveNurseOrderMutate } = useMutation(
    ({
      nurseId,
      shiftTeamId,
      nextShiftTeamId,
      divisionNum,
      prevPriority,
      nextPriority,
    }: {
      nurseId: number;
      shiftTeamId: number;
      nextShiftTeamId: number;
      divisionNum: number;
      prevPriority: number;
      nextPriority: number;
    }) =>
      updateNurseOrder(
        nurseId,
        shiftTeamId,
        nextShiftTeamId,
        divisionNum,
        prevPriority,
        nextPriority
      ),
    {
      onMutate: ({
        nurseId,
        shiftTeamId,
        nextShiftTeamId,
        prevPriority,
        nextPriority,
        divisionNum,
      }) => {
        const oldWard = queryClient.getQueryData<Ward>(getWardQueryKey);
        if (!oldWard) return;

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
      },
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
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
      shiftTeams: ward?.shiftTeams.map((shiftTeam) => ({
        ...shiftTeam,
        nurses: [...shiftTeam.nurses].sort((a, b) => {
          if (a.divisionNum === b.divisionNum) return a.priority - b.priority;
          else return a.divisionNum - b.divisionNum;
        }),
      })),
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
      editDivision: (shiftTeamId: number, prevPriority: number, changeValue: number) =>
        editDivisionMutate({ shiftTeamId, prevPriority, changeValue }),
      moveNurseOrder: (
        nurseId: number,
        shiftTeamId: number,
        nextShiftTeamId: number,
        divisionNum: number,
        prevPriority: number,
        nextPriority: number
      ) =>
        moveNurseOrderMutate({
          nurseId,
          shiftTeamId,
          nextShiftTeamId,
          divisionNum,
          prevPriority,
          nextPriority,
        }),
      updateShiftTeam: (shiftTeamId: number, updateShiftTeamDTO: UpdateShiftTeamDTO) =>
        wardId && updateShiftTeamMutate({ wardId, shiftTeamId, updateShiftTeamDTO }),
    },
  };
};

export default useEditShiftTeam;
