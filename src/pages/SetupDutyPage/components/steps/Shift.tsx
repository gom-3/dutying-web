/* eslint-disable react-refresh/only-export-components */
import TextField from '@components/TextField';

interface ContentsProps {
  shiftList: ShiftList;
  setShiftList: (shiftList: ShiftList) => void;
}

function Contents({ shiftList, setShiftList }: ContentsProps) {
  const handleChangeShift = (shift: Shift, shiftIndex: number, key: keyof Shift, value: string) => {
    setShiftList(shiftList.map((_, i) => (i === shiftIndex + 1 ? { ...shift, [key]: value } : _)));
  };

  return (
    <div className="mt-[3.125rem] w-[76%]">
      <div className="mb-[.6875rem] flex h-[3.125rem] items-center rounded-[3.875rem] bg-sub-4.5">
        <p className="flex-1 text-center font-apple text-[1.5rem] text-sub-2.5">근무 명</p>
        <p className="flex-1 text-center font-apple text-[1.5rem] text-sub-2.5">약자</p>
        <p className="flex-[3] text-center font-apple text-[1.5rem] text-sub-2.5">근무 시간</p>
        <p className="flex-1 text-center font-apple text-[1.5rem] text-sub-2.5">색상</p>
      </div>
      {shiftList.slice(1).map((shift, index) => (
        <div
          key={index}
          className="mb-[1.25rem] flex h-[9.1875rem] items-center rounded-[1.25rem] bg-white shadow-[0rem_.25rem_2.125rem_#EDE9F5] last:mb-0"
        >
          <div className="flex flex-1 items-center justify-center font-apple text-[2.25rem] font-semibold text-sub-2.5">
            {shift.fullname}
          </div>
          <div className="flex flex-1 items-center justify-center font-apple text-[2.25rem] font-semibold text-sub-2.5">
            <TextField
              className="h-[4rem] w-[4rem] text-center"
              value={shift.shortName}
              onChange={(e) =>
                handleChangeShift(shift, index, 'name', e.target.value.slice(0, 1).toUpperCase())
              }
            />
          </div>
          <div className="flex flex-[3] items-center justify-center gap-[1.125rem] font-apple text-[2.25rem] font-semibold text-sub-2.5">
            <TextField
              className="h-[4rem] w-[15rem] pl-2"
              value={shift.startTime}
              type="time"
              onChange={(e) => handleChangeShift(shift, index, 'startTime', e.target.value)}
            />
            <p>~</p>
            <TextField
              className="h-[4rem] w-[15rem] pl-2"
              value={shift.endTime}
              type="time"
              onChange={(e) => handleChangeShift(shift, index, 'endTime', e.target.value)}
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
