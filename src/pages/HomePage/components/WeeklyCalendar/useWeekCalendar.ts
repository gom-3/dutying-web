import { useState, useEffect } from 'react';

export interface Week {
  start: Date;
  end: Date;
  string: string;
}

const useWeekCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [week, setWeek] = useState<Week>({
    start: new Date(),
    end: new Date(),
    string: '',
  });
  const getCurrentWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;

    const start = new Date(date.getFullYear(), date.getMonth(), diff);
    const startDate = start.getDate();
    const startMonth = start.getMonth();
    const end = new Date(date.getFullYear(), date.getMonth(), diff + 6);
    const endDate = end.getDate();
    const endMonth = end.getMonth();

    let range = '';
    if (startMonth === endMonth) {
      range = startMonth + 1 + '월 ' + start.getDate() + '일' + ' - ' + end.getDate() + '일';
    } else {
      range =
        startMonth + 1 + '월 ' + startDate + '일' + ' - ' + (endMonth + 1) + '월 ' + endDate + '일';
    }
    setWeek({ start, end, string: range });
  };

  useEffect(() => {
    getCurrentWeek(date);
  }, [date]);

  const toPrevWeek = () => {
    const diff = date.getDate() - 7;
    const prevDate = new Date(date.getFullYear(), date.getMonth(), diff);
    setDate(prevDate);
  };

  const toNextWeek = () => {
    const diff = date.getDate() + 7;
    const nextDate = new Date(date.getFullYear(), date.getMonth(), diff);
    setDate(nextDate);
  };

  const dateArray = [];
  for (let d = new Date(week.start); d <= week.end; d.setDate(d.getDate() + 1)) {
    dateArray.push(new Date(d));
  }

  return { date, week, toPrevWeek, toNextWeek, dateArray };
};

export default useWeekCalendar;
