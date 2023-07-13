import { Focus } from '@pages/MakeDutyPage/components/useEditDuty';
import { RefObject } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { UnlinkedIcon } from '@assets/svg';
import ShiftBadge from '@components/ShiftBadge';

interface Props {
  duty: Duty;
  shiftList: ShiftList;
  isEditable?: boolean;
  focus?: Focus | null;
  focusedCellRef: RefObject<HTMLElement>;
  rowContainerRef: RefObject<HTMLDivElement>;
  handleFocusChange?: (focus: Focus | null) => void;
  selectedNurse: Nurse | null;
}

export default function DutyCalendar({
  duty,
  shiftList,
  isEditable,
  focus,
  focusedCellRef,
  rowContainerRef,
  handleFocusChange,
  selectedNurse,
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
            연동
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
      </div>
      <div
        className="m-[-1.25rem] flex max-h-[calc(100vh-10rem)] flex-col gap-[.3125rem] overflow-y-scroll p-[1.25rem] scrollbar-hide"
        ref={rowContainerRef}
      >
        {duty.dutyRowsByLevel.map(({ level, dutyRows }, _) => {
          return (
            <div key={_} className="flex gap-[1.25rem]">
              <div className="relative rounded-[1.25rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
                <div className="absolute flex h-full w-[1.875rem] items-center justify-center rounded-l-[1.25rem] bg-sub-4.5 font-poppins font-light text-sub-2.5">
                  {level}
                </div>
                {dutyRows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`flex h-[3.25rem] items-center gap-[1.25rem] rounded-l-[1.25rem] hover:bg-main-4 ${
                      selectedNurse?.nurseId === row.user.nurseId && 'bg-main-4'
                    }`}
                  >
                    <div className="w-[3.375rem] shrink-0"></div>
                    <div className="w-[3.375rem] shrink-0 text-center font-apple text-[1.25rem] text-sub-1">
                      {row.user.name}
                    </div>
                    <div className="w-[1.875rem] shrink-0 text-center font-apple text-[1.25rem] text-sub-1">
                      <UnlinkedIcon className="h-[1.5rem] w-[1.5rem]" />
                    </div>
                    <div className="flex h-full w-[69.5rem] px-[1rem]">
                      {row.shiftIndexList.map((shiftIndex, j) => {
                        const isSaturday = duty.days[j].dayKind === 'saturday';
                        const isSunday =
                          duty.days[j].dayKind === 'sunday' || duty.days[j].dayKind === 'holyday';
                        const isFocued =
                          focus &&
                          level === focus.level &&
                          focus.day === j &&
                          focus.row === rowIndex;
                        return (
                          <div
                            key={j}
                            className={`flex h-full flex-1 items-center px-[.25rem] ${
                              isSunday ? 'bg-[#FFE1E680]' : isSaturday ? 'bg-[#E1E5FF80]' : ''
                            } ${j === focus?.day && 'bg-main-4'}`}
                          >
                            <ShiftBadge
                              key={j}
                              onClick={() => {
                                handleFocusChange?.({
                                  level: level,
                                  day: j,
                                  row: rowIndex,
                                  openTooltip: true,
                                });
                              }}
                              forwardRef={
                                isFocued
                                  ? (focusedCellRef as unknown as RefObject<HTMLParagraphElement>)
                                  : null
                              }
                              shiftType={shiftList[shiftIndex]}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
