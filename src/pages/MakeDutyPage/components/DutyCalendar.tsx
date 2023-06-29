import { Focus } from '@pages/MakeDutyPage/components/useEditDuty';
import { RefObject } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { FoldDutyIcon } from '@assets/svg';
import ShiftBadge from '@components/ShiftBadge';

interface Props {
  duty: Duty;
  shiftList: ShiftList;
  isEditable?: boolean;
  focus?: Focus | null;
  focusedCellRef: RefObject<HTMLElement>;
  rowContainerRef: RefObject<HTMLDivElement>;
  foldedProficiency: boolean[];
  handleFocusChange?: (focus: Focus | null) => void;
  handleFold: (proficiency: number) => void;
}

export default function DutyCalendar({
  duty,
  foldedProficiency,
  shiftList,
  isEditable,
  focus,
  focusedCellRef,
  rowContainerRef,
  handleFocusChange,
  handleFold,
}: Props) {
  const clickAwayRef = useOnclickOutside(() => isEditable && handleFocusChange?.(null));

  return (
    <div ref={clickAwayRef} className="flex flex-col">
      <div className="z-10 my-[.75rem] flex h-[1.875rem] items-center gap-[1.25rem] bg-[#FDFCFE]">
        <div className="flex gap-[1.25rem]">
          <div className="w-[3.375rem] text-center font-apple text-[1rem] font-medium text-sub-3">
            숙련도
          </div>
          <div className="w-[3.375rem] text-center font-apple text-[1rem] font-medium text-sub-3">
            이름
          </div>
          <div className="w-[1.875rem] text-center font-apple text-[1rem] font-medium text-sub-3">
            이월
          </div>
          <div className="w-[5.625rem] text-center font-apple text-[1rem] font-medium text-sub-3">
            전달 근무
          </div>
          <div className="flex w-[69.5rem] rounded-[2.5rem] border-[.0625rem] border-sub-4 px-[1rem] py-[.1875rem]">
            {duty.days.map((item, j) => (
              <p
                key={j}
                className={`flex-1 text-center font-poppins text-[1rem] text-sub-2.5 ${
                  j === focus?.day && 'rounded-full bg-main-1 text-white'
                }`}
              >
                {j === focus?.day ? duty.month + '/' : ''}
                {item.day}
              </p>
            ))}
          </div>
        </div>
        <div className="flex w-[13.625rem] items-center px-[1.5625rem] text-center">
          {shiftList.slice(1).map((shift, index) => (
            <div key={index} className="flex-1 font-poppins text-[1.25rem] text-sub-3 ">
              {shift.shortName}
            </div>
          ))}
          <div className="flex-1 font-poppins text-[1.25rem] text-sub-3 ">O</div>
          <div className="flex-1 font-poppins text-[1.25rem] text-sub-3 ">WO</div>
        </div>
      </div>
      <div
        className="scroll m-[-1.25rem] flex max-h-[calc(100vh-22rem)] flex-col gap-[.3125rem] overflow-y-scroll p-[1.25rem] scrollbar-hide"
        ref={rowContainerRef}
      >
        {duty.dutyRowsByProficiency.map(({ proficiency, dutyRows }, _) => {
          return foldedProficiency[4 - proficiency] ? (
            <div
              key={_}
              className="flex h-[1.875rem] w-full cursor-pointer items-center gap-[.125rem] rounded-[.625rem] bg-sub-4.5 px-[.625rem]"
              onClick={() => handleFold(proficiency)}
            >
              <p className="font-poppins text-base text-sub-2.5">{proficiency}</p>
              <FoldDutyIcon className="h-[1.375rem] w-[1.375rem] rotate-180" />
            </div>
          ) : (
            <div key={_} className="flex gap-[1.25rem]">
              <div className="relative rounded-[1.25rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
                <div className="absolute flex h-full w-[1.875rem] items-center justify-center rounded-l-[1.25rem] bg-sub-4.5 font-poppins font-light text-sub-2.5">
                  {proficiency}
                </div>
                <FoldDutyIcon
                  className="absolute left-[1.875rem] top-[50%] h-[1.375rem] w-[1.375rem] translate-x-[-50%] translate-y-[-50%] cursor-pointer"
                  onClick={() => handleFold(proficiency)}
                />
                {dutyRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex h-[3.25rem] items-center gap-[1.25rem]">
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
                            key={j}
                            className={`flex h-full flex-1 items-center px-[.25rem] ${
                              isSunday ? 'bg-[#FFE1E680]' : isSaturday ? 'bg-[#E1E5FF80]' : ''
                            } ${j === focus?.day && 'bg-main-4'}`}
                            ref={
                              isFocued
                                ? (focusedCellRef as unknown as RefObject<HTMLParagraphElement>)
                                : null
                            }
                          >
                            <ShiftBadge
                              key={j}
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
        })}
      </div>
    </div>
  );
}
