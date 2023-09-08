/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CheckedIcon, FoldIcon, UncheckedIcon2 } from '@assets/svg';
import TextField from '@components/TextField';
import useEditShiftTeam from '@hooks/useEditShiftTeam';
import { event, sendEvent } from 'analytics';
import { produce } from 'immer';
import { useEffect, useRef, useState } from 'react';

function NurseEditDrawer() {
  const {
    state: { shiftTeams, selectedNurse },
    actions: { selectNurse, updateNurse, deleteNurse },
  } = useEditShiftTeam();
  const [writeNurse, setWriteNurse] = useState<Nurse | null>(null);

  const textInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (key: keyof Nurse, value: any) => {
    if (!writeNurse) return;
    setWriteNurse({ ...writeNurse, [key]: value });
  };

  const save = () => {
    writeNurse && updateNurse(writeNurse.nurseId, writeNurse);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      save();
    }
  };

  useEffect(() => {
    if (selectedNurse) setWriteNurse(selectedNurse);
    if (textInputRef) textInputRef.current?.focus();
  }, [selectedNurse]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [writeNurse]);

  return (
    <div
      className={`ignore-onclickoutside fixed right-0 top-0 flex h-screen w-[25rem] flex-col justify-center border-l-[.0625rem] border-sub-4.5 bg-white transition-all duration-500 ease-out ${
        selectedNurse ? 'translate-x-0' : 'translate-x-[100%]'
      }`}
    >
      <FoldIcon
        className="absolute left-[1.25rem] top-[.8125rem] h-[1.875rem] w-[1.875rem] scale-x-[-1] cursor-pointer"
        onClick={() => selectNurse(null)}
      />
      <p className="ml-[1.5625rem] font-apple text-base font-medium text-sub-3">간호사별 관리</p>
      <div className="mb-[1.25rem] mt-[3.75rem] flex h-[2.625rem] w-full items-center px-[2.5rem]">
        <div className="h-[2.625rem] w-[2.625rem] rounded-full bg-gray-400 " />
        <TextField
          forwardRef={textInputRef}
          autoFocus
          className="ml-[1.25rem] h-[2.625rem] w-[10.125rem] px-3 text-[1.875rem] font-semibold text-text-1"
          onChange={(e) => {
            handleChange('name', e.target.value);
            sendEvent(event.change_nurse_name);
          }}
          value={writeNurse?.name || ''}
        />
        <div
          className="ml-auto flex h-[1.25rem] w-[1.75rem] cursor-pointer items-center justify-center rounded-[.3125rem] bg-sub-5 font-apple text-[.875rem] text-[#A2A6F5]"
          onClick={() => {
            handleChange('gender', writeNurse?.gender === '남' ? '여' : '남');
            sendEvent(event.change_nurse_gender);
          }}
        >
          {writeNurse?.gender}
        </div>
      </div>
      <div className="h-[.3125rem] w-full bg-sub-5" />
      <div className="flex h-[7.25rem] w-full flex-col items-stretch justify-between border-b-[.0313rem] border-sub-4 px-[2.5rem] pb-[1.875rem] pt-[.625rem]">
        <div className="flex items-center justify-between">
          <p className="shrink-0 font-apple text-base font-medium text-sub-2">입사 년도</p>
          <p className="ml-8 truncate font-apple text-[.625rem] font-light text-sub-3">
            * 해당 병원에 입사한 년도를 작성해주세요.
          </p>
        </div>
        <TextField
          type="date"
          className="h-[2.5rem] font-poppins text-[1.25rem] text-sub-3"
          onChange={(e) => {
            handleChange('employmentDate', e.target.value);
            sendEvent(event.change_nurse_employment_date);
          }}
          value={writeNurse?.employmentDate || ''}
        />
      </div>
      <div className="flex h-[7.25rem] w-full flex-col items-stretch justify-between border-b-[.0313rem] border-sub-4 px-[2.5rem] pb-[1.875rem] pt-[.625rem]">
        <div className="flex items-center justify-between">
          <p className="shrink-0 font-apple text-base font-medium text-sub-2">전화 번호</p>
          <p className="ml-8 truncate font-apple text-[.625rem] font-light text-sub-3">
            * 비상 연락 망
          </p>
        </div>
        <TextField
          type="tel"
          className="h-[2.5rem] font-poppins text-[1.25rem] text-sub-3"
          onChange={(e) => {
            handleChange('phoneNum', e.target.value);
            sendEvent(event.change_nurse_phone);
          }}
          value={writeNurse?.phoneNum || ''}
        />
      </div>
      <div className="flex h-[7.25rem] w-full flex-col items-stretch justify-between border-b-[.0313rem] border-sub-4 px-[2.5rem] pb-[1.875rem] pt-[.625rem]">
        <div className="flex items-center justify-between">
          <p className="shrink-0 font-apple text-base font-medium text-sub-2">가능 근무</p>
          <p className="ml-8 truncate font-apple text-[.625rem] font-light text-sub-3">
            * 가능 근무를 모두 선택해주세요.
          </p>
        </div>
        <div className="flex gap-[1.375rem]">
          {writeNurse?.nurseShiftTypes.slice(0, 3).map(({ nurseShiftTypeId, isPossible, name }) => (
            <div
              key={nurseShiftTypeId}
              className={`flex h-[2.5rem] flex-1 cursor-pointer items-center justify-center rounded-[.3125rem] border-[.0625rem] font-apple text-[1.25rem]
                ${isPossible ? 'border-main-1 text-main-1' : 'border-sub-4 text-sub-3'}
              `}
              onClick={() => {
                handleChange(
                  'nurseShiftTypes',
                  produce(writeNurse.nurseShiftTypes, (draft: Nurse['nurseShiftTypes']) => {
                    draft.find((x) => x.nurseShiftTypeId === nurseShiftTypeId)!.isPossible =
                      !isPossible;
                  })
                );
                sendEvent(event.change_nurse_shift_types);
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-[2.5rem] w-full items-center border-b-[.0313rem] border-sub-4 bg-main-bg px-[2.5rem] py-[.625rem]">
        <p className="font-apple text-base font-medium text-sub-2">근무자</p>
        {writeNurse?.isWorker ? (
          <div className="ml-auto flex items-center gap-[.625rem]">
            <p className="font-apple text-[.75rem] text-sub-3">해당 됨</p>
            <CheckedIcon
              className="h-[1.25rem] w-[1.25rem] cursor-pointer"
              fill="#B08BFF"
              onClick={() => {
                handleChange('isWorker', false);
                sendEvent(event.change_nurse_is_worker);
              }}
            />
          </div>
        ) : (
          <div className="ml-auto flex items-center gap-[.625rem]">
            <p className="font-apple text-[.75rem] text-sub-3">해당 안됨</p>
            <UncheckedIcon2
              className="h-[1.25rem] w-[1.25rem] cursor-pointer"
              onClick={() => {
                handleChange('isWorker', true);
                sendEvent(event.change_nurse_is_worker);
              }}
            />
          </div>
        )}
      </div>
      <div className="mt-[.3125rem] flex h-[2.5rem] w-full items-center border-y-[.0313rem] border-sub-4 bg-main-bg px-[2.5rem] py-[.625rem]">
        <p className="font-apple text-base font-medium text-sub-2">근무표 작성 가능자</p>
        {writeNurse?.isDutyManager ? (
          <div className="ml-auto flex items-center gap-[.625rem]">
            <p className="font-apple text-[.75rem] text-sub-3">해당 됨</p>
            <CheckedIcon
              className="h-[1.25rem] w-[1.25rem] cursor-pointer"
              fill="#B08BFF"
              onClick={() => {
                handleChange('isDutyManager', false);
                sendEvent(event.change_nurse_is_manager);
              }}
            />
          </div>
        ) : (
          <div className="ml-auto flex items-center gap-[.625rem]">
            <p className="font-apple text-[.75rem] text-sub-3">해당 안됨</p>
            <UncheckedIcon2
              className="h-[1.25rem] w-[1.25rem] cursor-pointer"
              onClick={() => {
                handleChange('isDutyManager', true);
                sendEvent(event.change_nurse_is_manager);
              }}
            />
          </div>
        )}
      </div>

      <p className="ml-[2.5rem] mt-[1.875rem] font-apple text-base font-medium text-sub-2.5">
        메모
      </p>
      <textarea
        value={writeNurse?.memo}
        className="mx-[2.5rem] mt-[.9375rem] h-[10.8125rem] resize-none rounded-[.3125rem] border-[.0313rem] border-sub-4.5 bg-main-bg p-2 font-apple text-sm text-sub-1"
        onChange={(e) => {
          handleChange('memo', e.target.value);
          sendEvent(event.change_nurse_memo);
        }}
      />

      <div className="ml-auto mr-[2.5rem] mt-[1.5625rem] flex h-[2.25rem] gap-4">
        <button
          className="flex h-[2.25rem] items-center justify-center rounded-[3.125rem] bg-sub-3 px-[1.25rem] py-[.5rem] font-apple text-base font-medium text-white"
          onClick={() =>
            selectedNurse &&
            shiftTeams &&
            deleteNurse(
              shiftTeams.find((x) => x.nurses.some((y) => y.nurseId === selectedNurse.nurseId))!
                .shiftTeamId,
              selectedNurse.nurseId
            )
          }
        >
          간호사 삭제
        </button>
        <button
          className="flex h-[2.25rem] items-center justify-center rounded-[3.125rem] bg-main-3 px-[1.25rem] py-[.5rem] font-apple text-base font-medium text-white"
          onClick={() => save()}
        >
          저장
        </button>
      </div>
    </div>
  );
}

export default NurseEditDrawer;
