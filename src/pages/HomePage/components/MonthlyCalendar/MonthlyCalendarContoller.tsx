import { NextIcon2, PrevIcon2, SelectboxArrowIcon } from '@assets/svg';
import { nurses } from '@mocks/members/data';
import 'index.css';

interface Props {
  month: number;
  nurse: Nurse;
  changeNurse: (nurse: Nurse) => void;
  toNextMonth: () => void;
  toPrevMonth: () => void;
}

const MonthlyCalendarController = ({ nurse, month, toNextMonth, toPrevMonth }: Props) => {
  return (
    <div className="flex w-full justify-between">
      <div className="items-center flex">
        <PrevIcon2 onClick={toPrevMonth} className="cursor-pointer" />
        <div className="ml-[.9375rem] mr-[.9375rem] items-center font-poppins text-[1.5rem] font-medium text-main-1">
          {month + 1}월
        </div>
        <NextIcon2 onClick={toNextMonth} className="cursor-pointer" />
      </div>
      <div className="relative">
        <select
          style={{ lineHeight: 2.2 }}
          className="h-[2.1875rem] w-[10.1875rem] appearance-none rounded-[.625rem] border border-main-2 pl-[.9375rem] font-apple text-sub-2"
          name="간호사"
        >
          {nurses.map((n) => (
            <option selected={nurse.id === n.id}>{n.name}</option>
          ))}
        </select>
        <SelectboxArrowIcon className="absolute right-[.625rem] top-[.0625rem] h-[1.875rem] w-[1.875rem]" />
      </div>
    </div>
  );
};

export default MonthlyCalendarController;
