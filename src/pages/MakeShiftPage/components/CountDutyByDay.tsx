import { useState } from 'react';
import useEditShift from '@hooks/useEditShift';
import { mockShiftStandard } from '@mocks/shift';

function CountDutyByDay() {
  const {
    state: { focus, shift },
  } = useEditShift();
  const [dutyStandard] = useState(mockShiftStandard);

  return (
    shift && (
      <div className="mb-[3.125rem] mt-[1.25rem] rounded-[1.25rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
        {shift.shiftTypes.slice(0, 3).map((shiftType, index) => (
          <div
            key={index}
            className="flex h-[3.875rem] items-center justify-center gap-[1.25rem] border-b-[.0625rem] border-[#E0E0E0] last:border-none"
          >
            <div
              className={`flex h-full w-[3.125rem] items-center justify-center font-poppins text-[1.5rem] text-white 
            ${index === 0 && 'rounded-tl-[1.25rem]'} 
            ${index === shift.shiftTypes.length - 2 && 'rounded-bl-[1.25rem]'}
            `}
              style={{ backgroundColor: shiftType.color }}
            >
              {shiftType.shortName}
            </div>
            <div className="flex w-[3.4375rem] items-center justify-center gap-[.3125rem] font-apple text-[.875rem] text-sub-3">
              평일
              <span className="font-poppins text-[1.25rem] text-sub-2">
                {dutyStandard.workday[index + 1]}
              </span>
            </div>
            <div className="flex w-[3.4375rem] items-center justify-center gap-[.3125rem] font-apple text-[.875rem] text-sub-3">
              주말
              <span className="font-poppins text-[1.25rem] text-sub-2">
                {dutyStandard.weekend[index + 1]}
              </span>
            </div>
            <div className="flex h-full px-[1rem] text-center">
              {shift.days.map((_date, i) => (
                <p
                  key={i}
                  className={`flex w-[2.25rem] flex-1 items-center justify-center font-poppins text-[1.25rem] text-sub-3 ${
                    focus?.day === i && 'bg-main-4'
                  }`}
                >
                  {
                    shift.levelNurses
                      .flatMap((row) => row)
                      .filter((item) => item.shiftTypeIndexList[i].shift === index).length
                  }
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  );
}

export default CountDutyByDay;
