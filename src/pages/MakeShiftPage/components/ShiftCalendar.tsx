/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useOnclickOutside from 'react-cool-onclickoutside';
import { DragIcon, FoldDutyIcon, MinusIcon, PlusIcon2 } from '@assets/svg';
import useEditShift from '@hooks/shift/useEditShift';
import useUIConfig from '@hooks/ui/useUIConfig';
import useEditShiftTeam from '@hooks/ward/useEditShiftTeam';
import { events, sendEvent } from 'analytics';
import ShiftBadge from '@components/ShiftBadge';
import FaultLayer from './FaultLayer';
import RequestLayer from './RequestLayer';

export default function ShiftCalendar() {
  const {
    state: { readonly, year, month, shift, focus, faults, foldedLevels, wardShiftTypeMap, showLayer, currentShiftTeam },
    actions: { changeFocus, foldLevel, updateCarry },
  } = useEditShift();
  const {
    state: { shiftTeams },
    actions: { selectNurse, moveNurseOrder, editDivision },
  } = useEditShiftTeam();
  const {
    state: { separateWeekendColor, shiftTypeColorStyle },
  } = useUIConfig();

  const focusedCellRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clickAwayRef = useOnclickOutside(() => {
    changeFocus(null);
    selectNurse(null);
  });

  const onDragEnd = useCallback(
    ({ source, destination, draggableId }: DropResult) => {
      if (!destination || !shiftTeams || !shift || !currentShiftTeam) return null;
      if (source.droppableId === destination.droppableId && destination.index === source.index) return;

      const sourceDivision = parseInt(source.droppableId);
      const destinationDivision = parseInt(destination.droppableId);

      const dragedNurse = shift.divisionShiftNurses[sourceDivision].find((x) => x.shiftNurse.shiftNurseId === parseInt(draggableId))!.shiftNurse;
      const destinationNurses = shift.divisionShiftNurses[destinationDivision];

      if (
        destination.droppableId === source.droppableId &&
        destinationNurses.findIndex((x) => x.shiftNurse.shiftNurseId === dragedNurse.shiftNurseId) < destination.index
      ) {
        moveNurseOrder(
          dragedNurse.nurseId,
          currentShiftTeam.shiftTeamId,
          currentShiftTeam.shiftTeamId,
          destinationNurses[0].shiftNurse.divisionNum,
          destination.index === 0 ? 0 : destinationNurses[destination.index].shiftNurse.priority,
          destination.index === destinationNurses.length - 1
            ? destinationNurses[destination.index].shiftNurse.priority + 2024
            : destinationNurses[destination.index + 1].shiftNurse.priority,
          year.toString() + '-' + month.toString().padStart(2, '0')
        );
      } else {
        moveNurseOrder(
          dragedNurse.nurseId,
          currentShiftTeam.shiftTeamId,
          currentShiftTeam.shiftTeamId,
          destinationNurses[0].shiftNurse.divisionNum,
          destination.index === 0 ? 0 : destinationNurses[destination.index - 1].shiftNurse.priority,
          destination.index === destinationNurses.length
            ? destinationNurses[destination.index - 1].shiftNurse.priority + 2024
            : destinationNurses[destination.index].shiftNurse.priority,
          year.toString() + '-' + month.toString().padStart(2, '0')
        );
      }

      sendEvent(events.makePage.calendar.moveNurse);
    },
    [shiftTeams, shift, currentShiftTeam]
  );

  useEffect(() => {
    if (focus) {
      const focusRect = focusedCellRef.current?.getBoundingClientRect();
      const container = containerRef.current;
      if (!focusRect || !container) return;
      // 셀이 화면 오른쪽에 있을 때 오른쪽으로 충분히 화면을 이동한다.
      if (focusRect.x + focusRect.width > window.innerWidth)
        window.scroll({
          left: focusRect.left + container.scrollLeft,
        });
      // 셀이 화면 왼쪽에 있을 때 왼쪽 끝으로 화면을 이동한다.
      if (focusRect.x - container.offsetLeft < 0) window.scroll({ left: 0 });
      // 셀이 화면 아래에 있을 때 아래로 충분히 화면을 이동한다.
      if (focusRect.y + focusRect.height - container.offsetTop > container.clientHeight)
        window.scroll({
          top: focusRect.top + container.scrollTop,
        });
      // 셀이 화면 위에 있을 때 한칸씩 위로 화면을 이동한다.
      if (focusRect.y - container.offsetTop < 0) window.scroll({ top: focusRect.top + window.scrollY - 132 });
    }
  }, [focus]);

  return shift && foldedLevels && wardShiftTypeMap && currentShiftTeam ? (
    <div id="calendar" ref={clickAwayRef} className="flex w-full flex-col overflow-hidden">
      <div className="z-20 flex items-center gap-5 bg-main-bg py-[.75rem] pr-4">
        <div className="flex h-[1.875rem] gap-5">
          <div className="w-[3.375rem] text-center font-apple text-[1rem] font-medium text-sub-3">{/* 구분 */}</div>
          <div className="w-[4.375rem] text-center font-apple text-[1rem] font-medium text-sub-3">이름</div>
          <div className="w-[1.875rem] text-center font-apple text-[1rem] font-medium text-sub-3">이월</div>
          <div className="w-[5.625rem] text-center font-apple text-[1rem] font-medium text-sub-3">전달 근무</div>
          <div className="flex rounded-[2.5rem] border-[.0625rem] border-sub-4 px-4 py-[.1875rem]">
            {shift.days.map((item, j) => (
              <p
                key={j}
                className={`w-9 flex-1 rounded-full text-center font-poppins text-[1rem]
                  ${
                    item.dayType === 'saturday'
                      ? j === focus?.day
                        ? separateWeekendColor
                          ? 'bg-blue text-white'
                          : 'bg-red text-white'
                        : separateWeekendColor
                        ? 'text-blue'
                        : 'text-red'
                      : item.dayType === 'sunday' || item.dayType === 'holiday'
                      ? j === focus?.day
                        ? 'bg-red text-white'
                        : 'text-red'
                      : item.dayType === 'workday'
                      ? j === focus?.day
                        ? 'bg-main-1 text-white'
                        : 'text-sub-2.5'
                      : ''
                  }
                `}
              >
                {item.day}
              </p>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 px-[1.5625rem] text-center">
          {shift.wardShiftTypes
            .filter((x) => x.isCounted)
            .map((shiftType, index) => (
              <div
                key={index}
                className="flex size-6 items-center justify-center rounded-[.375rem] p-2 font-poppins text-[1.25rem]"
                style={
                  shiftTypeColorStyle === 'background'
                    ? { backgroundColor: shiftType.color, color: 'white' }
                    : { color: shiftType.color, backgroundColor: 'white' }
                }
              >
                {shiftType.shortName}
              </div>
            ))}
          <div
            className="flex size-6 items-center justify-center rounded-[.375rem] bg-red p-2 font-poppins text-[0.8rem] text-white"
            style={
              shiftTypeColorStyle === 'background'
                ? {
                    backgroundColor: shift.wardShiftTypes.find((x) => x.name === '오프')?.color,
                    color: 'white',
                  }
                : {
                    color: shift.wardShiftTypes.find((x) => x.name === '오프')?.color,
                    backgroundColor: 'white',
                  }
            }
          >
            WO
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={(d) => !readonly && onDragEnd(d)}>
        <div className="-mt-5 flex flex-col gap-[.3125rem] overflow-x-hidden overflow-y-scroll pb-8 pr-4 pt-5 scrollbar-hide" ref={containerRef}>
          {shift.divisionShiftNurses
            .map((x) => x.filter((y) => y.shiftNurse.isWorker)) // 근무자만 필터링
            .map((rows, level) => {
              return rows.length ? (
                shift && foldedLevels[level] ? (
                  <div
                    key={level}
                    className="ml-5 flex h-[1.875rem] w-[calc(100%-1.25rem)] cursor-pointer items-center gap-[.125rem] rounded-[.625rem] bg-sub-4.5 px-[.625rem]"
                    onClick={() => {
                      sendEvent(events.makePage.calendar.foldDivision);
                      foldLevel(level);
                    }}
                  >
                    <FoldDutyIcon className="size-[1.375rem] rotate-180" />
                  </div>
                ) : (
                  <Droppable droppableId={level.toString()} key={level.toString()}>
                    {(provided) => (
                      <div ref={provided.innerRef} key={level} className="flex gap-5" {...provided.droppableProps}>
                        <div className="relative ml-5 rounded-[1.25rem] shadow-banner">
                          {!readonly && (
                            <div className="absolute left-[-.9375rem] flex h-full w-[1.875rem] items-center justify-center font-poppins font-light text-sub-2.5">
                              <FoldDutyIcon
                                className="absolute left-0 top-1/2 z-10 size-[1.375rem] -translate-y-1/2 translate-x-1/2 cursor-pointer"
                                onClick={() => {
                                  sendEvent(events.makePage.calendar.spreadDivision);
                                  foldLevel(level);
                                }}
                              />
                            </div>
                          )}
                          {rows.map((row, rowIndex) => (
                            <Draggable
                              draggableId={row.shiftNurse.shiftNurseId.toString()}
                              index={rowIndex}
                              key={row.shiftNurse.shiftNurseId}
                              isDragDisabled={readonly}
                            >
                              {(provided) => (
                                <div
                                  className={`relative flex h-10 items-center gap-5
                                ${
                                  rowIndex === 0
                                    ? rowIndex === rows.length - 1
                                      ? 'rounded-[1.25rem]'
                                      : 'rounded-t-[1.25rem]'
                                    : rowIndex === rows.length - 1
                                    ? 'rounded-b-[1.25rem]'
                                    : ''
                                }
                                ${focus?.shiftNurseId === row.shiftNurse.shiftNurseId ? 'bg-main-4' : 'bg-white'}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className="relative w-[2.125rem] shrink-0">
                                    {!readonly && <DragIcon className="absolute -right-2.5 top-1/2 size-6 -translate-y-1/2" />}
                                  </div>
                                  <div
                                    className="w-[4.375rem] shrink-0 cursor-pointer truncate text-center font-apple text-[1.25rem] text-sub-1 hover:underline"
                                    onClick={() => {
                                      selectNurse(row.shiftNurse.nurseId);
                                    }}
                                  >
                                    {row.shiftNurse.name}
                                  </div>
                                  <div className="w-[1.875rem] shrink-0 text-center font-apple text-[1.25rem] text-sub-1">
                                    {readonly ? (
                                      <div className="size-[1.875rem] cursor-default rounded-[.3125rem] border-[.0313rem] bg-main-bg font-poppins text-[1.25rem] text-sub-2 outline-none focus:bg-main-4">
                                        {row.shiftNurse.carried}
                                      </div>
                                    ) : (
                                      <button
                                        className="size-[1.875rem] rounded-[.3125rem] border-[.0313rem] bg-main-bg font-poppins text-[1.25rem] text-sub-2 outline-none focus:bg-main-4"
                                        onClick={() => {
                                          sendEvent(events.makePage.calendar.focusCarried);
                                        }}
                                        onKeyDown={(e) => {
                                          e.preventDefault();
                                          if (e.key === 'ArrowUp') updateCarry(row.shiftNurse.shiftNurseId, row.shiftNurse.carried + 1);
                                          if (e.key === 'ArrowDown') updateCarry(row.shiftNurse.shiftNurseId, row.shiftNurse.carried - 1);
                                          sendEvent(events.makePage.calendar.changeCarried);
                                        }}
                                      >
                                        {row.shiftNurse.carried}
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex w-[5.625rem] gap-[.125rem]">
                                    {row.lastWardShiftList.map((current, j) => (
                                      <ShiftBadge
                                        key={j}
                                        shiftType={current != null ? wardShiftTypeMap.get(current) : null}
                                        className="size-[1.3125rem] text-[.9375rem]"
                                      />
                                    ))}
                                  </div>
                                  <div className="flex h-full px-[1.0625rem]">
                                    {row.wardShiftList.map((current, j) => {
                                      const request = row.wardReqShiftList[j];
                                      const isSaturday = shift.days[j].dayType === 'saturday';
                                      const isSunday = shift.days[j].dayType === 'sunday' || shift.days[j].dayType === 'holiday';
                                      const isFocused = focus?.shiftNurseId === row.shiftNurse.shiftNurseId && focus.day === j;
                                      const fault = faults.get(`${row.shiftNurse.shiftNurseId},${j}`);
                                      return (
                                        <div
                                          key={j}
                                          className={`group relative flex h-full w-9 flex-1 items-center justify-center px-[.25rem] 
                              ${isSunday ? 'bg-[#FFE1E680]' : isSaturday ? (separateWeekendColor ? 'bg-[#E1E5FF80]' : 'bg-[#FFE1E680]') : ''} 
                              ${j === focus?.day && 'bg-main-4'}`}
                                        >
                                          {!readonly && showLayer.fault && fault && <FaultLayer fault={fault} />}
                                          {!readonly && request !== null && current !== null && (
                                            <RequestLayer
                                              isAccept={request === current}
                                              request={wardShiftTypeMap.get(request)!}
                                              showCheck={showLayer.check}
                                              showSlash={showLayer.slash}
                                            />
                                          )}
                                          <ShiftBadge
                                            id={rowIndex === 0 && j === 0 ? 'cell_sample' : undefined}
                                            key={j}
                                            onClick={() => {
                                              if (readonly) return;
                                              changeFocus?.({
                                                shiftNurseName: row.shiftNurse.name,
                                                shiftNurseId: row.shiftNurse.shiftNurseId,
                                                day: j,
                                              });
                                              sendEvent(events.makePage.calendar.focusCell);
                                            }}
                                            shiftType={
                                              current === null ? (request === null ? null : wardShiftTypeMap.get(request)) : wardShiftTypeMap.get(current)
                                            }
                                            isOnlyRequest={current === null && request !== null}
                                            className={`z-10 ${readonly ? 'cursor-default' : 'cursor-pointer'} ${
                                              isFocused && 'outline outline-[.125rem] outline-main-1'
                                            }`}
                                            forwardRef={isFocused ? (focusedCellRef as unknown as RefObject<HTMLParagraphElement>) : null}
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div id="count_by_nurse" className="relative flex shrink-0 items-center gap-2 px-[1.5625rem] text-center" key={rowIndex}>
                                    {shift?.wardShiftTypes
                                      .filter((x) => x.isCounted)
                                      .map((wardShiftType, index) => (
                                        <div key={index} className="w-6 text-center font-poppins text-[1.25rem] text-sub-2">
                                          {row.wardShiftList.filter((current) => current === wardShiftType.wardShiftTypeId).length}
                                        </div>
                                      ))}
                                    <div className="w-6 text-center font-poppins text-[1.25rem] text-sub-2">
                                      {
                                        row.wardShiftList.filter(
                                          (current, i) =>
                                            current && wardShiftTypeMap.get(current)?.isOff && shift.days.find((x) => x.day === i + 1)?.dayType != 'workday'
                                        ).length
                                      }
                                    </div>
                                  </div>
                                  {rowIndex !== rows.length - 1
                                    ? !readonly && (
                                        <>
                                          <div
                                            className="justify-cente group peer absolute bottom-0 z-10 flex size-6 translate-x-[-80%] translate-y-1/2 items-center"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              editDivision(
                                                currentShiftTeam.shiftTeamId,
                                                row.shiftNurse.priority,
                                                1,
                                                year.toString() + '-' + month.toString().padStart(2, '0')
                                              );
                                              sendEvent(events.makePage.calendar.createDivision);
                                            }}
                                          >
                                            <PlusIcon2 className="invisible size-5 group-hover:visible" />
                                          </div>
                                          <div className="invisible absolute bottom-0 h-[.0938rem] w-full bg-sub-2.5 peer-hover:visible" />
                                        </>
                                      )
                                    : level !== shift.divisionShiftNurses.length - 1 &&
                                      !readonly && (
                                        <div
                                          className="absolute bottom-0 z-10 flex size-6 translate-x-[-65%] translate-y-[calc(50%+.1563rem)] items-center"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            editDivision(
                                              currentShiftTeam.shiftTeamId,
                                              row.shiftNurse.priority,
                                              -1,
                                              year.toString() + '-' + month.toString().padStart(2, '0')
                                            );
                                            sendEvent(events.makePage.calendar.deleteDivision);
                                          }}
                                        >
                                          <MinusIcon className="size-5 opacity-0 hover:opacity-100" />
                                        </div>
                                      )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                )
              ) : null;
            })}
        </div>
      </DragDropContext>
    </div>
  ) : null;
}
