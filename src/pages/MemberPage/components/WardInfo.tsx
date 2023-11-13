import { LinkedIcon } from '@assets/svg';
import useEditShiftTeam from '@hooks/ward/useEditShiftTeam';
import useEditWard from '@hooks/ward/useEditWard';
import { useState } from 'react';
import ConnectionManage from './ConnectionManage';

function WardInfo() {
  const {
    state: { ward, shiftTeams },
  } = useEditShiftTeam();
  const {
    state: { watingNurses },
  } = useEditWard();
  const [open, setOpen] = useState(false);
  return (
    <div id="ward_info" className="flex gap-[1.25rem]">
      <div className="flex flex-col gap-[.4375rem] ">
        <p className="font-apple text-base font-medium  text-sub-3">병원 정보</p>
        <div className="flex h-[4.375rem] min-w-[17.5rem] rounded-[.9375rem] border-[.0625rem] border-sub-4 bg-sub-5 px-[1.75rem] py-[.625rem]">
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-[.875rem] text-sub-2.5">병원</p>
            <p className="font-apple text-[1.75rem] font-bold text-sub-2.5">{ward?.hospitalName}</p>
          </div>
          <div className="mx-[1.25rem] h-[3.125rem] min-w-[.0313rem] bg-sub-4" />
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
      <div className="flex flex-col gap-[.4375rem] ">
        <p className="font-apple text-base font-medium  text-sub-3">연동 상태</p>
        <div className="flex h-[4.375rem] min-w-[17.5rem] rounded-[.9375rem] border-[.0625rem] border-sub-4 bg-sub-5 px-[1.75rem] py-[.625rem]">
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-[.875rem] text-sub-2.5">연동됨</p>
            <p className="font-apple text-[1.75rem] font-bold text-sub-2.5">
              {shiftTeams?.flatMap((x) => x.nurses).filter((x) => x.isConnected).length}
            </p>
            <p className="font-apple text-[.875rem] text-sub-2.5">명</p>
          </div>
          <div className="mx-[1.25rem] h-[3.125rem] min-w-[.0313rem] bg-sub-4" />
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-[.875rem] text-sub-2.5">미연동</p>
            <p className="font-apple text-[1.75rem] font-bold text-sub-2.5">
              {shiftTeams?.flatMap((x) => x.nurses).filter((x) => !x.isConnected).length}
            </p>
            <p className="font-apple text-[.875rem] text-sub-2.5">명</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[.4375rem] ">
        <p className="font-apple text-base font-medium  text-main-3">연동 관리</p>
        <div
          className="relative flex h-[3.875rem] w-[3.875rem] cursor-pointer items-center justify-center rounded-full border-[.0938rem] border-main-3 shadow-banner"
          onClick={() => setOpen(true)}
        >
          <LinkedIcon className="h-[2.25rem] w-[2.25rem]" />
          {watingNurses?.length ? (
            <div className="absolute bottom-0 right-0 flex h-[1.75rem] w-[1.75rem] translate-x-[50%] items-center justify-center rounded-full bg-main-1">
              <p className="font-poppins text-[.875rem] text-white">{watingNurses?.length}</p>
            </div>
          ) : null}
        </div>
      </div>
      <ConnectionManage open={open} setOpen={setOpen} />
    </div>
  );
}

export default WardInfo;
