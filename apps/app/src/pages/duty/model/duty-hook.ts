import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router';
import {wardQueryOptions} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import useLoadingUseCase from '@/features/loading';
import {
    buildWorkKeyMap,
    docToWardShiftsDTO,
    isDutyShiftWithoutAssignments,
    shiftToDoc,
    useShiftEditorCommands,
    useShiftEditorKeyBindings,
    useShiftExcelExport,
    useShiftEditorStore,
} from '@/features/shift-editor';
import WardAPI from '@/shared/api/ward';
import {
    isDutyAtMaxFutureMonth,
    isDutyCalendarViewAllowed,
    isDutyPastStrictlyBeforeLastMonth,
    isDutyViewingThisCalendarMonth,
} from './duty-month-policy';
import {buildMakeShiftPath, getNextYearMonth} from './duty-navigation';
import {useDutyStore} from './duty-store';

function parsePositiveInt(raw: string | null): number | null {
    if (!raw) return null;

    const n = Number(raw);

    return Number.isInteger(n) && n > 0 ? n : null;
}

function cloneDoc(doc: TDutyDoc): TDutyDoc {
    return {
        columns: [...doc.columns],
        rows: doc.rows.map((row) => ({
            workerId: row.workerId,
            cells: [...row.cells],
        })),
        workerMeta: Object.fromEntries(Object.entries(doc.workerMeta).map(([workerId, meta]) => [workerId, {...meta}])),
        fixedCells: {...doc.fixedCells},
        requestCells: {...doc.requestCells},
    };
}

const EMPTY_DUTY_DOC: TDutyDoc = {
    columns: [],
    rows: [],
    workerMeta: {},
    fixedCells: {},
    requestCells: {},
};
const ONBOARDING_WARD_CREATED_SEARCH_PARAM = 'onboardingWardCreated';

export function useDutyHook() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        state: {wardId, isAuth, _loaded, accountMeStatus},
        actions: {handleGetAccountMe},
    } = useAuth();
    const {setLoading} = useLoadingUseCase();
    const year = useDutyStore((s) => s.year);
    const month = useDutyStore((s) => s.month);
    const shiftTeams = useDutyStore((s) => s.shiftTeams);
    const currentShiftTeamId = useDutyStore((s) => s.currentShiftTeamId);
    const readonly = useDutyStore((s) => s.readonly);
    const shift = useDutyStore((s) => s.shift);
    const status = useDutyStore((s) => s.status);
    const setYearMonth = useDutyStore((s) => s.setYearMonth);
    const goPrevMonth = useDutyStore((s) => s.goPrevMonth);
    const goNextMonth = useDutyStore((s) => s.goNextMonth);
    const setShiftTeams = useDutyStore((s) => s.setShiftTeams);
    const setCurrentShiftTeamId = useDutyStore((s) => s.setCurrentShiftTeamId);
    const setReadonly = useDutyStore((s) => s.setReadonly);
    const setShift = useDutyStore((s) => s.setShift);
    const setStatus = useDutyStore((s) => s.setStatus);
    const commands = useShiftEditorCommands();
    const doc = useShiftEditorStore((s) => s.doc);
    const editorRef = useRef<HTMLDivElement>(null);
    const snapshotRef = useRef<TDutyDoc | null>(null);
    const isDutyViewAllowed = isDutyCalendarViewAllowed(year, month);
    const dutyAtMaxFutureMonth = isDutyAtMaxFutureMonth(year, month);
    const dutyViewingThisCalendarMonth = isDutyViewingThisCalendarMonth(year, month);
    const dutyPastStrictlyBeforeLastMonth = isDutyPastStrictlyBeforeLastMonth(year, month);
    const dutyQueryKey = wardQueryOptions.duty(wardId ?? -1, currentShiftTeamId ?? -1, year, month).queryKey;
    const queryYear = useMemo(() => parsePositiveInt(searchParams.get('year')), [searchParams]);
    const queryMonth = useMemo(() => parsePositiveInt(searchParams.get('month')), [searchParams]);
    const queryShiftTeamId = useMemo(() => parsePositiveInt(searchParams.get('shiftTeamId')), [searchParams]);
    const [showOnboardingWardCreatedModal, setShowOnboardingWardCreatedModal] = useState(false);

    // URL 맥락(연·월·팀)으로 들어올 때마다 보기 전용. (다른 화면에서 수정 모드로 나갔다 와도 편집 모드가 유지되지 않게)
    useEffect(() => {
        setReadonly(true);
    }, [wardId, queryYear, queryMonth, queryShiftTeamId, setReadonly]);

    const bootstrapStatus =
        !_loaded || (isAuth && wardId === null && (accountMeStatus === 'idle' || accountMeStatus === 'loading'))
            ? 'pending'
            : isAuth && wardId === null && accountMeStatus === 'error'
              ? 'error'
              : 'success';
    const shiftTeamsQuery = useQuery({
        ...wardQueryOptions.shiftTeams(wardId ?? -1),
        enabled: wardId !== null,
        staleTime: 1000 * 60 * 5,
    });
    const wardQuery = useQuery({
        ...wardQueryOptions.id(wardId ?? -1),
        enabled: wardId !== null,
        staleTime: 1000 * 60 * 5,
    });
    const dutyQuery = useQuery({
        ...wardQueryOptions.duty(wardId ?? -1, currentShiftTeamId ?? -1, year, month),
        enabled: wardId !== null && currentShiftTeamId !== null && isDutyViewAllowed,
        refetchOnWindowFocus: false,
    });
    const workKeyMap = useMemo(() => buildWorkKeyMap(shift ?? undefined), [shift]);
    const {onKeyDown, onPasteCapture} = useShiftEditorKeyBindings({workKeyMap});
    const {isExporting: isExportingExcel, exportExcel} = useShiftExcelExport({
        month,
        shift,
        disabled: !shift,
    });
    const currentShiftTeamName = shiftTeams.find((team) => team.shiftTeamId === currentShiftTeamId)?.name ?? '선택한 팀';
    const shiftTeamsStatus = shiftTeamsQuery.isPending ? 'pending' : shiftTeamsQuery.isError ? 'error' : 'success';

    useEffect(() => {
        if (!queryYear || !queryMonth) return;

        setYearMonth({year: queryYear, month: queryMonth});
    }, [queryMonth, queryYear, setYearMonth]);

    useEffect(() => {
        if (searchParams.get(ONBOARDING_WARD_CREATED_SEARCH_PARAM) !== '1') {
            return;
        }

        setShowOnboardingWardCreatedModal(true);

        const nextSearchParams = new URLSearchParams(searchParams);

        nextSearchParams.delete(ONBOARDING_WARD_CREATED_SEARCH_PARAM);
        setSearchParams(nextSearchParams, {replace: true});
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        if (!shiftTeamsQuery.data) return;

        setShiftTeams(shiftTeamsQuery.data);

        const prevSelectedId = useDutyStore.getState().currentShiftTeamId;
        const hasPrevSelected = prevSelectedId !== null && shiftTeamsQuery.data.some((team) => team.shiftTeamId === prevSelectedId);
        const hasQuerySelected = queryShiftTeamId !== null && shiftTeamsQuery.data.some((team) => team.shiftTeamId === queryShiftTeamId);
        const firstTeamId = shiftTeamsQuery.data[0]?.shiftTeamId ?? null;
        const nextTeamId = hasQuerySelected ? queryShiftTeamId : hasPrevSelected ? prevSelectedId : firstTeamId;

        setCurrentShiftTeamId(nextTeamId);
    }, [queryShiftTeamId, setCurrentShiftTeamId, setShiftTeams, shiftTeamsQuery.data]);

    useEffect(() => {
        if (!isDutyViewAllowed) {
            setStatus('success');
            setShift(null);
            commands.init(EMPTY_DUTY_DOC);
            commands.discardPersisted();

            return;
        }

        if (dutyQuery.isPending) {
            setStatus('pending');

            return;
        }

        if (dutyQuery.isError) {
            setStatus('error');
            setShift(null);
            commands.init(EMPTY_DUTY_DOC);
            commands.discardPersisted();

            return;
        }

        setStatus('success');

        const rawShift = dutyQuery.data ?? null;
        const nextShift =
            rawShift != null && !isDutyShiftWithoutAssignments(rawShift) ? rawShift : null;

        setShift(nextShift);

        if (!nextShift) {
            commands.init(EMPTY_DUTY_DOC);
            commands.discardPersisted();

            return;
        }

        commands.init(shiftToDoc(nextShift, year, month));
        commands.discardPersisted();
    }, [
        commands,
        dutyQuery.data,
        dutyQuery.isError,
        dutyQuery.isPending,
        isDutyViewAllowed,
        month,
        setShift,
        setStatus,
        year,
    ]);

    // 확정 근무표(/duty)에서는 규칙 검증·위반 UI를 쓰지 않는다(만들기 플로우 전용).
    useEffect(() => {
        commands.setDutyValidationInput(null);
    }, [commands]);

    const handleGoPrevMonth = () => {
        goPrevMonth();
        setReadonly(true);
    };
    const handleGoNextMonth = () => {
        if (dutyAtMaxFutureMonth) return;

        goNextMonth();
        setReadonly(true);
    };
    const handleSelectShiftTeam = (shiftTeamId: number) => {
        setCurrentShiftTeamId(shiftTeamId);
        setReadonly(true);
    };
    const handleEnableEdit = () => {
        snapshotRef.current = cloneDoc(doc);
        setReadonly(false);
        editorRef.current?.focus();
    };
    const handleSaveEdit = async () => {
        if (!wardId || !shift) return;

        setLoading(true);

        try {
            const dto = docToWardShiftsDTO(doc, shift);

            await WardAPI.updateShifts(wardId, dto);
            snapshotRef.current = null;
            setReadonly(true);
            commands.discardPersisted();
            await queryClient.invalidateQueries({queryKey: dutyQueryKey});
        } finally {
            setLoading(false);
        }
    };
    const handleCancelEdit = () => {
        if (snapshotRef.current) {
            commands.init(snapshotRef.current);
        }

        commands.discardPersisted();
        snapshotRef.current = null;
        setReadonly(true);
    };
    const navigateToMakeShift = (targetYear: number, targetMonth: number) => {
        navigate(buildMakeShiftPath({year: targetYear, month: targetMonth, shiftTeamId: currentShiftTeamId}));
    };
    const handleGoCurrentMonthMake = () => {
        navigateToMakeShift(year, month);
    };
    const handleGoNextMonthMake = () => {
        const {year: nextYear, month: nextMonth} = getNextYearMonth(year, month);

        navigateToMakeShift(nextYear, nextMonth);
    };
    const handleDismissOnboardingWardCreatedModal = () => {
        setShowOnboardingWardCreatedModal(false);
    };
    const handleStartNextMonthMakeFromOnboarding = () => {
        setShowOnboardingWardCreatedModal(false);
        handleGoNextMonthMake();
    };
    const handlePostShift = async () => {
        if (!wardId || !currentShiftTeamId) return;

        await WardAPI.postShift(wardId, currentShiftTeamId, year, month);
        await queryClient.invalidateQueries({queryKey: dutyQueryKey});
    };
    const handleExportExcel = () => {
        void exportExcel();
    };
    const handleRetry = () => {
        if (wardId === null) {
            void handleGetAccountMe().catch(() => undefined);

            return;
        }

        void Promise.all([
            shiftTeamsQuery.refetch(),
            currentShiftTeamId !== null ? dutyQuery.refetch() : Promise.resolve(),
        ]);
    };

    return {
        state: {
            year,
            month,
            bootstrapStatus,
            shiftTeams,
            currentShiftTeamId,
            currentShiftTeamName,
            shiftTeamsStatus,
            readonly,
            shift,
            status,
            isExportingExcel,
            doc,
            isDutyViewAllowed,
            dutyAtMaxFutureMonth,
            dutyViewingThisCalendarMonth,
            dutyPastStrictlyBeforeLastMonth,
            showOnboardingWardCreatedModal,
            wardCode: wardQuery.data?.code ?? '',
        },
        refs: {
            editorRef,
        },
        handlers: {
            goPrevMonth: handleGoPrevMonth,
            goNextMonth: handleGoNextMonth,
            selectShiftTeam: handleSelectShiftTeam,
            enableEdit: handleEnableEdit,
            saveEdit: handleSaveEdit,
            cancelEdit: handleCancelEdit,
            goCurrentMonthMake: handleGoCurrentMonthMake,
            goNextMonthMake: handleGoNextMonthMake,
            dismissOnboardingWardCreatedModal: handleDismissOnboardingWardCreatedModal,
            startNextMonthMakeFromOnboarding: handleStartNextMonthMakeFromOnboarding,
            postShift: handlePostShift,
            exportExcel: handleExportExcel,
            retry: handleRetry,
            onKeyDown,
            onPasteCapture,
        },
    };
}

export type TDutyHook = ReturnType<typeof useDutyHook>;
