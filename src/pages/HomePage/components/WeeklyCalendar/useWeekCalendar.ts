/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

export interface Week {
  dates: Date[];
  string: string;
}

const useWeekCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [weeks, setWeeks] = useState<Date[][]>([]);
  const [week, setWeek] = useState<Week>({
    dates: [],
    string: '',
  });

  useEffect(() => {
    getCurrentMonth(date);
  }, [date]);

  /** 이번 주차를 찾는 함수. 미리 계산된 weeks에서 어떤 배열이 이번 주인지 찾는다 */
  const findCurrentWeek = (date: Date, weeks: Date[][]) => {
    if (weeks.length === 0) return;
    let week = weeks.find((week) => {
      const start = week[0];
      const end = new Date(week[week.length - 1]);
      end.setHours(23, 59, 59, 999);
      return start <= date && end >= date;
    });
    if (!week) week = weeks[0];

    let range = '';
    const startMonth = week[0].getMonth();
    const endMonth = week[6].getMonth();
    const startDate = week[0].getDate();
    const endDate = week[6].getDate();

    if (startMonth === endMonth) {
      range = startMonth + 1 + '월 ' + week[0].getDate() + '일' + ' - ' + week[6].getDate() + '일';
    } else {
      range =
        startMonth + 1 + '월 ' + startDate + '일' + ' - ' + (endMonth + 1) + '월 ' + endDate + '일';
    }

    setWeek({ dates: week, string: range });
  };

  const getCurrentMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(2023, month, 1);
    const last = new Date(2023, month + 1, 0);
    const calendar = [];

    for (let i = first.getDay() - 1; i >= 0; i--) {
      calendar.push(new Date(year, month, -i));
    }
    for (let i = 1; i <= last.getDate(); i++) {
      calendar.push(new Date(year, month, i));
    }
    for (let i = last.getDay(), j = 1; i < 6; i++, j++) {
      calendar.push(new Date(year, month + 1, j));
    }
    const weeks = [];
    while (calendar.length > 0) weeks.push(calendar.splice(0, 7));
    setWeeks(weeks);
    findCurrentWeek(date, weeks);
  };

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

  const toNextMonth = () => {
    const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    setDate(nextDate);
  };

  const toPrevMonth = () => {
    const prevDate = new Date(date.getFullYear(), date.getMonth(), 0);
    setDate(prevDate);
  };

  const dateArray = [];
  for (let d = new Date(week.dates[0]); d <= week.dates[6]; d.setDate(d.getDate() + 1)) {
    dateArray.push(new Date(d));
  }

  return {
    date,
    week,
    weeks,
    toPrevWeek,
    toNextWeek,
    toNextMonth,
    toPrevMonth,
    dateArray,
  };
};

export default useWeekCalendar;
