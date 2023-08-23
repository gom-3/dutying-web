import useEditShiftTeam from '@hooks/useEditShiftTeam';

function WardInfo() {
  const {
    state: { ward, shiftTeams },
  } = useEditShiftTeam();
  return (
    <div className="flex gap-[1.25rem]">
      <div className="flex flex-col gap-[.4375rem] ">
        <p className="font-apple text-base font-medium  text-sub-3">병원 정보</p>
        <div className="flex h-[4.375rem] min-w-[17.5rem] rounded-[.9375rem] border-[.0625rem] border-sub-4 bg-sub-5 px-[1.75rem] py-[.625rem]">
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-[.875rem] text-sub-2.5">병원</p>
            <p className="font-apple text-[1.75rem] font-bold text-sub-2.5">{ward?.hospitalName}</p>
          </div>
          <div className="mx-[1.25rem] h-[3.125rem] w-[.0313rem] bg-sub-4" />
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-[.875rem] text-sub-2.5">병동</p>
            <p className="font-apple text-[1.75rem] font-bold text-sub-2.5">{ward?.name}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[.4375rem] ">
        <p className="font-apple text-base font-medium  text-sub-3">전체 인원</p>
        <div className="flex h-[4.375rem] min-w-[6.25rem] items-center gap-[.3125rem] rounded-[.9375rem] border-[.0625rem] border-sub-4 bg-sub-5 px-[1.75rem] py-[.625rem]">
          <p className="font-apple text-[1.75rem] font-bold text-sub-2.5">
            {shiftTeams?.flatMap((x) => x.nurses).length}
          </p>
          <p className="font-apple text-[.875rem] text-sub-2.5">명</p>
        </div>
      </div>
    </div>
  );
}

export default WardInfo;
