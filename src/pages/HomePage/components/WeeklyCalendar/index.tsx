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
    <div className="relative mt-[26px]">
      <div className="absolute right-0 top-[-45px] font-poppins text-[16px] font-light text-sub-3">
        Weekly • Group
      </div>
      <table
        className="border-collapse rounded-[20px] border-hidden shadow-shadow-1"
        ref={tableRef}
      >
        <thead className="rounded-[20px] bg-sub-5">
          <tr className="rounded-[20px]">
            {dateArray.map((date, i) => (
              <th
                className={`h-[143px] w-[170px] border-[0.5px] border-sub-4 font-poppins text-[40px] font-normal first:rounded-tl-[20px] last:rounded-tr-[20px] ${
                  areSameDate(today, date) ? 'text-sub-1' : 'text-sub-3'
                }`}
              >
                <div>{date.getDate()}</div>
                <div className="text-[16px] font-extralight">{days[i]}</div>
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
