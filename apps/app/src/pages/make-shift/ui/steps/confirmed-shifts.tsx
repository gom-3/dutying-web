import {useQuery} from '@tanstack/react-query';
import {Component, useMemo, type ReactNode} from 'react';
import {type TShift} from '@/entities';
import {wardQueryOptions} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import {shiftToDoc, type TViolation} from '@/features/shift-editor';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import Button from '@/shared/ui/form-controls/Button';
import PageState from '@/shared/ui/PageState';
import {useMakeShiftStore} from '../../model/make-shift-store';
import {useMakeShiftUseCase} from '../../model/make-shift-use-case';
import {MAKE_SHIFT_STEP_NAV_BUTTON_CLASS} from '../make-shift-step-nav';
import {MakeShiftCalendar} from './shared/make-shift-calendar';

const EMPTY_VIOLATION_MAP: Map<string, TViolation> = new Map();

function toConfirmedDoc(shift: TShift | null | undefined, year: number, month: number) {
    if (!shift) return null;

    try {
        return shiftToDoc(shift, year, month);
    } catch {
        return null;
    }
}

export function ConfirmedShifts() {
    const {t} = useTypedTranslation();
    const {
        state: {wardId},
    } = useAuth();
    const year = useMakeShiftStore((s) => s.year);
    const month = useMakeShiftStore((s) => s.month);
    const shiftTeams = useMakeShiftStore((s) => s.shiftTeams);
    const currentShiftTeamId = useMakeShiftStore((s) => s.currentShiftTeamId);
    const confirmedShiftSnapshot = useMakeShiftStore((s) => s.confirmedShiftSnapshot);
    const useCase = useMakeShiftUseCase();
    const enabled = wardId !== null && currentShiftTeamId !== null;
    const dutyQuery = useQuery({
        ...wardQueryOptions.duty(wardId ?? -1, currentShiftTeamId ?? -1, year, month),
        enabled,
    });
    const teamName =
        shiftTeams.find((team) => team.shiftTeamId === currentShiftTeamId)?.name ?? t('page.makeShift.confirmedShifts.fallbackTeamName');
    const shift = dutyQuery.data ?? confirmedShiftSnapshot;
    const doc = useMemo(() => toConfirmedDoc(shift, year, month), [month, shift, year]);
    const calendarResetKey = `${wardId ?? 'none'}:${currentShiftTeamId ?? 'none'}:${year}:${month}:${shift ? 'ready' : 'empty'}`;

    return (
        <div id="make_confirmed_shifts_step" className="confirmed-shifts-root flex w-full min-w-0 flex-col gap-3 pt-3 outline-none">
            <div className="confirmed-shifts-toolbar flex w-full min-w-0 flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="confirmed-shifts-toolbar__title font-apple text-[28px] leading-tight font-bold text-sub-1">
                        {t('page.makeShift.confirmedShifts.title', {teamName, month})}
                    </h1>
                    <p className="confirmed-shifts-toolbar__hint mt-4 font-apple text-[16px] leading-[28px] font-medium text-gray-3">
                        {t('page.makeShift.confirmedShifts.hint')}
                    </p>
                </div>

                <div className="confirmed-shifts-toolbar__actions flex shrink-0 items-center gap-2 pt-0.5">
                    <Button
                        variant="secondary"
                        size="md"
                        type="button"
                        className={`cursor-pointer border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ${MAKE_SHIFT_STEP_NAV_BUTTON_CLASS}`}
                        onClick={useCase.editConfirmed}
                    >
                        {t('page.makeShift.confirmedShifts.editAction')}
                    </Button>
                </div>
            </div>

            {!shift && dutyQuery.isLoading && (
                <PageState
                    tone="loading"
                    title={t('page.makeShift.confirmedShifts.loading')}
                    description={t('page.state.loadingDescription')}
                />
            )}
            {!shift && dutyQuery.isError && (
                <PageState
                    tone="error"
                    title={t('page.makeShift.confirmedShifts.error')}
                    description={t('page.state.errorDescription')}
                    action={{label: t('page.state.retry'), onClick: () => void dutyQuery.refetch()}}
                />
            )}
            {shift && !doc && (
                <PageState
                    tone="error"
                    title={t('page.makeShift.confirmedShifts.error')}
                    description={t('page.state.errorDescription')}
                    action={{label: t('page.state.retry'), onClick: () => void dutyQuery.refetch()}}
                />
            )}
            {shift && doc && (
                <div className="confirmed-shifts-calendar-wrap w-full min-w-0">
                    <ConfirmedCalendarBoundary
                        resetKey={calendarResetKey}
                        fallback={
                            <PageState
                                tone="error"
                                title={t('page.makeShift.confirmedShifts.error')}
                                description={t('page.state.errorDescription')}
                                action={{label: t('page.state.retry'), onClick: () => void dutyQuery.refetch()}}
                            />
                        }
                    >
                        <MakeShiftCalendar
                            shift={shift}
                            doc={doc}
                            violationMap={EMPTY_VIOLATION_MAP}
                            showFaults={false}
                            readonly
                            disableInitialSelection
                        />
                    </ConfirmedCalendarBoundary>
                </div>
            )}
            {!dutyQuery.isLoading && !dutyQuery.isError && !shift && (
                <PageState tone="empty" title={t('page.makeShift.confirmedShifts.empty')} description={t('page.state.emptyDescription')} />
            )}
        </div>
    );
}

class ConfirmedCalendarBoundary extends Component<{children: ReactNode; fallback: ReactNode; resetKey: string}, {hasError: boolean}> {
    state = {hasError: false};

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidUpdate(prevProps: {resetKey: string}) {
        if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
            this.setState({hasError: false});
        }
    }

    render() {
        if (this.state.hasError) return this.props.fallback;

        return this.props.children;
    }
}
