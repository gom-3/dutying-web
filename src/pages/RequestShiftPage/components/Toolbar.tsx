import useRequestShift from 'hooks/useRequestShift';

function Toolbar() {
  const {
    state: { month, changeStatus },
  } = useRequestShift();

  return (
    <div className="sticky top-0 flex h-[6.125rem] w-full items-center gap-[1.25rem] bg-[#FDFCFE] pt-[1.875rem]">
      <div className="w-[3.375rem]"></div>
      <div className="w-[5.375rem]"></div>
      <div className="flex flex-1 items-center gap-[1.25rem]">
        <p className="font-poppins text-2xl text-main-1">{month}월</p>
        <p className="font-apple text-[.875rem] text-sub-2 ">
          {changeStatus === 'loading' ? '저장 중...' : '저장 완료'}
        </p>
      </div>
    </div>
  );
}

export default Toolbar;
