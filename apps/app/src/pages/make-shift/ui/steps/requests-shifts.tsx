import {useEffect, useState} from 'react';
import {BouncingDots} from '@/components/loading-ui/bouncing-dots';
import useRequestShift from '@/features/request-shift';
import {useRequestShiftStore} from '@/features/request-shift/model/store';
import RequestCalendar from '@/pages/request-shift/ui/request-calendar';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import Button from '@/shared/ui/form-controls/Button';
import PageState from '@/shared/ui/PageState';
import {canGoNext, canGoPrev, useMakeShiftStore} from '../../model/make-shift-store';
import {useMakeShiftUseCase} from '../../model/make-shift-use-case';
import {MAKE_SHIFT_STEP_NAV_BUTTON_CLASS} from '../make-shift-step-nav';
import {useFlowTransitionFeedback} from '../use-flow-transition-feedback';

export function RequestsShifts() {
    const {t} = useTypedTranslation();
    const useCase = useMakeShiftUseCase();
    const {transitioning, runTransition} = useFlowTransitionFeedback();
    const canPrev = useMakeShiftStore((s) => canGoPrev(s));
    const canNext = useMakeShiftStore((s) => canGoNext(s));
    const makeYear = useMakeShiftStore((s) => s.year);
    const makeMonth = useMakeShiftStore((s) => s.month);
    const makeShiftTeamId = useMakeShiftStore((s) => s.currentShiftTeamId);
    const setRequestState = useRequestShiftStore((s) => s.setState);
    const [isRequestContextSynced, setIsRequestContextSynced] = useState(false);

    useEffect(() => {
        setIsRequestContextSynced(false);
        setRequestState('year', makeYear);
        setRequestState('month', makeMonth);
        setRequestState('currentShiftTeamId', makeShiftTeamId);
        setRequestState('focus', null);
        setIsRequestContextSynced(true);
    }, [makeMonth, makeShiftTeamId, makeYear, setRequestState]);

    const {
        state: {requestShift, shiftStatus, shiftTeams, shiftTeamsStatus, bootstrapStatus},
        actions: {retry, createNextMonthShift},
    } = useRequestShift(true);
    const shiftTeamCount = shiftTeams?.length ?? 0;
    const pageState =
        !isRequestContextSynced || bootstrapStatus === 'pending'
            ? {
                  tone: 'loading' as const,
                  title: t('page.request.overview.bootstrapLoadingTitle'),
                  description: t('page.request.overview.bootstrapLoadingDescription'),
              }
            : bootstrapStatus === 'error'
              ? {
                    tone: 'error' as const,
                    title: t('page.request.overview.bootstrapErrorTitle'),
                    description: t('page.request.overview.bootstrapErrorDescription'),
                    action: {label: t('page.state.retry'), onClick: () => void retry()},
                }
              : shiftTeamsStatus === 'pending'
                ? {
                      tone: 'loading' as const,
                      title: t('page.request.overview.loadingTitle'),
                      description: t('page.request.overview.loadingDescription'),
                  }
                : shiftTeamsStatus === 'error'
                  ? {
                        tone: 'error' as const,
                        title: t('page.request.overview.teamsErrorTitle'),
                        description: t('page.state.errorDescription'),
                        action: {label: t('page.state.retry'), onClick: () => void retry()},
                    }
                  : shiftTeamCount === 0
                    ? {
                          tone: 'empty' as const,
                          title: t('page.request.overview.noTeamsTitle'),
                          description: t('page.request.overview.noTeamsDescription'),
                      }
                    : shiftStatus === 'pending'
                      ? {
                            tone: 'loading' as const,
                            title: t('page.request.overview.shiftLoadingTitle'),
                            description: t('page.request.overview.shiftLoadingDescription'),
                        }
                      : shiftStatus === 'error'
                        ? {
                              tone: 'error' as const,
                              title: t('page.request.overview.shiftErrorTitle'),
                              description: t('page.state.errorDescription'),
                              action: {label: t('page.state.retry'), onClick: () => void retry()},
                          }
                        : !requestShift
                          ? {
                                tone: 'empty' as const,
                                title: t('page.request.overview.emptyTitle'),
                                description: t('page.request.overview.emptyDescription'),
                            }
                          : null;

    return (
        <div id="make_requests_step" className="make-shift-requests flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3">
                    <div className="min-w-0">
                        <h1 className="font-apple text-[28px] leading-tight font-bold text-sub-1">{t('page.makeShift.requests.title')}</h1>
                        <p className="mt-4 font-apple text-[16px] leading-[28px] font-medium text-gray-3">
                            {t('page.makeShift.requests.descriptionLine')}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <Button
                            variant="secondary"
                            size="md"
                            className={`make-shift-requests__nav-button cursor-pointer border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed ${MAKE_SHIFT_STEP_NAV_BUTTON_CLASS}`}
                            onClick={() => runTransition('prev', useCase.prev)}
                            disabled={!canPrev || transitioning !== null}
                            type="button"
                        >
                            {transitioning === 'prev' ? <BouncingDots className="w-5 shrink-0 text-main-1" /> : null}
                            {transitioning === 'prev' ? t('page.makeShift.navigation.moving') : t('page.makeShift.navigation.previous')}
                        </Button>
                        <Button
                            size="md"
                            className={`make-shift-requests__nav-button cursor-pointer border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed ${MAKE_SHIFT_STEP_NAV_BUTTON_CLASS}`}
                            onClick={() => runTransition('next', useCase.next)}
                            disabled={!canNext || transitioning !== null}
                            type="button"
                        >
                            {transitioning === 'next' ? <BouncingDots className="w-5 shrink-0 text-white" /> : null}
                            {transitioning === 'next' ? t('page.makeShift.navigation.moving') : t('page.makeShift.navigation.next')}
                        </Button>
                    </div>
                </div>

                {pageState ? (
                    <PageState {...pageState} loadingColor={pageState.tone === 'loading' ? 'purple' : undefined} className="py-0">
                        {pageState.tone === 'empty' && !requestShift && shiftTeamCount > 0 ? (
                            <div className="mt-1 flex justify-center">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="md"
                                    className="h-11 rounded-[14px] px-5 font-semibold"
                                    onClick={createNextMonthShift}
                                >
                                    {t('page.request.overview.createNextMonth')}
                                </Button>
                            </div>
                        ) : null}
                    </PageState>
                ) : (
                    <RequestCalendar defaultReviewMode="pending" />
                )}
            </div>
        </div>
    );
}
