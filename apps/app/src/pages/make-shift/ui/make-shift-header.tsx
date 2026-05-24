import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import {
    isMakeShiftMonthAtOrAfterNextCalendarMonth,
    isMakeShiftMonthAtOrBeforeThisCalendarMonth,
} from '@/shared/lib/shift-calendar-month-policy';
import {DutyManagementMonthTeamHeader} from '@/widgets/duty-management/ui';
import {useMakeShiftStore} from '../model/make-shift-store';

export function MakeShiftHeader() {
    const {t} = useTypedTranslation();
    const year = useMakeShiftStore((s) => s.year);
    const month = useMakeShiftStore((s) => s.month);
    const shiftTeams = useMakeShiftStore((s) => s.shiftTeams);
    const currentShiftTeamId = useMakeShiftStore((s) => s.currentShiftTeamId);
    const goPrevMonth = useMakeShiftStore((s) => s.goPrevMonth);
    const goNextMonth = useMakeShiftStore((s) => s.goNextMonth);
    const setCurrentShiftTeamId = useMakeShiftStore((s) => s.setCurrentShiftTeamId);
    const prevMonthDisabled = isMakeShiftMonthAtOrBeforeThisCalendarMonth(year, month);
    const nextMonthDisabled = isMakeShiftMonthAtOrAfterNextCalendarMonth(year, month);

    return (
        <DutyManagementMonthTeamHeader
            year={year}
            month={month}
            prevLabel={t('page.duty.prevMonth')}
            nextLabel={t('page.duty.nextMonth')}
            shiftTeams={shiftTeams}
            currentShiftTeamId={currentShiftTeamId}
            onPrevMonth={goPrevMonth}
            onNextMonth={goNextMonth}
            onSelectShiftTeam={setCurrentShiftTeamId}
            emptyLabel={t('page.makeShift.overview.noTeamsLabel')}
            formatMonthLabel={(headerYear, headerMonth) => t('page.duty.monthHeader', {year: headerYear, month: headerMonth})}
            prevMonthDisabled={prevMonthDisabled}
            nextMonthDisabled={nextMonthDisabled}
            teamTone="darkSegmented"
        />
    );
}
