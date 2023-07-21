import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nurses as tempNurse } from '@mocks/nurse';
import {
  addNurseInWard,
  deleteNurseInWard,
  getNursesByWardId,
  updateNurse as patchNurse,
  updateNurseShiftType,
  updateNurseShiftTypeRequest,
} from '@libs/api/nurse';
import { useAccount } from 'store';

const useRegistNurse = () => {
  const [nurse, setNurse] = useState<Nurse>(tempNurse[0]);

  const queryClient = useQueryClient();

  const { account } = useAccount();

  const { data } = useQuery(['nurses', account.wardId], () => getNursesByWardId(account.wardId));

  const { mutate: updateNurseMutate } = useMutation(
    ({ id, updatedNurse }: { id: number; updatedNurse: Nurse }) => patchNurse(id, updatedNurse),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nurses', account.wardId]);
        queryClient.invalidateQueries(['shift', account.wardId, 2023, 7]);
      },
      onError: (error) => {
        console.log(error);
        alert('간호사 정보 수정이 실패했습니다.');
      },
    }
  );

  const { mutate: addNurseMutate } = useMutation((wardId: number) => addNurseInWard(wardId), {
    onSuccess: (nurse) => {
      queryClient.invalidateQueries(['nurses', account.wardId]);
      setNurse(nurse);
    },
    onError: (error) => {
      console.log(error);
      alert('간호사 추가에 실패했습니다.');
    },
  });

  const { mutate: deleteNurseMutate } = useMutation(
    (nurseId: number) => deleteNurseInWard(nurseId),
    {
      onSuccess: (_, nurseId) => {
        const prevNurseIndex =
          (data?.nurses.findIndex((nurse) => nurse.nurseId === nurseId) || 1) - 1;
        queryClient.invalidateQueries(['nurses', account.wardId]);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setNurse(data!.nurses[prevNurseIndex]);
      },
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
      onSuccess: () => {
        queryClient.invalidateQueries(['nurses', account.wardId]);
      },
    }
  );

  useEffect(() => {
    const id = nurse.nurseId;
    if (!data) return;
    const temp = data.nurses.find((n) => n.nurseId === id);
    setNurse(temp || data.nurses[0]);
  }, [data]);

  const updateNurse = (id: number, updatedNurse: Nurse) => {
    updateNurseMutate({ id, updatedNurse });
  };

  const updateNurseShift = (
    nurseId: number,
    nurseShiftTypeId: number,
    change: updateNurseShiftTypeRequest
  ) => {
    updateNurseShiftTypeMutate({ nurseId, nurseShiftTypeId, change });
  };

  const selectNurse = (nurse: Nurse) => {
    setNurse(nurse);
  };

  const addNurse = () => {
    addNurseMutate(account.wardId);
  };

  const deleteNurse = (id: number) => {
    deleteNurseMutate(id);
  };

  return {
    nurse,
    selectNurse,
    addNurse,
    deleteNurse,
    nurses: data?.nurses || [],
    updateNurse,
    updateNurseShift,
  };
};

export default useRegistNurse;
