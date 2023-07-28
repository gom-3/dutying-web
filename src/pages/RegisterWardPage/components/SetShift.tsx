import { PenIcon, PlusIcon } from '@assets/svg';
import TextField from '@components/TextField';
import TimeInput from '@components/TimeInput';
import CreateShiftModal from './CreateShiftModal';
import { useState } from 'react';
import useCreateWard from '@hooks/useCreateWard';

function SetShift() {
  const {
    state: { shiftTypes },
    actions: { changeShiftTypes },
  } = useCreateWard();
  const [openModal, setOpenModal] = useState(false);
  const [editShift, setEditShift] = useState<CreateShiftTypeRequestDTO | null>(null);

  const handleChangeShift = (
    shiftType: CreateShiftTypeRequestDTO,
    shiftIndex: number,
    key: keyof CreateShiftTypeRequestDTO,
    value: string
  ) => {
    changeShiftTypes(
      shiftTypes.map((_, i) => (i === shiftIndex ? { ...shiftType, [key]: value } : _))
    );
  };

  const handleWriteShift = (shiftType: CreateShiftTypeRequestDTO) => {
    if (editShift) {
      changeShiftTypes(
        shiftTypes.map((_, i) => (i === shiftTypes.indexOf(editShift) ? shiftType : _))
      );
      setEditShift(null);
    } else {
      changeShiftTypes([...shiftTypes, shiftType]);
    }
    setOpenModal(false);
  };

  // const handleDeleteShift = (shiftIndex: number) => {
  //   setShiftTypeList(shiftTypeList.filter((_, i) => i !== shiftIndex));
  // };

  return (
    <div className="relative h-fit rounded-[1.25rem]">
      <div className="mb-[.6875rem] flex h-[3.125rem] items-center rounded-t-[1.25rem] bg-sub-4.5">
        <p className="flex-[2] text-center font-apple text-[1.5rem] text-sub-2.5">근무 명</p>
        <p className="flex-1 text-center font-apple text-[1.5rem] text-sub-2.5">약자</p>
        <p className="flex-[3] text-center font-apple text-[1.5rem] text-sub-2.5">근무 시간</p>
        <p className="flex-1 text-center font-apple text-[1.5rem] text-sub-2.5">색상</p>
        <p className="flex-1"></p>
      </div>
      {shiftTypes.map((shiftType, index) => (
        <div key={index} className="flex h-[9.1875rem] items-center">
          <div className="flex flex-[2] items-center justify-center font-poppins text-[2.25rem] text-sub-2.5">
            {shiftType.name}
          </div>
          <div className="flex flex-1 items-center justify-center">
            <TextField
              className="h-[4rem] w-[4rem] px-0 text-center font-poppins text-[2.25rem] font-normal text-sub-2.5"
              value={shiftType.shortName}
              onChange={(e) =>
                handleChangeShift(
                  shiftType,
                  index,
                  'shortName',
                  e.target.value.slice(0, 1).toUpperCase()
                )
              }
            />
          </div>
          <div className="flex flex-[3] items-center justify-center gap-[1.125rem] text-sub-2.5">
            {shiftType.isOff ? (
              <p className="font-poppins text-[2.25rem]">-</p>
            ) : (
              <>
                <TimeInput
                  className="h-[4rem] w-[9.375rem] text-center"
                  initTime={shiftType.startTime}
                  onTimeChange={(value) =>
                    handleChangeShift(shiftType, index, 'startTime', value || '')
                  }
                />
                <p className="font-poppins text-[2.25rem]">~</p>
                <TimeInput
                  className="h-[4rem] w-[9.375rem] text-center"
                  initTime={shiftType.endTime}
                  onTimeChange={(value) =>
                    handleChangeShift(shiftType, index, 'endTime', value || '')
                  }
                />
              </>
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
              value={shiftType.color}
              onChange={(e) => handleChangeShift(shiftType, index, 'color', e.target.value)}
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
              {/* {!shiftType.isDefault && (
                <ExitIcon
                  className="h-[2.25rem] w-[2.25rem] cursor-pointer"
                  onClick={() => handleDeleteShift(index)}
                />
              )} */}
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
        shiftType={editShift}
        open={openModal}
        setOpen={setOpenModal}
        onSubmit={handleWriteShift}
      />
    </div>
  );
}

export default SetShift;
