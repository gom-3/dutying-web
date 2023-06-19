import { useState, useEffect } from 'react';

interface Week {
  start: Date;
  end: Date;
  string: string;
}

const useWeekCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [week, setWeek] = useState<Week>({ start: new Date(), end: new Date(), string: '' });
  const getCurrentWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;

    const startOfWeek = new Date(date.getFullYear(), date.getMonth(), diff);
    const monthOfStart = startOfWeek.getMonth();
    const endOfWeek = new Date(date.getFullYear(), date.getMonth(), diff + 6);
    const monthOfEnd = endOfWeek.getMonth();
    let rangeString = '';
    if (monthOfStart === monthOfEnd) {
      rangeString =
        startOfWeek.toDateString().slice(4, 10) + ' - ' + endOfWeek.toDateString().slice(8, 10);
    } else {
      rangeString =
        startOfWeek.toDateString().slice(4, 10) + ' - ' + endOfWeek.toDateString().slice(4, 10);
    }
    setWeek({ start: startOfWeek, end: endOfWeek, string: rangeString });
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

  return { date, week, toPrevWeek, toNextWeek };
};

export default useWeekCalendar;
