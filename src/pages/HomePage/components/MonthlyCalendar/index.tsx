import 'index.css';
import MonthlyCalendarTable from './MonthlyCalendarTable';
import MonthlyCalendarController from './MonthlyCalendarContoller';
import { useState } from 'react';
import { nurses } from '@mocks/members/data';

const MonthlyCalendar = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [nurse, setNurse] = useState(nurses[0]);

  const toNextMonth = () => {
    if (month >= 11) setMonth(0);
    else setMonth(month + 1);
  };

  const toPrevMonth = () => {
    if (month <= 0) setMonth(11);
    else setMonth(month - 1);
  };

  const handleChangeNurse = (nurse:Nurse) => {
    setNurse(nurse);
  };

  return (
    <div className="ml-[2.0625rem] mt-[1.625rem] h-fit flex w-[26.875rem] flex-col items-center justify-center rounded-[1.25rem] p-[1.875rem] shadow-shadow-1">
      <MonthlyCalendarController
        month={month}
        nurse={nurse}
        changeNurse={handleChangeNurse}
        toNextMonth={toNextMonth}
        toPrevMonth={toPrevMonth}
      />
      <MonthlyCalendarTable month={month} />
    </div>
  );
};

export default MonthlyCalendar;
