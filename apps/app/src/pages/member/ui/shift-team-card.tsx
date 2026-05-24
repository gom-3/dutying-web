import {DateUtil} from '@dutying/utils/date';
import {Droppable, Draggable} from '@hello-pangea/dnd';
import type {KeyboardEvent as ReactKeyboardEvent, RefCallback} from 'react';
import {events, sendEvent} from '@/analytics';
import {type TShiftTeam} from '@/entities/ward';
import {setPreferredShiftTeamId} from '@/features/edit-duty/model/utils/prefs';
import {DragIcon, InfoIcon, MinusIcon, MoreIcon, PersonIcon, PlusIcon2, UnlinkedIcon} from '@/shared/assets/svg';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import TextField from '@/shared/ui/form-controls/TextField';
import {getGroupedDivisionNurses, type TEditShiftTeamState} from '../model/shift-team-list';

interface IShiftTeamCardProps {
    shiftTeam: TShiftTeam;
    selectedNurseId: number | undefined;
    openMenuShiftTeamId: number | null;
    editShiftTeam: TEditShiftTeamState;
    clickAwayMenuRef: RefCallback<HTMLDivElement>;
    clickAwayShiftTeamNameRef: RefCallback<HTMLInputElement>;
    selectNurse: (nurseId: number, mode?: 'create' | 'edit') => boolean;
    addNurse: (shiftTeamId: number) => void;
    isAddingNurse: boolean;
    editDivision: (shiftTeamId: number, prevPriority: number, changeValue: number, patchYearMonth: string) => void;
    deleteShiftTeam: (shiftTeamId: number) => void;
    onOpenMenu: (shiftTeamId: number) => void;
    onCloseMenu: () => void;
    onStartEditingShiftTeam: (shiftTeamId: number, name: string) => void;
    onChangeEditShiftTeamName: (name: string) => void;
    onSubmitEditShiftTeam: () => void;
    onMoveToMakePage: () => void;
}

function ShiftTeamCard({
    shiftTeam,
    selectedNurseId,
    openMenuShiftTeamId,
    editShiftTeam,
    clickAwayMenuRef,
    clickAwayShiftTeamNameRef,
    selectNurse,
    addNurse,
    isAddingNurse,
    editDivision,
    deleteShiftTeam,
    onOpenMenu,
    onCloseMenu,
    onStartEditingShiftTeam,
    onChangeEditShiftTeamName,
    onSubmitEditShiftTeam,
    onMoveToMakePage,
}: IShiftTeamCardProps) {
    const groupedDivisionNurses = getGroupedDivisionNurses(shiftTeam.nurses);
    const {t} = useTypedTranslation();
    const handleActionKeyDown = (event: ReactKeyboardEvent<HTMLElement>, action: () => void, options?: {preventDefault?: boolean}) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;

        if (options?.preventDefault ?? true) {
            event.preventDefault();
        }

        action();
    };

    return (
        <div id="shift_team_list" className="mt-5.5 flex w-75 flex-col rounded-[.9375rem] border-[.0625rem] border-sub-4.5 shadow-banner">
            <div className="relative flex w-full items-center justify-between rounded-t-[.9375rem] bg-sub-2 px-5 py-[.875rem]">
                <div className="flex flex-col gap-[.3125rem]">
                    {editShiftTeam?.shiftTeamId === shiftTeam.shiftTeamId ? (
                        <TextField
                            ref={clickAwayShiftTeamNameRef}
                            value={editShiftTeam.updateShiftTeamDTO.name}
                            onKeyDown={(event) => event.key === 'Enter' && onSubmitEditShiftTeam()}
                            onChange={(event) => onChangeEditShiftTeamName(event.target.value)}
                            className="ml-[-.5rem] bg-transparent px-[.5rem] font-apple text-[1.5rem] font-semibold text-sub-4 outline-main-2 focus:outline-main-2"
                            autoFocus
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => onStartEditingShiftTeam(shiftTeam.shiftTeamId, shiftTeam.name)}
                            className="w-fit rounded-[.3125rem] font-apple text-[1.5rem] font-semibold text-white focus-visible:outline-[.125rem] focus-visible:outline-white"
                            aria-label={t('page.member.shiftTeamList.card.editTeamNameAria', {teamName: shiftTeam.name})}
                        >
                            {shiftTeam.name}
                        </button>
                    )}

                    <div className="flex items-center text-white">
                        <PersonIcon className="h-4 w-4" />
                        <p className="font-poppins text-[.75rem] text-white">{shiftTeam.nurses.length}</p>
                    </div>
                </div>
                <button
                    type="button"
                    className="rounded-[.3125rem] focus-visible:outline-[.125rem] focus-visible:outline-white"
                    aria-label={t('page.member.shiftTeamList.card.openMenuAria', {teamName: shiftTeam.name})}
                    onClick={() => {
                        onOpenMenu(shiftTeam.shiftTeamId);
                        sendEvent(events.memberPage.openShiftTeamMenu);
                    }}
                >
                    <MoreIcon className="h-7.5 w-7.5 cursor-pointer" />
                </button>
                {openMenuShiftTeamId === shiftTeam.shiftTeamId && (
                    <div
                        className="absolute top-15 right-0 z-30 flex h-56 w-57.5 flex-col rounded-[.625rem] bg-white shadow-[4px_4px_42px_0px_rgba(104,81,149,0.25)]"
                        ref={clickAwayMenuRef}
                    >
                        <button
                            type="button"
                            className="relative flex flex-1 items-center gap-[.3125rem] border-b-[.0625rem] border-main-3 px-6.25 text-left font-apple text-[1.25rem] font-medium text-sub-2 last:border-none focus-visible:outline-[.125rem] focus-visible:outline-main-2 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isAddingNurse}
                            onClick={() => {
                                addNurse(shiftTeam.shiftTeamId);
                                onCloseMenu();
                            }}
                            aria-label={t('page.member.shiftTeamList.card.addNurse')}
                        >
                            {isAddingNurse ? '간호사 추가 중...' : t('page.member.shiftTeamList.card.addNurse')}
                            <InfoIcon className="peer h-5 w-5 text-sub-2.5" />
                            <div className="invisible absolute top-[50%] -right-86 z-30 flex w-91 translate-y-[-50%] items-center gap-[.5rem] rounded-[.3125rem] bg-white px-2 py-1 font-apple text-[.875rem] text-sub-2 shadow-shadow-2 peer-hover:visible">
                                <div
                                    className="absolute top-[50%] left-[-.4375rem] h-0 w-0 translate-y-[-50%]"
                                    style={{
                                        borderTop: '.4375rem solid transparent',
                                        borderLeft: '.625rem solid none',
                                        borderRight: '.625rem solid white',
                                        borderBottom: '.4375rem solid transparent',
                                    }}
                                />
                                {t('page.member.shiftTeamList.card.addNurseTooltip')}
                            </div>
                        </button>
                        <button
                            type="button"
                            className="flex flex-1 items-center border-b-[.0625rem] border-main-3 px-6.25 text-left font-apple text-[1.25rem] font-medium text-sub-2 last:border-none focus-visible:outline-[.125rem] focus-visible:outline-main-2"
                            onClick={() => {
                                setPreferredShiftTeamId(shiftTeam.shiftTeamId);
                                onMoveToMakePage();
                            }}
                            aria-label={t('page.member.shiftTeamList.card.viewShift')}
                        >
                            {t('page.member.shiftTeamList.card.viewShift')}
                        </button>
                        <button
                            type="button"
                            className="flex flex-1 items-center border-b-[.0625rem] border-main-3 px-6.25 text-left font-apple text-[1.25rem] font-medium text-sub-2 last:border-none focus-visible:outline-[.125rem] focus-visible:outline-main-2"
                            onClick={() => deleteShiftTeam(shiftTeam.shiftTeamId)}
                            aria-label={t('page.member.shiftTeamList.card.deleteTeam')}
                        >
                            {t('page.member.shiftTeamList.card.deleteTeam')}
                        </button>
                    </div>
                )}
            </div>
            {shiftTeam.nurses.length === 0 && (
                <Droppable droppableId={shiftTeam.shiftTeamId + ',' + 0} key={shiftTeam.shiftTeamId + ',' + 0}>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex h-14 w-full cursor-pointer items-center justify-center select-none"
                        >
                            <h3 className="font-apple text-[1.25rem] font-semibold text-sub-2.5">
                                {t('page.member.shiftTeamList.card.empty')}
                            </h3>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            )}
            {groupedDivisionNurses.map(([division, divisionNurses], divisionIndex) => (
                <Droppable droppableId={shiftTeam.shiftTeamId + ',' + division} key={shiftTeam.shiftTeamId + ',' + division}>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="border-b-[.0938rem] border-sub-2.5 last:border-none"
                        >
                            {divisionNurses.map((nurse, index) => (
                                <Draggable draggableId={nurse.nurseId.toString()} index={index} key={nurse.nurseId}>
                                    {(draggableProvided) => (
                                        <div
                                            id="nurse_sample"
                                            className={`group relative flex h-14 w-full cursor-pointer items-center justify-center select-none ${
                                                selectedNurseId === nurse.nurseId
                                                    ? 'bg-main-4 text-main-1 underline underline-offset-2'
                                                    : 'bg-white text-sub-1'
                                            } ${
                                                shiftTeam.nurses.findIndex((item) => item.nurseId === nurse.nurseId) ===
                                                shiftTeam.nurses.length - 1
                                                    ? 'rounded-b-[.9375rem]'
                                                    : 'border-b-[.0313rem] border-b-sub-4.5'
                                            } focus-visible:outline-[.125rem] focus-visible:outline-main-2`}
                                            ref={draggableProvided.innerRef}
                                            onClick={() => {
                                                selectNurse(nurse.nurseId);
                                                sendEvent(events.memberPage.focusNurse);
                                            }}
                                            onKeyDown={(event) =>
                                                handleActionKeyDown(event, () => {
                                                    selectNurse(nurse.nurseId);
                                                    sendEvent(events.memberPage.focusNurse);
                                                })
                                            }
                                            tabIndex={0}
                                            role="button"
                                            aria-label={t('page.member.shiftTeamList.card.selectNurseAria', {nurseName: nurse.name})}
                                            {...draggableProvided.draggableProps}
                                            {...draggableProvided.dragHandleProps}
                                        >
                                            <DragIcon className="invisible absolute left-[.75rem] h-6 w-6 group-hover:visible" />
                                            <div className="peer relative font-apple text-[1.25rem] font-semibold text-sub-1">
                                                {nurse.name}
                                                {!nurse.isConnected && (
                                                    <div className="absolute top-0 right-[-.3125rem] h-[.3125rem] w-[.3125rem] rounded-full bg-red"></div>
                                                )}
                                            </div>
                                            <div className="invisible absolute top-0 z-30 flex translate-y-[-60%] items-center gap-[.5rem] rounded-[.3125rem] bg-white px-2 py-1 font-apple text-[.875rem] whitespace-nowrap text-sub-2 shadow-shadow-2 peer-hover:visible">
                                                <div
                                                    className="absolute -bottom-1.5 left-[50%] h-0 w-0 translate-x-[-50%]"
                                                    style={{
                                                        borderTop: '.625rem solid white',
                                                        borderLeft: '.4375rem solid transparent',
                                                        borderRight: '.4375rem solid transparent',
                                                        borderBottom: '.625rem solid none',
                                                    }}
                                                />
                                                {t('page.member.shiftTeamList.card.virtualNurseTooltip')}
                                                <UnlinkedIcon className="h-5 w-5" />
                                            </div>
                                            {index !== divisionNurses.length - 1 ? (
                                                <div
                                                    className="absolute bottom-0 z-10 w-full focus-visible:outline-[.125rem] focus-visible:outline-main-2"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        editDivision(
                                                            shiftTeam.shiftTeamId,
                                                            nurse.priority,
                                                            1,
                                                            DateUtil.getDateString(new Date(), 'yyyy-MM'),
                                                        );
                                                        sendEvent(events.memberPage.createDivision);
                                                    }}
                                                    onKeyDown={(event) =>
                                                        handleActionKeyDown(event, () => {
                                                            editDivision(
                                                                shiftTeam.shiftTeamId,
                                                                nurse.priority,
                                                                1,
                                                                DateUtil.getDateString(new Date(), 'yyyy-MM'),
                                                            );
                                                            sendEvent(events.memberPage.createDivision);
                                                        })
                                                    }
                                                    tabIndex={0}
                                                    role="button"
                                                    aria-label={t('page.member.shiftTeamList.card.addDividerAria', {nurseName: nurse.name})}
                                                >
                                                    <div className="peer absolute bottom-0 z-30 h-[.8rem] w-full translate-y-[50%]" />
                                                    <div className="invisible absolute bottom-0 h-[.0938rem] w-full bg-sub-2.5 peer-hover:visible" />
                                                    <PlusIcon2 className="invisible absolute bottom-0 left-0 h-5 w-5 -translate-x-full translate-y-[50%] peer-hover:visible" />
                                                    <p className="invisible absolute bottom-0 left-0 translate-x-[calc(.625rem-100%)] translate-y-[-50%] font-apple text-[.75rem] text-sub-2.5 peer-hover:visible">
                                                        {t('page.member.shiftTeamList.card.divider')}
                                                    </p>
                                                </div>
                                            ) : (
                                                divisionIndex !== groupedDivisionNurses.length - 1 && (
                                                    <div
                                                        className="absolute bottom-0 z-10 w-full focus-visible:outline-[.125rem] focus-visible:outline-main-2"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            editDivision(
                                                                shiftTeam.shiftTeamId,
                                                                nurse.priority,
                                                                -1,
                                                                DateUtil.getDateString(new Date(), 'yyyy-MM'),
                                                            );
                                                            sendEvent(events.memberPage.deleteDivision);
                                                        }}
                                                        onKeyDown={(event) =>
                                                            handleActionKeyDown(event, () => {
                                                                editDivision(
                                                                    shiftTeam.shiftTeamId,
                                                                    nurse.priority,
                                                                    -1,
                                                                    DateUtil.getDateString(new Date(), 'yyyy-MM'),
                                                                );
                                                                sendEvent(events.memberPage.deleteDivision);
                                                            })
                                                        }
                                                        tabIndex={0}
                                                        role="button"
                                                        aria-label={t('page.member.shiftTeamList.card.removeDividerAria', {
                                                            nurseName: nurse.name,
                                                        })}
                                                    >
                                                        <div className="peer absolute bottom-0 z-30 h-[.8rem] w-full translate-y-[50%]" />
                                                        <div className="invisible absolute bottom-0 h-[.0938rem] w-full translate-y-full bg-red peer-hover:visible" />
                                                        <MinusIcon className="invisible absolute bottom-0 left-0 h-5 w-5 -translate-x-full translate-y-[50%] peer-hover:visible" />
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
    );
}

export default ShiftTeamCard;
