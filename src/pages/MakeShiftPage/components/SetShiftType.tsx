import useEditWard from '@hooks/useEditWard';
import { ExitIcon, PenIcon, PlusIcon } from '@assets/svg';
import TimeInput from '@components/TimeInput';
import TextField from '@components/TextField';
function SetShiftType() {
  const {
    state: { ward },
    actions: { editShiftType, removeShiftType },
  } = useEditWard();

  const handleDeleteShift = (shiftTypeId: number) => {
    removeShiftType(shiftTypeId);
  };

  return (
    <div className="relative h-fit rounded-[1.25rem]">
      <div className="mt-[1.25rem] flex items-center text-center font-apple text-[.875rem] text-sub-2.5">
        <p className="flex-[2]">근무 명</p>
        <p className="flex-1">약자</p>
        <p className="flex-[3]">근무 시간</p>
        <p className="flex-1">색상</p>
        <p className="flex-[2]">유형</p>
      </div>
      {ward?.shiftTypes.map((shiftType, index) => (
        <div
          key={index}
          className={`flex h-[4.625rem] items-center  border-b-[.0313rem] border-sub-4.5 ${
            index === ward.shiftTypes.length - 1 && 'border-none'
          }`}
        >
          <div className="flex flex-[2] items-center justify-center font-apple text-[1.25rem]">
            {shiftType.name}
          </div>
          <div className="flex flex-1 items-center justify-center text-[1.25rem]">
            <TextField
              className="h-[2rem] w-[2rem] rounded-[.3125rem] bg-main-bg p-0 text-center text-[1.25rem] font-light text-sub-1 outline-[.0313rem] outline-sub-4.5"
              value={shiftType.shortName}
              onChange={(e) =>
                editShiftType(shiftType.shiftTypeId, {
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
                    editShiftType(shiftType.shiftTypeId, { ...shiftType, startTime: value })
                  }
                />
                <p className="font-poppins text-[1.25rem]">~</p>
                <TimeInput
                  className="h-[2rem] w-full rounded-[.3125rem] bg-main-bg p-0 text-center text-[1.25rem] font-light text-sub-1 outline-[.0313rem] outline-sub-4.5"
                  initTime={shiftType.endTime}
                  onTimeChange={(value) =>
                    editShiftType(shiftType.shiftTypeId, { ...shiftType, endTime: value })
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
              className="absolute translate-x-[100%] translate-y-[50%] opacity-0"
              type="color"
              value={shiftType.color}
              onChange={(e) =>
                editShiftType(shiftType.shiftTypeId, { ...shiftType, color: e.target.value })
              }
            />
          </div>
          <div className="flex flex-[2] justify-center">
            <PenIcon className="h-[2.25rem] w-[2.25rem] cursor-pointer" />
            {!shiftType.isDefault && (
              <ExitIcon
                className="h-[2.25rem] w-[2.25rem] cursor-pointer"
                onClick={() => handleDeleteShift(shiftType.shiftTypeId)}
              />
            )}
          </div>
        </div>
      ))}
      <div className="mb-[1.625rem] mt-[.25rem] flex cursor-pointer items-center justify-end gap-[.4375rem] pr-[2.5rem]">
        <PlusIcon className="h-[1.25rem] w-[1.25rem]" />
        <p className="font-apple text-[.875rem] text-main-2">새로운 근무/휴가 추가하기</p>
      </div>
    </div>
  );
}

export default SetShiftType;
