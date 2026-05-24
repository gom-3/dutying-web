import {cn} from '@dutying/utils/style';
import {AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Loader2} from 'lucide-react';
import {events, sendEvent} from '@/analytics';
import useRequestShift from '@/features/request-shift';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';

function Toolbar() {
    const {t} = useTypedTranslation();
    const {
        state: {year, month, changeStatus, currentShiftTeam, shiftTeams, teamPendingRequestCountByTeamId, editAvailability},
        actions: {changeMonth, changeShiftTeam},
    } = useRequestShift();
    const isSaving = changeStatus === 'loading';
    const isSaved = changeStatus === 'success';
    const hasSaveError = changeStatus === 'error';
    const shiftTeamCount = shiftTeams?.length ?? 0;
    const shouldShowShiftTeamList = shiftTeamCount !== 1;
    const title = editAvailability.canEdit ? t('page.request.toolbar.editTitle') : t('page.request.toolbar.readonlyTitle', {month});
    const feedback = hasSaveError
        ? {
              tone: 'error' as const,
              message: t('page.request.toolbar.saveError'),
          }
        : isSaving
          ? {
                tone: 'info' as const,
                message: t('page.request.toolbar.savingDescription'),
            }
          : isSaved
            ? {
                  tone: 'success' as const,
                  message: t('page.request.toolbar.savedDescription'),
              }
            : {
                  tone: 'neutral' as const,
                  message: editAvailability.description,
              };
    const shouldShowFeedback = hasSaveError || isSaving || isSaved || !editAvailability.canEdit;
    const feedbackIcon =
        feedback.tone === 'error' ? (
            <AlertCircle className="h-3.5 w-3.5" />
        ) : feedback.tone === 'success' ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
        ) : isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : null;
    const feedbackClassName = cn(
        'inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 font-apple text-[12px] font-medium',
        feedback.tone === 'error'
            ? 'bg-[#FFF7F8] text-red'
            : feedback.tone === 'success'
              ? 'bg-[#F0FBF4] text-[#168A45]'
              : feedback.tone === 'info'
                ? 'bg-main-light text-main-1'
                : 'bg-gray-7 text-gray-3',
    );

    return (
        <div id="toolbar" className="mx-auto flex w-full max-w-none flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1 disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={() => {
                            if (!changeMonth('prev')) return;

                            sendEvent(events.requestPage.toolbar.changeMonth);
                        }}
                        disabled={isSaving}
                        aria-label={t('page.duty.prevMonth')}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <p className="min-w-[112px] text-center font-apple text-[20px] font-semibold text-sub-1">
                        {t('page.duty.monthHeader', {year, month})}
                    </p>
                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1 disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={() => {
                            if (!changeMonth('next')) return;

                            sendEvent(events.requestPage.toolbar.changeMonth);
                        }}
                        disabled={isSaving}
                        aria-label={t('page.duty.nextMonth')}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {shouldShowShiftTeamList ? (
                    <div
                        id="shift_team_list"
                        className="relative grid overflow-visible rounded-[12px] bg-[#3D4658] p-0.5"
                        style={{
                            gridTemplateColumns: `repeat(${Math.max(shiftTeamCount, 1)}, minmax(0, 1fr))`,
                        }}
                    >
                        <>
                            {(shiftTeams ?? []).map((team, teamIndex) => {
                                const selected = team.shiftTeamId === currentShiftTeam?.shiftTeamId;
                                const pendingCount = teamPendingRequestCountByTeamId?.[team.shiftTeamId] ?? 0;

                                return (
                                    <button
                                        key={team.shiftTeamId}
                                        type="button"
                                        className={cn(
                                            'relative h-8 min-w-[92px] overflow-visible rounded-[9px] px-3 font-apple text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                                            selected ? 'bg-white text-sub-1' : 'text-[#B8C0CF] hover:text-white',
                                        )}
                                        style={{
                                            zIndex: pendingCount > 0 ? 30 + (shiftTeamCount - teamIndex) : selected ? 10 : 0,
                                        }}
                                        disabled={isSaving}
                                        onClick={() => {
                                            const nextTeam = shiftTeams?.find((shiftTeam) => shiftTeam.shiftTeamId === team.shiftTeamId);

                                            if (!nextTeam) return;

                                            if (!changeShiftTeam(nextTeam)) return;

                                            sendEvent(events.requestPage.toolbar.changeShiftTeam);
                                        }}
                                    >
                                        {team.name}
                                        {pendingCount > 0 ? (
                                            <span className="pointer-events-none absolute -top-2 -right-2 z-50 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E97A84] px-1.5 font-poppins text-[11px] leading-none font-bold text-white">
                                                {pendingCount}
                                            </span>
                                        ) : null}
                                    </button>
                                );
                            })}

                            {shiftTeamCount === 0 ? (
                                <div className="px-3 py-1.5 font-apple text-[14px] font-medium text-[#AEB7C7]">
                                    {t('page.request.toolbar.noTeamsLabel')}
                                </div>
                            ) : null}
                        </>
                    </div>
                ) : null}
            </div>

            <div className="flex flex-col gap-2 py-3 md:flex-row md:items-end md:justify-between">
                <div className="min-w-0">
                    <h1 className="font-apple text-[30px] font-semibold text-sub-1">{title}</h1>
                    {shouldShowFeedback ? (
                        <p className={cn('mt-2', feedbackClassName)} aria-live="polite">
                            {feedbackIcon}
                            {feedback.message}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default Toolbar;
