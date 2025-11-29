import {NextIcon, PenIcon, PrevIcon, SaveCompleteIcon, SavingIcon} from '@/assets/svg';
import Button from '@/components/Button';
import Select from '@/components/Select';
import useRequestShift from '@/hooks/shift/useRequestShift';
import {events, sendEvent} from 'analytics';

function Toolbar() {
    const {
        state: {month, changeStatus, currentShiftTeam, shiftTeams, readonly},
        actions: {changeMonth, changeShiftTeam, toggleEditMode},
    } = useRequestShift();

    return (
        <div id="toolbar" className="sticky top-0 z-30 flex h-24.5 w-full items-center bg-[#FDFCFE] pt-7.5 pr-4 pb-[.75rem] pl-5">
            <div className="flex gap-5">
                <div className="w-13.5"></div>
                <div className="w-17.5"></div>
                <div className="w-4"></div>
            </div>

            <div className="absolute flex items-center">
                <PrevIcon
                    onClick={() => {
                        changeMonth('prev');
                        sendEvent(events.requestPage.toolbar.changeMonth);
                    }}
                    className="h-7.5 w-7.5 cursor-pointer"
                />
                <p className="mx-[.625rem] font-poppins text-2xl text-main-1">{month}월</p>
                <NextIcon
                    onClick={() => {
                        changeMonth('next');
                        sendEvent(events.requestPage.toolbar.changeMonth);
                    }}
                    className="h-7.5 w-7.5 cursor-pointer"
                />
            </div>

            {!readonly && (
                <>
                    <div className="ml-auto flex gap-[.3125rem] font-apple text-[.875rem] text-sub-2.5">
                        {changeStatus === 'loading' ? <SavingIcon className="h-5 w-5" /> : <SaveCompleteIcon className="h-5 w-5" />}
                        {changeStatus === 'loading' ? '저장중' : '저장 완료'}
                    </div>
                </>
            )}

            <div>
                {currentShiftTeam && (
                    <Select
                        value={currentShiftTeam?.shiftTeamId}
                        options={shiftTeams?.map((shiftTeam) => ({
                            label: shiftTeam.name,
                            value: shiftTeam.shiftTeamId,
                        }))}
                        className="ml-7.5 h-11.5 w-42 font-apple text-[1.25rem] font-semibold text-main-1"
                        selectClassName="outline-[.0938rem] outline-main-1"
                        onChange={(e) => {
                            changeShiftTeam(shiftTeams!.find((shiftTeam) => shiftTeam.shiftTeamId === parseInt(e.target.value))!);
                            sendEvent(events.requestPage.toolbar.changeShiftTeam);
                        }}
                    />
                )}
            </div>

            {readonly ? (
                <div className="ml-auto flex gap-[10px]">
                    <Button
                        id="editButton"
                        type="fill"
                        className="flex h-10 items-center justify-center gap-[.5rem] rounded-[.625rem] bg-main-2 px-[.75rem] text-[1.25rem] font-semibold"
                        onClick={() => toggleEditMode()}
                    >
                        수정하기
                        <PenIcon className="h-6 w-6 stroke-white" />
                    </Button>
                </div>
            ) : (
                <div className="ml-5 flex gap-[.875rem]">
                    <Button
                        type="outline"
                        className="h-10 w-18.75 rounded-[3.125rem] text-[1.25rem] font-semibold"
                        onClick={() => toggleEditMode()}
                    >
                        저장
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Toolbar;
