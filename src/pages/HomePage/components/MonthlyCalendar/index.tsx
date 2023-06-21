import 'index.css';
import MonthlyCalendarTable from './MonthlyCalendarTable';
import MonthlyCalendarController from './MonthlyCalendarContoller';

const MonthlyCalendar = () => {
  return (
    <div className="ml-[33px] mt-[26px] flex h-[441px] w-[430px] flex-col items-center justify-center rounded-[20px] p-[30px] shadow-shadow-1">
      <MonthlyCalendarController />
      <MonthlyCalendarTable />
    </div>
  );
};

export default MonthlyCalendar;
