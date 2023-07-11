import { ExitIcon, PenIcon, PlusIcon } from '@assets/svg';
import TextField from '@components/TextField';
import TimeInput from '@components/TimeInput';
import CreateShiftModal from './CreateShiftModal';
import { useState } from 'react';
import {
  CreateShiftListRequest,
  CreateShiftRequest,
} from '@pages/OnboardingPage/components/useCreateWard';

interface ContentsProps {
  shiftList: CreateShiftListRequest;
  setShiftList: (shiftList: CreateShiftListRequest) => void;
}

function SetShift({ shiftList, setShiftList }: ContentsProps) {
  const [openModal, setOpenModal] = useState(false);
  const [editShift, setEditShift] = useState<CreateShiftRequest | null>(null);

  const handleChangeShift = (
    shift: CreateShiftRequest,
    shiftIndex: number,
    key: keyof CreateShiftRequest,
    value: string
  ) => {
    setShiftList(shiftList.map((_, i) => (i === shiftIndex ? { ...shift, [key]: value } : _)));
  };

  const handleWriteShift = (shift: CreateShiftRequest) => {
    if (editShift) {
      setShiftList(shiftList.map((_, i) => (i === shiftList.indexOf(editShift) ? shift : _)));
      setEditShift(null);
    } else {
      setShiftList([...shiftList, shift]);
    }
    setOpenModal(false);
  };

  const handleDeleteShift = (shiftIndex: number) => {
    setShiftList(shiftList.filter((_, i) => i !== shiftIndex));
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
      {shiftList.map((shift, index) => (
        <div key={index} className="flex h-[9.1875rem] items-center">
          <div className="flex flex-[2] items-center justify-center font-poppins text-[2.25rem] text-sub-2.5">
            {shift.name}
          </div>
          <div className="flex flex-1 items-center justify-center">
            <TextField
              className="h-[4rem] w-[4rem] px-0 text-center font-poppins text-[2.25rem] font-normal text-sub-2.5"
              value={shift.shortName}
              onChange={(e) =>
                handleChangeShift(
                  shift,
                  index,
                  'shortName',
                  e.target.value.slice(0, 1).toUpperCase()
                )
              }
            />
          </div>
          <div className="flex flex-[3] items-center justify-center gap-[1.125rem] text-sub-2.5">
            {shift.isOff ? (
              <p className="font-poppins text-[2.25rem]">-</p>
            ) : (
              <>
                <TimeInput
                  className="h-[4rem] w-[9.375rem] text-center"
                  initTime={shift.startTime}
                  onTimeChange={(value) =>
                    handleChangeShift(shift, index, 'startTime', value || '')
                  }
                />
                <p className="font-poppins text-[2.25rem]">~</p>
                <TimeInput
                  className="h-[4rem] w-[9.375rem] text-center"
                  initTime={shift.endTime}
                  onTimeChange={(value) => handleChangeShift(shift, index, 'endTime', value || '')}
                />
              </>
            )}
          </div>
          <div className="relative flex flex-1 items-center justify-center font-apple text-[2.25rem] font-semibold text-sub-2.5">
            <label
              htmlFor={`color_picker_${index}`}
              className={`h-[4rem] w-[4rem] rounded-full`}
              style={{ backgroundColor: shift.color }}
            />
            <input
              id={`color_picker_${index}`}
              className="absolute translate-x-[100%] translate-y-[50%] opacity-0"
              type="color"
              value={shift.color}
              onChange={(e) => handleChangeShift(shift, index, 'color', e.target.value)}
            />
          </div>
          <div className="flex flex-1 justify-end">
            <div className="mr-[3.75rem] flex gap-[1.875rem]">
              <PenIcon
                className="h-[2.25rem] w-[2.25rem] cursor-pointer"
                onClick={() => {
                  setEditShift(shift);
                  setOpenModal(true);
                }}
              />
              {!shift.isDefault && (
                <ExitIcon
                  className="h-[2.25rem] w-[2.25rem] cursor-pointer"
                  onClick={() => handleDeleteShift(index)}
                />
              )}
            </div>
          </div>
        </div>
      ))}
      <div
        className="absolute bottom-[-3rem] flex cursor-pointer items-center gap-[1.25rem]"
        onClick={() => {
          setEditShift(null);
          setOpenModal(true);
        }}
      >
        <PlusIcon className="h-[1.75rem] w-[1.75rem]" />
        <p className="font-apple text-[1.25rem] text-sub-2.5">새로운 근무/휴가 추가하기</p>
      </div>
      <CreateShiftModal
        shift={editShift}
        open={openModal}
        setOpen={setOpenModal}
        onSubmit={handleWriteShift}
      />
    </div>
  );
}

export default SetShift;
