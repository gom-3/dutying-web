import { useState } from 'react';
import useEditWard from '@hooks/useEditWard';
import { ExitIcon, PenIcon, PlusIcon } from '@assets/svg';
import { CreateShiftTypeRequest } from '@libs/api/shift';
import CreateShiftModal from '@pages/RegisterWardPage/components/CreateShiftModal';

function SetShift() {
  const {
    state: { ward },
    actions: { addShiftType, editShiftType, removeShiftType },
  } = useEditWard();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editShift, setEditShift] = useState<ShiftType | null>(null);

  const handleWriteShift = (shiftType: CreateShiftTypeRequest, shiftTypeId?: number) => {
    if (shiftTypeId) {
      editShiftType(shiftTypeId, shiftType);
      setEditShift(null);
    } else {
      addShiftType(shiftType);
    }
    setEditShift(null);
  };

  const handleDeleteShift = (shiftTypeId: number) => {
    removeShiftType(shiftTypeId);
  };

  return (
    <div className="relative h-fit rounded-[1.25rem]">
      <div className="mb-[.6875rem] flex h-[3.125rem] items-center rounded-t-[1.25rem] bg-sub-4.5">
        <p className="flex-[2] text-center font-apple text-[1.5rem] text-sub-2.5">근무 명</p>
        <p className="flex-1 text-center font-apple text-[1.5rem] text-sub-2.5">약자</p>
        <p className="flex-[3] text-center font-apple text-[1.5rem] text-sub-2.5">근무 시간</p>
        <p className="flex-1 text-center font-apple text-[1.5rem] text-sub-2.5">색상</p>
        <p className="flex-1"></p>
      </div>
      {ward?.shiftTypes.map((shiftType, index) => (
        <div key={index} className="flex h-[9.1875rem] items-center">
          <div className="flex flex-[2] items-center justify-center font-poppins text-[2.25rem] text-sub-2.5">
            {shiftType.name}
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="h-[4rem] w-[4rem] px-0 text-center font-poppins text-[2.25rem] font-normal text-sub-2.5">
              {shiftType.shortName}
            </div>
          </div>
          <div className="flex flex-[3] items-center justify-center gap-[1.125rem] text-sub-2.5">
            {shiftType.isOff ? (
              <p className="font-poppins text-[2.25rem]">-</p>
            ) : (
              <div className="flex">
                <div className="h-[4rem] w-[9.375rem] text-center font-poppins text-[2.25rem]">
                  {shiftType.startTime}
                </div>
                <p className="mx-[1rem] font-poppins text-[2.25rem]">~</p>
                <div className="h-[4rem] w-[9.375rem] text-center font-poppins text-[2.25rem]">
                  {shiftType.endTime}
                </div>
              </div>
            )}
          </div>
          <div className="relative flex flex-1 items-center justify-center font-apple text-[2.25rem] font-semibold text-sub-2.5">
            <label
              htmlFor={`color_picker_${index}`}
              className={`h-[4rem] w-[4rem] rounded-full`}
              style={{ backgroundColor: shiftType.color }}
            />
            <input
              id={`color_picker_${index}`}
              className="absolute translate-x-[100%] translate-y-[50%] opacity-0"
              type="color"
              defaultValue={shiftType.color}
            />
          </div>
          <div className="flex flex-1 justify-end">
            <div className="mr-[3.75rem] flex gap-[1.875rem]">
              <PenIcon
                className="h-[2.25rem] w-[2.25rem] cursor-pointer"
                onClick={() => {
                  setEditShift(shiftType);
                  setOpenModal(true);
                }}
              />
              {!shiftType.isDefault && (
                <ExitIcon
                  className="h-[2.25rem] w-[2.25rem] cursor-pointer"
                  onClick={() => handleDeleteShift(shiftType.shiftTypeId)}
                />
              )}
            </div>
          </div>
        </div>
      ))}
      <div
        className="bottom-[-3rem] flex cursor-pointer items-center gap-[1.25rem]"
        onClick={() => {
          setEditShift(null);
          setOpenModal(true);
        }}
      >
        <PlusIcon className="h-[1.75rem] w-[1.75rem]" />
        <p className="font-apple text-[1.25rem] text-sub-2.5">새로운 근무/휴가 추가하기</p>
      </div>
      <CreateShiftModal
        open={openModal}
        close={() => {
          setEditShift(null);
          setOpenModal(false);
        }}
        shiftType={editShift}
        onSubmit={(shiftType) => handleWriteShift(shiftType, editShift?.shiftTypeId)}
      />
    </div>
  );
}

export default SetShift;
