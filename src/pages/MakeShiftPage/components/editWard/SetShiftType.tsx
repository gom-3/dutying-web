import type { CreateShiftTypeDTO } from '@libs/api/shiftType';
import { useState } from 'react';
import { PenIcon, PlusIcon } from '@assets/svg';
import useEditWard from '@hooks/ward/useEditWard';
import { events, sendEvent } from 'analytics';
import CreateShiftModal from './CreateShiftModal';

function SetShiftType() {
  const {
    state: { ward },
    actions: { editShiftType, removeShiftType, addShiftType },
  } = useEditWard();

  const [openModal, setOpenModal] = useState(false);
  const [tempShiftType, setTempShiftType] = useState<WardShiftType | null>(null);

  const handleWriteShift = (shiftType: CreateShiftTypeDTO, shiftTypeId?: number) => {
    if (shiftTypeId) {
      editShiftType(shiftTypeId, shiftType);
      setTempShiftType(null);
      sendEvent(events.makePage.editWardModal.editShiftType);
    } else {
      addShiftType(shiftType);
      sendEvent(events.makePage.editWardModal.createShiftType);
    }
    setTempShiftType(null);
  };

  return (
    <div className="relative h-fit w-[44.8125rem] rounded-[1.25rem]">
      <div className="mt-5 flex items-center text-center font-apple text-[.875rem] text-sub-2.5">
        <p className="flex-[2]">근무 명</p>
        <p className="flex-1">약자</p>
        <p className="flex-[3]">근무 시간</p>
        <p className="flex-1">색상</p>
        <p className="flex-1">유형</p>
        <p className="flex-1">카운트</p>
        <p className="flex-1">수정</p>
      </div>
      {ward?.wardShiftTypes.map((shiftType, index) => (
        <div
          key={index}
          className={`flex h-[4.625rem] items-center  border-b-[.0313rem] border-sub-4.5 ${index === ward.wardShiftTypes.length - 1 && 'border-none'}`}
        >
          <div className="flex flex-[2] items-center justify-center font-apple text-[1.25rem]">{shiftType.name}</div>
          <div className="flex flex-1 items-center justify-center text-[1.25rem]">
            <p className="size-8 rounded-[.3125rem] border-[.0313rem] border-sub-4.5 bg-main-bg p-0 text-center text-[1.25rem] text-sub-1">
              {shiftType.shortName}
            </p>
          </div>
          <div className="flex flex-[3] items-center justify-center gap-[1.125rem]">
            {shiftType.isOff ? (
              <p className="font-poppins text-[1.25rem]">-</p>
            ) : (
              <>
                <p className="h-8 w-full rounded-[.3125rem] border-[.0313rem] border-sub-4.5 bg-main-bg p-0 text-center text-[1.25rem] text-sub-1">
                  {shiftType.startTime}
                </p>
                <p className="font-poppins text-[1.25rem]">~</p>
                <p className="h-8 w-full rounded-[.3125rem] border-[.0313rem] border-sub-4.5 bg-main-bg p-0 text-center text-[1.25rem] text-sub-1">
                  {shiftType.endTime}
                </p>
              </>
            )}
          </div>
          <div className="relative flex flex-1 items-center justify-center font-apple text-[2.25rem] font-semibold text-sub-2.5">
            <label
              htmlFor={`color_picker_${index}`}
              className={`size-8 rounded-[.4375rem] border-[.0625rem] border-sub-4`}
              style={{ backgroundColor: shiftType.color }}
            />
          </div>
          <div className="flex flex-1 justify-center">
            <div
              className="cursor-pointer rounded-[1.25rem] border-[.0313rem] border-main-2 px-[.75rem] py-[.3125rem] font-apple text-[.875rem] text-main-2"
              onClick={() => {
                editShiftType(shiftType.wardShiftTypeId, { ...shiftType, isOff: !shiftType.isOff });
                sendEvent(events.makePage.editWardModal.changeShiftTypeOffType);
              }}
            >
              {shiftType.isOff ? '휴가' : '근무'}
            </div>
          </div>
          <div className="flex flex-1 justify-center">
            <div
              className="cursor-pointer rounded-[1.25rem] border-[.0313rem] border-main-2 px-[.75rem] py-[.3125rem] font-apple text-[.875rem] text-main-2"
              onClick={() => {
                editShiftType(shiftType.wardShiftTypeId, {
                  ...shiftType,
                  isCounted: !shiftType.isCounted,
                });
              }}
            >
              {shiftType.isCounted ? 'On' : 'Off'}
            </div>
          </div>
          <div className="flex flex-1 justify-center">
            <PenIcon
              className="size-9 cursor-pointer"
              onClick={() => {
                setTempShiftType(shiftType);
                setOpenModal(true);
                sendEvent(events.makePage.editWardModal.openEditModal);
              }}
            />
          </div>
        </div>
      ))}
      <div className="mb-[1.625rem] mt-[.25rem] flex items-center justify-end  pr-10">
        <div
          className="flex cursor-pointer gap-[.4375rem]"
          onClick={() => {
            setOpenModal(true);
            sendEvent(events.makePage.editWardModal.openEditModal);
          }}
        >
          <PlusIcon className="size-5 stroke-main-2" />
          <p className="font-apple text-[.875rem] text-main-2">새로운 근무/휴가 추가하기</p>
        </div>
      </div>
      <CreateShiftModal
        open={openModal}
        close={() => {
          setTempShiftType(null);
          setOpenModal(false);
        }}
        shiftType={tempShiftType}
        onSubmit={(shiftType) => handleWriteShift(shiftType, tempShiftType?.wardShiftTypeId)}
        onDelete={() => tempShiftType && removeShiftType(tempShiftType?.wardShiftTypeId)}
      />
    </div>
  );
}

export default SetShiftType;
