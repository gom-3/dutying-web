/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useOnclickOutside from 'react-cool-onclickoutside';
import {
  DragIcon,
  FoldDutyIcon,
  LinkedIcon,
  MinusIcon,
  PlusIcon2,
  UnlinkedIcon,
} from '@assets/svg';
import ShiftBadge from '@components/ShiftBadge';
import { RefObject, useCallback, useEffect, useRef } from 'react';
import { events, sendEvent } from 'analytics';
import useEditShiftTeam from '@hooks/ward/useEditShiftTeam';
import { DragDropContext, DropResult, Droppable, Draggable } from 'react-beautiful-dnd';
import useUIConfig from '@hooks/ui/useUIConfig';
import useRequestShift from '@hooks/shift/useRequestShift';
import { twMerge } from 'tailwind-merge';

export default function ShiftCalendar() {
  const {
    state: {
      readonly,
      year,
      month,
      requestShift,
      dutyRequestList,
      focus,
      foldedLevels,
      wardShiftTypeMap,
      currentShiftTeam,
    },
    actions: { changeFocus, foldLevel, acceptRequest },
  } = useRequestShift();
  const {
    state: { shiftTeams },
    actions: { selectNurse, moveNurseOrder, editDivision },
  } = useEditShiftTeam();
  const {
    state: { separateWeekendColor },
  } = useUIConfig();

  const focusedCellRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clickAwayRef = useOnclickOutside(() => {
    changeFocus(null);
    selectNurse(null);
  });

  const onDragEnd = useCallback(
    ({ source, destination, draggableId }: DropResult) => {
      if (!destination || !shiftTeams || !requestShift || !currentShiftTeam) return null;
      if (source.droppableId === destination.droppableId && destination.index === source.index)
        return;

      const sourceDivision = parseInt(source.droppableId);
      const destinationDivision = parseInt(destination.droppableId);

      const dragedNurse = requestShift.divisionShiftNurses[sourceDivision].find(
        (x) => x.shiftNurse.shiftNurseId === parseInt(draggableId)
      )!.shiftNurse;
      const destinationNurses = requestShift.divisionShiftNurses[destinationDivision];

      if (
        destination.droppableId === source.droppableId &&
        destinationNurses.findIndex((x) => x.shiftNurse.shiftNurseId === dragedNurse.shiftNurseId) <
          destination.index
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
          destination.index === 0
            ? 0
            : destinationNurses[destination.index - 1].shiftNurse.priority,
          destination.index === destinationNurses.length
            ? destinationNurses[destination.index - 1].shiftNurse.priority + 2024
            : destinationNurses[destination.index].shiftNurse.priority,
          year.toString() + '-' + month.toString().padStart(2, '0')
        );
      }

      sendEvent(events.requestPage.calendar.moveNurse);
    },
    [shiftTeams, requestShift, currentShiftTeam]
  );

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

  return requestShift && foldedLevels && wardShiftTypeMap && currentShiftTeam ? (
    <div id="calendar" className="flex">
      <div ref={clickAwayRef} className="flex flex-col">
        <div className="z-20 my-[.75rem] flex h-[1.875rem] items-center gap-[1.25rem] bg-[#FDFCFE] pr-[1rem]">
          <div className="flex gap-[1.25rem]">
            <div className="w-[3.375rem] text-center font-apple text-[1rem] font-medium text-sub-3">
              {/* 구분 */}
            </div>
            <div className="w-[4.375rem] text-center font-apple text-[1rem] font-medium text-sub-3">
              이름
            </div>
            <div className="w-[1.875rem] text-center font-apple text-[1rem] font-medium text-sub-3">
              연동
            </div>
            <div className="flex rounded-[2.5rem] border-[.0625rem] border-sub-4 px-[1rem] py-[.1875rem]">
              {requestShift.days.map((item, j) => (
                <p
                  key={j}
                  className={`w-[2.25rem] flex-1 rounded-full text-center font-poppins text-[1rem]
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
        </div>
        <DragDropContext onDragEnd={(d) => !readonly && onDragEnd(d)}>
          <div
            className="mt-[-1.25rem] flex flex-col gap-[.3125rem] overflow-x-hidden overflow-y-scroll pb-8 pr-[1rem] pt-[1.25rem] scrollbar-hide"
            ref={containerRef}
          >
            {requestShift.divisionShiftNurses
              .map((x) => x.filter((y) => y.shiftNurse.isWorker)) // 근무자만 필터링
              .map((rows, level) => {
                return rows.length ? (
                  requestShift && foldedLevels[level] ? (
                    <div
                      key={level}
                      className="ml-[1.25rem] flex h-[1.875rem] w-[calc(100%-1.25rem)] cursor-pointer items-center gap-[.125rem] rounded-[.625rem] bg-sub-4.5 px-[.625rem]"
                      onClick={() => {
                        sendEvent(events.requestPage.calendar.foldDivision);
                        foldLevel(level);
                      }}
                    >
                      <FoldDutyIcon className="h-[1.375rem] w-[1.375rem] rotate-180" />
                    </div>
                  ) : (
                    <Droppable droppableId={level.toString()} key={level.toString()}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          key={level}
                          className="flex gap-[1.25rem]"
                          {...provided.droppableProps}
                        >
                          <div className="relative ml-[1.25rem] rounded-[1.25rem] shadow-banner">
                            {!readonly && (
                              <div className="absolute left-[-.9375rem] flex h-full w-[1.875rem] items-center justify-center font-poppins font-light text-sub-2.5">
                                <FoldDutyIcon
                                  className="absolute left-[50%] top-[50%] z-10 h-[1.375rem] w-[1.375rem] translate-x-[-50%] translate-y-[-50%] cursor-pointer"
                                  onClick={() => {
                                    sendEvent(events.requestPage.calendar.spreadDivision);
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
                                    className={`relative flex h-[2.5rem] items-center gap-[1.25rem]
                                ${
                                  rowIndex === 0
                                    ? rowIndex === rows.length - 1
                                      ? 'rounded-[1.25rem]'
                                      : 'rounded-t-[1.25rem]'
                                    : rowIndex === rows.length - 1
                                    ? 'rounded-b-[1.25rem]'
                                    : ''
                                }
                                ${
                                  focus?.shiftNurseId === row.shiftNurse.shiftNurseId
                                    ? 'bg-main-4'
                                    : 'bg-white'
                                }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div className="relative w-[2.125rem] shrink-0">
                                      {!readonly && (
                                        <DragIcon className="absolute right-[-0.625rem] top-[50%] h-[1.5rem] w-[1.5rem] translate-y-[-50%]" />
                                      )}
                                    </div>
                                    <div className="w-[4.375rem] shrink-0 truncate text-center font-apple text-[1.25rem] text-sub-1">
                                      {row.shiftNurse.name}
                                    </div>
                                    <div className="flex w-[1.875rem] shrink-0 items-center justify-center text-center font-apple text-[1.25rem] text-sub-1">
                                      {currentShiftTeam.nurses.find(
                                        (x) => x.nurseId === row.shiftNurse.nurseId
                                      )?.isConnected ? (
                                        <LinkedIcon className="h-[1.5rem] w-[1.5rem]" />
                                      ) : (
                                        <UnlinkedIcon className="h-[1.5rem] w-[1.5rem]" />
                                      )}
                                    </div>
                                    <div className="flex h-full px-[1.0625rem]">
                                      {row.wardReqShiftList.map((current, date) => {
                                        const requestDutyRequest =
                                          dutyRequestList?.find(
                                            (x) =>
                                              x.nurseId === row.shiftNurse.nurseId &&
                                              x.date - 1 === date
                                          ) || null;
                                        const isSaturday =
                                          requestShift.days[date].dayType === 'saturday';
                                        const isSunday =
                                          requestShift.days[date].dayType === 'sunday' ||
                                          requestShift.days[date].dayType === 'holiday';
                                        const isFocused =
                                          focus?.shiftNurseId === row.shiftNurse.shiftNurseId &&
                                          focus.day === date;
                                        return (
                                          <div
                                            key={date}
                                            className={`group relative flex h-full w-[2.25rem] flex-1 items-center justify-center px-[.25rem] 
                                          ${
                                            isSunday
                                              ? 'bg-[#FFE1E680]'
                                              : isSaturday
                                              ? separateWeekendColor
                                                ? 'bg-[#E1E5FF80]'
                                                : 'bg-[#FFE1E680]'
                                              : ''
                                          } 
                                          ${date === focus?.day && 'bg-main-4'}`}
                                          >
                                            <ShiftBadge
                                              id={
                                                rowIndex === 0 && date === 0
                                                  ? 'cell_sample'
                                                  : undefined
                                              }
                                              onClick={() => {
                                                if (readonly) return;
                                                changeFocus?.({
                                                  shiftNurseName: row.shiftNurse.name,
                                                  shiftNurseId: row.shiftNurse.shiftNurseId,
                                                  day: date,
                                                });
                                                sendEvent(events.requestPage.calendar.focusCell);
                                              }}
                                              shiftType={
                                                current === null
                                                  ? requestDutyRequest === null
                                                    ? null
                                                    : wardShiftTypeMap.get(
                                                        requestDutyRequest.wardShiftTypeId
                                                      )
                                                  : wardShiftTypeMap.get(current)
                                              }
                                              isOnlyRequest={
                                                current === null && requestDutyRequest !== null
                                              }
                                              className={`z-10 ${
                                                readonly ? 'cursor-default' : 'cursor-pointer'
                                              } ${
                                                isFocused &&
                                                'outline outline-[.125rem] outline-main-1'
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
                                    {rowIndex !== rows.length - 1
                                      ? !readonly && (
                                          <>
                                            <div
                                              className="justify-cente group peer absolute bottom-0 z-10 flex h-[1.5rem] w-[1.5rem] translate-x-[-80%] translate-y-[50%] items-center"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                editDivision(
                                                  currentShiftTeam.shiftTeamId,
                                                  row.shiftNurse.priority,
                                                  1,
                                                  year.toString() +
                                                    '-' +
                                                    month.toString().padStart(2, '0')
                                                );
                                                sendEvent(events.makePage.calendar.createDivision);
                                              }}
                                            >
                                              <PlusIcon2 className="invisible h-[1.25rem] w-[1.25rem] group-hover:visible" />
                                            </div>
                                            <div className="invisible absolute bottom-0 h-[.0938rem] w-full bg-sub-2.5 peer-hover:visible" />
                                          </>
                                        )
                                      : level !== requestShift.divisionShiftNurses.length - 1 &&
                                        !readonly && (
                                          <div
                                            className="absolute bottom-0 z-10 flex h-[1.5rem] w-[1.5rem] translate-x-[-65%] translate-y-[calc(50%+.1563rem)] items-center"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              editDivision(
                                                currentShiftTeam.shiftTeamId,
                                                row.shiftNurse.priority,
                                                -1,
                                                year.toString() +
                                                  '-' +
                                                  month.toString().padStart(2, '0')
                                              );
                                              sendEvent(events.makePage.calendar.deleteDivision);
                                            }}
                                          >
                                            <MinusIcon className="h-[1.25rem] w-[1.25rem] opacity-0 hover:opacity-100" />
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
      <div id="nurse_request_list" className="flex flex-1 flex-col">
        <div className="my-[.75rem] flex items-center">
          <p className="font-apple text-[1.25rem] font-semibold text-main-1">신청 내역</p>
          <p className="ml-auto cursor-pointer font-apple text-[.875rem] font-medium text-main-2">
            * 미처리 신청 {dutyRequestList?.filter((x) => x.isAccepted === null).length}개
          </p>
        </div>
        <div className="max-h-[calc(100vh-9rem)] overflow-scroll rounded-[1.25rem] bg-white py-[.0625rem] scrollbar-hide">
          {dutyRequestList?.map((dutyRequest, i) => {
            const focus: Focus = {
              shiftNurseName: dutyRequest.nurseName,
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              shiftNurseId: requestShift.divisionShiftNurses
                .flatMap((x) => x)
                .find((x) => x.shiftNurse.nurseId === dutyRequest.nurseId)?.shiftNurse
                .shiftNurseId!,
              day: dutyRequest.date - 1,
            };

            return (
              <div
                key={i}
                className="flex h-[3.25rem] items-center border-b-[.0625rem] border-sub-4.5 pl-[1.875rem] pr-[.75rem] last:border-b-0"
              >
                <p
                  className="mr-[.625rem] cursor-pointer font-apple text-[1rem] text-sub-1"
                  onClick={() => {
                    if (readonly) return;
                    changeFocus(focus);
                  }}
                >
                  {dutyRequest.nurseName} / {dutyRequest.date}일
                </p>
                <ShiftBadge shiftType={wardShiftTypeMap.get(dutyRequest.wardShiftTypeId)} />
                <div className="ml-auto flex h-[1.75rem] w-[5.625rem] items-center justify-center gap-[.125rem] rounded-[.3125rem] border-[.0313rem] border-sub-4 bg-sub-5 p-[.125rem]">
                  <button
                    className={twMerge(
                      'flex h-[1.5rem] flex-1 items-center justify-center rounded-[.3125rem] font-poppins text-[1rem] text-sub-2.5',
                      dutyRequest.isAccepted === true && 'bg-main-1 text-white'
                    )}
                    onClick={() => {
                      acceptRequest(dutyRequest.wardReqShiftId, true);
                      sendEvent(events.requestPage.acceptRequest, 'true');
                    }}
                  >
                    수락
                  </button>
                  <button
                    className={twMerge(
                      'flex h-[1.5rem] flex-1 items-center justify-center rounded-[.3125rem] font-poppins text-[1rem] text-sub-2.5',
                      dutyRequest.isAccepted === false && 'bg-sub-2 text-white'
                    )}
                    onClick={() => {
                      acceptRequest(dutyRequest.wardReqShiftId, false);
                      sendEvent(events.requestPage.acceptRequest, 'false');
                    }}
                  >
                    거절
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : null;
}
