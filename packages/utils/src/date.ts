import {DateTime} from 'luxon';

export function getDaysInMonth(month?: number, year?: number) {
    const currentDate = new Date();

    month ??= currentDate.getMonth() + 1;
    month--;
    year ??= currentDate.getFullYear();

    const date = new Date(year, month, 1);
    const days = [];

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

export class DateUtil {
    public static locale: string = 'ko-KR';

    static setLocale(locale: string) {
        this.locale = locale;
    }

    static getDateString(date?: Date, format: string = 'yyyy-MM-dd'): string {
        return DateTime.fromJSDate(date ?? new Date())
            .setLocale(this.locale)
            .toFormat(format);
    }

    static getMonthStartAndEndDates(date?: Date): {startDate: string; endDate: string} {
        return {
            startDate: DateTime.fromJSDate(date ?? new Date())
                .setLocale(this.locale)
                .startOf('month')
                .toFormat('yyyy-MM-dd'),
            endDate: DateTime.fromJSDate(date ?? new Date())
                .setLocale(this.locale)
                .endOf('month')
                .toFormat('yyyy-MM-dd'),
        };
    }

    static getCalendarStartAndEndDate(date?: Date): {startDate: string; endDate: string} {
        const dt = DateTime.fromJSDate(date ?? new Date()).setLocale(this.locale);
        const monthStart = dt.startOf('month');
        const monthEnd = dt.endOf('month');
        const startDate = monthStart.weekday === 7 ? monthStart : monthStart.minus({days: monthStart.weekday});
        const endDate =
            monthEnd.weekday === 6
                ? monthEnd
                : monthEnd.weekday === 7
                  ? monthEnd.plus({days: 6})
                  : monthEnd.plus({days: 6 - monthEnd.weekday});

        return {
            startDate: startDate.toFormat('yyyy-MM-dd'),
            endDate: endDate.toFormat('yyyy-MM-dd'),
        };
    }
}
