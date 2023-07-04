import { NextIcon, PrevIcon } from '@assets/svg';
import 'index.css';
import { Week } from './useWeekCalendar';

interface Props {
  week: Week;
  onClickPrev: () => void;
  onClickNext: () => void;
}

const WeekController = ({ week, onClickPrev, onClickNext }: Props) => {
  return (
    <div className="flex select-none items-center">
      <div className="flex font-poppins text-[2rem] font-medium text-main-1">
        {week.dates[0] ? week.dates[0].getFullYear() : 2023}
      </div>
      <PrevIcon className="ml-[2.8125rem] h-[2rem] w-[2rem] cursor-pointer" onClick={onClickPrev} />
      <div className="ml-[1.25rem] mr-[1.25rem] flex font-poppins text-[2rem] font-medium text-main-1">
        {week.string}
      </div>
      <NextIcon className=" h-[2rem] w-[2rem] cursor-pointer" onClick={onClickNext} />

    </div>
  );
};

export default WeekController;
