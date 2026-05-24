import {produce} from 'immer';
import {type ReactNode, type RefObject} from 'react';
import {events, sendEvent} from '@/analytics';
import {type TNurse} from '@/entities/nurse';
import {CancelIcon, CheckedIcon, UncheckedIcon2} from '@/shared/assets/svg';
import Button from '@/shared/ui/form-controls/Button';
import TextField from '@/shared/ui/form-controls/TextField';
import {isNurseEditSaveDisabled} from './is-nurse-edit-save-disabled';

type TNurseEditFormProps = {
    selectedNurse: TNurse | null;
    writeNurse: TNurse | null;
    nameRef: RefObject<HTMLInputElement | null>;
    onClose: () => void;
    onChange: <K extends keyof TNurse>(key: K, value: TNurse[K]) => void;
    onSubmit: () => void;
};

type TNurseEditFieldSectionProps = {
    title: string;
    description: string;
    children: ReactNode;
};

function NurseEditFieldSection({title, description, children}: TNurseEditFieldSectionProps) {
    return (
        <div className="flex h-29 w-full flex-col items-stretch justify-between border-b-[.0313rem] border-sub-4 px-10 pt-[.625rem] pb-7.5">
            <div className="flex items-center justify-between">
                <p className="shrink-0 font-apple text-base font-medium text-sub-2">{title}</p>
                <p className="ml-8 truncate font-apple text-[.625rem] font-light text-sub-3">{description}</p>
            </div>
            {children}
        </div>
    );
}

type TNurseEditToggleRowProps = {
    title: string;
    checked: boolean | undefined;
    onToggle: () => void;
    borderClassName: string;
};

function NurseEditToggleRow({title, checked, onToggle, borderClassName}: TNurseEditToggleRowProps) {
    return (
        <div className={`flex h-10 w-full items-center ${borderClassName} bg-main-bg px-10 py-[.625rem]`}>
            <p className="font-apple text-base font-medium text-sub-2">{title}</p>
            {checked ? (
                <div className="ml-auto flex items-center gap-[.625rem]">
                    <p className="font-apple text-[.75rem] text-sub-3">해당 됨</p>
                    <CheckedIcon className="h-5 w-5 cursor-pointer" fill="#B08BFF" onClick={onToggle} />
                </div>
            ) : (
                <div className="ml-auto flex items-center gap-[.625rem]">
                    <p className="font-apple text-[.75rem] text-sub-3">해당 안 됨</p>
                    <UncheckedIcon2 className="h-5 w-5 cursor-pointer" onClick={onToggle} />
                </div>
            )}
        </div>
    );
}

export function NurseEditForm({selectedNurse, writeNurse, nameRef, onClose, onChange, onSubmit}: TNurseEditFormProps) {
    return (
        <div className="flex h-fit w-full flex-col">
            <div className="flex h-11 items-center bg-sub-5 px-10">
                <p className="font-apple text-base text-sub-3">간호사별 관리</p>
                <div className="ml-auto flex cursor-pointer items-center" onClick={onClose}>
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
                        onChange('name', e.target.value);
                        sendEvent(events.makePage.editNurseModal.changeNurseName);
                    }}
                    value={writeNurse?.name ?? ''}
                />
                <div
                    className="ml-auto flex h-5 w-7 cursor-pointer items-center justify-center rounded-[.3125rem] bg-sub-5 font-apple text-[.875rem] text-[#A2A6F5]"
                    onClick={() => {
                        onChange('gender', writeNurse?.gender === '남' ? '여' : '남');
                        sendEvent(events.makePage.editNurseModal.changeNurseGender);
                    }}
                >
                    {writeNurse?.gender}
                </div>
            </div>
            <div className="h-[.3125rem] w-full bg-sub-5" />
            <NurseEditFieldSection title="입사 년도" description="* 해당 병원에 입사한 년도를 작성해 주세요.">
                <TextField
                    type="date"
                    className="h-10 font-poppins text-[1.25rem] text-sub-3"
                    placeholder="YYYY-MM-DD"
                    onChange={(e) => {
                        onChange('employmentDate', e.target.value);
                        sendEvent(events.makePage.editNurseModal.changeNurseEmploymentDate);
                    }}
                    value={writeNurse?.employmentDate ?? ''}
                />
            </NurseEditFieldSection>
            <NurseEditFieldSection title="전화 번호" description="* 비상 연락 망">
                <TextField
                    type="tel"
                    className="h-10 font-poppins text-[1.25rem] text-sub-3"
                    onChange={(e) => {
                        onChange('phoneNum', e.target.value);
                        sendEvent(events.makePage.editNurseModal.changeNursePhone);
                    }}
                    value={writeNurse?.phoneNum ?? ''}
                />
            </NurseEditFieldSection>
            <NurseEditFieldSection title="가능 근무" description="* 가능 근무를 모두 선택해 주세요.">
                <div className="flex gap-5.5">
                    {writeNurse?.nurseShiftTypes.slice(0, 3).map(({nurseShiftTypeId, isPossible, name}) => (
                        <div
                            key={nurseShiftTypeId}
                            className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-[.3125rem] border-[.0625rem] font-apple text-[1.25rem] ${isPossible ? 'border-main-1 text-main-1' : 'border-sub-4 text-sub-3'} `}
                            onClick={() => {
                                onChange(
                                    'nurseShiftTypes',
                                    produce(writeNurse.nurseShiftTypes, (draft: TNurse['nurseShiftTypes']) => {
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
            </NurseEditFieldSection>
            <NurseEditToggleRow
                title="근무자"
                checked={writeNurse?.isWorker}
                borderClassName="border-b-[.0313rem] border-sub-4"
                onToggle={() => {
                    onChange('isWorker', !writeNurse?.isWorker);
                    sendEvent(events.makePage.editNurseModal.changeNurseIsWorker);
                }}
            />
            <NurseEditToggleRow
                title="근무표 작성 가능자"
                checked={writeNurse?.isDutyManager}
                borderClassName="mt-[.3125rem] border-y-[.0313rem] border-sub-4"
                onToggle={() => {
                    onChange('isDutyManager', !writeNurse?.isDutyManager);
                    sendEvent(events.makePage.editNurseModal.changeNurseIsManager);
                }}
            />

            <p className="mt-7.5 ml-10 font-apple text-base font-medium text-sub-2.5">메모</p>
            <textarea
                value={writeNurse?.memo ?? ''}
                className="mx-10 mt-[.9375rem] h-43.25 resize-none rounded-[.3125rem] border-[.0313rem] border-sub-4.5 bg-main-bg p-2 font-apple text-sm text-sub-1"
                onChange={(e) => {
                    onChange('memo', e.target.value);
                    sendEvent(events.makePage.editNurseModal.changeNurseMemo);
                }}
            />
            <Button
                id="nurse_edit_drawer"
                className="mt-6.25 mr-10 mb-6.5 ml-auto flex h-9 items-center justify-center rounded-[3.125rem] bg-main-1 px-5 py-[.5rem] font-apple text-base font-medium text-white"
                disabled={isNurseEditSaveDisabled(selectedNurse, writeNurse)}
                onClick={onSubmit}
            >
                저장
            </Button>
        </div>
    );
}
