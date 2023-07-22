import { Labels, NextIcon, PrevIcon } from '@assets/svg';
import Button from '@components/Button';
import ShiftBadge from '@components/ShiftBadge';
import { shiftToExcel } from '@libs/util/shiftToExcel';
import { MutationStatus } from '@tanstack/react-query';
import { event, sendEvent } from 'analytics';

interface Props {
  month: number;
  shift: Shift | undefined;
  changeStatus: MutationStatus;
  changeMonth: MakeShiftPageActions['changeMonth'];
}

function Toolbar({ month, shift, changeStatus, changeMonth }: Props) {
  return (
    <div className="sticky top-0 z-20 flex h-[6.125rem] w-full items-center gap-[1.25rem] bg-[#FDFCFE] pt-[1.875rem]">
      <Labels className="absolute h-auto w-[15rem]" />
      <div className="w-[3.375rem]"></div>
      <div className="w-[3.375rem]"></div>
      <div className="w-[1.875rem]"></div>
      <div className="w-[5.625rem]"></div>
      <div className="flex flex-1 items-center gap-[1.25rem]">
        <PrevIcon
          onClick={() => changeMonth('prev')}
          className="h-[1.875rem] w-[1.875rem] cursor-pointer"
        />
        {shift && <p className="font-poppins text-2xl text-main-1">{month}월</p>}
        <NextIcon
          onClick={() => changeMonth('next')}
          className="h-[1.875rem] w-[1.875rem] cursor-pointer"
        />
        <p className="font-apple text-[.875rem] text-main-1 ">
          기본 OFF {shift?.days.filter((x) => x.dayType !== 'workday').length}일
        </p>
        <p className="font-apple text-[.875rem] text-sub-2 ">
          {changeStatus === 'loading' ? '저장 중...' : '저장 완료'}
        </p>
        <div className="flex gap-2 overflow-x-scroll scrollbar-hide">
          {shift?.shiftTypes.map((shiftType, index) => (
            <div className="flex shrink-0 items-center" key={index}>
              <ShiftBadge shiftType={shiftType} />
              <p className="ml-2 font-apple text-base text-sub-2">{shiftType.name}</p>
              <p className="font-apple text-base font-bold text-sub-2">({shiftType.shortName})</p>
            </div>
          ))}
        </div>

        <Button
          type="outline"
          className="ml-auto h-[2.5rem] w-[10rem] border-[.0938rem] text-[1.25rem] font-normal"
          onClick={() => {
            shift && shiftToExcel(month, shift);
            sendEvent(event.clickExcelDownloadButton, 'excel download');
          }}
        >
          엑셀로 저장하기
        </Button>
      </div>
    </div>
  );
}

export default Toolbar;
