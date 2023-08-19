import useEditWard from '@hooks/useEditWard';
import { PenIcon, PlusIcon } from '@assets/svg';
import TimeInput from '@components/TimeInput';
import TextField from '@components/TextField';
import { useState } from 'react';
import CreateShiftModal from './CreateWardModal';
import { CreateShiftTypeDTO } from '@libs/api/shift';

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
    } else {
      addShiftType(shiftType);
    }
    setTempShiftType(null);
  };

  return (
    <div className="relative h-fit rounded-[1.25rem]">
      <div className="mt-[1.25rem] flex items-center text-center font-apple text-[.875rem] text-sub-2.5">
        <p className="flex-[2]">근무 명</p>
        <p className="flex-1">약자</p>
        <p className="flex-[3]">근무 시간</p>
        <p className="flex-1">색상</p>
        <p className="flex-1">유형</p>
        <p className="flex-1">수정</p>
      </div>
      {ward?.wardShiftTypes.map((shiftType, index) => (
        <div
          key={index}
          className={`flex h-[4.625rem] items-center  border-b-[.0313rem] border-sub-4.5 ${
            index === ward.wardShiftTypes.length - 1 && 'border-none'
          }`}
        >
          <div className="flex flex-[2] items-center justify-center font-apple text-[1.25rem]">
            {shiftType.name}
          </div>
          <div className="flex flex-1 items-center justify-center text-[1.25rem]">
            <TextField
              className="h-[2rem] w-[2rem] rounded-[.3125rem] bg-main-bg p-0 text-center text-[1.25rem] font-light text-sub-1 outline-[.0313rem] outline-sub-4.5"
              value={shiftType.shortName}
              onClick={(e) => {
                e.currentTarget.select();
              }}
              onChange={(e) =>
                editShiftType(shiftType.wardShiftTypeId, {
                  ...shiftType,
                  shortName: e.target.value.slice(0, 1).toUpperCase(),
                })
              }
            />
          </div>
          <div className="flex flex-[3] items-center justify-center gap-[1.125rem]">
            {shiftType.isOff ? (
              <p className="font-poppins text-[1.25rem]">-</p>
            ) : (
              <>
                <TimeInput
                  className="h-[2rem] w-full rounded-[.3125rem] bg-main-bg p-0 text-center text-[1.25rem] font-light text-sub-1 outline-[.0313rem] outline-sub-4.5"
                  initTime={shiftType.startTime}
                  onTimeChange={(value) =>
                    editShiftType(shiftType.wardShiftTypeId, { ...shiftType, startTime: value })
                  }
                />
                <p className="font-poppins text-[1.25rem]">~</p>
                <TimeInput
                  className="h-[2rem] w-full rounded-[.3125rem] bg-main-bg p-0 text-center text-[1.25rem] font-light text-sub-1 outline-[.0313rem] outline-sub-4.5"
                  initTime={shiftType.endTime}
                  onTimeChange={(value) =>
                    editShiftType(shiftType.wardShiftTypeId, { ...shiftType, endTime: value })
                  }
                />
              </>
            )}
          </div>
          <div className="relative flex flex-1 items-center justify-center font-apple text-[2.25rem] font-semibold text-sub-2.5">
            <label
              htmlFor={`color_picker_${index}`}
              className={`h-[2rem] w-[2rem] rounded-[.4375rem]`}
              style={{ backgroundColor: shiftType.color }}
            />
            <input
              id={`color_picker_${index}`}
              className="absolute h-[2rem] w-[2rem] cursor-pointer opacity-0"
              type="color"
              value={shiftType.color}
              onChange={(e) =>
                editShiftType(shiftType.wardShiftTypeId, { ...shiftType, color: e.target.value })
              }
            />
          </div>
          <div className="flex flex-1 justify-center">
            <div
              className="cursor-pointer rounded-[1.25rem] border-[.0313rem] border-main-2 px-[.75rem] py-[.3125rem] font-apple text-[.875rem] text-main-2"
              onClick={() =>
                editShiftType(shiftType.wardShiftTypeId, { ...shiftType, isOff: !shiftType.isOff })
              }
            >
              {shiftType.isOff ? '휴가' : '근무'}
            </div>
          </div>
          <div className="flex flex-1 justify-center">
            <PenIcon
              className="h-[2.25rem] w-[2.25rem] cursor-pointer"
              onClick={() => {
                setTempShiftType(shiftType);
                setOpenModal(true);
              }}
            />
          </div>
        </div>
      ))}
      <div className="mb-[1.625rem] mt-[.25rem] flex items-center justify-end  pr-[2.5rem]">
        <div
          className="flex cursor-pointer gap-[.4375rem]"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          <PlusIcon className="h-[1.25rem] w-[1.25rem]" />
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
