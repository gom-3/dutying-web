import {useQueryClient} from '@tanstack/react-query';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import toast from 'react-hot-toast';
import {wardQueryOptions} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import {docToShift, docToWardShiftsDTO, useShiftEditorCommands, useShiftEditorStore} from '@/features/shift-editor';
import WardAPI from '@/shared/api/ward';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import PageState from '@/shared/ui/PageState';
import {canConfirmAiAutofill, type TAiAutofillStatus} from '../../../model/ai-autofill-state';
import {requestAiSchedule} from '../../../model/ai-schedule-provider';
import {useMakeShiftStore} from '../../../model/make-shift-store';
import {useMakeShiftUseCase} from '../../../model/make-shift-use-case';
import {MakeShiftCalendar} from '../shared/make-shift-calendar';
import {maskDutyDocNonFixedCells} from '../shared/mask-duty-doc-non-fixed';
import {useDutyEditorStep} from '../shared/use-duty-editor-step';
import {AiAutofillToolbar} from './ai-autofill-toolbar';

/**
 * AI 자동 채우기 — MakeShiftCalendar + 툴바. 가로 스크롤은 페이지(page-view)가 담당, 캘린더는 cqw 기반(스케일 없음).
 */
export function AiAutofill() {
    const {t} = useTypedTranslation();
    const queryClient = useQueryClient();
    const {
        state: {wardId},
    } = useAuth();
    const year = useMakeShiftStore((s) => s.year);
    const month = useMakeShiftStore((s) => s.month);
    const currentShiftTeamId = useMakeShiftStore((s) => s.currentShiftTeamId);
    const commands = useShiftEditorCommands();
    const editorDoc = useShiftEditorStore((s) => s.doc);
    const history = useShiftEditorStore((s) => s.history);
    const useCase = useMakeShiftUseCase();
    /** true: AI·기타로 채운 표 포함 전체 표시. false: 고정 근무 칸만 표시. */
    const [autoFillEnabled, setAutoFillEnabled] = useState(true);
    const [showFaults, setShowFaults] = useState(true);
    const [isWorking, setIsWorking] = useState(false);
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [aiStatus, setAiStatus] = useState<TAiAutofillStatus>('idle');
    const [hasCompletedAiFill, setHasCompletedAiFill] = useState(false);
    const resetAiStatus = useCallback(() => setAiStatus('idle'), []);
    const {
        dutyQuery,
        editorRef,
        editorDoc: hydratedDoc,
        onKeyDown,
        onPasteCapture,
        violationMap,
        teamViolations,
        focusEditor,
    } = useDutyEditorStep({onContextChanged: resetAiStatus});
    const aiRequestSeqRef = useRef(0);
    const currentAiContextRef = useRef({wardId, shiftTeamId: currentShiftTeamId, year, month});

    currentAiContextRef.current = {wardId, shiftTeamId: currentShiftTeamId, year, month};

    useEffect(() => {
        setHasCompletedAiFill(false);
    }, [wardId, currentShiftTeamId, year, month]);

    const calendarDoc = useMemo(
        () => (autoFillEnabled ? hydratedDoc : maskDutyDocNonFixedCells(hydratedDoc)),
        [autoFillEnabled, hydratedDoc],
    );
    const canConfirm =
        !isWorking &&
        !isAiGenerating &&
        !dutyQuery.isLoading &&
        !dutyQuery.isError &&
        Boolean(dutyQuery.data) &&
        canConfirmAiAutofill(aiStatus);
    const handleConfirm = async () => {
        if (!wardId || !dutyQuery.data || !canConfirm) return;

        setIsWorking(true);

        const progressToastId = 'make-shift-confirm-progress';

        toast.loading(t('page.makeShift.navigation.saving'), {id: progressToastId});

        try {
            const dto = docToWardShiftsDTO(editorDoc, dutyQuery.data);
            const nextShift = docToShift(editorDoc, dutyQuery.data);
            const queryKey = wardQueryOptions.duty(wardId, currentShiftTeamId ?? -1, year, month).queryKey;

            await WardAPI.updateShifts(wardId, dto);
            useCase.confirm(nextShift);
            queryClient.setQueryData(queryKey, nextShift);
            void queryClient.invalidateQueries({queryKey});
        } catch {
            toast.error(t('page.makeShift.aiRefill.saveFailed'));
        } finally {
            toast.dismiss(progressToastId);
            setIsWorking(false);
        }
    };
    const handleAiFill = async () => {
        if (wardId == null || currentShiftTeamId == null || isAiGenerating) return;

        const requestSeq = aiRequestSeqRef.current + 1;
        const requestContext = {wardId, shiftTeamId: currentShiftTeamId, year, month};

        aiRequestSeqRef.current = requestSeq;
        setIsAiGenerating(true);
        setAiStatus('loading');

        const progressToastId = 'make-shift-ai-fill-progress';

        toast.loading(t('page.makeShift.aiRefill.progressToast'), {id: progressToastId});

        try {
            const result = await requestAiSchedule({
                shiftTeamId: requestContext.shiftTeamId,
                year: requestContext.year,
                month: requestContext.month,
                doc: editorDoc,
            });

            if (aiRequestSeqRef.current !== requestSeq) return;

            const currentContext = currentAiContextRef.current;

            if (
                currentContext.wardId !== requestContext.wardId ||
                currentContext.shiftTeamId !== requestContext.shiftTeamId ||
                currentContext.year !== requestContext.year ||
                currentContext.month !== requestContext.month
            ) {
                resetAiStatus();

                return;
            }

            if (!result.ok) {
                setAiStatus('error');

                return;
            }

            commands.applySchedule(result.response.schedule, 'ai');
            commands.setScheduleValidationFromApi(result.response.validation, result.response.generation_id);
            setAiStatus('success');
            setHasCompletedAiFill(true);
        } finally {
            toast.dismiss(progressToastId);

            if (aiRequestSeqRef.current === requestSeq) {
                setIsAiGenerating(false);
            }
        }
    };

    return (
        <div
            id="make_ai_autofill_step"
            className="ai-autofill-root flex w-full min-w-0 flex-col gap-3 pt-3 outline-none"
            ref={editorRef}
            onKeyDown={onKeyDown}
            onPasteCapture={onPasteCapture}
            tabIndex={0}
        >
            <AiAutofillToolbar
                autoFillEnabled={autoFillEnabled}
                onToggleAutoFill={() => setAutoFillEnabled((prev) => !prev)}
                showFaults={showFaults}
                onToggleFaults={() => setShowFaults((prev) => !prev)}
                canUndo={history.past.length > 0}
                canRedo={history.future.length > 0}
                onUndo={() => commands.undo()}
                onRedo={() => commands.redo()}
                onAiFill={handleAiFill}
                isAiGenerating={isAiGenerating}
                aiStatus={aiStatus}
                hasCompletedAiFill={hasCompletedAiFill}
                onConfirm={handleConfirm}
                isConfirming={isWorking}
                canConfirm={canConfirm}
            />

            {dutyQuery.isLoading && (
                <PageState
                    tone="loading"
                    loadingColor="purple"
                    title={t('page.makeShift.aiRefill.loading')}
                    description={t('page.state.loadingDescription')}
                />
            )}
            {dutyQuery.isError && (
                <PageState
                    tone="error"
                    title={t('page.makeShift.aiRefill.error')}
                    description={t('page.state.errorDescription')}
                    action={{label: t('page.state.retry'), onClick: () => void dutyQuery.refetch()}}
                />
            )}
            {!dutyQuery.isLoading && !dutyQuery.isError && dutyQuery.data && (
                <MakeShiftCalendar
                    shift={dutyQuery.data}
                    doc={calendarDoc}
                    violationMap={violationMap}
                    teamViolations={teamViolations}
                    showFaults={showFaults}
                    onCellClick={focusEditor}
                />
            )}
            {!dutyQuery.isLoading && !dutyQuery.isError && !dutyQuery.data && (
                <PageState tone="empty" title={t('page.makeShift.aiRefill.empty')} description={t('page.state.emptyDescription')} />
            )}
        </div>
    );
}
