/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EditWardDTO, editWard, getWard } from '@libs/api/ward';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateShiftTypeDTO,
  createShiftType,
  deleteShiftType,
  updateShiftType,
} from '@libs/api/shiftType';
import useGlobalStore from 'store';

const useEditWard = () => {
  const { wardId } = useGlobalStore();

  const getWardQueryKey = ['ward', wardId];
  const queryClient = useQueryClient();
  const { data: ward } = useQuery(getWardQueryKey, () => getWard(wardId!), {
    enabled: wardId !== null,
  });
  const { mutate: updateWardMutate } = useMutation(
    ({ wardId, editWardDTO }: { wardId: number; editWardDTO: EditWardDTO }) =>
      editWard(wardId, editWardDTO),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
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
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
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
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
        queryClient.invalidateQueries(['shift']);
      },
    }
  );
  const { mutate: deleteShiftTypeMutate } = useMutation(
    ({ wardId, shiftTypeId }: { wardId: number; shiftTypeId: number }) =>
      deleteShiftType(wardId, shiftTypeId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
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

  return {
    state: {
      ward,
    },
    actions: {
      editWardSetting,
      removeShiftType,
      editShiftType,
      addShiftType,
    },
  };
};

export default useEditWard;
