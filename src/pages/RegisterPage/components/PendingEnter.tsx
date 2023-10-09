import useRegister from '@hooks/auth/useRegister';

function PendingEnter() {
  const {
    state: { accountMe },
    actions: { cancelWaiting },
  } = useRegister();
  return (
    <div className="my-auto flex w-full flex-col items-center justify-center">
      <h1 className="font-apple text-[3rem] font-semibold text-main-1">듀팅 병원 듀팅 병동</h1>
      <p className="mt-[3.75rem] font-apple text-[1.5rem] font-medium text-main-2">
        병동 입장 승인 대기중입니다.
      </p>
      <button
        onClick={() => accountMe && accountMe.nurseId && cancelWaiting(2, accountMe.nurseId)}
        className="mt-[8rem] rounded-[.625rem] border-[.0625rem] border-red px-[2.25rem] py-[.425rem] font-apple text-[1.5rem] text-red"
      >
        입장 취소
      </button>
    </div>
  );
}

export default PendingEnter;
