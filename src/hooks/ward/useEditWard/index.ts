/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as wardApi from '@libs/api/ward';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as shiftTypeApi from '@libs/api/shiftType';
import useAuth from '@hooks/auth/useAuth';
import useEditShift from '@hooks/shift/useEditShift';

const useEditWard = () => {
  const {
    state: { wardId },
  } = useAuth();

  const getWardQueryKey = ['ward', wardId];
  const getWardWaitingNursesQueryKey = ['waitingNurses', wardId];
  const queryClient = useQueryClient();
  const {
    queryKey: { shiftQueryKey },
  } = useEditShift();

  const { data: ward } = useQuery(getWardQueryKey, () => wardApi.getWard(wardId!), {
    enabled: wardId !== null,
  });

  const { data: watingNurses } = useQuery(
    getWardWaitingNursesQueryKey,
    () => wardApi.getWatingNurses(wardId!),
    {
      enabled: wardId !== null,
    }
  );

  const { mutate: updateWardMutate } = useMutation(
    ({ wardId, editWardDTO }: { wardId: number; editWardDTO: wardApi.EditWardDTO }) =>
      wardApi.editWard(wardId, editWardDTO),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
      },
      onError: () => {
        alert('근무 설정 수정에 실패하였습니다.');
      },
    }
  );

  const { mutate: createShiftTypeMutate } = useMutation(
    ({
      wardId,
      createShiftTypeDTO,
    }: {
      wardId: number;
      createShiftTypeDTO: shiftTypeApi.CreateShiftTypeDTO;
    }) => shiftTypeApi.createShiftType(wardId, createShiftTypeDTO),
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
      createShiftTypeDTO: shiftTypeApi.CreateShiftTypeDTO;
    }) => shiftTypeApi.updateShiftType(wardId, shiftTypeId, createShiftTypeDTO),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
        queryClient.invalidateQueries(shiftQueryKey);
      },
    }
  );

  const { mutate: deleteShiftTypeMutate } = useMutation(
    ({ wardId, shiftTypeId }: { wardId: number; shiftTypeId: number }) =>
      shiftTypeApi.deleteShiftType(wardId, shiftTypeId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
      },
    }
  );

  const { mutate: approveWatingNursesMutate } = useMutation(
    ({
      wardId,
      waitingNurseId,
      shiftTeamId,
    }: {
      wardId: number;
      waitingNurseId: number;
      shiftTeamId: number;
    }) => wardApi.approveWatingNurses(wardId, waitingNurseId, shiftTeamId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
        queryClient.invalidateQueries(getWardWaitingNursesQueryKey);
      },
    }
  );

  const { mutate: connectWatingNursesMutate } = useMutation(
    ({
      wardId,
      waitingNurseId,
      targetNurseId,
    }: {
      wardId: number;
      waitingNurseId: number;
      targetNurseId: number;
    }) => wardApi.connectWatingNurses(wardId, waitingNurseId, targetNurseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
        queryClient.invalidateQueries(getWardWaitingNursesQueryKey);
      },
    }
  );

  const { mutate: cancelWaitingMutate } = useMutation(
    ({ wardId, nurseId }: { wardId: number; nurseId: number }) =>
      wardApi.deleteWatingNurses(wardId, nurseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getWardQueryKey);
        queryClient.invalidateQueries(getWardWaitingNursesQueryKey);
      },
    }
  );

  const editWardSetting = (editWardDTO: wardApi.EditWardDTO) => {
    if (wardId) updateWardMutate({ wardId, editWardDTO });
  };

  const addShiftType = (createShiftTypeDTO: shiftTypeApi.CreateShiftTypeDTO) => {
    if (wardId) createShiftTypeMutate({ wardId, createShiftTypeDTO });
  };

  const editShiftType = (
    shiftTypeId: number,
    createShiftTypeDTO: shiftTypeApi.CreateShiftTypeDTO
  ) => {
    if (wardId) updateShiftTypeMutate({ wardId, shiftTypeId, createShiftTypeDTO });
  };

  const removeShiftType = (shiftTypeId: number) => {
    if (wardId) deleteShiftTypeMutate({ wardId, shiftTypeId });
  };

  const approveWatingNurses = (waitingNurseId: number, shiftTeamId: number) => {
    wardId && approveWatingNursesMutate({ wardId, waitingNurseId, shiftTeamId });
  };

  const connectWatingNurses = (waitingNurseId: number, targetNurseId: number) => {
    wardId && connectWatingNursesMutate({ wardId, waitingNurseId, targetNurseId });
  };

  const cancelWaiting = (nurseId: number) => {
    wardId && cancelWaitingMutate({ wardId, nurseId });
  };

  return {
    state: {
      ward,
      watingNurses,
    },
    actions: {
      editWardSetting,
      removeShiftType,
      editShiftType,
      addShiftType,
      approveWatingNurses,
      connectWatingNurses,
      cancelWaiting,
    },
  };
};

export default useEditWard;
