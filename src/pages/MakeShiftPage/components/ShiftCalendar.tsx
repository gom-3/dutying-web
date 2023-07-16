import useOnclickOutside from 'react-cool-onclickoutside';
import { FoldDutyIcon } from '@assets/svg';
import ShiftBadge from '@components/ShiftBadge';
import { RefObject, useEffect, useRef } from 'react';

interface Props {
  shift: Shift | null | undefined;
  isEditable?: boolean;
  focus?: Focus | null;
  foldedLevels: boolean[] | null;
  handleFocusChange?: (focus: Focus | null) => void;
  handleFold: (level: number) => void;
}

export default function ShiftCalendar({
  shift,
  focus,
  foldedLevels,
  isEditable,
  handleFocusChange,
  handleFold,
}: Props) {
  const focusedCellRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clickAwayRef = useOnclickOutside(() => isEditable && handleFocusChange?.(null));

  useEffect(() => {
    if (focus) {
      const focusRect = focusedCellRef.current?.getBoundingClientRect();
      const container = containerRef.current;
      if (!focusRect || !container) return;

      // 셀이 화면 오른쪽에 있을 때 오른쪽으로 충분히 화면을 이동한다.
      if (focusRect.x + focusRect.width - container.offsetLeft > container.clientWidth)
        container.scroll({
          left: focusRect.left + container.scrollLeft,
        });
      // 셀이 화면 왼쪽에 있을 때 왼쪽 끝으로 화면을 이동한다.
      if (focusRect.x - container.offsetLeft < 0) container.scroll({ left: 0 });
      // 셀이 화면 아래에 있을 때 아래로 충분히 화면을 이동한다.
      if (focusRect.y + focusRect.height - container.offsetTop > container.clientHeight)
        container.scroll({
          top: focusRect.top + container.scrollTop,
        });
      // 셀이 화면 위에 있을 때 한칸씩 위로 화면을 이동한다.
      if (focusRect.y - container.offsetTop < 0)
        container.scroll({ top: focusRect.top + window.scrollY - 132 });
    }
  }, [focus]);

  return shift && foldedLevels ? (
    <div ref={clickAwayRef} className="flex flex-col">
      <div className="z-10 my-[.75rem] flex h-[1.875rem] items-center gap-[1.25rem] bg-[#FDFCFE]">
        <div className="flex gap-[1.25rem]">
          <div className="w-[3.375rem] text-center font-apple text-[1rem] font-medium text-sub-3">
            구분
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
            {shift.days.map((item, j) => (
              <p
                key={j}
                className={`flex-1 text-center font-poppins text-[1rem] text-sub-2.5 ${
                  j === focus?.day && 'rounded-full bg-main-1 text-white'
                }`}
              >
                {j === focus?.day ? shift.month + '/' : ''}
                {item.day}
              </p>
            ))}
          </div>
        </div>
        <div className="flex w-[13.625rem] items-center px-[1.5625rem] text-center">
          {shift.shiftTypeList.slice(1).map((shiftType, index) => (
            <div key={index} className="flex-1 font-poppins text-[1.25rem] text-sub-3 ">
              {shiftType.shortName}
            </div>
          ))}
          <div className="flex-1 font-poppins text-[1.25rem] text-sub-3 ">O</div>
          <div className="flex-1 font-poppins text-[1.25rem] text-sub-3 ">WO</div>
        </div>
      </div>
      <div
        className="scroll m-[-1.25rem] flex max-h-[calc(100vh-22rem)] flex-col gap-[.3125rem] overflow-y-scroll p-[1.25rem] scrollbar-hide"
        ref={containerRef}
      >
        {shift.levels.map((rows, level) => {
          return foldedLevels[level] ? (
            <div
              key={level}
              className="flex h-[1.875rem] w-full cursor-pointer items-center gap-[.125rem] rounded-[.625rem] bg-sub-4.5 px-[.625rem]"
              onClick={() => handleFold(level)}
            >
              {/* <p className="font-poppins text-base text-sub-2.5">{level}</p> */}
              <FoldDutyIcon className="h-[1.375rem] w-[1.375rem] rotate-180" />
            </div>
          ) : (
            <div key={level} className="flex gap-[1.25rem]">
              <div className="relative rounded-[1.25rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
                <div className="absolute flex h-full w-[1.875rem] items-center justify-center rounded-l-[1.25rem] bg-sub-4.5 font-poppins font-light text-sub-2.5">
                  {/* {level} */}
                  <FoldDutyIcon
                    className="absolute left-[50%] top-[50%] h-[1.375rem] w-[1.375rem] translate-x-[-50%] translate-y-[-50%] cursor-pointer"
                    onClick={() => handleFold(level)}
                  />
                </div>
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex h-[3.25rem] items-center gap-[1.25rem]">
                    <div className="w-[3.375rem] shrink-0"></div>
                    <div className="w-[3.375rem] shrink-0 text-center font-apple text-[1.25rem] text-sub-1">
                      {row.nurse.name}
                    </div>
                    <div className="w-[1.875rem] shrink-0 text-center font-apple text-[1.25rem] text-sub-1">
                      {row.carry}
                    </div>
                    <div className="flex w-[5.625rem] gap-[.125rem]">
                      {row.lastShiftTypeIndexList.map(({ current }, j) => (
                        <ShiftBadge
                          key={j}
                          shiftType={current != null ? shift.shiftTypeList[current] : null}
                          className="h-[1.3125rem] w-[1.3125rem] text-[.9375rem]"
                        />
                      ))}
                    </div>
                    <div className="flex h-full w-[69.5rem] px-[1rem]">
                      {row.shiftTypeIndexList.map(({ current }, j) => {
                        const isSaturday = shift.days[j].dayKind === 'saturday';
                        const isSunday =
                          shift.days[j].dayKind === 'sunday' || shift.days[j].dayKind === 'holyday';
                        const isFocused =
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
                                });
                              }}
                              shiftType={current != null ? shift.shiftTypeList[current] : null}
                              className={`cursor-pointer ${
                                isFocused && 'outline outline-[.0625rem] outline-main-1'
                              }`}
                              forwardRef={
                                isFocused
                                  ? (focusedCellRef as unknown as RefObject<HTMLParagraphElement>)
                                  : null
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-[13.625rem] rounded-[1.25rem] px-[1.5625rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
                {rows.map((row, i) => (
                  <div key={i} className="flex h-[3.25rem] items-center">
                    {shift.shiftTypeList.slice(1).map((_, index) => (
                      <div
                        key={index}
                        className="flex-1 text-center font-poppins text-[1.25rem] text-sub-2"
                      >
                        {
                          row.shiftTypeIndexList.filter(({ current }) => current === index + 1)
                            .length
                        }
                      </div>
                    ))}
                    <div className="flex-1 text-center font-poppins text-[1.25rem] text-sub-2">
                      {row.shiftTypeIndexList.filter(({ current }) => current === 0).length}
                    </div>
                    <div className="flex-1 text-center font-poppins text-[1.25rem] text-sub-2">
                      {
                        row.shiftTypeIndexList.filter(
                          ({ current }, i) =>
                            current === 0 &&
                            shift.days.find((x) => x.day === i + 1)?.dayKind != 'workday'
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
  ) : null;
}
