/* eslint-disable react-refresh/only-export-components */
import TextField from '@components/TextField';
import TimeInput from '@components/TimeInput';
import 'react-time-picker/dist/TimePicker.css';

interface ContentsProps {
  shiftList: ShiftList;
  setShiftList: (shiftList: ShiftList) => void;
}

function Contents({ shiftList, setShiftList }: ContentsProps) {
  const handleChangeShift = (shift: Shift, shiftIndex: number, key: keyof Shift, value: string) => {
    setShiftList(shiftList.map((_, i) => (i === shiftIndex ? { ...shift, [key]: value } : _)));
  };

  return (
    <div className="rounded-[1.25rem]">
      <div className="mb-[.6875rem] flex h-[3.125rem] items-center rounded-t-[1.25rem] bg-sub-4.5">
        <p className="flex-1 text-center font-apple text-[1.5rem] text-sub-2.5">근무 명</p>
        <p className="flex-1 text-center font-apple text-[1.5rem] text-sub-2.5">약자</p>
        <p className="flex-[2] text-center font-apple text-[1.5rem] text-sub-2.5">근무 시간</p>
        <p className="flex-1 text-center font-apple text-[1.5rem] text-sub-2.5">색상</p>
      </div>
      {shiftList.map((shift, index) => (
        <div key={index} className="flex h-[9.1875rem] items-center">
          <div className="flex flex-1 items-center justify-center font-poppins text-[2.25rem] text-sub-2.5">
            {shift.fullname}
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
          <div className="flex flex-[2] items-center justify-center gap-[1.125rem] text-sub-2.5">
            <TimeInput
              className="h-[4rem] w-[9.375rem] text-center"
              initTime={shift.startTime}
              onTimeChange={(value) => handleChangeShift(shift, index, 'startTime', value || '')}
            />
            <p>~</p>
            <TimeInput
              className="h-[4rem] w-[9.375rem] text-center"
              initTime={shift.endTime}
              onTimeChange={(value) => handleChangeShift(shift, index, 'endTime', value || '')}
            />
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
        </div>
      ))}
    </div>
  );
}

export default { Contents };
