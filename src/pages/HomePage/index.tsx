import 'index.css';
import MonthlyCalendar from './components/MonthlyCalendar';
import WeeklyGroupCalednar from './components/WeeklyGroupCanlendar';
import WeekController from './components/WeekController';
import useWeekCalendar from './components/useWeekCalendar';

const HomePage = () => {
  const { date, week, toPrevWeek, toNextWeek, dateArray } = useWeekCalendar();
  return (
    <div className="p-12">
      <div className="mb-[30px] flex font-apple text-[36px] font-normal">
        안녕하세요, <div className=" ml-2 font-medium">{'곰세마리'}님</div>
      </div>
      <WeekController date={week.string} onClickPrev={toPrevWeek} onClickNext={toNextWeek} />
      <div>
        <WeeklyGroupCalednar dateArray={dateArray} startDate={week.start} endDate={week.end} />
        <MonthlyCalendar />
      </div>
    </div>
  );
};

export default HomePage;
