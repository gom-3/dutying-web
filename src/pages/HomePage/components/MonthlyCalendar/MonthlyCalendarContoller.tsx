import { NextIcon2, PrevIcon2 } from '@assets/svg';
import 'index.css';

const MonthlyCalendarController = () => {
  return (
    <div className="flex w-full justify-between">
      <div className="item-center font-poppins text-2xl font-medium text-main-1">June</div>
      <div className="item-center flex">
        <PrevIcon2 className="mr-[1.25rem] cursor-pointer" />
        <NextIcon2 className="cursor-pointer" />
      </div>
    </div>
  );
};

export default MonthlyCalendarController;
