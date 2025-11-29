import {produce} from 'immer';
import {useCallback, useEffect, useRef, useState} from 'react';
import {CheckedIcon, FoldIcon, UncheckedIcon2} from '@/assets/svg';
import Button from '@/components/Button';
import TextField from '@/components/TextField';
import useEditShiftTeam from '@/hooks/ward/useEditShiftTeam';
import {type Nurse} from '@/types/nurse';
import {events, sendEvent} from 'analytics';

function NurseEditDrawer() {
    const {
        state: {shiftTeams, selectedNurse},
        actions: {selectNurse, updateNurse, deleteNurse},
    } = useEditShiftTeam();
    const [writeNurse, setWriteNurse] = useState<Nurse | null>(null);
    const textInputRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (key: keyof Nurse, value: any) => {
        if (!writeNurse) return;

        setWriteNurse({...writeNurse, [key]: value});
    };
    const save = useCallback(() => {
        if (writeNurse) {
            updateNurse(writeNurse.nurseId, writeNurse);
        }
    }, [writeNurse, updateNurse]);
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                save();
            }
        },
        [save],
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (selectedNurse) setWriteNurse(selectedNurse);

        if (textInputRef) textInputRef.current?.focus();
    }, [selectedNurse]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown, writeNurse]);

    return (
        <div
            className={`ignore-onclickoutside fixed top-0 right-0 flex h-screen w-100 flex-col justify-center border-l-[.0625rem] border-sub-4.5 bg-white transition-all duration-500 ease-out ${
                selectedNurse ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <FoldIcon
                className="absolute top-[.8125rem] left-5 h-7.5 w-7.5 scale-x-[-1] cursor-pointer"
                onClick={() => selectNurse(null)}
            />
            <div className="mt-15 mb-5 flex h-10.5 w-full items-center px-10">
                <div className="h-10.5 w-10.5 rounded-full bg-gray-400" />
                <TextField
                    ref={textInputRef}
                    autoFocus
                    className="ml-5 h-10.5 w-40.5 px-3 text-[1.875rem] font-semibold text-text-1"
                    onChange={(e) => {
                        handleChange('name', e.target.value);
                        sendEvent(events.memberPage.editNurseDrawer.changeNurseName);
                    }}
                    value={writeNurse?.name ?? ''}
                />
                <div
                    className="ml-auto flex h-5 w-7 cursor-pointer items-center justify-center rounded-[.3125rem] bg-sub-5 font-apple text-[.875rem] text-[#A2A6F5]"
                    onClick={() => {
                        handleChange('gender', writeNurse?.gender === '남' ? '여' : '남');
                        sendEvent(events.memberPage.editNurseDrawer.changeNurseGender);
                    }}
                >
                    {writeNurse?.gender}
                </div>
            </div>
            <div className="h-[.3125rem] w-full bg-sub-5" />
            <div className="flex h-29 w-full flex-col items-stretch justify-between border-b-[.0313rem] border-sub-4 px-10 pt-[.625rem] pb-7.5">
                <div className="flex items-center justify-between">
                    <p className="shrink-0 font-apple text-base font-medium text-sub-2">입사 년도</p>
                    <p className="ml-8 truncate font-apple text-[.625rem] font-light text-sub-3">
                        * 해당 병원에 입사한 년도를 작성해주세요.
                    </p>
                </div>
                <TextField
                    type="date"
                    className="h-10 font-poppins text-[1.25rem] text-sub-3"
                    placeholder="YYYY-MM-DD"
                    onChange={(e) => {
                        handleChange('employmentDate', e.target.value);
                        sendEvent(events.memberPage.editNurseDrawer.changeNurseEmploymentDate);
                    }}
                    value={writeNurse?.employmentDate ?? ''}
                />
            </div>
            <div className="flex h-29 w-full flex-col items-stretch justify-between border-b-[.0313rem] border-sub-4 px-10 pt-[.625rem] pb-7.5">
                <div className="flex items-center justify-between">
                    <p className="shrink-0 font-apple text-base font-medium text-sub-2">전화 번호</p>
                    <p className="ml-8 truncate font-apple text-[.625rem] font-light text-sub-3">* 비상 연락 망</p>
                </div>
                <TextField
                    type="tel"
                    className="h-10 font-poppins text-[1.25rem] text-sub-3"
                    onChange={(e) => {
                        handleChange('phoneNum', e.target.value);
                        sendEvent(events.memberPage.editNurseDrawer.changeNursePhone);
                    }}
                    value={writeNurse?.phoneNum ?? ''}
                />
            </div>
            <div className="flex h-29 w-full flex-col items-stretch justify-between border-b-[.0313rem] border-sub-4 px-10 pt-[.625rem] pb-7.5">
                <div className="flex items-center justify-between">
                    <p className="shrink-0 font-apple text-base font-medium text-sub-2">가능 근무</p>
                    <p className="ml-8 truncate font-apple text-[.625rem] font-light text-sub-3">* 가능 근무를 모두 선택해주세요.</p>
                </div>
                <div className="flex gap-5.5">
                    {writeNurse?.nurseShiftTypes.slice(0, 3).map(({nurseShiftTypeId, isPossible, name}) => (
                        <div
                            key={nurseShiftTypeId}
                            className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-[.3125rem] border-[.0625rem] font-apple text-[1.25rem] ${isPossible ? 'border-main-1 text-main-1' : 'border-sub-4 text-sub-3'} `}
                            onClick={() => {
                                handleChange(
                                    'nurseShiftTypes',
                                    produce(writeNurse.nurseShiftTypes, (draft: Nurse['nurseShiftTypes']) => {
                                        draft.find((x) => x.nurseShiftTypeId === nurseShiftTypeId)!.isPossible = !isPossible;
                                    }),
                                );
                                sendEvent(events.memberPage.editNurseDrawer.changeNurseShiftTypes);
                            }}
                        >
                            {name}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex h-10 w-full items-center border-b-[.0313rem] border-sub-4 bg-main-bg px-10 py-[.625rem]">
                <p className="font-apple text-base font-medium text-sub-2">근무자</p>
                {writeNurse?.isWorker ? (
                    <div className="ml-auto flex items-center gap-[.625rem]">
                        <p className="font-apple text-[.75rem] text-sub-3">해당 됨</p>
                        <CheckedIcon
                            className="h-5 w-5 cursor-pointer"
                            fill="#B08BFF"
                            onClick={() => {
                                handleChange('isWorker', false);
                                sendEvent(events.memberPage.editNurseDrawer.changeNurseIsWorker);
                            }}
                        />
                    </div>
                ) : (
                    <div className="ml-auto flex items-center gap-[.625rem]">
                        <p className="font-apple text-[.75rem] text-sub-3">해당 안됨</p>
                        <UncheckedIcon2
                            className="h-5 w-5 cursor-pointer"
                            onClick={() => {
                                handleChange('isWorker', true);
                                sendEvent(events.memberPage.editNurseDrawer.changeNurseIsWorker);
                            }}
                        />
                    </div>
                )}
            </div>
            <div className="mt-[.3125rem] flex h-10 w-full items-center border-y-[.0313rem] border-sub-4 bg-main-bg px-10 py-[.625rem]">
                <p className="font-apple text-base font-medium text-sub-2">근무표 작성 가능자</p>
                {writeNurse?.isDutyManager ? (
                    <div className="ml-auto flex items-center gap-[.625rem]">
                        <p className="font-apple text-[.75rem] text-sub-3">해당 됨</p>
                        <CheckedIcon
                            className="h-5 w-5 cursor-pointer"
                            fill="#B08BFF"
                            onClick={() => {
                                handleChange('isDutyManager', false);
                                sendEvent(events.memberPage.editNurseDrawer.changeNurseIsManager);
                            }}
                        />
                    </div>
                ) : (
                    <div className="ml-auto flex items-center gap-[.625rem]">
                        <p className="font-apple text-[.75rem] text-sub-3">해당 안됨</p>
                        <UncheckedIcon2
                            className="h-5 w-5 cursor-pointer"
                            onClick={() => {
                                handleChange('isDutyManager', true);
                                sendEvent(events.memberPage.editNurseDrawer.changeNurseIsManager);
                            }}
                        />
                    </div>
                )}
            </div>

            <p className="mt-7.5 ml-10 font-apple text-base font-medium text-sub-2.5">메모</p>
            <textarea
                value={writeNurse?.memo}
                className="mx-10 mt-[.9375rem] h-43.25 resize-none rounded-[.3125rem] border-[.0313rem] border-sub-4.5 bg-main-bg p-2 font-apple text-sm text-sub-1"
                onChange={(e) => {
                    handleChange('memo', e.target.value);
                    sendEvent(events.memberPage.editNurseDrawer.changeNurseMemo);
                }}
            />

            <div className="mt-6.25 mr-10 ml-auto flex h-9 gap-4">
                <button
                    className="flex h-9 items-center justify-center rounded-[3.125rem] bg-sub-3 px-5 py-[.5rem] font-apple text-base font-medium text-white"
                    onClick={() =>
                        selectedNurse &&
                        shiftTeams &&
                        deleteNurse(
                            shiftTeams.find((x) => x.nurses.some((y) => y.nurseId === selectedNurse.nurseId))!.shiftTeamId,
                            selectedNurse.nurseId,
                        )
                    }
                >
                    간호사 삭제
                </button>
                <Button
                    id="nurse_edit_drawer"
                    className="flex h-9 items-center justify-center rounded-[3.125rem] bg-main-1 px-5 py-[.5rem] font-apple text-base font-medium text-white"
                    disabled={
                        selectedNurse?.name === writeNurse?.name &&
                        selectedNurse?.employmentDate === writeNurse?.employmentDate &&
                        selectedNurse?.phoneNum === writeNurse?.phoneNum &&
                        selectedNurse?.isWorker === writeNurse?.isWorker &&
                        selectedNurse?.isDutyManager === writeNurse?.isDutyManager &&
                        selectedNurse?.memo === writeNurse?.memo &&
                        selectedNurse?.nurseShiftTypes.length === writeNurse?.nurseShiftTypes.length
                    }
                    onClick={() => save()}
                >
                    저장
                </Button>
            </div>
        </div>
    );
}

export default NurseEditDrawer;
