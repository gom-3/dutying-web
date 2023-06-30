import 'index.css';
import { dutyByDate } from '@mocks/duty/data';
import { useRef } from 'react';

interface Props {
  today: Date;
  dateArray: Date[];
  areSameDate: (today: Date, date: Date) => boolean;
  dutyKind: 'day' | 'evening' | 'night';
}

interface Color {
  [key: string]: string;
}
const color: Color = { day: 'bg-day', evening: 'bg-evening', night: 'bg-night' };
const bgColor: Color = { day: 'bg-day/10', evening: 'bg-evening/10', night: 'bg-night/10' };

const WeeklyCalendarRow = ({ dutyKind, today, dateArray, areSameDate }: Props) => {
  const ref = useRef(null);

  return (
    <tr ref={ref}>
      {dateArray.map((date) => {
        return (
          <td
            key={date.getDate()}
            className={`relative border-[.0313rem] ${
              areSameDate(today, date) ? `${bgColor[dutyKind]} text-sub-1` : 'text-sub-2.5'
            } border-sub-4 p-[1.25rem] text-center font-apple text-[1.25rem] font-normal `}
          >
            {ref.current && areSameDate(today, date) && (
              <div
                className={`${color[dutyKind]} absolute left-0 top-0 h-full w-[.375rem] translate-x-[-50%] rounded-2xl`}
              />
            )}
            {dutyByDate[date.getDate()][dutyKind].map((n) => (
              <div key={n} className="cursor-pointer mb-1 hover:text-main-1 hover:font-medium">{n}</div>
            ))}
          </td>
        );
      })}
    </tr>
  );
};

export default WeeklyCalendarRow;
