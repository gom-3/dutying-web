import 'index.css';
import MonthlyCalendar from './components/MonthlyCalendar/index';
import WeeklyCalendar from './components/WeeklyCalendar/index';
import WeekController from './components/WeeklyCalendar/Controller';
import useCalendar from './useCalendar';

const HomePage = () => {
  const { date, week, weeks, toPrevWeek, toNextWeek, toNextMonth, toPrevMonth, dateArray } =
    useCalendar();

  return (
    <div className="flex p-12">
      <div>
        <div className="mb-[1.875rem] flex font-apple text-[2.25rem] font-normal">
          안녕하세요, <div className=" ml-2 font-medium">{'곰세마리'}님</div>
        </div>
        <WeekController week={week} onClickPrev={toPrevWeek} onClickNext={toNextWeek} />
        <div className="flex">
          <WeeklyCalendar dateArray={dateArray} />
          <MonthlyCalendar
            date={date}
            week={dateArray}
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
