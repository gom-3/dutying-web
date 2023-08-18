/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EditWardDTO, editWard, getWard } from '@libs/api/ward';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateShiftTypeDTO,
  createShiftType,
  deleteShiftType,
  updateShiftType,
} from '@libs/api/shift';
import useEditWardStore from './store';
import { shallow } from 'zustand/shallow';
import useGlobalStore from 'store';

const useEditWard = () => {
  const [tempWard, setState] = useEditWardStore(
    (state) => [state.tempWard, state.setState],
    shallow
  );

  const { wardId } = useGlobalStore();

  const getWardQueryKey = ['wardSettings', wardId];
  const queryClient = useQueryClient();
  const { data: ward } = useQuery(getWardQueryKey, () => getWard(wardId!), {
    enabled: wardId !== null,
    onSuccess: (ward) => {
      if (!tempWard) setState('tempWard', ward);
    },
  });
  const { mutate: updateWardMutate } = useMutation(
    ({ wardId, editWardDTO }: { wardId: number; editWardDTO: EditWardDTO }) =>
      editWard(wardId, editWardDTO),
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
    ({ wardId, createShiftTypeDTO }: { wardId: number; createShiftTypeDTO: CreateShiftTypeDTO }) =>
      createShiftType(wardId, createShiftTypeDTO),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(getWardQueryKey);
        setState('tempWard', ward);
      },
    }
  );

  const { mutate: updateShiftTypeMutate } = useMutation(
    ({
      wardId,
      shiftTypeId,
      createShiftTypeDTO,
    }: {
      wardId: number;
      shiftTypeId: number;
      createShiftTypeDTO: CreateShiftTypeDTO;
    }) => updateShiftType(wardId, shiftTypeId, createShiftTypeDTO),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(getWardQueryKey);
        await queryClient.invalidateQueries(['shift']);
        setState('tempWard', ward);
      },
    }
  );
  const { mutate: deleteShiftTypeMutate } = useMutation(
    ({ wardId, shiftTypeId }: { wardId: number; shiftTypeId: number }) =>
      deleteShiftType(wardId, shiftTypeId),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(getWardQueryKey);
        setState('tempWard', ward);
      },
    }
  );

  const editWardSetting = (editWardDTO: EditWardDTO) => {
    if (wardId) updateWardMutate({ wardId, editWardDTO });
  };

  const addShiftType = (createShiftTypeDTO: CreateShiftTypeDTO) => {
    if (wardId) createShiftTypeMutate({ wardId, createShiftTypeDTO });
  };

  const editShiftType = (shiftTypeId: number, createShiftTypeDTO: CreateShiftTypeDTO) => {
    if (wardId) updateShiftTypeMutate({ wardId, shiftTypeId, createShiftTypeDTO });
  };

  const removeShiftType = (shiftTypeId: number) => {
    if (wardId) deleteShiftTypeMutate({ wardId, shiftTypeId });
  };

  const changeTempWard = (key: keyof Ward, value: string | number) => {
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
