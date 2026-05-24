import {type TRequestShift} from '@/entities/shift';
import {getDayBadgeClass} from './utils';

interface IRequestCalendarHeaderProps {
    days: TRequestShift['days'];
    focusDay: number | undefined;
    separateWeekendColor: boolean;
}

export default function RequestCalendarHeader({days, focusDay, separateWeekendColor}: IRequestCalendarHeaderProps) {
    return (
        <div className="sticky top-0 z-20 mb-1 flex h-8 w-full items-center bg-white pt-1">
            <div className="flex w-full items-center gap-2">
                <div className="w-[72px] shrink-0 pl-2 text-center font-apple text-[12px] font-semibold text-gray-4">이름</div>
                <div className="w-11 shrink-0 text-center font-apple text-[12px] font-semibold text-gray-4">숙련도</div>
                <div className="w-6 shrink-0 text-center font-apple text-[12px] font-semibold text-gray-4">연동</div>
                <div className="flex flex-1 rounded-[12px] bg-gray-7 px-1 py-0.5">
                    {days.map((day, index) => (
                        <p
                            key={day.day}
                            className={`min-w-0 flex-1 rounded-full text-center font-poppins text-[12px] leading-5 font-semibold ${getDayBadgeClass(
                                day.dayType,
                                index === focusDay,
                                separateWeekendColor,
                            )}`}
                        >
                            {day.day}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
