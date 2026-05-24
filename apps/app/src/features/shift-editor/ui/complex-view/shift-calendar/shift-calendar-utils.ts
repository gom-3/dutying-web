import {type TShift} from '@/entities';

export function getWeekendCellBg(dayType: TShift['days'][number]['dayType'], separateWeekendColor: boolean): string {
    if (dayType === 'sunday' || dayType === 'holiday') return 'bg-[#FFE1E680]';

    if (dayType === 'saturday') return separateWeekendColor ? 'bg-[#E1E5FF80]' : 'bg-[#FFE1E680]';

    return '';
}
