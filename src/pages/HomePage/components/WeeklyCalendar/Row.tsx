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

const Row = ({ dutyKind, today, dateArray, areSameDate }: Props) => {
  const ref = useRef(null);

  return (
    <tr ref={ref}>
      {dateArray.map((date) => {
        const nurses = dutyByDate[date.getDate()] ? (
          dutyByDate[date.getDate()][dutyKind].map((n) => (
            <div key={n} className="mb-1 cursor-pointer hover:font-medium hover:text-main-1">
              {n}
            </div>
          ))
        ) : (
          <div>-</div>
        );
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
            {nurses}
          </td>
        );
      })}
    </tr>
  );
};

export default Row;
