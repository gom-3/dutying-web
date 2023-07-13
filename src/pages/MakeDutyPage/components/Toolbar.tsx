import { NextIcon, PrevIcon } from '@assets/svg';
import Button from '@components/Button';
import { dutyToExcel } from '@libs/util/dutyToExcel';
import { shiftList } from '@mocks/duty/data';

interface Props {
  duty: Duty;
}

function Toolbar({ duty }: Props) {
  return (
    <div className="sticky top-0 flex h-[6.125rem] w-full items-center gap-[1.25rem] bg-[#FDFCFE] pt-[1.875rem]">
      <div className="w-[3.375rem]"></div>
      <div className="w-[3.375rem]"></div>
      <div className="w-[1.875rem]"></div>
      <div className="w-[5.625rem]"></div>
      <div className="flex flex-1 items-center gap-[1.25rem]">
        <PrevIcon className="h-[1.875rem] w-[1.875rem] cursor-pointer" />
        <p className="font-poppins text-2xl text-main-1">{duty.month}월</p>
        <NextIcon className="h-[1.875rem] w-[1.875rem] cursor-pointer" />
      </div>

      <Button
        type="outline"
        className="h-[2.5rem] w-[4.6875rem] border-[.0938rem] text-[1.25rem] font-normal"
        onClick={() => dutyToExcel(duty, shiftList)}
      >
        엑셀로 저장하기
      </Button>
    </div>
  );
}

export default Toolbar;
