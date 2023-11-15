/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DragIcon,
  InfoIcon,
  MinusIcon,
  MoreIcon,
  PersonIcon,
  PlusIcon,
  PlusIcon2,
  UnlinkedIcon,
} from '@assets/svg';
import TextField from '@components/TextField';
import useEditShiftStore from '@hooks/shift/useEditShift/store';
import useTutorial from '@hooks/ui/useTutorial';
import useEditShiftTeam from '@hooks/ward/useEditShiftTeam';
import { UpdateShiftTeamDTO } from '@libs/api/shiftTeam';
import ROUTE from '@libs/constant/path';
import { events, sendEvent } from 'analytics';
import { groupBy } from 'lodash-es';
import { useEffect, useState } from 'react';
import { DragDropContext, DropResult, Droppable, Draggable } from 'react-beautiful-dnd';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useNavigate } from 'react-router';

function ShiftTeamList() {
  const {
    state: { shiftTeams, selectedNurse },
    actions: {
      selectNurse,
      createShiftTeam,
      moveNurseOrder,
      updateShiftTeam,
      addNurse,
      editDivision,
      deleteShiftTeam,
    },
  } = useEditShiftTeam();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [editShiftTeam, setEditShiftTeam] = useState<{
    shiftTeamId: number;
    updateShiftTeamDTO: UpdateShiftTeamDTO;
  } | null>(null);
  const {
    state: { showMemberTutorial },
  } = useTutorial();
  const setEditShiftStore = useEditShiftStore((state) => state.setState);

  const navigate = useNavigate();

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
    const selectedShiftTeamIndex = shiftTeams.findIndex(
      (shiftTeam) =>
        shiftTeam.nurses.findIndex((nurse) => nurse.nurseId === selectedNurse.nurseId) !== -1
    );
    const groupNurses = Object.entries(
      groupBy(shiftTeams[selectedShiftTeamIndex].nurses, 'divisionNum')
    ).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    const selectedGroupIndex = groupNurses.findIndex((x) =>
      x[1].some((y) => y.nurseId === selectedNurse.nurseId)
    );
    const selectedGroup = groupNurses[selectedGroupIndex][1];
    const selectedNurseIndex = selectedGroup.findIndex(
      (nurse) => nurse.nurseId === selectedNurse.nurseId
    );
    if (e.key === 'ArrowUp') {
      if (selectedNurseIndex > 0) {
        selectNurse(selectedGroup[selectedNurseIndex - 1].nurseId);
      } else if (selectedGroupIndex > 0) {
        selectNurse(
          groupNurses[selectedGroupIndex - 1][1][groupNurses[selectedGroupIndex - 1][1].length - 1]
            .nurseId
        );
      } else if (selectedShiftTeamIndex > 0) {
        selectNurse(
          shiftTeams[selectedShiftTeamIndex - 1].nurses[
            shiftTeams[selectedShiftTeamIndex - 1].nurses.length - 1
          ].nurseId
        );
      }
    } else if (e.key === 'ArrowDown') {
      if (selectedNurseIndex < selectedGroup.length - 1) {
        selectNurse(selectedGroup[selectedNurseIndex + 1].nurseId);
      } else if (selectedGroupIndex < groupNurses.length - 1) {
        selectNurse(groupNurses[selectedGroupIndex + 1][1][0].nurseId);
      } else if (selectedShiftTeamIndex < shiftTeams.length - 1) {
        selectNurse(shiftTeams[selectedShiftTeamIndex + 1].nurses[0].nurseId);
      }
    }
    sendEvent(events.memberPage.moveNurseFocus);
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
          : destinationNurses[destination.index + 1].priority,
        `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`
      );
    } else {
      if (parseInt(destinationDivision) === 0) {
        moveNurseOrder(
          dragedNurse.nurseId,
          parseInt(sourceShiftTeamId),
          parseInt(destinationShiftTeamId),
          1,
          0,
          2024,
          `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`
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
            : destinationNurses[destination.index].priority,
          `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`
        );
      }
    }
    sendEvent(events.memberPage.moveNurse);
  };

  useEffect(() => {
    if (shiftTeams && showMemberTutorial) window.dispatchEvent(new Event('resize'));

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shiftTeams, selectedNurse]);

  return (
    <div>
      <div className="mt-[1.875rem] flex items-end gap-[.625rem]">
        <h1 className="font-apple text-[1.75rem] font-semibold text-text-1">팀</h1>
        <p className="font-apple text-base text-sub-2.5">팀당 근무표 1개 생성 가능합니다.</p>
        <button
          className="ml-[1.125rem] flex h-[2.25rem] items-center gap-[.5rem] rounded-[.3125rem] border-[.0625rem] border-main-3 bg-white px-[.75rem] font-apple text-base text-main-2"
          onClick={() => {
            createShiftTeam();
            sendEvent(events.memberPage.createShiftTeam);
          }}
        >
          <PlusIcon className="h-[1.5rem] w-[1.5rem] stroke-main-2" />팀 추가하기
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="mb-8 flex items-start gap-[2.5rem]">
          {shiftTeams?.map((shiftTeam) => (
            <div
              id="shift_team_list"
              ref={clickAwayRef}
              className="mt-[1.375rem] flex w-[18.75rem] flex-col rounded-[.9375rem] border-[.0625rem] border-sub-4.5 shadow-banner"
              key={shiftTeam.shiftTeamId}
            >
              <div className="relative flex w-full items-center justify-between rounded-t-[.9375rem] bg-sub-2 px-[1.25rem] py-[.875rem]">
                <div className="flex flex-col gap-[.3125rem]">
                  {editShiftTeam?.shiftTeamId === shiftTeam.shiftTeamId ? (
                    <TextField
                      ref={clickAwayShiftTeamNameRef}
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
                  onClick={() => {
                    setOpenMenu(shiftTeam.shiftTeamId);
                    sendEvent(events.memberPage.openShiftTeamMenu);
                  }}
                />
                {openMenu === shiftTeam.shiftTeamId && (
                  <div
                    className="absolute right-0 top-[3.75rem] z-30 flex h-[14rem] w-[14.375rem] flex-col rounded-[.625rem] bg-white shadow-[4px_4px_42px_0px_rgba(104,81,149,0.25)]"
                    ref={clickAwayMenuRef}
                  >
                    <div
                      className="relative flex flex-1 cursor-pointer items-center gap-[.3125rem] border-b-[.0625rem] border-main-3 px-[1.5625rem] font-apple text-[1.25rem] font-medium text-sub-2 last:border-none"
                      onClick={() => {
                        addNurse(shiftTeam.shiftTeamId);
                        setOpenMenu(null);
                      }}
                    >
                      간호사 만들기
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
                        초대하지 않아도, 가상의 간호사를 만들어 관리할 수 있어요! &nbsp; (언제든지
                        초대해서 연동 가능합니다.)
                      </div>
                    </div>
                    <div
                      className="flex flex-1 cursor-pointer items-center border-b-[.0625rem] border-main-3 px-[1.5625rem] font-apple text-[1.25rem] font-medium text-sub-2 last:border-none"
                      onClick={() => {
                        setEditShiftStore('currentShiftTeam', shiftTeam);
                        navigate(ROUTE.MAKE);
                      }}
                    >
                      근무표 보러가기
                    </div>
                    <div
                      className="flex flex-1 cursor-pointer items-center border-b-[.0625rem] border-main-3 px-[1.5625rem] font-apple text-[1.25rem] font-medium text-sub-2 last:border-none"
                      onClick={() => deleteShiftTeam(shiftTeam.shiftTeamId)}
                    >
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
              {Object.entries(groupBy(shiftTeam.nurses, 'divisionNum'))
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .map(([division, divisionNurses], divisionIndex) => (
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
                                id="nurse_sample"
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
                                onClick={() => {
                                  selectNurse(nurse.nurseId);
                                  sendEvent(events.memberPage.focusNurse);
                                }}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <DragIcon className="invisible absolute left-[.75rem] h-[1.5rem] w-[1.5rem] group-hover:visible" />
                                <div className="peer relative font-apple text-[1.25rem] font-semibold text-sub-1">
                                  {nurse.name}
                                  {!nurse.isConnected && (
                                    <div className="absolute right-[-.3125rem] top-0 h-[.3125rem] w-[.3125rem] rounded-full bg-red"></div>
                                  )}
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
                                  연동 되지 않은 가상의 간호사입니다.
                                  <UnlinkedIcon className="h-[1.25rem] w-[1.25rem]" />
                                </div>
                                {index !== divisionNurses.length - 1 ? (
                                  <div
                                    className="absolute bottom-0 z-10 w-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      editDivision(
                                        shiftTeam.shiftTeamId,
                                        nurse.priority,
                                        1,
                                        `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
                                          .toString()
                                          .padStart(2, '0')}`
                                      );
                                      sendEvent(events.memberPage.createDivision);
                                    }}
                                  >
                                    <div className="peer absolute bottom-0 z-30 h-[.8rem] w-full translate-y-[50%]" />
                                    <div className="invisible absolute bottom-0 h-[.0938rem] w-full bg-sub-2.5 peer-hover:visible" />
                                    <PlusIcon2 className="invisible absolute bottom-0 left-0  h-[1.25rem] w-[1.25rem] translate-x-[-100%] translate-y-[50%] peer-hover:visible" />
                                    <p className="invisible absolute bottom-0 left-0 translate-x-[calc(.625rem-100%)] translate-y-[-50%] font-apple text-[.75rem] text-sub-2.5 peer-hover:visible">
                                      구분선
                                    </p>
                                  </div>
                                ) : (
                                  divisionIndex !==
                                    Object.entries(groupBy(shiftTeam.nurses, 'divisionNum'))
                                      .length -
                                      1 && (
                                    <div
                                      className="absolute bottom-0 z-10 w-full"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        editDivision(
                                          shiftTeam.shiftTeamId,
                                          nurse.priority,
                                          -1,
                                          `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
                                            .toString()
                                            .padStart(2, '0')}`
                                        );
                                        sendEvent(events.memberPage.deleteDivision);
                                      }}
                                    >
                                      <div className="peer absolute bottom-0 z-30 h-[.8rem] w-full translate-y-[50%]" />
                                      <div className="invisible absolute bottom-0 h-[.0938rem] w-full translate-y-[100%] bg-red peer-hover:visible" />
                                      <MinusIcon className="invisible absolute bottom-0 left-0  h-[1.25rem] w-[1.25rem] translate-x-[-100%] translate-y-[50%] peer-hover:visible" />
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default ShiftTeamList;
