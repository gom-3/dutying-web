import 'index.css';
import Calendar from './Calendar';
import Controller from './Controller';
import { useState } from 'react';
import { nurses } from '@mocks/nurse';

interface Props {
  date: Date;
  week: Date[];
  weeks: Date[][];
  onClickNext: () => void;
  onClickPrev: () => void;
}

const MonthlyCalendar = ({ date, onClickNext, onClickPrev, weeks, week }: Props) => {
  const [nurse, setNurse] = useState(nurses[0]);

  const handleChangeNurse = (nurse: Nurse) => {
    setNurse(nurse);
  };

  return (
    <div className="relative ml-[2.0625rem] mt-[1.625rem] flex h-fit w-[26.875rem] flex-col items-center justify-center rounded-[1.25rem] p-[1.875rem] shadow-shadow-1">
      <div className="absolute right-[0.5rem] top-[-2.8125rem] font-poppins text-[1rem] font-light text-sub-3">
        월간 달력 • 개인
      </div>
      <Controller
        date={date}
        nurse={nurse}
        changeNurse={handleChangeNurse}
        toNextMonth={onClickNext}
        toPrevMonth={onClickPrev}
      />
      <Calendar weeks={weeks} selectedWeek={week} />
    </div>
  );
};

export default MonthlyCalendar;
