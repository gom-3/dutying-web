import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'store';
import {
  addNurseInWard,
  deleteNurseInWard,
  getNursesByWardId,
  updateNurse as patchNurse,
  updateNurseShiftType,
  updateNurseShiftTypeRequest,
} from '@libs/api/nurse';
import useEditNurseStore from './store';
import { shallow } from 'zustand/shallow';
import { useEffect } from 'react';
import { groupBy } from 'lodash-es';

const useEditNurse = () => {
  const [selectedNurseId, groupedNurses, setState] = useEditNurseStore(
    (state) => [state.selectedNurseId, state.groupedNurses, state.setState],
    shallow
  );

  const {
    account: { wardId },
  } = useAccount();

  const queryClient = useQueryClient();
  const getNursesQueryKey = ['nurses', wardId];
  const { data: nurses } = useQuery(getNursesQueryKey, () => getNursesByWardId(wardId));

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

  const { mutate: addNurseMutate } = useMutation((wardId: number) => addNurseInWard(wardId), {
    onSuccess: () => queryClient.invalidateQueries(getNursesQueryKey),
    onError: (error) => {
      console.log(error);
      alert('간호사 추가에 실패했습니다.');
    },
  });

  const { mutate: deleteNurseMutate } = useMutation(
    (nurseId: number) => deleteNurseInWard(nurseId),
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

  useEffect(() => {
    if (nurses) {
      queryClient.invalidateQueries(['shift']);
      const groupedNurses = Object.values(groupBy(nurses, 'level')).reverse();
      setState('groupedNurses', groupedNurses);
      if (selectedNurseId === null) setState('selectedNurseId', groupedNurses[0][0].nurseId);
    }
  }, [nurses]);

  return {
    state: {
      selectedNurseId,
      selectedNurse: nurses?.find((nurse) => nurse.nurseId === selectedNurseId),
      nurses,
      groupedNurses,
    },
    actions: {
      addNurse: () => addNurseMutate(wardId),
      deleteNurse: (id: number) => deleteNurseMutate(id),
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
