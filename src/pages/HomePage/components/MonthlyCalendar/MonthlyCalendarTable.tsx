import 'index.css';
import { duty } from '@mocks/duty/data';
import ShiftCircle from '@components/ShiftCircle';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthlyCalendarTable = () => {
  const first = new Date(2023, 5, 1);
  const last = new Date(2023, 6, 0);
  const prevLast = new Date(2023, 5, 0).getDate();
  const calendar = [];
  const shiftList = duty.dutyRows[0].shiftList;
  console.log(shiftList.length);

  for (let i = first.getDay() - 1; i >= 0; i--) {
    calendar.push(prevLast - i);
  }
  for (let i = 1; i <= last.getDate(); i++) {
    calendar.push(i);
  }
  for (let i = last.getDay(); i < 6; i++) {
    calendar.push(6 - i);
  }

  const weeks = [];
  while (calendar.length > 0) weeks.push(calendar.splice(0, 7));

  return (
    <table className="h-[390px] w-full">
      <thead>
        <tr>
          {days.map((day) => (
            <th className="h-[28px] w-[55px] font-poppins text-[10px] font-normal text-main-2">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week) => {
          return (
            <tr>
              {week.map((day) => {
                return (
                  <td className="relative h-[66px] w-[55px] border-t border-sub-4">
                    <div className="absolute left-[6px] top-[5px] font-poppins text-[9px] font-light text-sub-3">
                      {day}
                    </div>
                    <ShiftCircle isCurrent={true} id={shiftList[day - 1]} />
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
