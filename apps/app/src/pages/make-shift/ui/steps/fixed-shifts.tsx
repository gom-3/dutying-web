import {useQueryClient} from '@tanstack/react-query';
import {useCallback, useEffect, useMemo, useState} from 'react';
import toast from 'react-hot-toast';
import {wardQueryOptions} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import {docToWardShiftsDTO, useShiftEditorStore} from '@/features/shift-editor';
import {type TViolation} from '@/features/shift-editor/model';
import WardAPI from '@/shared/api/ward';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import Button from '@/shared/ui/form-controls/Button';
import PageState from '@/shared/ui/PageState';
import {canGoNext, canGoPrev, useMakeShiftStore} from '../../model/make-shift-store';
import {useMakeShiftUseCase} from '../../model/make-shift-use-case';
import {MAKE_SHIFT_STEP_NAV_BUTTON_CLASS} from '../make-shift-step-nav';
import {MakeShiftCalendar} from './shared/make-shift-calendar';
import {useDutyEditorStep} from './shared/use-duty-editor-step';

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
    const setEditorMode = useShiftEditorStore((s) => s.setEditorMode);
    const editorMode = useShiftEditorStore((s) => s.editorMode);
    const [isSaving, setIsSaving] = useState(false);

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
    const {dutyQuery, editorDoc, editorRef, onKeyDown, onPasteCapture, focusEditor} = useDutyEditorStep();
    const handleNext = useCallback(async () => {
        if (!wardId || !dutyQuery.data || !canNext || isSaving) return;

        setIsSaving(true);

        try {
            const dto = docToWardShiftsDTO(editorDoc, dutyQuery.data);

            await WardAPI.updateShifts(wardId, dto);
            await queryClient.invalidateQueries({
                queryKey: wardQueryOptions.duty(wardId, currentShiftTeamId ?? -1, year, month).queryKey,
            });
            useCase.next();
        } catch {
            toast.error(t('page.makeShift.fixedShifts.saveFailed'));
        } finally {
            setIsSaving(false);
        }
    }, [wardId, dutyQuery.data, canNext, isSaving, editorDoc, queryClient, currentShiftTeamId, year, month, useCase, t]);
    const nextDisabled =
        wardId === null || !canNext || isSaving || dutyQuery.isLoading || dutyQuery.isError || dutyQuery.data === undefined;
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

    return (
        <div
            id="make_fixed_shifts_step"
            className="fixed-shifts-root flex w-full min-w-0 flex-col gap-3 pt-3 outline-none"
            ref={editorRef}
            onKeyDown={onKeyDown}
            onPasteCapture={onPasteCapture}
            tabIndex={0}
        >
            <div className="fixed-shifts-toolbar flex w-full min-w-0 flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="fixed-shifts-toolbar__title font-apple text-[28px] leading-tight font-bold whitespace-nowrap text-sub-1">
                        {t('page.makeShift.fixedShifts.title')}
                    </h1>
                    <p className="fixed-shifts-toolbar__hint mt-4 font-apple text-[16px] leading-[28px] font-medium text-gray-3">
                        {t('page.makeShift.fixedShifts.hint')}
                    </p>
                </div>

                <div className="fixed-shifts-toolbar__actions flex shrink-0 items-center gap-2 pt-0.5">
                    <Button
                        variant="secondary"
                        size="md"
                        type="button"
                        className={`cursor-pointer border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed ${MAKE_SHIFT_STEP_NAV_BUTTON_CLASS}`}
                        onClick={() => useCase.prev()}
                        disabled={!canPrev}
                    >
                        {t('page.makeShift.navigation.previous')}
                    </Button>
                    <Button
                        size="md"
                        type="button"
                        className={`cursor-pointer border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed ${MAKE_SHIFT_STEP_NAV_BUTTON_CLASS}`}
                        onClick={() => void handleNext()}
                        disabled={nextDisabled}
                    >
                        {isSaving ? t('page.makeShift.navigation.saving') : t('page.makeShift.navigation.next')}
                    </Button>
                </div>
            </div>

            {dutyQuery.isLoading && (
                <PageState
                    tone="loading"
                    title={t('page.makeShift.fixedShifts.loading')}
                    description={t('page.state.loadingDescription')}
                />
            )}
            {dutyQuery.isError && (
                <PageState
                    tone="error"
                    title={t('page.makeShift.fixedShifts.error')}
                    description={t('page.state.errorDescription')}
                    action={{label: t('page.state.retry'), onClick: () => void dutyQuery.refetch()}}
                />
            )}
            {!dutyQuery.isLoading && !dutyQuery.isError && dutyQuery.data && (
                <div className="fixed-shifts-calendar-wrap w-full min-w-0">
                    <MakeShiftCalendar
                        shift={dutyQuery.data}
                        doc={fixedOnlyDoc}
                        // 고정 근무 화면에서는 위반(violation) 표시를 항상 끈다.
                        violationMap={EMPTY_VIOLATION_MAP}
                        showFaults={false}
                        onCellClick={focusEditor}
                    />
                </div>
            )}
            {!dutyQuery.isLoading && !dutyQuery.isError && !dutyQuery.data && (
                <PageState tone="empty" title={t('page.makeShift.fixedShifts.empty')} description={t('page.state.emptyDescription')} />
            )}
        </div>
    );
}
