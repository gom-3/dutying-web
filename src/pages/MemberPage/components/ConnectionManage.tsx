import { groupBy } from 'lodash-es';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { match } from 'ts-pattern';
import {
  CancelIcon,
  CheckedIcon,
  MoreIcon,
  PersonIcon,
  SuccessCircleIcon,
  UncheckedIcon2,
  UnlinkedIcon,
} from '@/assets/svg';
import useEditShiftTeam from '@/hooks/ward/useEditShiftTeam';
import useEditWard from '@/hooks/ward/useEditWard';
import { type WaitingNurse } from '@/types/nurse';

interface ConnectionManageProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function ConnectionManage({ open, setOpen }: ConnectionManageProps) {
  const {
    state: { watingNurses },
    actions: { cancelWaiting, approveWatingNurses, connectWatingNurses },
  } = useEditWard();
  const {
    state: { shiftTeams },
  } = useEditShiftTeam();
  const [step, setStep] = useState(0);
  const [currentWaitingNurse, setCurrentWaitingNurse] = useState<WaitingNurse | null>(null);
  const [connectMode, setConnectMode] = useState<'link' | 'add'>('link');
  const [toLinkNurseId, setToLinkNurseId] = useState<number | null>(null);
  const [toAddShiftTeamId, setToAddShiftTeamId] = useState<number | null>(null);
  const initialize = () => {
    setStep(0);
    setCurrentWaitingNurse(null);
    setConnectMode('link');
    setToLinkNurseId(null);
    setToAddShiftTeamId(null);
  };

  useEffect(() => {
    if (open === false) {
      initialize();
    }
  }, [open]);

  return open
    ? createPortal(
        <div
          className="fixed top-0 left-0 z-1001 flex h-screen w-screen items-center justify-center bg-[#00000099] backdrop-blur-[.125rem]"
          onClick={() => setOpen(false)}
        >
          {match(step)
            .with(0, () => (
              <div
                className="h-[44%] min-h-117.5 w-[40%] min-w-190 rounded-[1.25rem] bg-white px-10.5 py-8.75"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h1 className="font-apple text-text-1 text-[1.75rem] font-semibold">
                      연동 관리
                    </h1>
                  </div>
                  <CancelIcon className="h-7.5 w-7.5" onClick={() => setOpen(false)} />
                </div>
                <div className="h-full overflow-hidden pt-10.5">
                  <p className="font-apple text-sub-3 text-[1rem] font-medium">신청 내역</p>
                  {watingNurses?.length === 0 ? (
                    <div className="font-apple text-sub-2 flex h-[calc(100%-80px)] items-center justify-center text-[1.7rem]">
                      연동 신청을 한 간호사가 없습니다.
                    </div>
                  ) : (
                    <div className="scrollbar-hide mt-6 flex h-[calc(100%-5.9375rem)] flex-col gap-4 overflow-scroll">
                      {watingNurses?.map((waitingNurse) => (
                        <div
                          key={waitingNurse.waitingNurseId}
                          className="border-sub-4.5 bg-main-bg flex h-18 shrink-0 items-center rounded-[.625rem] border-[.0625rem] px-5"
                        >
                          <img
                            className="h-8 w-8 rounded-full"
                            src={'data:image/png;base64,' + waitingNurse.profileImgBase64}
                            alt=""
                          />
                          <p className="font-apple text-sub-1 ml-[.625rem] text-[1.5rem] font-medium">
                            {waitingNurse.name}
                          </p>
                          <div
                            className={`bg-sub-5 font-apple ml-8 flex h-5 w-7 items-center justify-center rounded-[.3125rem] text-[.875rem] ${
                              waitingNurse.gender === '남' ? 'text-[#A2A6F5]' : 'text-[#F5A2C5]'
                            }`}
                          >
                            {waitingNurse.gender}
                          </div>
                          <p className="font-poppins text-sub-1 ml-4 text-[1.25rem] font-medium">
                            {waitingNurse.phoneNum.slice(0, 3) +
                              '-' +
                              waitingNurse.phoneNum.slice(3, 7) +
                              '-' +
                              waitingNurse.phoneNum.slice(7, 11)}
                          </p>
                          <div className="border-sub-4 bg-sub-5 ml-auto flex h-11.5 w-36.5 items-center justify-center gap-[.125rem] rounded-[.3125rem] border-[.0313rem] p-[.125rem]">
                            <button
                              className="font-poppins text-sub-2.5 hover:bg-main-1 flex h-9.5 flex-1 items-center justify-center rounded-[.3125rem] text-[1.5rem] hover:text-white"
                              onClick={() => {
                                setStep(1);
                                setCurrentWaitingNurse(waitingNurse);
                              }}
                            >
                              수락
                            </button>
                            <button
                              className="font-poppins text-sub-2.5 hover:bg-sub-2 flex h-9.5 flex-1 items-center justify-center rounded-[.3125rem] text-[1.5rem] hover:text-white"
                              onClick={() =>
                                confirm('정말 거절하시겠습니까?') &&
                                cancelWaiting(waitingNurse.nurseId)
                              }
                            >
                              거절
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
            .with(1, () => (
              <div
                className="h-[36%] min-h-95 w-[40%] min-w-190 rounded-[1.25rem] bg-white px-10.5 py-8.75"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h1 className="font-apple text-text-1 text-[1.75rem] font-semibold">
                    간호사 계정을 어떻게 생성할까요?
                  </h1>
                  <div className="ml-auto flex gap-5">
                    <button
                      className="border-sub-3 font-apple text-sub-3 flex h-7.5 items-center rounded-[1.875rem] border-[.0625rem] px-[.75rem] text-[1rem]"
                      onClick={() => {
                        setStep(0);
                        setCurrentWaitingNurse(null);
                      }}
                    >
                      이전
                    </button>
                    <button
                      className="border-main-1 font-apple text-main-1 flex h-7.5 items-center rounded-[1.875rem] border-[.0625rem] px-[.75rem] text-[1rem]"
                      onClick={() => {
                        setStep(2);
                      }}
                    >
                      다음
                    </button>
                  </div>
                </div>
                <div className="pt-10.5">
                  <p className="font-apple text-sub-3 text-[1rem] font-medium">연동할 간호사</p>
                  <div className="border-sub-4.5 bg-main-bg mt-6 flex h-18 shrink-0 items-center rounded-[.625rem] border-[.0625rem] px-5">
                    <img className="rounded-full" src="" alt="" />
                    <p className="font-apple text-sub-1 ml-[.625rem] text-[1.5rem] font-medium">
                      {currentWaitingNurse?.name}
                    </p>
                    <div
                      className={`bg-sub-5 font-apple ml-8 flex h-5 w-7 items-center justify-center rounded-[.3125rem] text-[.875rem] ${
                        currentWaitingNurse?.gender === '남' ? 'text-[#A2A6F5]' : 'text-[#F5A2C5]'
                      }`}
                    >
                      {currentWaitingNurse?.gender}
                    </div>
                    <p className="font-poppins text-sub-1 ml-4 text-[1.25rem] font-medium">
                      {currentWaitingNurse?.phoneNum.slice(0, 3) +
                        '-' +
                        currentWaitingNurse?.phoneNum.slice(3, 7) +
                        '-' +
                        currentWaitingNurse?.phoneNum.slice(7, 11)}
                    </p>
                  </div>
                </div>
                <div className="mt-4.75 flex w-full">
                  <button
                    className={twMerge(
                      'border-main-3 font-apple h-11.5 flex-1 rounded-l-[3.125rem] border-[.0625rem] text-[1.5rem] font-medium',
                      connectMode === 'link' ? 'bg-main-1 text-white' : 'bg-sub-5 text-sub-2.5',
                    )}
                    onClick={() => setConnectMode('link')}
                  >
                    기존 간호사와 연동하기
                  </button>
                  <button
                    className={twMerge(
                      'border-main-3 font-apple h-11.5 flex-1 rounded-r-[3.125rem] border-[.0625rem] text-[1.5rem] font-medium',
                      connectMode === 'link' ? 'bg-sub-5 text-sub-2.5' : 'bg-main-1 text-white',
                    )}
                    onClick={() => setConnectMode('add')}
                  >
                    새로 추가하기
                  </button>
                </div>
                <p className="font-apple text-main-2 mt-[.625rem] text-[.875rem]">
                  *기존 간호사와 연동 시, 미연동 상태인 간호사 목록에서 일치하는 계정을 연결시킬 수
                  있어요.
                </p>
              </div>
            ))
            .with(2, () => (
              <div
                className="h-[83%] min-h-225.75 w-[40%] min-w-190 rounded-[1.25rem] bg-white px-10.5 py-8.75"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h1 className="font-apple text-text-1 text-[1.75rem] font-semibold">
                    {connectMode === 'link'
                      ? '연동할 간호사를 선택해 주세요.'
                      : '팀을 선택해 주세요.'}
                  </h1>
                  <div className="ml-auto flex gap-5">
                    <button
                      className="border-sub-3 font-apple text-sub-3 flex h-7.5 items-center rounded-[1.875rem] border-[.0625rem] px-[.75rem] text-[1rem]"
                      onClick={() => {
                        setToAddShiftTeamId(null);
                        setToLinkNurseId(null);
                        setStep(1);
                      }}
                    >
                      이전
                    </button>
                    <button
                      disabled={
                        (connectMode === 'link' ? !toLinkNurseId : !toAddShiftTeamId) ||
                        !currentWaitingNurse
                      }
                      className="border-main-1 font-apple text-main-1 disabled:border-sub-3 disabled:text-sub-3 flex h-7.5 items-center rounded-[1.875rem] border-[.0625rem] px-[.75rem] text-[1rem]"
                      onClick={() => {
                        if (connectMode === 'link') {
                          connectWatingNurses(currentWaitingNurse!.waitingNurseId, toLinkNurseId!);
                        } else {
                          approveWatingNurses(
                            currentWaitingNurse!.waitingNurseId,
                            toAddShiftTeamId!,
                          );
                        }

                        setStep(3);
                      }}
                    >
                      다음
                    </button>
                  </div>
                </div>
                <p className="font-apple text-sub-3 pt-[.375rem] text-[1rem] font-medium">
                  {connectMode === 'link'
                    ? '미연동 상태인 간호사 목록 중에 일치하는 계정을 선택해주세요.'
                    : '팀을 선택해주시면 해당 팀에 계정이 추가됩니다.'}
                </p>
                <div
                  className={`scrollbar-hide mb-8 flex h-[calc(100%-5rem)] items-start gap-10 overflow-y-scroll ${
                    connectMode === 'add' && 'pt-25.5'
                  }`}
                >
                  {shiftTeams?.map((shiftTeam) => (
                    <div
                      className={twMerge(
                        'border-sub-4.5 shadow-banner relative mt-5.5 flex w-75 flex-col rounded-2xl border-[.0625rem]',
                        toAddShiftTeamId === shiftTeam.shiftTeamId &&
                          'border-main-1 border-[.125rem]',
                      )}
                      key={shiftTeam.shiftTeamId}
                    >
                      {connectMode === 'add' ? (
                        toAddShiftTeamId === shiftTeam.shiftTeamId ? (
                          <CheckedIcon className="absolute -top-6 left-[50%] h-9 w-9 translate-x-[-50%] -translate-y-full cursor-pointer" />
                        ) : (
                          <UncheckedIcon2
                            className="absolute -top-6 left-[50%] h-9 w-9 translate-x-[-50%] -translate-y-full cursor-pointer"
                            onClick={() => setToAddShiftTeamId(shiftTeam.shiftTeamId)}
                          />
                        )
                      ) : null}
                      <div className="bg-sub-2 relative flex w-full items-center justify-between rounded-t-[.9375rem] px-5 py-[.875rem]">
                        <div className="flex flex-col gap-[.3125rem]">
                          <h2 className="font-apple text-[1.5rem] font-semibold text-white">
                            {shiftTeam.name}
                          </h2>

                          <div className="flex items-center">
                            <PersonIcon className="h-4 w-4" />
                            <p className="font-poppins text-[.75rem] text-white">
                              {shiftTeam.nurses.length}
                            </p>
                          </div>
                        </div>
                        <MoreIcon className="h-7.5 w-7.5 cursor-pointer" />
                      </div>
                      {shiftTeam.nurses.length === 0 && (
                        <div
                          className={`flex h-14 w-full cursor-pointer items-center justify-center select-none`}
                        >
                          <h3 className="font-apple text-sub-2.5 text-[1.25rem] font-semibold">
                            아직 간호사가 없습니다!
                          </h3>
                        </div>
                      )}
                      {Object.entries(groupBy(shiftTeam.nurses, 'divisionNum'))
                        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                        .map(([, divisionNurses], divisionIndex) => (
                          <div
                            key={divisionIndex}
                            className="border-sub-2.5 border-b-[.0938rem] last:border-none"
                          >
                            {divisionNurses.map((nurse, index) => (
                              <div
                                key={index}
                                className={`group relative flex h-14 w-full ${
                                  nurse.isConnected ? 'cursor-default' : 'cursor-pointer'
                                } items-center justify-center select-none ${
                                  toLinkNurseId === nurse.nurseId
                                    ? 'bg-main-4 text-main-1 underline underline-offset-2'
                                    : 'text-sub-1 bg-white'
                                } ${
                                  shiftTeam.nurses.findIndex((x) => x.nurseId === nurse.nurseId) ===
                                  shiftTeam.nurses.length - 1
                                    ? 'rounded-b-[.9375rem]'
                                    : 'border-b-sub-4.5 border-b-[.0313rem]'
                                }`}
                                onClick={() => {
                                  if (!nurse.isConnected) {
                                    setToLinkNurseId(nurse.nurseId);
                                  }
                                }}
                              >
                                <div className="peer font-apple text-sub-1 relative text-[1.25rem] font-semibold">
                                  {nurse.name}
                                  {!nurse.isConnected && (
                                    <div className="bg-red absolute top-0 right-[-.3125rem] h-[.3125rem] w-[.3125rem] rounded-full"></div>
                                  )}
                                </div>
                                {!nurse.isConnected && (
                                  <div className="font-apple text-sub-2 shadow-shadow-2 invisible absolute top-0 z-30 flex translate-y-[-60%] items-center gap-[.5rem] rounded-[.3125rem] bg-white px-2 py-1 text-[.875rem] whitespace-nowrap peer-hover:visible">
                                    <div
                                      className="absolute -bottom-1.5 left-[50%] h-0 w-0 translate-x-[-50%]"
                                      style={{
                                        borderTop: '.625rem solid white',
                                        borderLeft: '.4375rem solid transparent',
                                        borderRight: '.4375rem solid transparent',
                                        borderBottom: '.625rem solid none',
                                      }}
                                    />
                                    연동 되지 않은 가상의 프로필입니다.
                                    <UnlinkedIcon className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            ))
            .with(3, () => (
              <div
                className="flex min-h-96 w-[40%] min-w-190 flex-col items-center justify-center rounded-[1.25rem] bg-white"
                onClick={(e) => e.stopPropagation()}
              >
                <SuccessCircleIcon className="h-15 w-15" />
                <h1 className="font-apple text-text-1 mt-5 text-[1.75rem] font-semibold">
                  간호사 계정이 연동되었습니다.
                </h1>
                <p className="font-apple text-sub-3 mt-[.5rem] text-[1rem]">
                  연동된 간호사의 계정은{' '}
                  <span
                    className="text-main-1 cursor-pointer underline"
                    onClick={() => setOpen(false)}
                  >
                    간호사 관리 탭
                  </span>
                  에서 확인하실 수 있어요!
                </p>

                <div className="mt-12 flex w-100">
                  <button
                    className="border-main-3 bg-main-1 font-apple h-11.5 flex-1 rounded-l-[3.125rem] border-[.0625rem] text-[1.5rem] font-medium text-white"
                    onClick={() => initialize()}
                  >
                    돌아가기
                  </button>
                  <button
                    className="border-main-3 bg-sub-5 font-apple text-sub-2.5 h-11.5 flex-1 rounded-r-[3.125rem] border-[.0625rem] text-[1.5rem] font-medium"
                    onClick={() => setOpen(false)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            ))
            .otherwise(() => null)}
        </div>,
        document.getElementById('modal-root')!,
      )
    : null;
}

export default ConnectionManage;
