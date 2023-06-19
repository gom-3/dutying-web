import 'index.css';
import MonthlyCalendar from './components/MonthlyCalendar';
import WeeklyGroupCalednar from './components/WeeklyGroupCanlendar';
import WeekController from './components/WeekController';
import useWeekCalendar from './components/useWeekCalendar';

const HomePage = () => {
  const { date, week, toPrevWeek, toNextWeek } = useWeekCalendar();
  console.log(week);
  return (
    <div>
      <MonthlyCalendar />
      <WeekController date={week.string} onClickPrev={toPrevWeek} onClickNext={toNextWeek} />
      <WeeklyGroupCalednar />
    </div>
  );
};

export default HomePage;
