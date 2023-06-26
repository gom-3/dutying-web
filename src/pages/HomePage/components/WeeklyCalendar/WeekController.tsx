import { NextIcon, PrevIcon } from '@assets/svg';
import 'index.css';

interface Props {
  date: string;
  onClickPrev: () => void;
  onClickNext: () => void;
}

const WeekController = ({ date, onClickPrev, onClickNext }: Props) => {
  return (
    <div className="flex w-[25rem] select-none items-center justify-between">
      <div className="flex font-poppins text-[2rem] font-medium text-main-1">
        {date.slice(0, 4)}
        <div className="ml-[1.25rem]">{date.slice(4)}</div>
      </div>
      <div className="flex">
        <PrevIcon className="cursor-pointer" onClick={onClickPrev} />
        <NextIcon className="ml-[1.875rem] cursor-pointer" onClick={onClickNext} />
      </div>
    </div>
  );
};

export default WeekController;
