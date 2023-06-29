import React from 'react';

function DutyRow(props) {
  return return isFold ? (
    <div
      className="flex h-[1.875rem] w-full cursor-pointer items-center gap-[.125rem] rounded-[.625rem] bg-sub-4.5 px-[.625rem]"
      onClick={() => handleFold(proficiency)}
    >
      <p className="font-poppins text-base text-sub-2.5">{proficiency}</p>
      <FoldDutyIcon className="h-[1.375rem] w-[1.375rem] rotate-180" />
    </div>
  ) : (
    <div className="flex gap-[1.25rem]">
      <div className="relative rounded-[1.25rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
        <div className="absolute flex h-full w-[1.875rem] items-center justify-center rounded-l-[1.25rem] bg-sub-4.5 font-poppins font-light text-sub-2.5">
          {proficiency}
        </div>
        <FoldDutyIcon
          className="absolute left-[1.875rem] top-[50%] h-[1.375rem] w-[1.375rem] translate-x-[-50%] translate-y-[-50%] cursor-pointer"
          onClick={() => handleFold(proficiency)}
        />
        {dutyRows.map((row, rowIndex) => (
          <div className="flex h-[3.25rem] items-center gap-[1.25rem]">
            <div className="w-[3.375rem] shrink-0"></div>
            <div className="w-[3.375rem] shrink-0 text-center font-apple text-[1.25rem] text-sub-1">
              {row.user.name}
            </div>
            <div className="w-[1.875rem] shrink-0 text-center font-apple text-[1.25rem] text-sub-1">
              {row.carry}
            </div>
            <div className="flex w-[5.625rem] gap-[.125rem]">
              {row.lastShiftIndexList.map((shiftIndex, j) => (
                <ShiftBadge
                  key={j}
                  shift={shiftList[shiftIndex]}
                  className="h-[1.3125rem] w-[1.3125rem] text-[.9375rem]"
                />
              ))}
            </div>
            <div className="flex h-full w-[69.5rem] px-[1rem]">
              {row.shiftIndexList.map((shiftIndex, j) => {
                const isSaturday = duty.days[j].dayKind === 'saturday';
                const isSunday =
                  duty.days[j].dayKind === 'sunday' || duty.days[j].dayKind === 'holyday';
                const isFocued =
                  focus &&
                  proficiency === focus.proficiency &&
                  focus.day === j &&
                  focus.row === rowIndex;
                return (
                  <div
                    className={`w-ful flex h-full items-center px-[.25rem] ${
                      isSunday ? 'bg-[#FFE1E680]' : isSaturday ? 'bg-[#E1E5FF80]' : ''
                    } ${j === focus?.day && 'bg-main-4'}`}
                    onClick={() => console.log(focus, proficiency, j, rowIndex)}
                  >
                    <ShiftBadge
                      key={j}
                      ref={
                        isFocued
                          ? (focusedCellRef as unknown as RefObject<HTMLParagraphElement>)
                          : null
                      }
                      onClick={() => {
                        handleFocusChange?.({ proficiency, day: j, row: rowIndex });
                      }}
                      shift={shiftList[shiftIndex]}
                      className={`cursor-pointer ${
                        isFocued && 'outline outline-[.0625rem] outline-main-1'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="w-[13.625rem] rounded-[1.25rem] px-[1.5625rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
        {dutyRows.map((row, i) => (
          <div key={i} className="flex h-[3.25rem] items-center">
            {shiftList.slice(1).map((_, index) => (
              <div
                key={index}
                className="flex-1 text-center font-poppins text-[1.25rem] text-sub-2"
              >
                {row.shiftIndexList.filter((shiftIndex) => shiftIndex === index).length}
              </div>
            ))}
            <div className="flex-1 text-center font-poppins text-[1.25rem] text-sub-2">
              {row.shiftIndexList.filter((shiftIndex) => shiftIndex === 0).length}
            </div>
            <div className="flex-1 text-center font-poppins text-[1.25rem] text-sub-2">
              {
                row.shiftIndexList.filter(
                  (shiftIndex, i) =>
                    shiftIndex === 0 &&
                    duty.days.find((x) => x.day === i + 1)?.dayKind != 'workday'
                ).length
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DutyRow;
