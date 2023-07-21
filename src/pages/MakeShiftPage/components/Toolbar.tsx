import { Labels, NextIcon, PrevIcon } from '@assets/svg';
import Button from '@components/Button';
import { shiftToExcel } from '@libs/util/shiftToExcel';
import { MutationStatus } from '@tanstack/react-query';

interface Props {
  month: number;
  shift: Shift | undefined;
  changeStatus: MutationStatus;
  changeMonth: MakeShiftPageActions['changeMonth'];
}

function Toolbar({ month, shift, changeStatus, changeMonth }: Props) {
  return (
    <div className="sticky top-0 z-10 flex h-[6.125rem] w-full items-center gap-[1.25rem] bg-[#FDFCFE] pt-[1.875rem]">
      <Labels className="absolute h-[2.25rem] w-[10.625rem]" />
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
        <Button
          type="outline"
          className="ml-auto h-[2.5rem] w-[10rem] border-[.0938rem] text-[1.25rem] font-normal"
          onClick={() => shift && shiftToExcel(month, shift)}
        >
          엑셀로 저장하기
        </Button>
      </div>
    </div>
  );
}

export default Toolbar;
