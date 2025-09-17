import { useState } from 'react';
import { PenIcon, PlusIcon } from '@/assets/svg';
import useEditWard from '@/hooks/ward/useEditWard';
import { type CreateShiftTypeDTO } from '@/libs/api/shiftType';
import { type WardShiftType } from '@/types/ward';
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
    <div className="relative h-fit w-179.25 rounded-[1.25rem]">
      <div className="font-apple text-sub-2.5 mt-5 flex items-center text-center text-[.875rem]">
        <p className="flex-2">근무 명</p>
        <p className="flex-1">약자</p>
        <p className="flex-3">근무 시간</p>
        <p className="flex-1">색상</p>
        <p className="flex-1">유형</p>
        <p className="flex-1">카운트</p>
        <p className="flex-1">수정</p>
      </div>
      {ward?.wardShiftTypes.map((shiftType, index) => (
        <div
          key={index}
          className={`border-sub-4.5 flex h-18.5 items-center border-b-[.0313rem] ${
            index === ward.wardShiftTypes.length - 1 && 'border-none'
          }`}
        >
          <div className="font-apple flex flex-2 items-center justify-center text-[1.25rem]">
            {shiftType.name}
          </div>
          <div className="flex flex-1 items-center justify-center text-[1.25rem]">
            <p className="border-sub-4.5 bg-main-bg text-sub-1 h-8 w-8 rounded-[.3125rem] border-[.0313rem] p-0 text-center text-[1.25rem]">
              {shiftType.shortName}
            </p>
          </div>
          <div className="flex flex-3 items-center justify-center gap-4.5">
            {shiftType.isOff ? (
              <p className="font-poppins text-[1.25rem]">-</p>
            ) : (
              <>
                <p className="border-sub-4.5 bg-main-bg text-sub-1 h-8 w-full rounded-[.3125rem] border-[.0313rem] p-0 text-center text-[1.25rem]">
                  {shiftType.startTime}
                </p>
                <p className="font-poppins text-[1.25rem]">~</p>
                <p className="border-sub-4.5 bg-main-bg text-sub-1 h-8 w-full rounded-[.3125rem] border-[.0313rem] p-0 text-center text-[1.25rem]">
                  {shiftType.endTime}
                </p>
              </>
            )}
          </div>
          <div className="font-apple text-sub-2.5 relative flex flex-1 items-center justify-center text-[2.25rem] font-semibold">
            <label
              htmlFor={`color_picker_${index}`}
              className={`border-sub-4 h-8 w-8 rounded-[.4375rem] border-[.0625rem]`}
              style={{ backgroundColor: shiftType.color }}
            />
          </div>
          <div className="flex flex-1 justify-center">
            <div
              className="border-main-2 font-apple text-main-2 cursor-pointer rounded-[1.25rem] border-[.0313rem] px-[.75rem] py-[.3125rem] text-[.875rem]"
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
              className="border-main-2 font-apple text-main-2 cursor-pointer rounded-[1.25rem] border-[.0313rem] px-[.75rem] py-[.3125rem] text-[.875rem]"
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
              className="h-9 w-9 cursor-pointer"
              onClick={() => {
                setTempShiftType(shiftType);
                setOpenModal(true);
                sendEvent(events.makePage.editWardModal.openEditModal);
              }}
            />
          </div>
        </div>
      ))}
      <div className="mt-[.25rem] mb-6.5 flex items-center justify-end pr-10">
        <div
          className="flex cursor-pointer gap-[.4375rem]"
          onClick={() => {
            setOpenModal(true);
            sendEvent(events.makePage.editWardModal.openEditModal);
          }}
        >
          <PlusIcon className="stroke-main-2 h-5 w-5" />
          <p className="font-apple text-main-2 text-[.875rem]">새로운 근무/휴가 추가하기</p>
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
