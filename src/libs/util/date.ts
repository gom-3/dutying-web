export function getDaysInMonth(month?: number, year?: number) {
  const currentDate = new Date();

  month = month || currentDate.getMonth();
  month--;
  year = year || currentDate.getFullYear();

  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
}

export function getDayName(date: Date) {
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = week[date.getDay()];
  return dayOfWeek;
}
