import 'index.css';
import { duty } from '@mocks/duty/data';
import ShiftCircle from '@components/ShiftCircle';

const days = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
  weeks: Date[][];
  selectedWeek: Date[];
}

const MonthlyCalendarTable = ({ weeks, selectedWeek }: Props) => {
  let currentMonth: number;
  if (weeks.length > 0) {
    currentMonth = weeks[2][2].getMonth();
  }
  const shiftIndexList = duty.dutyRows[0].shiftIndexList;

  return (
    <table className="h-[24.375rem] w-full">
      <thead>
        <tr>
          {days.map((day) => (
            <th
              key={day}
              className="h-[1.75rem] w-[3.4375rem] font-apple text-[.75rem] font-normal text-main-2"
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week) => {
          let isSelectedWeek;
          if (selectedWeek) {
            isSelectedWeek =
              selectedWeek[0].getDate() === week[0].getDate() &&
              selectedWeek[0].getMonth() === week[0].getMonth() &&
              selectedWeek[0].getFullYear() === week[0].getFullYear();
          }

          return (
            <tr className={`${isSelectedWeek ? 'bg-sub-5' : ''}`} key={week[0].getDate()}>
              {week.map((day) => {
                const isCurrentMonth = currentMonth === day.getMonth();
                return (
                  <td
                    key={day.getDate()}
                    className="relative h-[4.125rem] w-[3.4375rem] border-t border-sub-4 "
                  >
                    <div className="absolute left-[.375rem] top-[.3125rem] font-poppins text-[.5625rem] font-light text-sub-3">
                      {day.getDate()}
                    </div>
                    <ShiftCircle
                      translucent={!isCurrentMonth}
                      id={shiftIndexList[day.getDate() - 1]}
                    />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MonthlyCalendarTable;
