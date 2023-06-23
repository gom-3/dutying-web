import 'index.css';
import MonthlyCalendar from './components/MonthlyCalendar/index';
import WeeklyGroupCaledndar from './components/WeeklyCalendar/index';
import WeekController from './components/WeeklyCalendar/WeekController';
import useWeekCalendar from './components/WeeklyCalendar/useWeekCalendar';

const HomePage = () => {
  const { date, week, toPrevWeek, toNextWeek, dateArray } = useWeekCalendar();

  console.log(date);
  return (
    <div className="flex p-12">
      <div>
        <div className="mb-[30px] flex font-apple text-[36px] font-normal">
          안녕하세요, <div className=" ml-2 font-medium">{'곰세마리'}님</div>
        </div>
        <WeekController date={week.string} onClickPrev={toPrevWeek} onClickNext={toNextWeek} />
        <div className="flex">
          <WeeklyGroupCaledndar dateArray={dateArray} />
          <MonthlyCalendar />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default HomePage;
