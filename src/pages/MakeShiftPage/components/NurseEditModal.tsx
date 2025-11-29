import {produce} from 'immer';
import {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {CancelIcon, CheckedIcon, UncheckedIcon2} from '@/assets/svg';
import Button from '@/components/Button';
import TextField from '@/components/TextField';
import useEditShiftTeam from '@/hooks/ward/useEditShiftTeam';
import {type Nurse} from '@/types/nurse';
import {events, sendEvent} from 'analytics';

function NurseEditModal() {
    const {
        state: {selectedNurse},
        actions: {selectNurse, updateNurse},
    } = useEditShiftTeam();
    const [writeNurse, setWriteNurse] = useState<Nurse | null>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (key: keyof Nurse, value: any) => {
        if (!writeNurse) return;

        setWriteNurse({...writeNurse, [key]: value});
    };

    useEffect(() => {
        if (selectedNurse) {
            nameRef.current?.focus();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setWriteNurse(selectedNurse);
        }
    }, [selectedNurse]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') selectNurse(null);
        },
        [selectNurse],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return createPortal(
        <div
            className={`ignore-onclickoutside fixed top-[50%] z-999 scrollbar-hide h-[90vh] w-100 translate-y-[-50%] overflow-y-scroll rounded-[1.25rem] border-l-[.0625rem] border-sub-4.5 bg-white shadow-shadow-2 transition-all duration-500 ease-out ${
                selectedNurse ? 'right-12.5' : '-right-100'
            }`}
        >
            <div className="flex h-fit w-full flex-col">
                <div className="flex h-11 items-center bg-sub-5 px-10">
                    <p className="font-apple text-base text-sub-3">간호사별 관리</p>
                    <div className="ml-auto flex cursor-pointer items-center" onClick={() => selectNurse(null)}>
                        <p className="font-apple text-base text-sub-3">닫기</p>
                        <CancelIcon className="h-6 w-6" />
                    </div>
                </div>
                <div className="my-5 flex h-10.5 w-full items-center px-10">
                    <div className="h-10.5 w-10.5 rounded-full bg-gray-400" />
                    <TextField
                        ref={nameRef}
                        autoFocus
                        className="ml-5 h-10.5 w-40.5 px-3 text-[1.875rem] font-semibold text-text-1"
                        onChange={(e) => {
                            handleChange('name', e.target.value);
                            sendEvent(events.makePage.editNurseModal.changeNurseName);
                        }}
                        value={writeNurse?.name ?? ''}
                    />
                    <div
                        className="ml-auto flex h-5 w-7 cursor-pointer items-center justify-center rounded-[.3125rem] bg-sub-5 font-apple text-[.875rem] text-[#A2A6F5]"
                        onClick={() => {
                            handleChange('gender', writeNurse?.gender === '남' ? '여' : '남');
                            sendEvent(events.makePage.editNurseModal.changeNurseGender);
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
                            sendEvent(events.makePage.editNurseModal.changeNurseEmploymentDate);
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
                            sendEvent(events.makePage.editNurseModal.changeNursePhone);
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
                                    sendEvent(events.makePage.editNurseModal.changeNurseShiftTypes);
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
                                    sendEvent(events.makePage.editNurseModal.changeNurseIsWorker);
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
                                    sendEvent(events.makePage.editNurseModal.changeNurseIsWorker);
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
                                    sendEvent(events.makePage.editNurseModal.changeNurseIsManager);
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
                                    sendEvent(events.makePage.editNurseModal.changeNurseIsManager);
                                }}
                            />
                        </div>
                    )}
                </div>

                <p className="mt-7.5 ml-10 font-apple text-base font-medium text-sub-2.5">메모</p>
                <textarea
                    value={writeNurse?.memo ?? ''}
                    className="mx-10 mt-[.9375rem] h-43.25 resize-none rounded-[.3125rem] border-[.0313rem] border-sub-4.5 bg-main-bg p-2 font-apple text-sm text-sub-1"
                    onChange={(e) => {
                        handleChange('memo', e.target.value);
                        sendEvent(events.makePage.editNurseModal.changeNurseMemo);
                    }}
                />
                <Button
                    id="nurse_edit_drawer"
                    className="mt-6.25 mr-10 mb-6.5 ml-auto flex h-9 items-center justify-center rounded-[3.125rem] bg-main-1 px-5 py-[.5rem] font-apple text-base font-medium text-white"
                    disabled={
                        selectedNurse?.name === writeNurse?.name &&
                        selectedNurse?.employmentDate === writeNurse?.employmentDate &&
                        selectedNurse?.phoneNum === writeNurse?.phoneNum &&
                        selectedNurse?.isWorker === writeNurse?.isWorker &&
                        selectedNurse?.isDutyManager === writeNurse?.isDutyManager &&
                        selectedNurse?.memo === writeNurse?.memo &&
                        selectedNurse?.nurseShiftTypes.length === writeNurse?.nurseShiftTypes.length
                    }
                    onClick={() => writeNurse && updateNurse(writeNurse.nurseId, writeNurse)}
                >
                    저장
                </Button>
            </div>
        </div>,
        document.getElementById('nurse-modal-root')!,
    );
}

export default NurseEditModal;
