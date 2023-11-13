/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CancelIcon,
  CheckedIcon,
  MoreIcon,
  PersonIcon,
  SuccessCircleIcon,
  UncheckedIcon2,
  UnlinkedIcon,
} from '@assets/svg';
import useEditShiftTeam from '@hooks/ward/useEditShiftTeam';
import useEditWard from '@hooks/ward/useEditWard';
import { groupBy } from 'lodash-es';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { match } from 'ts-pattern';

interface ConnectionManageProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function ConnectionManage({ open, setOpen }: ConnectionManageProps) {
  const {
    state: { ward, watingNurses },
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
          className="fixed left-0 top-0 z-[1001] flex h-screen w-screen items-center justify-center bg-[#00000099] backdrop-blur-[.125rem]"
          onClick={() => setOpen(false)}
        >
          {match(step)
            .with(0, () => (
              <div
                className="h-[44%] min-h-[29.375rem] w-[40%] min-w-[47.5rem] rounded-[1.25rem] bg-white px-[2.625rem] py-[2.1875rem]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h1 className="font-apple text-[1.75rem] font-semibold text-text-1">
                      연동 관리
                    </h1>
                    <p className="font-apple text-[1.4rem] text-sub-2">병동 코드: {ward?.code}</p>
                  </div>
                  <CancelIcon
                    className="h-[1.875rem] w-[1.875rem]"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <div className="h-full overflow-hidden pt-[2.625rem]">
                  <p className="font-apple text-[1rem] font-medium text-sub-3">신청 내역</p>
                  {watingNurses?.length === 0 ? (
                    <div className="flex h-[calc(100%-80px)] items-center justify-center font-apple text-[1.7rem] text-sub-2">
                      연동 신청을 한 간호사가 없습니다.
                    </div>
                  ) : (
                    <div className="mt-[1.5rem] flex h-[calc(100%-5.9375rem)] flex-col gap-[1rem] overflow-scroll scrollbar-hide">
                      {watingNurses?.map((waitingNurse) => (
                        <div className="flex h-[4.5rem] shrink-0 items-center rounded-[.625rem] border-[.0625rem] border-sub-4.5 bg-main-bg px-[1.25rem]">
                          <img
                            className="h-[2rem] w-[2rem] rounded-full"
                            src={'data:image/png;base64,' + waitingNurse.profileImgBase64}
                            alt=""
                          />
                          <p className="ml-[.625rem] font-apple text-[1.5rem] font-medium text-sub-1">
                            {waitingNurse.name}
                          </p>
                          <div
                            className={`ml-[2rem] flex h-[1.25rem] w-[1.75rem] items-center justify-center rounded-[.3125rem] bg-sub-5 font-apple text-[.875rem] ${
                              waitingNurse.gender === '남' ? 'text-[#A2A6F5]' : 'text-[#F5A2C5]'
                            }`}
                          >
                            {waitingNurse.gender}
                          </div>
                          <p className="ml-[1rem] font-poppins text-[1.25rem] font-medium text-sub-1">
                            {waitingNurse.phoneNum.slice(0, 3) +
                              '-' +
                              waitingNurse.phoneNum.slice(3, 7) +
                              '-' +
                              waitingNurse.phoneNum.slice(7, 11)}
                          </p>
                          <div className="ml-auto flex h-[2.875rem] w-[9.125rem] items-center justify-center gap-[.125rem] rounded-[.3125rem] border-[.0313rem] border-sub-4 bg-sub-5 p-[.125rem]">
                            <button
                              className="flex h-[2.375rem] flex-1 items-center justify-center rounded-[.3125rem] font-poppins text-[1.5rem] text-sub-2.5 hover:bg-main-1 hover:text-white"
                              onClick={() => {
                                setStep(1);
                                setCurrentWaitingNurse(waitingNurse);
                              }}
                            >
                              수락
                            </button>
                            <button
                              className="flex h-[2.375rem] flex-1 items-center justify-center rounded-[.3125rem] font-poppins text-[1.5rem] text-sub-2.5 hover:bg-sub-2 hover:text-white"
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
                className="h-[36%] min-h-[23.75rem] w-[40%] min-w-[47.5rem] rounded-[1.25rem] bg-white px-[2.625rem] py-[2.1875rem]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h1 className="font-apple text-[1.75rem] font-semibold text-text-1">
                    간호사 계정을 어떻게 생성할까요?
                  </h1>
                  <div className="ml-auto flex gap-[1.25rem]">
                    <button
                      className="flex h-[1.875rem] items-center rounded-[1.875rem] border-[.0625rem] border-sub-3 px-[.75rem] font-apple text-[1rem] text-sub-3"
                      onClick={() => {
                        setStep(0);
                        setCurrentWaitingNurse(null);
                      }}
                    >
                      이전
                    </button>
                    <button
                      className="flex h-[1.875rem] items-center rounded-[1.875rem] border-[.0625rem] border-main-1 px-[.75rem] font-apple text-[1rem] text-main-1"
                      onClick={() => {
                        setStep(2);
                      }}
                    >
                      다음
                    </button>
                  </div>
                </div>
                <div className="pt-[2.625rem]">
                  <p className="font-apple text-[1rem] font-medium text-sub-3">연동할 간호사</p>
                  <div className="mt-[1.5rem] flex h-[4.5rem] shrink-0 items-center rounded-[.625rem] border-[.0625rem] border-sub-4.5 bg-main-bg px-[1.25rem]">
                    <img className="rounded-full" src="" alt="" />
                    <p className="ml-[.625rem] font-apple text-[1.5rem] font-medium text-sub-1">
                      {currentWaitingNurse?.name}
                    </p>
                    <div
                      className={`ml-[2rem] flex h-[1.25rem] w-[1.75rem] items-center justify-center rounded-[.3125rem] bg-sub-5 font-apple text-[.875rem] ${
                        currentWaitingNurse?.gender === '남' ? 'text-[#A2A6F5]' : 'text-[#F5A2C5]'
                      }`}
                    >
                      {currentWaitingNurse?.gender}
                    </div>
                    <p className="ml-[1rem] font-poppins text-[1.25rem] font-medium text-sub-1">
                      {currentWaitingNurse?.phoneNum.slice(0, 3) +
                        '-' +
                        currentWaitingNurse?.phoneNum.slice(3, 7) +
                        '-' +
                        currentWaitingNurse?.phoneNum.slice(7, 11)}
                    </p>
                  </div>
                </div>
                <div className="mt-[1.1875rem] flex w-full">
                  <button
                    className={twMerge(
                      'h-[2.875rem] flex-1 rounded-l-[3.125rem] border-[.0625rem] border-main-3 font-apple text-[1.5rem] font-medium',
                      connectMode === 'link' ? 'bg-main-1 text-white' : 'bg-sub-5 text-sub-2.5'
                    )}
                    onClick={() => setConnectMode('link')}
                  >
                    기존 간호사와 연동하기
                  </button>
                  <button
                    className={twMerge(
                      'h-[2.875rem] flex-1 rounded-r-[3.125rem] border-[.0625rem] border-main-3  font-apple text-[1.5rem] font-medium',
                      connectMode === 'link' ? 'bg-sub-5 text-sub-2.5' : 'bg-main-1 text-white'
                    )}
                    onClick={() => setConnectMode('add')}
                  >
                    새로 추가하기
                  </button>
                </div>
                <p className="mt-[.625rem] font-apple text-[.875rem] text-main-2">
                  *기존 간호사와 연동 시, 미연동 상태인 간호사 목록에서 일치하는 계정을 연결시킬 수
                  있어요.
                </p>
              </div>
            ))
            .with(2, () => (
              <div
                className="h-[83%] min-h-[56.4375rem] w-[40%] min-w-[47.5rem] rounded-[1.25rem] bg-white px-[2.625rem] py-[2.1875rem]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h1 className="font-apple text-[1.75rem] font-semibold text-text-1">
                    {connectMode === 'link'
                      ? '연동할 간호사를 선택해 주세요.'
                      : '팀을 선택해 주세요.'}
                  </h1>
                  <div className="ml-auto flex gap-[1.25rem]">
                    <button
                      className="flex h-[1.875rem] items-center rounded-[1.875rem] border-[.0625rem] border-sub-3 px-[.75rem] font-apple text-[1rem] text-sub-3"
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
                      className="flex h-[1.875rem] items-center rounded-[1.875rem] border-[.0625rem] border-main-1 px-[.75rem] font-apple text-[1rem] text-main-1 disabled:border-sub-3 disabled:text-sub-3"
                      onClick={() => {
                        if (connectMode === 'link') {
                          connectWatingNurses(currentWaitingNurse!.waitingNurseId, toLinkNurseId!);
                        } else {
                          approveWatingNurses(
                            currentWaitingNurse!.waitingNurseId,
                            toAddShiftTeamId!
                          );
                        }
                        setStep(3);
                      }}
                    >
                      다음
                    </button>
                  </div>
                </div>
                <p className="pt-[.375rem] font-apple text-[1rem] font-medium text-sub-3">
                  {connectMode === 'link'
                    ? '미연동 상태인 간호사 목록 중에 일치하는 계정을 선택해주세요.'
                    : '팀을 선택해주시면 해당 팀에 계정이 추가됩니다.'}
                </p>
                <div
                  className={`mb-8 flex items-start gap-[2.5rem] ${
                    connectMode === 'add' && 'mt-[6.375rem]'
                  }`}
                >
                  {shiftTeams?.map((shiftTeam) => (
                    <div
                      className={twMerge(
                        'relative mt-[1.375rem] flex w-[18.75rem] flex-col rounded-[1rem] border-[.0625rem] border-sub-4.5 shadow-banner',
                        toAddShiftTeamId === shiftTeam.shiftTeamId &&
                          'border-[.125rem] border-main-1'
                      )}
                      key={shiftTeam.shiftTeamId}
                    >
                      {connectMode === 'add' ? (
                        toAddShiftTeamId === shiftTeam.shiftTeamId ? (
                          <CheckedIcon className="absolute left-[50%] top-[-1.5rem] h-[2.25rem] w-[2.25rem] translate-x-[-50%] translate-y-[-100%] cursor-pointer checked:bg-main-1" />
                        ) : (
                          <UncheckedIcon2
                            className="absolute left-[50%] top-[-1.5rem] h-[2.25rem] w-[2.25rem] translate-x-[-50%] translate-y-[-100%] cursor-pointer checked:bg-main-1"
                            onClick={() => setToAddShiftTeamId(shiftTeam.shiftTeamId)}
                          />
                        )
                      ) : null}
                      <div className="relative flex w-full items-center justify-between rounded-t-[.9375rem] bg-sub-2 px-[1.25rem] py-[.875rem]">
                        <div className="flex flex-col gap-[.3125rem]">
                          <h2 className="font-apple text-[1.5rem] font-semibold text-white">
                            {shiftTeam.name}
                          </h2>

                          <div className="flex items-center">
                            <PersonIcon className="h-[1rem] w-[1rem]" />
                            <p className="font-poppins text-[.75rem] text-white">
                              {shiftTeam.nurses.length}
                            </p>
                          </div>
                        </div>
                        <MoreIcon className="h-[1.875rem] w-[1.875rem] cursor-pointer" />
                      </div>
                      {shiftTeam.nurses.length === 0 && (
                        <div
                          className={`flex h-[3.5rem] w-full cursor-pointer select-none items-center justify-center`}
                        >
                          <h3 className="font-apple text-[1.25rem] font-semibold text-sub-2.5">
                            아직 간호사가 없습니다!
                          </h3>
                        </div>
                      )}
                      {Object.entries(groupBy(shiftTeam.nurses, 'divisionNum'))
                        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                        .map(([, divisionNurses], divisionIndex) => (
                          <div
                            key={divisionIndex}
                            className="border-b-[.0938rem] border-sub-2.5 last:border-none"
                          >
                            {divisionNurses.map((nurse, index) => (
                              <div
                                key={index}
                                className={`group relative flex h-[3.5rem] w-full ${
                                  nurse.isConnected ? 'cursor-default' : 'cursor-pointer'
                                } select-none items-center justify-center  
                              ${
                                toLinkNurseId === nurse.nurseId
                                  ? 'bg-main-4 text-main-1 underline underline-offset-2'
                                  : 'bg-white text-sub-1'
                              }
                              ${
                                shiftTeam.nurses.findIndex((x) => x.nurseId === nurse.nurseId) ===
                                shiftTeam.nurses.length - 1
                                  ? 'rounded-b-[.9375rem]'
                                  : 'border-b-[.0313rem] border-b-sub-4.5'
                              }`}
                                onClick={() => {
                                  !nurse.isConnected && setToLinkNurseId(nurse.nurseId);
                                }}
                              >
                                <div className="peer relative font-apple text-[1.25rem] font-semibold text-sub-1">
                                  {nurse.name}
                                  {!nurse.isConnected && (
                                    <div className="absolute right-[-.3125rem] top-0 h-[.3125rem] w-[.3125rem] rounded-full bg-red"></div>
                                  )}
                                </div>
                                {!nurse.isConnected && (
                                  <div className="invisible absolute top-0 z-30 flex translate-y-[-60%] items-center gap-[.5rem] whitespace-nowrap rounded-[.3125rem] bg-white px-2 py-1 font-apple text-[.875rem] text-sub-2 shadow-shadow-2 peer-hover:visible">
                                    <div
                                      className="absolute bottom-[-0.375rem] left-[50%] h-0 w-0 translate-x-[-50%]"
                                      style={{
                                        borderTop: '.625rem solid white',
                                        borderLeft: '.4375rem solid transparent',
                                        borderRight: '.4375rem solid transparent',
                                        borderBottom: '.625rem solid none',
                                      }}
                                    />
                                    연동 되지 않은 가상의 프로필입니다.
                                    <UnlinkedIcon className="h-[1.25rem] w-[1.25rem]" />
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
                className="flex min-h-[24rem] w-[40%] min-w-[47.5rem] flex-col items-center justify-center rounded-[1.25rem] bg-white"
                onClick={(e) => e.stopPropagation()}
              >
                <SuccessCircleIcon className="h-[3.75rem] w-[3.75rem]" />
                <h1 className="mt-[1.25rem] font-apple text-[1.75rem] font-semibold text-text-1">
                  간호사 계정이 연동되었습니다.
                </h1>
                <p className="mt-[.5rem] font-apple text-[1rem] text-sub-3">
                  연동된 간호사의 계정은{' '}
                  <span
                    className="cursor-pointer text-main-1 underline"
                    onClick={() => setOpen(false)}
                  >
                    간호사 관리 탭
                  </span>
                  에서 확인하실 수 있어요!
                </p>

                <div className="mt-[3rem] flex w-[25rem]">
                  <button
                    className="h-[2.875rem] flex-1 rounded-l-[3.125rem] border-[.0625rem] border-main-3 bg-main-1 font-apple text-[1.5rem] font-medium text-white"
                    onClick={() => initialize()}
                  >
                    돌아가기
                  </button>
                  <button
                    className="h-[2.875rem] flex-1 rounded-r-[3.125rem] border-[.0625rem] border-main-3 bg-sub-5 font-apple text-[1.5rem] font-medium text-sub-2.5"
                    onClick={() => setOpen(false)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            ))
            .otherwise(() => null)}
        </div>,
        document.getElementById('modal-root')!
      )
    : null;
}

export default ConnectionManage;
