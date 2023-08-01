import useOnclickOutside from 'react-cool-onclickoutside';
import { FoldDutyIcon } from '@assets/svg';
import ShiftBadge from '@components/ShiftBadge';
import { RefObject, useEffect, useRef } from 'react';
import FaultLayer from './FaultLayer';
import RequestLayer from './RequestLayer';
import { event, sendEvent } from 'analytics';
import TextField from '@components/TextField';
import useEditShift from '@hooks/useEditShift';
import useEditNurse from '@hooks/useEditNurse';

interface Props {
  isEditable?: boolean;
  setNurseTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShiftCalendar({ isEditable, setNurseTabOpen }: Props) {
  const {
    actions: { selectNurse },
  } = useEditNurse();
  const {
    state: { month, shift, focus, faults, foldedLevels },
    actions: { changeFocus, foldLevel, updateCarry },
  } = useEditShift();
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

  return shift && foldedLevels ? (
    <div ref={clickAwayRef} className="flex flex-col">
      <div className="z-20 my-[.75rem] flex h-[1.875rem] items-center gap-[1.25rem] bg-[#FDFCFE]">
        <div className="flex gap-[1.25rem]">
          <div className="w-[3.375rem] text-center font-apple text-[1rem] font-medium text-sub-3">
            구분
          </div>
          <div className="w-[4.375rem] text-center font-apple text-[1rem] font-medium text-sub-3">
            이름
          </div>
          <div className="w-[1.875rem] text-center font-apple text-[1rem] font-medium text-sub-3">
            이월
          </div>
          <div className="w-[5.625rem] text-center font-apple text-[1rem] font-medium text-sub-3">
            전달 근무
          </div>
          <div className="flex rounded-[2.5rem] border-[.0625rem] border-sub-4 px-[1rem] py-[.1875rem]">
            {shift.days.map((item, j) => (
              <p
                key={j}
                className={`w-[2.25rem] flex-1 text-center font-poppins text-[1rem] text-sub-2.5 
                ${j === focus?.day && 'rounded-full bg-main-1 text-white'}`}
              >
                {j === focus?.day ? month + '/' : ''}
                {item.day}
              </p>
            ))}
          </div>
        </div>
        <div className="flex w-[13.625rem] shrink-0 items-center px-[1.5625rem] text-center">
          {shift.shiftTypes.map((shiftType, index) => (
            <div key={index} className="flex-1 font-poppins text-[1.25rem] text-sub-3 ">
              {shiftType.shortName}
            </div>
          ))}
          <div className="flex-1 font-poppins text-[1.25rem] text-sub-3 ">WO</div>
        </div>
      </div>
      <div
        className="m-[-1.25rem] flex max-h-[calc(100vh-22rem)] flex-col gap-[.3125rem] overflow-x-hidden overflow-y-scroll p-[1.25rem] scrollbar-hide"
        ref={containerRef}
      >
        {shift.levelNurses.map((rows, level) => {
          return rows.length ? (
            shift && foldedLevels[level] ? (
              <div
                key={level}
                className="flex h-[1.875rem] w-full cursor-pointer items-center gap-[.125rem] rounded-[.625rem] bg-sub-4.5 px-[.625rem]"
                onClick={() => {
                  sendEvent(event.clickFoldLevelButton, 'close');
                  foldLevel(level);
                }}
              >
                <FoldDutyIcon className="h-[1.375rem] w-[1.375rem] rotate-180" />
              </div>
            ) : (
              <div key={level} className="flex gap-[1.25rem]">
                <div className="relative rounded-[1.25rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
                  <div className="absolute flex h-full w-[1.875rem] items-center justify-center rounded-l-[1.25rem] bg-sub-4.5 font-poppins font-light text-sub-2.5">
                    {/* {level} */}
                    <FoldDutyIcon
                      className="absolute left-[50%] top-[50%] h-[1.375rem] w-[1.375rem] translate-x-[-50%] translate-y-[-50%] cursor-pointer"
                      onClick={() => {
                        sendEvent(event.clickFoldLevelButton, 'open');
                        foldLevel(level);
                      }}
                    />
                  </div>
                  {rows.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className={`flex h-[3.25rem] items-center gap-[1.25rem]
                  ${focus?.row === rowIndex && focus.level === level && 'bg-main-4'}`}
                    >
                      <div className="w-[3.375rem] shrink-0"></div>
                      <div
                        className="w-[4.375rem] shrink-0 cursor-pointer truncate text-center font-apple text-[1.25rem] text-sub-1 hover:underline"
                        onClick={() => {
                          setNurseTabOpen(true);
                          selectNurse(row.nurse.nurseId);
                        }}
                      >
                        {row.nurse.name}
                      </div>
                      <div className="w-[1.875rem] shrink-0 text-center font-apple text-[1.25rem] text-sub-1">
                        <TextField
                          className="text-md h-[1.875rem] w-[1.875rem] p-0 text-center text-sub-1"
                          value={row.carried}
                          onClick={(e) => {
                            e.currentTarget.select();
                          }}
                          onChange={(e) => {
                            console.log(e.target.value);
                            if (/[0-9]+/.test(e.target.value)) {
                              updateCarry(row.nurse.nurseId, parseInt(e.target.value));
                            }
                          }}
                        />
                      </div>
                      <div className="flex w-[5.625rem] gap-[.125rem]">
                        {row.lastShiftTypeIndexList.map(({ shift: current }, j) => (
                          <ShiftBadge
                            key={j}
                            shiftType={current != null ? shift.shiftTypes[current] : null}
                            className="h-[1.3125rem] w-[1.3125rem] text-[.9375rem]"
                          />
                        ))}
                      </div>
                      <div className="flex h-full  px-[1rem]">
                        {row.shiftTypeIndexList.map(({ reqShift: request, shift: current }, j) => {
                          const isSaturday = shift.days[j].dayType === 'saturday';
                          const isSunday =
                            shift.days[j].dayType === 'sunday' ||
                            shift.days[j].dayType === 'holiday';
                          const isFocused =
                            focus &&
                            level === focus.level &&
                            focus.day === j &&
                            focus.row === rowIndex;
                          const fault = faults.get(`${level},${rowIndex},${j}`);
                          return (
                            <div
                              key={j}
                              className={`group relative flex h-full w-[2.25rem] flex-1 items-center justify-center px-[.25rem] 
                              ${isSunday ? 'bg-[#FFE1E680]' : isSaturday ? 'bg-[#E1E5FF80]' : ''} 
                              ${j === focus?.day && 'bg-main-4'}`}
                            >
                              {fault && <FaultLayer fault={fault} />}
                              {request !== null && current !== null && (
                                <RequestLayer
                                  isAccept={request === current}
                                  request={shift.shiftTypes[request]}
                                />
                              )}
                              <ShiftBadge
                                key={j}
                                onClick={() => {
                                  changeFocus?.({
                                    level: level,
                                    day: j,
                                    row: rowIndex,
                                  });
                                }}
                                shiftType={
                                  current === null
                                    ? request === null
                                      ? null
                                      : shift.shiftTypes[request]
                                    : shift.shiftTypes[current]
                                }
                                isOnlyRequest={current === null && request !== null}
                                className={`z-10 cursor-pointer 
                                ${isFocused && 'outline outline-[.125rem] outline-main-1'}`}
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
                <div className="w-[13.625rem] shrink-0 rounded-[1.25rem] px-[1.5625rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
                  {rows.map((row, i) => (
                    <div key={i} className="flex h-[3.25rem] items-center">
                      {shift.shiftTypes.map((_, index) => (
                        <div
                          key={index}
                          className="flex-1 text-center font-poppins text-[1.25rem] text-sub-2"
                        >
                          {row.shiftTypeIndexList.filter(({ shift }) => shift === index).length}
                        </div>
                      ))}
                      <div className="flex-1 text-center font-poppins text-[1.25rem] text-sub-2">
                        {
                          row.shiftTypeIndexList.filter(
                            ({ shift: current }, i) =>
                              current &&
                              shift.shiftTypes[current].isOff &&
                              shift.days.find((x) => x.day === i + 1)?.dayType != 'workday'
                          ).length
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : null;
        })}
      </div>
    </div>
  ) : null;
}
