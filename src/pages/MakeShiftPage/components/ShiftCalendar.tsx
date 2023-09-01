/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useOnclickOutside from 'react-cool-onclickoutside';
import { DragIcon, FoldDutyIcon } from '@assets/svg';
import ShiftBadge from '@components/ShiftBadge';
import { RefObject, useEffect, useRef } from 'react';
import FaultLayer from './FaultLayer';
import RequestLayer from './RequestLayer';
import { event, sendEvent } from 'analytics';
import TextField from '@components/TextField';
import useEditShift from '@hooks/useEditShift';
import useEditShiftTeam from '@hooks/useEditShiftTeam';
import { DragDropContext, DropResult, Droppable, Draggable } from 'react-beautiful-dnd';

interface Props {
  isEditable?: boolean;
  setNurseTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShiftCalendar({ isEditable, setNurseTabOpen }: Props) {
  const {
    state: { shift, focus, faults, foldedLevels, wardShiftTypeMap, showLayer, currentShiftTeam },
    actions: { changeFocus, foldLevel, updateCarry },
  } = useEditShift();
  const {
    state: { shiftTeams },
    actions: { selectNurse, moveNurseOrder },
  } = useEditShiftTeam();

  const focusedCellRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clickAwayRef = useOnclickOutside(() => isEditable && changeFocus?.(null));

  const onDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (!destination || !shiftTeams || !shift || !currentShiftTeam) return null;
    if (source.droppableId === destination.droppableId && destination.index === source.index)
      return;

    const destinationDivision = parseInt(destination.droppableId);

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const dragedNurse = shift.divisionShiftNurses[destinationDivision].find(
      (x) => x.shiftNurse.shiftNurseId === parseInt(draggableId)
    )!.shiftNurse;
    const destinationNurses = shift.divisionShiftNurses[destinationDivision];

    if (
      destination.droppableId === source.droppableId &&
      destinationNurses.findIndex((x) => x.shiftNurse.shiftNurseId === dragedNurse.shiftNurseId) <
        destination.index
    ) {
      moveNurseOrder(
        dragedNurse.nurseInfo.nurseId,
        currentShiftTeam.shiftTeamId,
        currentShiftTeam.shiftTeamId,
        destinationNurses[0].shiftNurse.divisionNum,
        destination.index === 0 ? 0 : destinationNurses[destination.index].shiftNurse.priority,
        destination.index === destinationNurses.length - 1
          ? destinationNurses[destination.index].shiftNurse.priority + 2024
          : destinationNurses[destination.index + 1].shiftNurse.priority
      );
    } else {
      moveNurseOrder(
        dragedNurse.nurseInfo.nurseId,
        currentShiftTeam.shiftTeamId,
        currentShiftTeam.shiftTeamId,
        destinationNurses[0].shiftNurse.divisionNum,
        destination.index === 0 ? 0 : destinationNurses[destination.index - 1].shiftNurse.priority,
        destination.index === destinationNurses.length
          ? destinationNurses[destination.index - 1].shiftNurse.priority + 2024
          : destinationNurses[destination.index].shiftNurse.priority
      );
    }
  };

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

  return shift && foldedLevels && wardShiftTypeMap ? (
    <div ref={clickAwayRef} className="flex flex-col">
      <div className="z-20 my-[.75rem] flex h-[1.875rem] items-center gap-[1.25rem] bg-[#FDFCFE]">
        <div className="flex gap-[1.25rem]">
          <div className="w-[3.375rem] text-center font-apple text-[1rem] font-medium text-sub-3">
            {/* 구분 */}
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
                className={`w-[2.25rem] flex-1 text-center font-poppins text-[1rem]
                  ${
                    item.dayType === 'saturday'
                      ? j === focus?.day
                        ? 'rounded-full bg-[#436DFF] text-white'
                        : 'text-[#436DFF]'
                      : item.dayType === 'sunday' || item.dayType === 'holiday'
                      ? j === focus?.day
                        ? 'rounded-full bg-[#FF4A80] text-white'
                        : 'text-[#FF4A80]'
                      : item.dayType === 'workday'
                      ? j === focus?.day
                        ? 'rounded-full bg-main-1 text-white'
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
        <div className="flex w-[13.625rem] shrink-0 items-center px-[1.5625rem] text-center">
          {shift.wardShiftTypes.slice(0, 4).map((shiftType, index) => (
            <div key={index} className="flex-1 font-poppins text-[1.25rem] text-sub-3 ">
              {shiftType.shortName}
            </div>
          ))}
          <div className="flex-1 font-poppins text-[1.25rem] text-sub-3 ">WO</div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className="mt-[-1.25rem] flex max-h-[calc(100vh-22rem)] flex-col gap-[.3125rem] overflow-x-hidden overflow-y-scroll pb-8 pt-[1.25rem] scrollbar-hide"
          ref={containerRef}
        >
          {shift.divisionShiftNurses.map((rows, level) => {
            return rows.length ? (
              shift && foldedLevels[level] ? (
                <div
                  key={level}
                  className="ml-[1.25rem] flex h-[1.875rem] w-[calc(100%-1.25rem)] cursor-pointer items-center gap-[.125rem] rounded-[.625rem] bg-sub-4.5 px-[.625rem]"
                  onClick={() => {
                    sendEvent(event.clickFoldLevelButton, 'close');
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
                      <div className="relative ml-[1.25rem] rounded-[1.25rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
                        <div className="absolute left-[-.9375rem] flex h-full w-[1.875rem] items-center justify-center font-poppins font-light text-sub-2.5">
                          <FoldDutyIcon
                            className="absolute left-[50%] top-[50%] h-[1.375rem] w-[1.375rem] translate-x-[-50%] translate-y-[-50%] cursor-pointer"
                            onClick={() => {
                              sendEvent(event.clickFoldLevelButton, 'open');
                              foldLevel(level);
                            }}
                          />
                        </div>
                        {rows.map((row, rowIndex) => (
                          <Draggable
                            draggableId={row.shiftNurse.shiftNurseId.toString()}
                            index={rowIndex}
                            key={row.shiftNurse.shiftNurseId}
                          >
                            {(provided) => (
                              <div
                                className={`flex h-[3.25rem] items-center gap-[1.25rem]
                                ${
                                  rowIndex === 0
                                    ? 'rounded-t-[1.25rem]'
                                    : rowIndex === rows.length - 1
                                    ? 'rounded-b-[1.25rem]'
                                    : ''
                                }
                                ${
                                  focus?.shiftNurseId === row.shiftNurse.shiftNurseId && 'bg-main-4'
                                }`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="relative w-[2.125rem] shrink-0">
                                  <DragIcon className="absolute right-[-0.625rem] top-[50%] h-[1.5rem] w-[1.5rem] translate-y-[-50%]" />
                                </div>
                                <div
                                  className="w-[4.375rem] shrink-0 cursor-pointer truncate text-center font-apple text-[1.25rem] text-sub-1 hover:underline"
                                  onClick={() => {
                                    setNurseTabOpen(true);
                                    selectNurse(row.shiftNurse.nurseInfo.nurseId);
                                  }}
                                >
                                  {row.shiftNurse.name}
                                </div>
                                <div className="w-[1.875rem] shrink-0 text-center font-apple text-[1.25rem] text-sub-1">
                                  <TextField
                                    readOnly
                                    className="text-md h-[1.875rem] w-[1.875rem] p-0 text-center text-sub-1"
                                    value={row.shiftNurse.carried}
                                    onClick={(e) => {
                                      e.currentTarget.select();
                                    }}
                                    onKeyDown={(e) => {
                                      e.preventDefault();
                                      if (e.key === 'ArrowUp')
                                        updateCarry(
                                          row.shiftNurse.shiftNurseId,
                                          row.shiftNurse.carried + 1
                                        );
                                      if (e.key === 'ArrowDown')
                                        updateCarry(
                                          row.shiftNurse.shiftNurseId,
                                          row.shiftNurse.carried - 1
                                        );
                                    }}
                                  />
                                </div>
                                <div className="flex w-[5.625rem] gap-[.125rem]">
                                  {row.lastWardShiftList.map((current, j) => (
                                    <ShiftBadge
                                      key={j}
                                      shiftType={
                                        current != null ? wardShiftTypeMap.get(current) : null
                                      }
                                      className="h-[1.3125rem] w-[1.3125rem] text-[.9375rem]"
                                    />
                                  ))}
                                </div>
                                <div className="flex h-full  px-[1rem]">
                                  {row.wardShiftList.map((current, j) => {
                                    const request = row.wardReqShiftList[j];
                                    const isSaturday = shift.days[j].dayType === 'saturday';
                                    const isSunday =
                                      shift.days[j].dayType === 'sunday' ||
                                      shift.days[j].dayType === 'holiday';
                                    const isFocused =
                                      focus?.shiftNurseId === row.shiftNurse.shiftNurseId &&
                                      focus.day === j;
                                    const fault = faults.get(`${row.shiftNurse.shiftNurseId},${j}`);
                                    return (
                                      <div
                                        key={j}
                                        className={`group relative flex h-full w-[2.25rem] flex-1 items-center justify-center px-[.25rem] 
                              ${isSunday ? 'bg-[#FFE1E680]' : isSaturday ? 'bg-[#E1E5FF80]' : ''} 
                              ${j === focus?.day && 'bg-main-4'}`}
                                      >
                                        {showLayer.fault && fault && <FaultLayer fault={fault} />}
                                        {request !== null && current !== null && (
                                          <RequestLayer
                                            isAccept={request === current}
                                            request={wardShiftTypeMap.get(request)!}
                                            showCheck={showLayer.check}
                                            showSlash={showLayer.slash}
                                          />
                                        )}
                                        <ShiftBadge
                                          key={j}
                                          onClick={() => {
                                            changeFocus?.({
                                              shiftNurseName: row.shiftNurse.name,
                                              shiftNurseId: row.shiftNurse.shiftNurseId,
                                              day: j,
                                            });
                                          }}
                                          shiftType={
                                            current === null
                                              ? request === null
                                                ? null
                                                : wardShiftTypeMap.get(request)
                                              : wardShiftTypeMap.get(current)
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
                                <div className="w-[13.625rem] shrink-0 rounded-[1.25rem] px-[1.5625rem]">
                                  <div key={rowIndex} className="flex h-[3.25rem] items-center">
                                    {shift?.wardShiftTypes
                                      .slice(0, 4)
                                      .map((wardShiftType, index) => (
                                        <div
                                          key={index}
                                          className="flex-1 text-center font-poppins text-[1.25rem] text-sub-2"
                                        >
                                          {
                                            row.wardShiftList.filter(
                                              (current) => current === wardShiftType.wardShiftTypeId
                                            ).length
                                          }
                                        </div>
                                      ))}
                                    <div className="flex-1 text-center font-poppins text-[1.25rem] text-sub-2">
                                      {
                                        row.wardShiftList.filter(
                                          (current, i) =>
                                            current &&
                                            wardShiftTypeMap.get(current)?.isOff &&
                                            shift.days.find((x) => x.day === i + 1)?.dayType !=
                                              'workday'
                                        ).length
                                      }
                                    </div>
                                  </div>
                                </div>
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
