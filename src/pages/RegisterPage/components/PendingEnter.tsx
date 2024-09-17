import useRegister from '@hooks/auth/useRegister';

function PendingEnter() {
  const {
    state: { accountMe, accountWaitingWard },
    actions: { cancelWaiting },
  } = useRegister();

  return (
    <div className="my-auto flex w-full flex-col items-center justify-center">
      <h1 className="font-apple text-[3rem] font-semibold text-main-1">
        {accountWaitingWard?.hospitalName} {accountWaitingWard?.name}
      </h1>
      <p className="mt-[3.75rem] font-apple text-[1.5rem] font-medium text-main-2">병동 입장 승인 대기중입니다.</p>
      <button
        onClick={() => accountMe && accountMe.nurseId && accountWaitingWard && cancelWaiting(accountWaitingWard.wardId, accountMe.nurseId)}
        className="mt-32 rounded-[.625rem] border-[.0625rem] border-red px-9 py-[.425rem] font-apple text-[1.5rem] text-red"
      >
        입장 취소
      </button>
    </div>
  );
}

export default PendingEnter;
