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
    <div className="flex w-[28rem] select-none items-center justify-between">
      <div className="flex font-poppins text-[2rem] font-medium text-main-1">
        {week.string}
      </div>
      <div className="flex">
        <PrevIcon className="cursor-pointer" onClick={onClickPrev} />
        <NextIcon className="ml-[1.875rem] cursor-pointer" onClick={onClickNext} />
      </div>
    </div>
  );
};

export default WeekController;
