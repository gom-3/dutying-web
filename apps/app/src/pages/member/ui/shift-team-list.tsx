import {DragDropContext} from '@hello-pangea/dnd';
import {useEffect} from 'react';
import {useNavigate} from 'react-router';
import {events, sendEvent} from '@/analytics';
import useEditShiftTeam from '@/features/edit-shift-team';
import {useTutorialStore} from '@/features/tutorial/model/store';
import {Plus} from 'lucide-react';
import ROUTE from '@/shared/constant/path';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import useShiftTeamListController from '../model/use-shift-team-list-controller-hook';
import ShiftTeamCard from './shift-team-card';

function ShiftTeamList() {
    const {
        state: {shiftTeams, selectedNurse, isAddingNurse},
        actions: {selectNurse, createShiftTeam, moveNurseOrder, updateShiftTeam, addNurse, editDivision, deleteShiftTeam},
    } = useEditShiftTeam();
    const showMemberTutorial = useTutorialStore((state) => state.showMemberTutorial);
    const navigate = useNavigate();
    const {t} = useTypedTranslation();
    const {
        state: {openMenuShiftTeamId, editShiftTeam},
        refs: {clickAwayListRef, clickAwayMenuRef, clickAwayShiftTeamNameRef},
        actions: {setOpenMenuShiftTeamId, handleUpdateShiftTeam, startEditingShiftTeam, changeEditShiftTeamName, handleDragEnd},
    } = useShiftTeamListController({
        shiftTeams,
        selectedNurse,
        selectNurse,
        moveNurseOrder,
        updateShiftTeam,
    });

    useEffect(() => {
        if (shiftTeams && showMemberTutorial) {
            window.dispatchEvent(new Event('resize'));
        }
    }, [shiftTeams, showMemberTutorial]);

    return (
        <div>
            <div className="mt-7.5 flex items-end gap-[.625rem]">
                <h1 className="font-apple text-[1.75rem] font-semibold text-text-1">{t('page.member.shiftTeamList.title')}</h1>
                <p className="font-apple text-base text-sub-2.5">{t('page.member.shiftTeamList.subtitle')}</p>
                <button
                    type="button"
                    className="ml-4.5 flex h-9 items-center gap-[.5rem] rounded-[.3125rem] border-[.0625rem] border-main-3 bg-white px-[.75rem] font-apple text-base text-main-2"
                    onClick={() => {
                        createShiftTeam();
                        sendEvent(events.memberPage.createShiftTeam);
                    }}
                >
                    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#CFD6DF] transition-colors group-hover:bg-[#EEF2F6]">
                        <Plus className="h-[12px] w-[12px] text-[#4F5A71]" strokeWidth={3} />
                    </span>
                    {t('page.member.shiftTeamList.addTeam')}
                </button>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="mb-8 flex items-start gap-10" ref={clickAwayListRef}>
                    {shiftTeams?.map((shiftTeam) => (
                        <ShiftTeamCard
                            key={shiftTeam.shiftTeamId}
                            shiftTeam={shiftTeam}
                            selectedNurseId={selectedNurse?.nurseId}
                            openMenuShiftTeamId={openMenuShiftTeamId}
                            editShiftTeam={editShiftTeam}
                            clickAwayMenuRef={clickAwayMenuRef}
                            clickAwayShiftTeamNameRef={clickAwayShiftTeamNameRef}
                            selectNurse={selectNurse}
                            addNurse={addNurse}
                            isAddingNurse={isAddingNurse}
                            editDivision={editDivision}
                            deleteShiftTeam={deleteShiftTeam}
                            onOpenMenu={setOpenMenuShiftTeamId}
                            onCloseMenu={() => setOpenMenuShiftTeamId(null)}
                            onStartEditingShiftTeam={startEditingShiftTeam}
                            onChangeEditShiftTeamName={changeEditShiftTeamName}
                            onSubmitEditShiftTeam={handleUpdateShiftTeam}
                            onMoveToMakePage={() => navigate(ROUTE.MAKE)}
                        />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}

export default ShiftTeamList;


