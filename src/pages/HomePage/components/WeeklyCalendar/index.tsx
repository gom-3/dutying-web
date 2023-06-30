import 'index.css';
import { useRef } from 'react';
import WeeklyCalendarRow from './WeeklyCalendarRow';

interface Props {
  dateArray: Date[];
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WeeklyCalendar = ({ dateArray }: Props) => {
  const today = new Date();
  const tableRef = useRef(null);

  const areSameDate = (today: Date, date: Date) =>
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate();

  return (
    <div className="relative mt-[1.625rem]">
      <div className="absolute right-[0.5rem] top-[-2.8125rem] font-poppins text-[1rem] font-light text-sub-3">
        주간 달력 • 전체
      </div>
      <table
        className="border-collapse rounded-[1.25rem] border-hidden shadow-shadow-1"
        ref={tableRef}
      >
        <thead className="rounded-[1.25rem] bg-sub-5">
          <tr className="rounded-[1.25rem]">
            {dateArray.map((date, i) => (
              <th
                key={date.getDate()}
                className={`h-[8.9375rem] w-[10.625rem] border-[.0313rem] border-sub-4 font-poppins text-[2.5rem] font-normal first:rounded-tl-[1.25rem] last:rounded-tr-[1.25rem] ${
                  areSameDate(today, date) ? 'text-sub-1' : 'text-sub-3'
                }`}
              >
                <div>{date.getDate()}</div>
                <div className="text-[1rem] font-extralight">{days[i]}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <WeeklyCalendarRow
            dutyKind="day"
            today={today}
            dateArray={dateArray}
            areSameDate={areSameDate}
          />
          <WeeklyCalendarRow
            dutyKind="evening"
            today={today}
            dateArray={dateArray}
            areSameDate={areSameDate}
          />
          <WeeklyCalendarRow
            dutyKind="night"
            today={today}
            dateArray={dateArray}
            areSameDate={areSameDate}
          />
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyCalendar;
