import { useState } from 'react';
import toast from 'react-hot-toast';
import { CopyIcon, LinkedIcon } from '@/assets/svg';
import useEditShiftTeam from '@/hooks/ward/useEditShiftTeam';
import useEditWard from '@/hooks/ward/useEditWard';
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
      <div className="flex flex-col gap-[.4375rem]">
        <p className="font-apple text-sub-3 text-base font-medium">병원 정보</p>
        <div className="border-sub-4 bg-sub-5 flex h-17.5 min-w-70 rounded-[.9375rem] border-[.0625rem] px-7 py-[.625rem]">
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-sub-2.5 text-[.875rem]">병원</p>
            <p className="font-apple text-sub-2.5 text-[1.75rem] font-bold">{ward?.hospitalName}</p>
          </div>
          <div className="bg-sub-4 mx-5 h-12.5 min-w-[.0313rem]" />
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-sub-2.5 text-[.875rem]">병동</p>
            <p className="font-apple text-sub-2.5 text-[1.75rem] font-bold">{ward?.name}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[.4375rem]">
        <p className="font-apple text-sub-3 text-base font-medium">전체 인원</p>
        <div className="border-sub-4 bg-sub-5 flex h-17.5 min-w-25 items-center gap-[.3125rem] rounded-[.9375rem] border-[.0625rem] px-7 py-[.625rem]">
          <p className="font-apple text-sub-2.5 text-[1.75rem] font-bold">
            {shiftTeams?.flatMap((x) => x.nurses).length}
          </p>
          <p className="font-apple text-sub-2.5 text-[.875rem]">명</p>
        </div>
      </div>
      <div className="flex flex-col gap-[.4375rem]">
        <p className="font-apple text-sub-3 text-base font-medium">연동 상태</p>
        <div className="border-sub-4 bg-sub-5 flex h-17.5 min-w-70 rounded-[.9375rem] border-[.0625rem] px-7 py-[.625rem]">
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-sub-2.5 text-[.875rem]">연동됨</p>
            <p className="font-apple text-sub-2.5 text-[1.75rem] font-bold">
              {shiftTeams?.flatMap((x) => x.nurses).filter((x) => x.isConnected).length}
            </p>
            <p className="font-apple text-sub-2.5 text-[.875rem]">명</p>
          </div>
          <div className="bg-sub-4 mx-5 h-12.5 min-w-[.0313rem]" />
          <div className="flex items-center gap-[.625rem]">
            <p className="font-apple text-sub-2.5 text-[.875rem]">미연동</p>
            <p className="font-apple text-sub-2.5 text-[1.75rem] font-bold">
              {shiftTeams?.flatMap((x) => x.nurses).filter((x) => !x.isConnected).length}
            </p>
            <p className="font-apple text-sub-2.5 text-[.875rem]">명</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[.4375rem]">
        <div className="flex items-center gap-[.25rem]">
          <p className="font-apple text-main-3 text-base font-medium">병동 코드</p>
          <CopyIcon
            className="h-6 w-6 cursor-pointer"
            onClick={() => {
              if (ward) {
                toast.promise(navigator.clipboard.writeText(ward.code), {
                  loading: '복사 중입니다...',
                  success: '복사 완료!',
                  error: '복사를 실패했습니다.',
                });
              }
            }}
          />
        </div>
        <div className="border-main-3 flex h-17.5 min-w-37 items-center justify-center rounded-[.9375rem] border-[.0625rem] bg-white px-4">
          <p className="spacing font-poppins text-main-2 text-[1.75rem]">{ward?.code}</p>
        </div>
      </div>
      <div className="flex flex-col gap-[.4375rem]">
        <p className="font-apple text-main-3 text-base font-medium">연동 관리</p>
        <div
          className="border-main-3 shadow-banner relative flex h-15.5 w-15.5 cursor-pointer items-center justify-center rounded-full border-[.0938rem]"
          onClick={() => setOpen(true)}
        >
          <LinkedIcon className="h-9 w-9" />
          {watingNurses?.length ? (
            <div className="bg-main-1 absolute right-0 bottom-0 flex h-7 w-7 translate-x-[50%] items-center justify-center rounded-full">
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
