import {useQueryClient} from '@tanstack/react-query';
import {useCallback, useEffect, useMemo, useState} from 'react';
import toast from 'react-hot-toast';
import {BouncingDotsSlot} from '@/components/loading-ui/bouncing-dots';
import {wardQueryOptions} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import {docToFixedWardShiftsDTO, useShiftEditorStore} from '@/features/shift-editor';
import {type TViolation} from '@/features/shift-editor/model';
import {useRestLeavePolicy} from '@/pages/ward-settings/model/rest-leave-policy';
import WardAPI from '@/shared/api/ward';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import Button from '@/shared/ui/form-controls/Button';
import PageState from '@/shared/ui/PageState';
import {canGoNext, canGoPrev, useMakeShiftStore} from '../../model/make-shift-store';
import {useMakeShiftUseCase} from '../../model/make-shift-use-case';
import {useRestTargetAdjustment} from '../../model/rest-target-adjustment';
import {calculateRestCheckByShiftNurse} from '../../model/rest-target-days';
import {
    MAKE_SHIFT_STEP_HEADING_BLOCK_CLASS,
    MAKE_SHIFT_STEP_NAV_ACTIONS_CLASS,
    MAKE_SHIFT_STEP_SUBTITLE_CLASS,
    MAKE_SHIFT_STEP_TITLE_CLASS,
    MAKE_SHIFT_STEP_TOOLBAR_CLASS,
} from '../make-shift-step-layout';
import {MAKE_SHIFT_STEP_NAV_BUTTON_CLASS} from '../make-shift-step-nav';
import {useFlowTransitionFeedback} from '../use-flow-transition-feedback';
import {RestLeavePolicySummaryButton} from './rest-leave-policy-summary-card';
import {MakeShiftCalendar} from './shared/make-shift-calendar';
import {MakeShiftCalendarSkeleton} from './shared/make-shift-calendar-skeleton';
import {useDutyEditorStep} from './shared/use-duty-editor-step';
import {useMakeShiftSkillColumn} from './shared/use-make-shift-skill-column';

/**
 * 고정 근무 화면에서는 violation을 절대 표시하지 않으므로,
 * 매 렌더마다 새 Map을 만들지 않도록 모듈 스코프에서 한 번만 만들어 재사용한다.
 */
const EMPTY_VIOLATION_MAP: Map<string, TViolation> = new Map();

export function FixedShifts() {
    const {t} = useTypedTranslation();
    const queryClient = useQueryClient();
    const {
        state: {wardId},
    } = useAuth();
    const year = useMakeShiftStore((s) => s.year);
    const month = useMakeShiftStore((s) => s.month);
    const currentShiftTeamId = useMakeShiftStore((s) => s.currentShiftTeamId);
    const useCase = useMakeShiftUseCase();
    const {transitioning, runTransition} = useFlowTransitionFeedback();
    const setEditorMode = useShiftEditorStore((s) => s.setEditorMode);
    const editorMode = useShiftEditorStore((s) => s.editorMode);
    const setStepNavigationBusy = useMakeShiftStore((s) => s.setStepNavigationBusy);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setStepNavigationBusy(4, isSaving);

        return () => setStepNavigationBusy(4, false);
    }, [isSaving, setStepNavigationBusy]);

    useEffect(() => {
        if (editorMode !== 'fixed') {
            setEditorMode('fixed');
        }
    }, [editorMode, setEditorMode]);

    useEffect(() => {
        return () => setEditorMode('normal');
    }, [setEditorMode]);

    const canPrev = useMakeShiftStore((s) => canGoPrev(s));
    const canNext = useMakeShiftStore((s) => canGoNext(s));
    const handleClearSelectionCells = useCallback(
        ({key}: {key: 'Backspace' | 'Delete'}) => {
            if (key !== 'Backspace' || !canPrev || isSaving || transitioning !== null) return;

            runTransition('prev', useCase.prev);
        },
        [canPrev, isSaving, runTransition, transitioning, useCase.prev],
    );
    const {dutyQuery, editorDoc, editorRef, onKeyDown, onPasteCapture, focusEditor, isHydratingEditor} = useDutyEditorStep({
        hydratePreviousLastShifts: true,
        onClearSelectionCells: handleClearSelectionCells,
    });
    const skillColumn = useMakeShiftSkillColumn(dutyQuery.data);
    const {policy} = useRestLeavePolicy(wardId);
    const {adjustmentDays} = useRestTargetAdjustment({wardId, shiftTeamId: currentShiftTeamId, year, month});
    const handleNext = useCallback(async () => {
        if (!wardId || !dutyQuery.data || !canNext || isSaving) return;

        setIsSaving(true);

        const progressToastId = 'make-shift-fixed-shifts-save-progress';

        toast.loading(t('page.makeShift.navigation.saving'), {id: progressToastId});

        try {
            const dto = docToFixedWardShiftsDTO(editorDoc, dutyQuery.data);

            await WardAPI.updateShifts(wardId, dto);
            await queryClient.invalidateQueries({
                queryKey: wardQueryOptions.duty(wardId, currentShiftTeamId ?? -1, year, month).queryKey,
            });
            useCase.next();
        } catch {
            toast.error(t('page.makeShift.fixedShifts.saveFailed'));
        } finally {
            toast.dismiss(progressToastId);
            setIsSaving(false);
        }
    }, [wardId, dutyQuery.data, canNext, isSaving, editorDoc, queryClient, currentShiftTeamId, year, month, useCase, t]);
    const nextDisabled =
        wardId === null ||
        !canNext ||
        isSaving ||
        dutyQuery.isLoading ||
        isHydratingEditor ||
        dutyQuery.isError ||
        dutyQuery.data === undefined;
    /**
     * 고정 근무 화면에서는 fixedCells / requestCells 로 마킹된 셀만 보여준다.
     * (그 외 셀은 비워서 사용자가 "고정해야 할 부분"에만 집중하도록.)
     */
    const fixedOnlyDoc = useMemo(
        () => ({
            ...editorDoc,
            rows: editorDoc.rows.map((row) => ({
                ...row,
                cells: row.cells.map((cell, colIdx) => {
                    const date = editorDoc.columns[colIdx];

                    if (!date) return null;

                    const key = `${row.workerId}|${date}`;

                    return editorDoc.fixedCells[key] || editorDoc.requestCells[key] ? cell : null;
                }),
            })),
        }),
        [editorDoc],
    );
    const restCheckByShiftNurseId = useMemo(
        () =>
            dutyQuery.data
                ? calculateRestCheckByShiftNurse({
                      shift: dutyQuery.data,
                      doc: fixedOnlyDoc,
                      policy,
                      year,
                      month,
                      adjustmentDays,
                  })
                : undefined,
        [adjustmentDays, dutyQuery.data, fixedOnlyDoc, month, policy, year],
    );

    return (
        <div
            id="make_fixed_shifts_step"
            className="fixed-shifts-root flex w-full min-w-0 flex-col gap-3 pt-3 outline-none"
            ref={editorRef}
            onKeyDown={onKeyDown}
            onPasteCapture={onPasteCapture}
            tabIndex={0}
        >
            <div className={`fixed-shifts-toolbar ${MAKE_SHIFT_STEP_TOOLBAR_CLASS}`}>
                <div className={MAKE_SHIFT_STEP_HEADING_BLOCK_CLASS}>
                    <h1 className={`fixed-shifts-toolbar__title ${MAKE_SHIFT_STEP_TITLE_CLASS}`}>
                        {t('page.makeShift.fixedShifts.title')}
                    </h1>
                    <p className={`fixed-shifts-toolbar__hint ${MAKE_SHIFT_STEP_SUBTITLE_CLASS}`}>{t('page.makeShift.fixedShifts.hint')}</p>
                </div>

                <div className={`fixed-shifts-toolbar__actions ${MAKE_SHIFT_STEP_NAV_ACTIONS_CLASS}`}>
                    <Button
                        variant="secondary"
                        size="md"
                        type="button"
                        className={`cursor-pointer border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed ${MAKE_SHIFT_STEP_NAV_BUTTON_CLASS}`}
                        onClick={() => runTransition('prev', useCase.prev)}
                        disabled={!canPrev || isSaving || transitioning !== null}
                    >
                        <BouncingDotsSlot active={transitioning === 'prev'} className="w-5 shrink-0 text-main-1" />
                        {transitioning === 'prev' ? t('page.makeShift.navigation.moving') : t('page.makeShift.navigation.previous')}
                    </Button>
                    <Button
                        size="md"
                        type="button"
                        className={`cursor-pointer border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed ${MAKE_SHIFT_STEP_NAV_BUTTON_CLASS}`}
                        onClick={() => void handleNext()}
                        disabled={nextDisabled}
                    >
                        <BouncingDotsSlot active={isSaving} className="w-5 shrink-0 text-white" />
                        {isSaving ? t('page.makeShift.navigation.saving') : t('page.makeShift.navigation.next')}
                    </Button>
                </div>
            </div>

            {(dutyQuery.isLoading || isHydratingEditor) && (
                <MakeShiftCalendarSkeleton className="fixed-shifts-calendar-wrap" ariaLabel={t('page.makeShift.fixedShifts.loading')} />
            )}
            {dutyQuery.isError && (
                <PageState
                    tone="error"
                    title={t('page.makeShift.fixedShifts.error')}
                    description={t('page.state.errorDescription')}
                    action={{label: t('page.state.retry'), onClick: () => void dutyQuery.refetch()}}
                />
            )}
            {!dutyQuery.isLoading && !isHydratingEditor && !dutyQuery.isError && dutyQuery.data && (
                <div className="fixed-shifts-calendar-wrap w-full min-w-0">
                    <MakeShiftCalendar
                        shift={dutyQuery.data}
                        doc={fixedOnlyDoc}
                        // 고정 근무 화면에서는 위반(violation) 표시를 항상 끈다.
                        violationMap={EMPTY_VIOLATION_MAP}
                        showFaults={false}
                        tutorialCellId="make_fixed_shift_sample_cell"
                        onCellClick={focusEditor}
                        editableLastShifts
                        showCellStatusPins
                        skillColumn={skillColumn}
                        restCheckByShiftNurseId={restCheckByShiftNurseId}
                        restPolicyControl={
                            <RestLeavePolicySummaryButton wardId={wardId} shiftTeamId={currentShiftTeamId} year={year} month={month} />
                        }
                    />
                </div>
            )}
            {!dutyQuery.isLoading && !isHydratingEditor && !dutyQuery.isError && !dutyQuery.data && (
                <PageState tone="empty" title={t('page.makeShift.fixedShifts.empty')} description={t('page.state.emptyDescription')} />
            )}
        </div>
    );
}
