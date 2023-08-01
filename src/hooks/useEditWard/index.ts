import { useAccount } from 'store';
import { EditWardRequest, WardResponse, editWard, getWard } from '@libs/api/ward';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateShiftTypeRequest,
  createShiftType,
  deleteShiftType,
  updateShiftType,
} from '@libs/api/shift';
import useEditWardStore from './store';
import { shallow } from 'zustand/shallow';

const useEditWard = () => {
  const [tempWard, setState] = useEditWardStore(
    (state) => [state.tempWard, state.setState],
    shallow
  );

  const {
    account: { wardId },
  } = useAccount();

  const getWardQueryKey = ['wardSettings', wardId];
  const queryClient = useQueryClient();
  const { data: ward } = useQuery(getWardQueryKey, () => getWard(wardId), {
    onSuccess: (ward) => {
      if (!tempWard) setState('tempWard', ward);
    },
  });
  const { mutate: updateWardMutate } = useMutation(
    (editWardDTO: EditWardRequest) => editWard(wardId, editWardDTO),
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries(getWardQueryKey);
        setState('tempWard', data);
      },
      onError: (error) => {
        console.log(error);
        alert('근무 설정 수정에 실패하였습니다.');
      },
    }
  );
  const { mutate: createShiftTypeMutate } = useMutation(
    (createShiftTypeRequest: CreateShiftTypeRequest) =>
      createShiftType(wardId, createShiftTypeRequest),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(getWardQueryKey);
        setState('tempWard', ward);
      },
    }
  );
  const { mutate: updateShiftTypeMutate } = useMutation(
    ({
      shiftTypeId,
      createShiftTypeRequest,
    }: {
      shiftTypeId: number;
      createShiftTypeRequest: CreateShiftTypeRequest;
    }) => updateShiftType(wardId, shiftTypeId, createShiftTypeRequest),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(getWardQueryKey);
        setState('tempWard', ward);
      },
    }
  );
  const { mutate: deleteShiftTypeMutate } = useMutation(
    (shiftTypeId: number) => deleteShiftType(wardId, shiftTypeId),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(getWardQueryKey);
        setState('tempWard', ward);
      },
    }
  );

  const editWardSetting = (editWardDTO: EditWardRequest) => {
    updateWardMutate(editWardDTO);
  };

  const addShiftType = (createShiftTypeRequest: CreateShiftTypeRequest) => {
    createShiftTypeMutate(createShiftTypeRequest);
  };

  const editShiftType = (shiftTypeId: number, createShiftTypeRequest: CreateShiftTypeRequest) => {
    updateShiftTypeMutate({ shiftTypeId, createShiftTypeRequest });
  };

  const removeShiftType = (shiftTypeId: number) => {
    deleteShiftTypeMutate(shiftTypeId);
  };

  const changeTempWard = (key: keyof WardResponse, value: string | number) => {
    setState('tempWard', { ...tempWard, [key]: value });
  };

  const synchronizeTempWard = () => {
    setState('tempWard', ward);
  };

  return {
    state: {
      /** 실제 설정에 반영되기 전의 임시 상태 */
      tempWard,
      /** 실제 DB에 반영된 상태 */
      ward,
    },
    actions: {
      editWardSetting,
      removeShiftType,
      editShiftType,
      addShiftType,
      changeTempWard,
      synchronizeTempWard,
    },
  };
};

export default useEditWard;
