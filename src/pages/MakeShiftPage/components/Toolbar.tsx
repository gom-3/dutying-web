import { Labels, NextIcon, PrevIcon } from '@assets/svg';
import Button from '@components/Button';
import { shiftToExcel } from '@libs/util/shiftToExcel';
import { mockShiftTypeList } from '@mocks/shift';
import { MutationStatus } from '@tanstack/react-query';

interface Props {
  shift: Shift | undefined;
  changeStatus: MutationStatus;
}

function Toolbar({ shift, changeStatus }: Props) {
  return (
    <div className="sticky top-0 flex h-[6.125rem] w-full items-center gap-[1.25rem] bg-[#FDFCFE] pt-[1.875rem]">
      <Labels className="absolute h-[2.25rem] w-[10.625rem]" />
      <div className="w-[3.375rem]"></div>
      <div className="w-[3.375rem]"></div>
      <div className="w-[1.875rem]"></div>
      <div className="w-[5.625rem]"></div>
      <div className="flex flex-1 items-center gap-[1.25rem]">
        <PrevIcon className="h-[1.875rem] w-[1.875rem] cursor-pointer" />
        {shift && <p className="font-poppins text-2xl text-main-1">{shift.month}월</p>}
        <NextIcon className="h-[1.875rem] w-[1.875rem] cursor-pointer" />
        <p className="font-apple text-[.875rem] text-main-1 ">
          기본 OFF {shift?.days.filter((x) => x.dayKind !== 'workday').length}일
        </p>
        <p className="font-apple text-[.875rem] text-sub-2 ">
          {changeStatus === 'loading' ? '저장 중...' : '저장 완료'}
        </p>
        <Button
          type="outline"
          className="ml-auto h-[2.5rem] w-[10rem] border-[.0938rem] text-[1.25rem] font-normal"
          onClick={() => shift && shiftToExcel(shift, mockShiftTypeList)}
        >
          엑셀로 저장하기
        </Button>
      </div>
    </div>
  );
}

export default Toolbar;
