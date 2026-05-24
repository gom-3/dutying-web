import {produce} from 'immer';
import {useCallback, useEffect, useRef, useState} from 'react';
import {events, sendEvent} from '@/analytics';
import {type TNurse} from '@/entities/nurse';
import useEditShiftTeam from '@/features/edit-shift-team';
import {CheckedIcon, FoldIcon, UncheckedIcon2} from '@/shared/assets/svg';
import Button from '@/shared/ui/form-controls/Button';
import TextField from '@/shared/ui/form-controls/TextField';
import {getNurseDrawerFeedback, hasNurseChanges} from '../model/nurse-edit';

function NurseEditDrawer() {
    const {
        state: {shiftTeams, selectedNurse, selectedNurseDrawerMode, nurseSaveStatus, isDeletingNurse},
        actions: {selectNurse, updateNurse, deleteNurse, setNurseDraftDirty},
    } = useEditShiftTeam();
    const [writeNurse, setWriteNurse] = useState<TNurse | null>(null);
    const textInputRef = useRef<HTMLInputElement>(null);
    const isDirty = hasNurseChanges(selectedNurse, writeNurse);
    const isBusy = nurseSaveStatus === 'saving' || isDeletingNurse;
    const feedback = getNurseDrawerFeedback({
        mode: selectedNurseDrawerMode,
        saveStatus: nurseSaveStatus,
        isDirty,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (key: keyof TNurse, value: any) => {
        if (!writeNurse) return;

        setWriteNurse({...writeNurse, [key]: value});
    };
    const save = useCallback(() => {
        if (writeNurse && !isBusy && isDirty) {
            updateNurse(writeNurse.nurseId, writeNurse);
        }
    }, [isBusy, isDirty, writeNurse, updateNurse]);
    const closeDrawer = useCallback(() => {
        selectNurse(null);
    }, [selectNurse]);
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !isBusy && isDirty) {
                save();
            }
        },
        [isBusy, isDirty, save],
    );

    useEffect(() => {
        if (selectedNurse) setWriteNurse(selectedNurse);

        if (textInputRef) textInputRef.current?.focus();
    }, [selectedNurse]);

    useEffect(() => {
        setNurseDraftDirty(isDirty);
    }, [isDirty, setNurseDraftDirty]);

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
            <FoldIcon className="absolute top-[.8125rem] left-5 h-7.5 w-7.5 scale-x-[-1] cursor-pointer text-sub-3" onClick={closeDrawer} />
            <div className="mt-15 mb-5 flex h-10.5 w-full items-center px-10">
                <div className="h-10.5 w-10.5 rounded-full bg-gray-400" />
                <TextField
                    ref={textInputRef}
                    autoFocus
                    disabled={isBusy}
                    className="ml-5 h-10.5 w-40.5 px-3 text-[1.875rem] font-semibold text-text-1"
                    onChange={(e) => {
                        handleChange('name', e.target.value);
                        sendEvent(events.memberPage.editNurseDrawer.changeNurseName);
                    }}
                    value={writeNurse?.name ?? ''}
                />
                <div
                    className={`ml-auto flex h-5 w-7 items-center justify-center rounded-[.3125rem] bg-sub-5 font-apple text-[.875rem] text-[#A2A6F5] ${
                        isBusy ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                    }`}
                    onClick={() => {
                        if (isBusy) return;

                        handleChange('gender', writeNurse?.gender === '남' ? '여' : '남');
                        sendEvent(events.memberPage.editNurseDrawer.changeNurseGender);
                    }}
                >
                    {writeNurse?.gender}
                </div>
            </div>
            <div className="h-[.3125rem] w-full bg-sub-5" />
            <div className={`mx-10 mt-5 rounded-[.625rem] border px-4 py-3 ${feedback.toneClassName}`} aria-live="polite">
                <p className="font-apple text-[.9375rem] font-semibold">{feedback.title}</p>
                <p className="mt-1 font-apple text-[.8125rem]">{feedback.description}</p>
            </div>
            <div className="flex h-29 w-full flex-col items-stretch justify-between border-b-[.0313rem] border-sub-4 px-10 pt-[.625rem] pb-7.5">
                <div className="flex items-center justify-between">
                    <p className="shrink-0 font-apple text-base font-medium text-sub-2">입사 년도</p>
                    <p className="ml-8 truncate font-apple text-[.625rem] font-light text-sub-3">
                        * 해당 병원에 입사한 년도를 작성해 주세요.
                    </p>
                </div>
                <TextField
                    type="date"
                    disabled={isBusy}
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
                    disabled={isBusy}
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
                    <p className="ml-8 truncate font-apple text-[.625rem] font-light text-sub-3">* 가능 근무를 모두 선택해 주세요.</p>
                </div>
                <div className="flex gap-5.5">
                    {writeNurse?.nurseShiftTypes.slice(0, 3).map(({nurseShiftTypeId, isPossible, name}) => (
                        <div
                            key={nurseShiftTypeId}
                            className={`flex h-10 flex-1 items-center justify-center rounded-[.3125rem] border-[.0625rem] font-apple text-[1.25rem] ${isBusy ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isPossible ? 'border-main-1 text-main-1' : 'border-sub-4 text-sub-3'} `}
                            onClick={() => {
                                if (isBusy) return;

                                handleChange(
                                    'nurseShiftTypes',
                                    produce(writeNurse.nurseShiftTypes, (draft: TNurse['nurseShiftTypes']) => {
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
                            className={`h-5 w-5 ${isBusy ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                            fill="#B08BFF"
                            onClick={() => {
                                if (isBusy) return;

                                handleChange('isWorker', false);
                                sendEvent(events.memberPage.editNurseDrawer.changeNurseIsWorker);
                            }}
                        />
                    </div>
                ) : (
                    <div className="ml-auto flex items-center gap-[.625rem]">
                        <p className="font-apple text-[.75rem] text-sub-3">해당 안 됨</p>
                        <UncheckedIcon2
                            className={`h-5 w-5 ${isBusy ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                            onClick={() => {
                                if (isBusy) return;

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
                        <p className="font-apple text-[.75rem] text-sub-3">해당됨</p>
                        <CheckedIcon
                            className={`h-5 w-5 ${isBusy ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                            fill="#B08BFF"
                            onClick={() => {
                                if (isBusy) return;

                                handleChange('isDutyManager', false);
                                sendEvent(events.memberPage.editNurseDrawer.changeNurseIsManager);
                            }}
                        />
                    </div>
                ) : (
                    <div className="ml-auto flex items-center gap-[.625rem]">
                        <p className="font-apple text-[.75rem] text-sub-3">해당 안 됨</p>
                        <UncheckedIcon2
                            className={`h-5 w-5 ${isBusy ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                            onClick={() => {
                                if (isBusy) return;

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
                disabled={isBusy}
                className="mx-10 mt-[.9375rem] h-43.25 resize-none rounded-[.3125rem] border-[.0313rem] border-sub-4.5 bg-main-bg p-2 font-apple text-sm text-sub-1"
                onChange={(e) => {
                    handleChange('memo', e.target.value);
                    sendEvent(events.memberPage.editNurseDrawer.changeNurseMemo);
                }}
            />

            <div className="mt-6.25 mr-10 ml-auto flex h-9 gap-4">
                <button
                    className="flex h-9 items-center justify-center rounded-[3.125rem] bg-sub-3 px-5 py-[.5rem] font-apple text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isBusy}
                    onClick={() => {
                        if (!selectedNurse || !shiftTeams) return;
                        const shouldDelete = window.confirm(`${selectedNurse.name} 간호사를 삭제할까요? 삭제 후에는 되돌릴 수 없어요.`);

                        if (!shouldDelete) return;

                        deleteNurse(
                            shiftTeams.find((x) => x.nurses.some((y) => y.nurseId === selectedNurse.nurseId))!.shiftTeamId,
                            selectedNurse.nurseId,
                        );
                    }}
                >
                    {isDeletingNurse ? '삭제 중...' : '간호사 삭제'}
                </button>
                <Button
                    type="button"
                    variant="outline"
                    size="md"
                    className="flex h-9 items-center justify-center rounded-[3.125rem] px-5 py-[.5rem] font-apple text-base font-medium"
                    disabled={nurseSaveStatus === 'saving'}
                    onClick={closeDrawer}
                >
                    닫기
                </Button>
                <Button
                    id="nurse_edit_drawer"
                    type="button"
                    className="flex h-9 items-center justify-center rounded-[3.125rem] bg-main-1 px-5 py-[.5rem] font-apple text-base font-medium text-white"
                    disabled={!isDirty || nurseSaveStatus === 'saving'}
                    onClick={() => save()}
                >
                    {nurseSaveStatus === 'saving' ? '저장 중...' : '저장'}
                </Button>
            </div>
        </div>
    );
}

export default NurseEditDrawer;
