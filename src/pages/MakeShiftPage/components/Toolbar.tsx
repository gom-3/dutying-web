import {useState} from 'react';
import {createPortal} from 'react-dom';
import Draggable from 'react-draggable';
import {
    CancelIcon,
    DutyIconSelected,
    FaultDotIcon,
    HistoryBackIcon,
    HistoryNextIcon,
    InfoIcon,
    NextIcon,
    PenIcon,
    PrevIcon,
    RequestCheckIcon,
    RequestSlashIcon,
    SaveCompleteIcon,
    SavingIcon,
    ShareIcon,
} from '@/assets/svg';
import Button from '@/components/Button';
import Select from '@/components/Select';
import ShiftBadge from '@/components/ShiftBadge';
import useEditShift from '@/hooks/shift/useEditShift';
import {shiftToExcel} from '@/libs/util/shiftToExcel';
import {events, sendEvent} from 'analytics';
import SetConstraint from './editWard/SetConstraint';
import SetDesignTheme from './editWard/SetDesignTheme';
import SetShiftType from './editWard/SetShiftType';
// import useCreateShift from '@/hooks/shift/useCreateShift/indes';

function Toolbar() {
    const {
        state: {year, month, shift, changeStatus, showLayer, currentShiftTeam, shiftTeams, readonly},
        actions: {changeMonth, toggleLayer, changeShiftTeam, moveHistory, toggleEditMode, createNextMonthShift, postShift},
    } = useEditShift();
    // const { autoCompleteShift } = useCreateShift();
    const [openInfo, setOpenInfo] = useState(false);
    const [currentSetup, setCurrentSetup] = useState<'constraint' | 'shiftType' | 'designTheme' | null>(null);

    return (
        <div id="toolbar" className="sticky top-0 z-30 flex h-24.5 w-full items-center bg-[#FDFCFE] pt-7.5 pr-4 pb-[.75rem] pl-5">
            <div className="flex gap-5">
                <div className="w-13.5"></div>
                <div className="w-17.5"></div>
                <div className="w-7.5"></div>
                <div className="w-22.5"></div>
            </div>

            <div className="absolute flex items-center">
                <PrevIcon
                    onClick={() => {
                        changeMonth('prev');
                        sendEvent(events.makePage.toolbar.changeMonth);
                    }}
                    className="h-7.5 w-7.5 cursor-pointer"
                />
                <p className="mx-[.625rem] font-poppins text-2xl text-main-1">{month}월</p>
                <NextIcon
                    onClick={() => {
                        changeMonth('next');
                        sendEvent(events.makePage.toolbar.changeMonth);
                    }}
                    className="h-7.5 w-7.5 cursor-pointer"
                />
                <p className="ml-5 font-apple text-[.875rem] text-main-1">
                    기본 OFF {shift?.days.filter((x) => x.dayType !== 'workday').length}일
                </p>
            </div>

            {!readonly && (
                <Button
                    type="outline"
                    className="mr-5 flex h-10 w-31.75 items-center justify-center rounded-[3.125rem] border-[.0313rem] border-main-2 bg-main-4 text-base font-normal"
                    onClick={() => {
                        if (currentSetup) {
                            setCurrentSetup(null);
                        } else {
                            setCurrentSetup('constraint');
                        }

                        sendEvent(events.makePage.toolbar.openEditWardModal);
                    }}
                >
                    <PenIcon className="h-6 w-6 stroke-main-1" />
                    설정 편집
                </Button>
            )}

            {currentSetup !== null &&
                createPortal(
                    <Draggable>
                        <div className="absolute top-22 left-70.5 z-1001 flex flex-col rounded-[1.25rem] bg-white shadow-shadow-3">
                            <div className="flex h-11 cursor-move items-center rounded-t-[1.25rem] bg-sub-5">
                                <div
                                    className={`flex h-full w-37.5 cursor-pointer items-center justify-center rounded-t-[1.25rem] font-apple text-base ${currentSetup === 'constraint' ? 'bg-white text-main-1' : 'text-sub-3'} `}
                                    onClick={() => setCurrentSetup('constraint')}
                                >
                                    제약 조건
                                </div>
                                <div
                                    className={`flex h-full w-37.5 cursor-pointer items-center justify-center rounded-t-[1.25rem] font-apple text-base ${currentSetup === 'shiftType' ? 'bg-white text-main-1' : 'text-sub-3'} `}
                                    onClick={() => setCurrentSetup('shiftType')}
                                >
                                    근무 유형
                                </div>
                                <div
                                    className={`flex h-full w-37.5 cursor-pointer items-center justify-center rounded-t-[1.25rem] font-apple text-base ${currentSetup === 'designTheme' ? 'bg-white text-main-1' : 'text-sub-3'} `}
                                    onClick={() => setCurrentSetup('designTheme')}
                                >
                                    디자인 테마
                                </div>
                                <CancelIcon
                                    className="absolute right-[.5rem] h-6 w-6 cursor-pointer"
                                    onClick={() => setCurrentSetup(null)}
                                />
                            </div>
                            {currentSetup === 'constraint' && <SetConstraint />}
                            {currentSetup === 'shiftType' && <SetShiftType />}
                            {currentSetup === 'designTheme' && <SetDesignTheme />}
                        </div>
                    </Draggable>,

                    document.getElementById('edit-modal-root')!,
                )}

            <InfoIcon
                className="h-6.5 w-6.5 cursor-pointer"
                onClick={() => {
                    setOpenInfo(!openInfo);
                    sendEvent(events.makePage.toolbar.openShiftInfoModal);
                }}
            />
            {openInfo &&
                createPortal(
                    <Draggable>
                        <div className="absolute top-22 left-70.5 z-1001 flex w-116.5 flex-col rounded-[.625rem] bg-white shadow-shadow-3">
                            <div className="flex h-6.5 cursor-move items-center rounded-t-[.625rem] bg-sub-5 pl-10">
                                <p className="bottom-0 font-apple text-[.875rem] text-sub-2.5">근무 유형 보기</p>
                                <CancelIcon
                                    className="absolute right-[.5rem] h-4.5 w-4.5 cursor-pointer"
                                    onClick={() => setOpenInfo(false)}
                                />
                            </div>
                            <div className="flex flex-wrap items-center justify-start gap-5 py-[.875rem] pl-10">
                                {shift?.wardShiftTypes.map((shiftType, index) => (
                                    <div key={index} className="flex shrink-0 items-center gap-[.3125rem]">
                                        <ShiftBadge key={index} shiftType={shiftType} />
                                        <p className="font-apple text-[.875rem] text-sub-2">
                                            {shiftType.name}({shiftType.shortName})
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Draggable>,

                    document.getElementById('info-modal-root')!,
                )}

            {!readonly && (
                <>
                    <div className="ml-12.5 flex gap-[.25rem]">
                        <div
                            className={`flex h-9 cursor-pointer items-center gap-[.5rem] rounded-[.3125rem] border-[.0313rem] border-sub-4 px-[.625rem] ${
                                showLayer.fault ? 'white' : 'bg-sub-5'
                            }`}
                            onClick={() => {
                                toggleLayer('fault');
                                sendEvent(showLayer.fault ? events.makePage.toolbar.offLayer : events.makePage.toolbar.onLayer, 'fault');
                            }}
                        >
                            <div
                                className={`relative h-[.875rem] w-[.875rem] rounded-[.1875rem] border-[.0806rem] border-[#FF0000] bg-[#ff000033]`}
                            >
                                <FaultDotIcon className="absolute -top-2 -right-0.75 h-[.4rem] w-[.4rem]" />
                            </div>
                            <p className={`font-apple text-[.75rem] select-none ${showLayer.fault ? 'text-sub-2' : 'text-sub-3'}`}>
                                잘못된 근무
                            </p>
                        </div>
                        <div
                            className={`flex h-9 cursor-pointer items-center gap-[.5rem] rounded-[.3125rem] border-[.0313rem] border-sub-4 px-[.625rem] ${
                                showLayer.check ? 'white' : 'bg-sub-5'
                            }`}
                            onClick={() => {
                                toggleLayer('check');
                                sendEvent(showLayer.check ? events.makePage.toolbar.offLayer : events.makePage.toolbar.onLayer, 'check');
                            }}
                        >
                            <div
                                className={`relative h-[.875rem] w-[.875rem] rounded-[.1875rem] border-[.0806rem] border-[#06E738] bg-[#06e73833]`}
                            >
                                <RequestCheckIcon className="absolute -top-2 -right-0.75 h-[.4rem] w-[.4rem]" />
                            </div>
                            <p className={`font-apple text-[.75rem] select-none ${showLayer.check ? 'text-sub-2' : 'text-sub-3'}`}>
                                신청 근무 반영
                            </p>
                        </div>
                        <div
                            className={`flex h-9 cursor-pointer items-center gap-[.5rem] rounded-[.3125rem] border-[.0313rem] border-sub-4 px-[.625rem] ${
                                showLayer.slash ? 'white' : 'bg-sub-5'
                            }`}
                            onClick={() => {
                                toggleLayer('slash');
                                sendEvent(showLayer.slash ? events.makePage.toolbar.offLayer : events.makePage.toolbar.onLayer, 'slash');
                            }}
                        >
                            <div
                                className={`relative h-[.875rem] w-[.875rem] rounded-[.1875rem] border-[.0806rem] border-[#0027F4] bg-[#0027f433]`}
                            >
                                <RequestSlashIcon className="absolute -top-2 -right-0.75 h-[.4rem] w-[.4rem]" />
                            </div>
                            <p className={`font-apple text-[.75rem] select-none ${showLayer.slash ? 'text-sub-2' : 'text-sub-3'}`}>
                                신청 근무 미반영
                            </p>
                        </div>
                    </div>

                    <div className="ml-auto flex gap-[.3125rem] font-apple text-[.875rem] text-sub-2.5">
                        {changeStatus === 'pending' ? <SavingIcon className="h-5 w-5" /> : <SaveCompleteIcon className="h-5 w-5" />}
                        {changeStatus === 'pending' ? '저장중' : '저장 완료'}
                    </div>

                    <div className="ml-7.5 flex gap-[.625rem]">
                        <HistoryBackIcon
                            className="h-6.5 w-6.5 cursor-pointer"
                            onClick={() => {
                                moveHistory(-1);
                                sendEvent(events.makePage.toolbar.undoBytoolbar);
                            }}
                        />
                        <HistoryNextIcon
                            className="h-6.5 w-6.5 cursor-pointer"
                            onClick={() => {
                                moveHistory(1);
                                sendEvent(events.makePage.toolbar.redoByToolbar);
                            }}
                        />
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
                        onChange={(e) => changeShiftTeam(parseInt(e.target.value))}
                    />
                )}
            </div>

            {readonly ? (
                <div className="ml-auto flex gap-[10px]">
                    <Button
                        type="fill"
                        className="flex h-10 items-center justify-center rounded-[.625rem] bg-main-2 px-[.75rem] text-[1.25rem] font-semibold"
                        onClick={() => {
                            postShift();
                            sendEvent(events.makePage.toolbar.postShift);
                        }}
                        disabled={new Date(year, month + 1, 1) <= new Date()}
                    >
                        게시하기
                    </Button>
                    <Button
                        id="editButton"
                        type="fill"
                        className="flex h-10 items-center justify-center gap-[.5rem] rounded-[.625rem] bg-main-2 pr-[.5rem] pl-[.75rem] text-[1.25rem] font-semibold"
                        onClick={() => {
                            toggleEditMode();
                            sendEvent(events.makePage.toolbar.changeEditMode);
                        }}
                        disabled={new Date(year, month + 1, 1) <= new Date()}
                    >
                        수정하기
                        <PenIcon className="h-6 w-6 stroke-white" />
                    </Button>
                    {/* @TODO 이미지 저장 구현 */}
                    <Button
                        id="El2"
                        type="fill"
                        className="flex h-10 items-center justify-center gap-[.5rem] rounded-[.625rem] bg-main-2 pr-[.5rem] pl-[.75rem] text-[1.25rem] font-semibold"
                        onClick={() => {
                            if (shift) {
                                shiftToExcel(month, shift);
                            }

                            sendEvent(events.makePage.toolbar.downloadExcel);
                        }}
                    >
                        다운로드
                        <ShareIcon className="h-6 w-6" />
                    </Button>
                    <Button
                        type="outline"
                        className="flex h-10 w-59 items-center justify-center gap-[.5rem] rounded-[.625rem] text-[1.25rem] font-semibold"
                        onClick={() => {
                            createNextMonthShift();
                            sendEvent(events.makePage.toolbar.editNextMonth);
                        }}
                    >
                        다음달 근무표 만들기
                        <DutyIconSelected className="h-6 w-6" />
                    </Button>
                </div>
            ) : (
                <div className="ml-5 flex gap-[.875rem]">
                    <Button
                        type="fill"
                        className="h-10 w-33 rounded-[3.125rem] border-none bg-[rgba(171,171,180,0.80)] text-[1.25rem] font-semibold text-white"
                        onClick={() => alert('아직 준비중인 기능입니다!')}
                    >
                        자동 채우기
                    </Button>
                    <Button
                        className="h-10 rounded-[3.125rem] border-main-1 bg-white px-5 text-[1.25rem] font-semibold text-main-1 transition-all hover:bg-main-1 hover:text-white"
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
