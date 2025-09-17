import useRegister from '@/hooks/auth/useRegister';

function PendingEnter() {
  const {
    state: { accountMe, accountWaitingWard },
    actions: { cancelWaiting },
  } = useRegister();

  return (
    <div className="my-auto flex w-full flex-col items-center justify-center">
      <h1 className="font-apple text-main-1 text-[3rem] font-semibold">
        {accountWaitingWard?.hospitalName} {accountWaitingWard?.name}
      </h1>
      <p className="font-apple text-main-2 mt-15 text-[1.5rem] font-medium">
        병동 입장 승인 대기중입니다.
      </p>
      <button
        onClick={() =>
          accountMe?.nurseId &&
          accountWaitingWard &&
          cancelWaiting(accountWaitingWard.wardId, accountMe.nurseId)
        }
        className="border-red font-apple text-red mt-32 rounded-[.625rem] border-[.0625rem] px-9 py-[.425rem] text-[1.5rem]"
      >
        입장 취소
      </button>
    </div>
  );
}

export default PendingEnter;
