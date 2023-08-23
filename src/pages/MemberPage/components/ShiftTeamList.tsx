/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DragIcon, InfoIcon, MoreIcon, PersonIcon, PlusIcon, UnlinkedIcon } from '@assets/svg';
import TextField from '@components/TextField';
import useEditShiftTeam from '@hooks/useEditShiftTeam';
import { UpdateShiftTeamDTO } from '@libs/api/ward';
import { groupBy } from 'lodash-es';
import { useEffect, useState } from 'react';
import { DragDropContext, DropResult, Droppable, Draggable } from 'react-beautiful-dnd';
import useOnclickOutside from 'react-cool-onclickoutside';

function ShiftTeamList() {
  const {
    state: { shiftTeams, selectedNurse },
    actions: { selectNurse, createShiftTeam, moveNurseOrder, updateShiftTeam, addNurse },
  } = useEditShiftTeam();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [editShiftTeam, setEditShiftTeam] = useState<{
    shiftTeamId: number;
    updateShiftTeamDTO: UpdateShiftTeamDTO;
  } | null>(null);
  const clickAwayRef = useOnclickOutside(() => selectNurse(null));
  const clickAwayMenuRef = useOnclickOutside(() => setOpenMenu(null));
  const clickAwayShiftTeamNameRef = useOnclickOutside(() => {
    if (!editShiftTeam) return;
    handleUpdateShiftTeam();
  });

  const handleUpdateShiftTeam = () => {
    setEditShiftTeam(null);
    updateShiftTeam(editShiftTeam!.shiftTeamId, editShiftTeam!.updateShiftTeamDTO);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!shiftTeams || !selectedNurse) return;
    const selectedShiftTeamId = shiftTeams.findIndex(
      (shiftTeam) =>
        shiftTeam.nurses.findIndex((nurse) => nurse.nurseId === selectedNurse.nurseId) !== -1
    );

    const selectedNurseIndex = shiftTeams[selectedShiftTeamId].nurses.findIndex(
      (nurse) => nurse.nurseId === selectedNurse.nurseId
    );
    if (e.key === 'ArrowUp') {
      if (selectedNurseIndex > 0)
        selectNurse(shiftTeams[selectedShiftTeamId].nurses[selectedNurseIndex - 1].nurseId);
      else if (selectedShiftTeamId > 0)
        selectNurse(
          shiftTeams[selectedShiftTeamId - 1].nurses[
            shiftTeams[selectedShiftTeamId - 1].nurses.length - 1
          ].nurseId
        );
    } else if (e.key === 'ArrowDown') {
      if (selectedNurseIndex < shiftTeams[selectedShiftTeamId].nurses.length - 1)
        selectNurse(shiftTeams[selectedShiftTeamId].nurses[selectedNurseIndex + 1].nurseId);
      else if (selectedShiftTeamId < shiftTeams.length - 1)
        selectNurse(shiftTeams[selectedShiftTeamId + 1].nurses[0].nurseId);
    }
  };

  const onDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (!destination || !shiftTeams) return null;
    if (source.droppableId === destination.droppableId && destination.index === source.index)
      return;

    const [sourceShiftTeamId] = source.droppableId.split(',');
    const [destinationShiftTeamId, destinationDivision] = destination.droppableId.split(',');

    const divisionNurses = groupBy(
      shiftTeams.find((x) => x.shiftTeamId === parseInt(destinationShiftTeamId))!.nurses,
      'divisionNum'
    );
    const destinationNurses = divisionNurses[destinationDivision];

    const dragedNurse = shiftTeams
      .find((x) => x.shiftTeamId === parseInt(sourceShiftTeamId))!
      .nurses.find((x) => x.nurseId === parseInt(draggableId))!;

    if (
      destination.droppableId === source.droppableId &&
      destinationNurses.findIndex((x) => x.nurseId === dragedNurse.nurseId) < destination.index
    ) {
      moveNurseOrder(
        dragedNurse.nurseId,
        parseInt(sourceShiftTeamId),
        parseInt(destinationShiftTeamId),
        parseInt(destinationDivision),
        destination.index === 0 ? 0 : destinationNurses[destination.index].priority,
        destination.index === destinationNurses.length - 1
          ? destinationNurses[destination.index].priority + 2024
          : destinationNurses[destination.index + 1].priority
      );
    } else {
      if (parseInt(destinationDivision) === 0) {
        moveNurseOrder(
          dragedNurse.nurseId,
          parseInt(sourceShiftTeamId),
          parseInt(destinationShiftTeamId),
          1,
          0,
          2024
        );
      } else {
        moveNurseOrder(
          dragedNurse.nurseId,
          parseInt(sourceShiftTeamId),
          parseInt(destinationShiftTeamId),
          parseInt(destinationDivision),
          destination.index === 0 ? 0 : destinationNurses[destination.index - 1].priority,
          destination.index === destinationNurses.length
            ? destinationNurses[destination.index - 1].priority + 2024
            : destinationNurses[destination.index].priority
        );
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shiftTeams, selectedNurse]);

  return (
    <div>
      <div className="mt-[1.875rem] flex items-end gap-[.625rem]">
        <h1 className="font-apple text-[1.75rem] font-semibold text-text-1">팀</h1>
        <p className="font-apple text-base text-sub-2.5">팀당 근무표 1개 생성 가능합니다.</p>
        <button
          className="ml-[16.125rem] flex h-[2.25rem] items-center gap-[.5rem] rounded-[.3125rem] border-[.0625rem] border-main-3 bg-white px-[.75rem] font-apple text-base text-main-2"
          onClick={createShiftTeam}
        >
          <PlusIcon className="h-[1.5rem] w-[1.5rem] stroke-main-2" />팀 추가하기
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="mb-8 flex items-start gap-[2.5rem]">
          {shiftTeams?.map((shiftTeam) => (
            <div
              ref={clickAwayRef}
              className="mt-[1.375rem] flex w-[18.75rem] flex-col rounded-[.9375rem] border-[.0625rem] border-sub-4.5 shadow-shadow-1"
              key={shiftTeam.shiftTeamId}
            >
              <div className="relative flex w-full items-center justify-between rounded-t-[.9375rem] bg-sub-2 px-[1.25rem] py-[.875rem]">
                <div className="flex flex-col gap-[.3125rem]">
                  {editShiftTeam?.shiftTeamId === shiftTeam.shiftTeamId ? (
                    <TextField
                      forwardRef={clickAwayShiftTeamNameRef}
                      value={editShiftTeam.updateShiftTeamDTO.name}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateShiftTeam()}
                      onChange={(e) =>
                        setEditShiftTeam({
                          ...editShiftTeam,
                          updateShiftTeamDTO: { name: e.target.value },
                        })
                      }
                      className="ml-[-.5rem] bg-transparent px-[.5rem] font-apple text-[1.5rem] font-semibold text-sub-4 outline-main-2 focus:outline-main-2"
                      autoFocus
                    />
                  ) : (
                    <h2
                      onClick={() =>
                        setEditShiftTeam({
                          shiftTeamId: shiftTeam.shiftTeamId,
                          updateShiftTeamDTO: { name: shiftTeam.name },
                        })
                      }
                      className="font-apple text-[1.5rem] font-semibold text-white"
                    >
                      {shiftTeam.name}
                    </h2>
                  )}

                  <div className="flex items-center">
                    <PersonIcon className="h-[1rem] w-[1rem]" />
                    <p className="font-poppins text-[.75rem] text-white">
                      {shiftTeam.nurses.length}
                    </p>
                  </div>
                </div>
                <MoreIcon
                  className="h-[1.875rem] w-[1.875rem] cursor-pointer"
                  onClick={() => setOpenMenu(shiftTeam.shiftTeamId)}
                />
                {openMenu === shiftTeam.shiftTeamId && (
                  <div
                    className="absolute right-0 top-[3.75rem] z-10 flex h-[14rem] w-[14.375rem] flex-col rounded-[.625rem] bg-white shadow-[4px_4px_42px_0px_rgba(104,81,149,0.25)]"
                    ref={clickAwayMenuRef}
                  >
                    <div className="flex flex-1 cursor-pointer items-center border-b-[.0625rem] border-main-3 px-[1.5625rem] font-apple text-[1.25rem] font-medium text-sub-2 last:border-none">
                      팀 초대하기
                    </div>
                    <div
                      className="relative flex flex-1 cursor-pointer items-center gap-[.3125rem] border-b-[.0625rem] border-main-3 px-[1.5625rem] font-apple text-[1.25rem] font-medium text-sub-2 last:border-none"
                      onClick={() => {
                        addNurse(shiftTeam.shiftTeamId);
                        setOpenMenu(null);
                      }}
                    >
                      가상 간호사 만들기
                      <InfoIcon className="peer h-[1.25rem] w-[1.25rem]" />
                      <div className="invisible absolute right-[-21.5rem] top-[50%] z-30 flex w-[22.75rem] translate-y-[-50%] items-center gap-[.5rem] rounded-[.3125rem] bg-white px-2 py-1 font-apple text-[.875rem] text-sub-2 shadow-shadow-2 peer-hover:visible">
                        <div
                          className="absolute left-[-.4375rem] top-[50%] h-0 w-0 translate-y-[-50%]"
                          style={{
                            borderTop: '.4375rem solid transparent',
                            borderLeft: '.625rem solid none',
                            borderRight: '.625rem solid white',
                            borderBottom: '.4375rem solid transparent',
                          }}
                        />
                        초대하지 않아도, 가상의 프로필을 만들어 관리할 수 있어요! &nbsp; (언제든지
                        초대해서 연동 가능합니다.)
                      </div>
                    </div>
                    <div className="flex flex-1 cursor-pointer items-center border-b-[.0625rem] border-main-3 px-[1.5625rem] font-apple text-[1.25rem] font-medium text-sub-2 last:border-none">
                      근무표 보러가기
                    </div>
                    <div className="flex flex-1 cursor-pointer items-center border-b-[.0625rem] border-main-3 px-[1.5625rem] font-apple text-[1.25rem] font-medium text-sub-2 last:border-none">
                      팀 삭제하기
                    </div>
                  </div>
                )}
              </div>
              {shiftTeam.nurses.length === 0 && (
                <Droppable
                  droppableId={shiftTeam.shiftTeamId + ',' + 0}
                  key={shiftTeam.shiftTeamId + ',' + 0}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex h-[3.5rem] w-full cursor-pointer select-none items-center justify-center`}
                    >
                      <h3 className="font-apple text-[1.25rem] font-semibold text-sub-2.5">
                        아직 간호사가 없습니다!
                      </h3>
                    </div>
                  )}
                </Droppable>
              )}
              {Object.entries(groupBy(shiftTeam.nurses, 'divisionNum')).map(
                ([division, divisionNurses]) => (
                  <Droppable
                    droppableId={shiftTeam.shiftTeamId + ',' + division}
                    key={shiftTeam.shiftTeamId + ',' + division}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="border-b-[.0938rem] border-sub-2.5 last:border-none"
                      >
                        {divisionNurses.map((nurse, index) => (
                          <Draggable
                            draggableId={nurse.nurseId.toString()}
                            index={index}
                            key={nurse.nurseId}
                          >
                            {(provided) => (
                              <div
                                className={`group relative flex h-[3.5rem] w-full cursor-pointer select-none items-center justify-center  
                              ${
                                selectedNurse?.nurseId === nurse.nurseId
                                  ? 'bg-main-4 text-main-1 underline underline-offset-2'
                                  : 'bg-white text-sub-1'
                              }
                              ${
                                shiftTeam.nurses.findIndex((x) => x.nurseId === nurse.nurseId) ===
                                shiftTeam.nurses.length - 1
                                  ? 'rounded-b-[.9375rem]'
                                  : 'border-b-[.0313rem] border-b-sub-4.5'
                              }`}
                                ref={provided.innerRef}
                                onClick={() => selectNurse(nurse.nurseId)}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <DragIcon className="invisible absolute left-[.75rem] h-[1.5rem] w-[1.5rem] group-hover:visible" />
                                <div className="peer relative font-apple text-[1.25rem] font-semibold text-sub-1">
                                  {nurse.name}
                                  <div className="absolute right-[-.3125rem] top-0 h-[.3125rem] w-[.3125rem] rounded-full bg-[#FF4A80]"></div>
                                </div>
                                <div className="invisible absolute top-0 z-30 flex translate-y-[-60%] items-center gap-[.5rem] whitespace-nowrap rounded-[.3125rem] bg-white px-2 py-1 font-apple text-[.875rem] text-sub-2 shadow-shadow-2 peer-hover:visible">
                                  <div
                                    className="absolute bottom-[-0.375rem] left-[50%] h-0 w-0 translate-x-[-50%]"
                                    style={{
                                      borderTop: '.625rem solid white',
                                      borderLeft: '.4375rem solid transparent',
                                      borderRight: '.4375rem solid transparent',
                                      borderBottom: '.625rem solid none',
                                    }}
                                  />
                                  연동 되지 않은 가상의 프로필입니다.
                                  <UnlinkedIcon className="h-[1.25rem] w-[1.25rem]" />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )
              )}
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default ShiftTeamList;
