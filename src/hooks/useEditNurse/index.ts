/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  updateNurse as patchNurse,
  updateNurseShiftType,
  updateNurseShiftTypeRequest,
} from '@libs/api/nurse';
import useEditNurseStore from './store';
import { shallow } from 'zustand/shallow';
import { addNurseIntoShiftTeam, getShiftTeams, removeNurseFromShiftTeam } from '@libs/api/ward';
import useGlobalStore from 'store';

const useEditNurse = () => {
  const [selectedNurseId, setState] = useEditNurseStore(
    (state) => [state.selectedNurseId, state.setState],
    shallow
  );

  const { wardId } = useGlobalStore();

  const queryClient = useQueryClient();
  const getNursesQueryKey = ['nurses', wardId];
  const { data: shiftTeams } = useQuery(['shiftTeams', wardId], () => getShiftTeams(wardId!), {
    enabled: wardId != null,
  });

  const { mutate: updateNurseMutate } = useMutation(
    (nurse: Nurse) => patchNurse(nurse.nurseId, nurse),
    {
      onSuccess: () => queryClient.invalidateQueries(getNursesQueryKey),
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
        phoneNum: '010-1234-5678',
        gender: '여',
        isWorker: true,
        employmentDate: '2023-08-01',
        isDutyManager: false,
        isWardManager: false,
        memo: '해당 간호사에 대한 메모입니다.',
        workStartDate: '2023-08-01',
        workEndDate: '2023-12-31',
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(getNursesQueryKey),
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
      onSuccess: () => queryClient.invalidateQueries(getNursesQueryKey),
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
      onSuccess: () => queryClient.invalidateQueries(getNursesQueryKey),
    }
  );

  return {
    state: {
      selectedNurse: shiftTeams
        ?.flatMap((x) => x.nurses)
        .find((nurse) => nurse.nurseId === selectedNurseId),
      shiftTeams,
    },
    actions: {
      addNurse: (shiftTeamId: number) => wardId && addNurseMutate({ wardId, shiftTeamId }),
      deleteNurse: (shiftTeamId: number, nurseId: number) =>
        wardId && deleteNurseMutate({ wardId, nurseId, shiftTeamId }),
      selectNurse: (nurseId: number) => setState('selectedNurseId', nurseId),
      updateNurse: (nurse: Nurse) => updateNurseMutate(nurse),
      updateNurseShift: (
        nurseId: number,
        nurseShiftTypeId: number,
        change: updateNurseShiftTypeRequest
      ) => updateNurseShiftTypeMutate({ nurseId, nurseShiftTypeId, change }),
    },
  };
};

export default useEditNurse;
