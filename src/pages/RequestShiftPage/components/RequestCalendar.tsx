import useOnclickOutside from 'react-cool-onclickoutside';
import ShiftBadge from '@components/ShiftBadge';
import { RefObject, useEffect, useRef } from 'react';
import { FoldDutyIcon } from '@assets/svg';
import { event, sendEvent } from 'analytics';
import useRequestShift from '@hooks/useRequestShift';

interface Props {
  isEditable?: boolean;
}

export default function RequestCalendar({ isEditable }: Props) {
  const {
    state: { focus, requestShift, foldedLevels, month },
    actions: { changeFocus, foldLevel },
  } = useRequestShift();

  const focusedCellRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clickAwayRef = useOnclickOutside(() => isEditable && changeFocus?.(null));

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

  return requestShift && foldedLevels ? (
    <div ref={clickAwayRef} className="flex flex-col">
      <div className="z-10 my-[.75rem] flex h-[1.875rem] items-center gap-[1.25rem] bg-[#FDFCFE]">
        <div className="flex gap-[1.25rem]">
          <div className="w-[3.375rem] text-center font-apple text-[1rem] font-medium text-sub-3">
            숙련도
          </div>
          <div className="w-[4.375rem] text-center font-apple text-[1rem] font-medium text-sub-3">
            이름
          </div>

          <div className="flex rounded-[2.5rem] border-[.0625rem] border-sub-4 px-[1rem] py-[.1875rem]">
            {requestShift.days.map((item, j) => (
              <p
                key={j}
                className={`w-[2.25rem] flex-1 text-center font-poppins text-[1rem] text-sub-2.5 ${
                  j === focus?.day && 'rounded-full bg-main-1 text-white'
                }`}
              >
                {j === focus?.day ? month + '/' : ''}
                {item.day}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div
        className="m-[-1.25rem] flex max-h-[calc(100vh-10rem)] flex-col gap-[.3125rem] overflow-x-hidden overflow-y-scroll p-[1.25rem] scrollbar-hide"
        ref={containerRef}
      >
        {requestShift.levelNurses.map((rows, level) => {
          return foldedLevels[level] ? (
            <div
              key={level}
              className="flex h-[1.875rem] w-full cursor-pointer items-center gap-[.125rem] rounded-[.625rem] bg-sub-4.5 px-[.625rem]"
              onClick={() => {
                sendEvent(event.clickFoldLevelButton, 'close at request');
                foldLevel(level);
              }}
            >
              <FoldDutyIcon className="h-[1.375rem] w-[1.375rem] rotate-180" />
            </div>
          ) : (
            <div key={level} className="flex gap-[1.25rem]">
              <div className="relative rounded-[1.25rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
                <div className="absolute flex h-full w-[1.875rem] items-center justify-center rounded-l-[1.25rem] bg-sub-4.5 font-poppins font-light text-sub-2.5">
                  <div className="absolute flex h-full w-[1.875rem] items-center justify-center rounded-l-[1.25rem] bg-sub-4.5 font-poppins font-light text-sub-2.5">
                    <FoldDutyIcon
                      className="absolute left-[50%] top-[50%] h-[1.375rem] w-[1.375rem] translate-x-[-50%] translate-y-[-50%] cursor-pointer"
                      onClick={() => {
                        sendEvent(event.clickFoldLevelButton, 'open at request');
                        foldLevel(level);
                      }}
                    />
                  </div>
                </div>
                {rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`flex h-[3.25rem] items-center gap-[1.25rem] rounded-l-[1.25rem] ${
                      focus?.nurse.nurseId === row.nurse.nurseId && 'bg-main-4'
                    }`}
                  >
                    <div className="w-[3.375rem] shrink-0"></div>
                    <div className="w-[4.375rem] shrink-0 truncate text-center font-apple text-[1.25rem] text-sub-1">
                      {row.nurse.name}
                    </div>
                    <div className="flex h-full px-[1rem]">
                      {row.shiftTypeIndexList.map(({ reqShift }, j) => {
                        const isSaturday = requestShift.days[j].dayType === 'saturday';
                        const isSunday =
                          requestShift.days[j].dayType === 'sunday' ||
                          requestShift.days[j].dayType === 'holiday';
                        const isFocused =
                          focus?.nurse.nurseId === row.nurse.nurseId && focus.day === j;
                        return (
                          <div
                            key={j}
                            className={`flex h-full w-[2.25rem] flex-1 items-center px-[.25rem] ${
                              isSunday ? 'bg-[#FFE1E680]' : isSaturday ? 'bg-[#E1E5FF80]' : ''
                            } ${j === focus?.day && 'bg-main-4'}`}
                          >
                            <ShiftBadge
                              key={j}
                              onClick={() => {
                                changeFocus?.({
                                  nurse: row.nurse,
                                  day: j,
                                });
                              }}
                              shiftType={
                                reqShift !== null ? requestShift.shiftTypes[reqShift] : null
                              }
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
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
}
