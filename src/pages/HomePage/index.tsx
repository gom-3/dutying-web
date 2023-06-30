import 'index.css';
import MonthlyCalendar from './components/MonthlyCalendar/index';
import WeeklyGroupCaledndar from './components/WeeklyCalendar/index';
import WeekController from './components/WeeklyCalendar/WeekController';
import useWeekCalendar from './components/WeeklyCalendar/useWeekCalendar';

const HomePage = () => {
  const { date, week, weeks, toPrevWeek, toNextWeek, toNextMonth, toPrevMonth, dateArray } =
    useWeekCalendar();

  return (
    <div className="flex p-12">
      <div>
        <div className="mb-[1.875rem] flex font-apple text-[2.25rem] font-normal">
          안녕하세요, <div className=" ml-2 font-medium">{'곰세마리'}님</div>
        </div>
        <WeekController week={week} onClickPrev={toPrevWeek} onClickNext={toNextWeek} />
        <div className="flex">
          <WeeklyGroupCaledndar dateArray={dateArray} />
          <MonthlyCalendar
            date={date}
            weeks={weeks}
            onClickPrev={toPrevMonth}
            onClickNext={toNextMonth}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
