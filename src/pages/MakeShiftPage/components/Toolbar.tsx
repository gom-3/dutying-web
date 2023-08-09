import {
  CancelIcon,
  FaultDotIcon,
  HistoryBackIcon,
  HistoryNextIcon,
  InfoIcon,
  NextIcon,
  PenIcon,
  PrevIcon,
  RequestCheckIcon,
  RequestSlashIcon,
  SavingIcon,
} from '@assets/svg';
import Button from '@components/Button';
import { shiftToExcel } from '@libs/util/shiftToExcel';
import { event, sendEvent } from 'analytics';
import useEditShift from '@hooks/useEditShift';
import { Fragment, useState } from 'react';
import Draggable from 'react-draggable';
import ShiftBadge from '@components/ShiftBadge';

function Toolbar() {
  const {
    state: { month, shift, changeStatus },
    actions: { changeMonth },
  } = useEditShift();

  const [openInfo, setOpenInfo] = useState(false);

  return (
    <div className="sticky top-0 z-30 flex h-[6.125rem] w-full items-center bg-[#FDFCFE] pb-[.75rem] pl-[1.25rem] pt-[1.875rem]">
      <PrevIcon
        onClick={() => changeMonth('prev')}
        className="h-[1.875rem] w-[1.875rem] cursor-pointer"
      />
      <p className="mx-[.625rem] font-poppins text-2xl text-main-1">{month}월</p>
      <NextIcon
        onClick={() => changeMonth('next')}
        className="h-[1.875rem] w-[1.875rem] cursor-pointer"
      />
      <p className="ml-[1.25rem] font-apple text-[.875rem] text-main-1">
        기본 OFF {shift?.days.filter((x) => x.dayType !== 'workday').length}일
      </p>

      <Button
        type="outline"
        className="ml-[7rem] flex h-[2.5rem] w-[7.9375rem] items-center justify-center rounded-[3.125rem] border-[.0313rem] border-main-2 bg-main-4 text-base font-normal"
      >
        <PenIcon className="h-[1.5rem] w-[1.5rem] stroke-main-1" />
        설정 편집
      </Button>

      <InfoIcon
        className="ml-[1.25rem] h-[1.625rem] w-[1.625rem] cursor-pointer"
        onClick={() => setOpenInfo(!openInfo)}
      />
      {openInfo && (
        <Draggable>
          <div className="absolute left-[17.625rem] top-[5.5rem] z-30 flex h-[5.25rem] w-[29.125rem] flex-col rounded-[.625rem] bg-white shadow-shadow-1">
            <div className="flex h-[1.625rem] cursor-move items-center bg-sub-5 pl-[2.5rem]">
              <p className="bottom-0 font-apple text-[.875rem] text-sub-2.5">근무 유형 보기</p>
              <CancelIcon
                className="absolute right-[.5rem] h-[1.125rem] w-[1.125rem] cursor-pointer"
                onClick={() => setOpenInfo(false)}
              />
            </div>
            <div className="flex h-[3.625rem] items-center justify-center gap-[1.25rem]">
              {shift?.shiftTypes.map((shiftType, index) => (
                <div key={index} className="flex items-center gap-[.3125rem]">
                  <ShiftBadge key={index} shiftType={shiftType} />
                  <p className="font-apple text-[.875rem] text-sub-2">
                    {shiftType.name}({shiftType.shortName})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Draggable>
      )}

      <div className="ml-[3.125rem] flex gap-[.25rem]">
        <div className="flex h-[1.875rem] items-center gap-[.5rem] rounded-[.3125rem] border-[.0313rem] border-sub-4 bg-white px-[.625rem]">
          <div
            className={`relative h-[.875rem] w-[.875rem] rounded-[.1875rem] border-[.0806rem] border-[#FF0000] bg-[#ff000033]`}
          >
            <FaultDotIcon className="absolute right-[-0.1875rem] top-[-0.5rem] h-[.4rem] w-[.4rem]" />
          </div>
          <p className="font-apple text-[.75rem] text-sub-2">잘못된 근무</p>
        </div>
        <div className="flex h-[1.875rem] items-center gap-[.5rem] rounded-[.3125rem] border-[.0313rem] border-sub-4 bg-white px-[.625rem]">
          <div
            className={`relative h-[.875rem] w-[.875rem] rounded-[.1875rem] border-[.0806rem] border-[#06E738] bg-[#06e73833]`}
          >
            <RequestCheckIcon className="absolute right-[-0.1875rem] top-[-0.5rem] h-[.4rem] w-[.4rem]" />
          </div>
          <p className="font-apple text-[.75rem] text-sub-2">신청 근무 반영</p>
        </div>
        <div className="flex h-[1.875rem] items-center gap-[.5rem] rounded-[.3125rem] border-[.0313rem] border-sub-4 bg-white px-[.625rem]">
          <div
            className={`relative h-[.875rem] w-[.875rem] rounded-[.1875rem] border-[.0806rem] border-[#0027F4] bg-[#0027f433]`}
          >
            <RequestSlashIcon className="absolute right-[-0.1875rem] top-[-0.5rem] h-[.4rem] w-[.4rem]" />
          </div>
          <p className="font-apple text-[.75rem] text-sub-2">신청 근무 미반영</p>
        </div>
      </div>

      <div className="ml-auto flex gap-[.3125rem] font-apple text-[.875rem] text-sub-2.5">
        {changeStatus === 'loading' ? (
          <SavingIcon className="h-[1.25rem] w-[1.25rem]" />
        ) : (
          <SavingIcon className="h-[1.25rem] w-[1.25rem]" />
        )}
        {changeStatus === 'loading' ? '저장중' : '저장 완료'}
      </div>

      <div className="ml-[1.875rem] flex gap-[.625rem]">
        <HistoryBackIcon className="h-[1.625rem] w-[1.625rem]" />
        <HistoryNextIcon className="h-[1.625rem] w-[1.625rem]" />
      </div>

      <Button
        type="outline"
        className="ml-[3.25rem] h-[2.5rem] w-[10rem] border-[.0938rem] text-[1.25rem] font-normal"
        onClick={() => {
          shift && shiftToExcel(month, shift);
          sendEvent(event.clickExcelDownloadButton, 'excel download');
        }}
      >
        엑셀로 저장하기
      </Button>
    </div>
  );
}

export default Toolbar;
