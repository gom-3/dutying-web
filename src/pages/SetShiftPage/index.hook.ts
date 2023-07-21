import { CreateShiftTypeRequest, createShiftType, deleteShiftType, updateShiftType } from "@libs/api/shift";
import { EditWardRequest, editWard, getWard } from "@libs/api/ward";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type ModalType = '숙련도' | '연속근무';

const SetShiftPageHook = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<'숙련도' | '연속근무'>('숙련도');

  const queryClient = useQueryClient();
  const wardId = 1;

  const { data: ward } = useQuery(['wardSettings', wardId], () => getWard(wardId));
  const { mutate: editWardMutate } = useMutation(
    ({ wardId, editWardDTO }: { wardId: number; editWardDTO: EditWardRequest }) =>
      editWard(wardId, editWardDTO),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['wardSettings', wardId]);
      },
      onError: (error) => {
        console.log(error);
        alert('근무 설정 수정에 실패하였습니다.');
      },
    }
  );
  const { mutate: createShiftTypeMutate } = useMutation(
    ({
      wardId,
      createShiftTypeRequest,
    }: {
      wardId: number;
      createShiftTypeRequest: CreateShiftTypeRequest;
    }) => createShiftType(wardId, createShiftTypeRequest),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['wardSettings', wardId]);
      },
    }
  );
  const { mutate: updateShiftTypeMutate } = useMutation(
    ({
      wardId,
      shiftTypeId,
      createShiftTypeRequest,
    }: {
      wardId: number;
      shiftTypeId: number;
      createShiftTypeRequest: CreateShiftTypeRequest;
    }) => updateShiftType(wardId, shiftTypeId, createShiftTypeRequest),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['wardSettings', wardId]);
      },
    }
  );
  const { mutate: deleteShiftTypeMutate } = useMutation(
    ({ wardId, shiftTypeId }: { wardId: number; shiftTypeId: number }) =>
      deleteShiftType(wardId, shiftTypeId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['wardSettings', wardId]);
      },
    }
  );

  const editWardSetting = (wardId: number, editWardDTO: EditWardRequest) => {
    editWardMutate({ wardId, editWardDTO });
  };

  const addShiftType = (createShiftTypeRequest: CreateShiftTypeRequest) => {
    createShiftTypeMutate({ wardId, createShiftTypeRequest });
  };

  const editShiftType = (
    shiftTypeId: number,
    createShiftTypeRequest: CreateShiftTypeRequest
  ) => {
    updateShiftTypeMutate({ wardId, shiftTypeId, createShiftTypeRequest });
  };

  const removeShiftType = (shiftTypeId: number) => {
    deleteShiftTypeMutate({ wardId, shiftTypeId });
  };

  const handleClickPenIcon = (step: ModalType) => {
    setCurrentModal(step);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return {
    state:{
      isModalOpen,
      currentModal,
      ward
    },
    actions:{
      editWardSetting,
      closeModal,
      handleClickPenIcon,
      removeShiftType,
      editShiftType,
      addShiftType
    }
  }
};

export default SetShiftPageHook;