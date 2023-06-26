import 'index.css';
import MonthlyCalendarTable from './MonthlyCalendarTable';
import MonthlyCalendarController from './MonthlyCalendarContoller';

const MonthlyCalendar = () => {
  return (
    <div className="ml-[2.0625rem] mt-[1.625rem] flex h-[27.5625rem] w-[26.875rem] flex-col items-center justify-center rounded-[1.25rem] p-[1.875rem] shadow-shadow-1">
      <MonthlyCalendarController />
      <MonthlyCalendarTable />
    </div>
  );
};

export default MonthlyCalendar;
