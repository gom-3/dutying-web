import { useState } from 'react';
import toast from 'react-hot-toast';
import { CopyIcon, LinkedIcon } from '@assets/svg';
import useEditShiftTeam from '@hooks/ward/useEditShiftTeam';
import useEditWard from '@hooks/ward/useEditWard';
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
    <div id="ward_info" className="flex gap-5">
      <div className="flex flex-col gap-[.4375rem] ">
        <p className="font-apple text-base font-medium  text-sub-3">병원 정보</p>
        <div className="flex h-[4.375rem] min-w-[17.5rem] rounded-[.9375rem] border-[.0625rem] border-sub-4 bg-sub-5 px-7 py-[.625rem]">
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-[.875rem] text-sub-2.5">병원</p>
            <p className="font-apple text-[1.75rem] font-bold text-sub-2.5">{ward?.hospitalName}</p>
          </div>
          <div className="mx-5 h-[3.125rem] min-w-[.0313rem] bg-sub-4" />
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-[.875rem] text-sub-2.5">병동</p>
            <p className="font-apple text-[1.75rem] font-bold text-sub-2.5">{ward?.name}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[.4375rem] ">
        <p className="font-apple text-base font-medium  text-sub-3">전체 인원</p>
        <div className="flex h-[4.375rem] min-w-[6.25rem] items-center gap-[.3125rem] rounded-[.9375rem] border-[.0625rem] border-sub-4 bg-sub-5 px-7 py-[.625rem]">
          <p className="font-apple text-[1.75rem] font-bold text-sub-2.5">{shiftTeams?.flatMap((x) => x.nurses).length}</p>
          <p className="font-apple text-[.875rem] text-sub-2.5">명</p>
        </div>
      </div>
      <div className="flex flex-col gap-[.4375rem] ">
        <p className="font-apple text-base font-medium  text-sub-3">연동 상태</p>
        <div className="flex h-[4.375rem] min-w-[17.5rem] rounded-[.9375rem] border-[.0625rem] border-sub-4 bg-sub-5 px-7 py-[.625rem]">
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-[.875rem] text-sub-2.5">연동됨</p>
            <p className="font-apple text-[1.75rem] font-bold text-sub-2.5">{shiftTeams?.flatMap((x) => x.nurses).filter((x) => x.isConnected).length}</p>
            <p className="font-apple text-[.875rem] text-sub-2.5">명</p>
          </div>
          <div className="mx-5 h-[3.125rem] min-w-[.0313rem] bg-sub-4" />
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-[.875rem] text-sub-2.5">미연동</p>
            <p className="font-apple text-[1.75rem] font-bold text-sub-2.5">{shiftTeams?.flatMap((x) => x.nurses).filter((x) => !x.isConnected).length}</p>
            <p className="font-apple text-[.875rem] text-sub-2.5">명</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[.4375rem] ">
        <div className="flex items-center gap-[.25rem]">
          <p className="font-apple text-base font-medium  text-main-3">병동 코드</p>
          <CopyIcon
            className="size-6 cursor-pointer"
            onClick={() => {
              ward &&
                toast.promise(navigator.clipboard.writeText(ward.code), {
                  loading: '복사 중입니다...',
                  success: '복사 완료!',
                  error: '복사를 실패했습니다.',
                });
            }}
          />
        </div>
        <div className="flex h-[4.375rem] min-w-[9.25rem] items-center justify-center rounded-[.9375rem] border-[.0625rem] border-main-3 bg-white px-4">
          <p className="spacing font-poppins text-[1.75rem] text-main-2">{ward?.code}</p>
        </div>
      </div>
      <div className="flex flex-col gap-[.4375rem] ">
        <p className="font-apple text-base font-medium  text-main-3">연동 관리</p>
        <div
          className="relative flex size-[3.875rem] cursor-pointer items-center justify-center rounded-full border-[.0938rem] border-main-3 shadow-banner"
          onClick={() => setOpen(true)}
        >
          <LinkedIcon className="size-9" />
          {watingNurses?.length ? (
            <div className="absolute bottom-0 right-0 flex size-7 translate-x-1/2 items-center justify-center rounded-full bg-main-1">
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
