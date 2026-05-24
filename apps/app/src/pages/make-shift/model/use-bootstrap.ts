import {useEffect, useRef} from 'react';
import {useSearchParams} from 'react-router';
import {isDutyShiftFullyAssigned, isDutyShiftWithoutAssignments, useShiftEditorCommands} from '@/features/shift-editor';
import WardAPI from '@/shared/api/ward';
import {bumpMaxReachedStep, loadDraftStep, saveDraftStep} from './make-shift-progress-storage';
import {clearPersistedStep, loadPersistedStep, loadPersistedYearMonth, useMakeShiftStore} from './make-shift-store';

function parsePositiveInt(raw: string | null): number | null {
    if (!raw) return null;

    const n = Number(raw);

    return Number.isInteger(n) && n > 0 ? n : null;
}

export function useMakeShiftBootstrap(wardId: number | null) {
    const [searchParams] = useSearchParams();
    const editor = useShiftEditorCommands();
    const editorRef = useRef(editor);
    const initializedWardIdRef = useRef<number | null>(null);
    const initialQueryShiftTeamIdRef = useRef<number | null>(null);

    editorRef.current = editor;

    const setShiftStatus = useMakeShiftStore((s) => s.setShiftStatus);
    const setShiftExists = useMakeShiftStore((s) => s.setShiftExists);
    const setShiftFullyAssigned = useMakeShiftStore((s) => s.setShiftFullyAssigned);
    const setShiftTeams = useMakeShiftStore((s) => s.setShiftTeams);
    const setShiftTeamsStatus = useMakeShiftStore((s) => s.setShiftTeamsStatus);
    const setCurrentShiftTeamId = useMakeShiftStore((s) => s.setCurrentShiftTeamId);
    const setYearMonth = useMakeShiftStore((s) => s.setYearMonth);
    const shiftTeams = useMakeShiftStore((s) => s.shiftTeams);
    const year = useMakeShiftStore((s) => s.year);
    const month = useMakeShiftStore((s) => s.month);
    const currentShiftTeamId = useMakeShiftStore((s) => s.currentShiftTeamId);
    const shiftStatus = useMakeShiftStore((s) => s.shiftStatus);
    const reloadToken = useMakeShiftStore((s) => s.reloadToken);
    const isHydrated = useMakeShiftStore((s) => s.isHydrated);
    const setHydrated = useMakeShiftStore((s) => s.setHydrated);
    const startFromStep = useMakeShiftStore((s) => s.startFromStep);
    const resetToOverview = useMakeShiftStore((s) => s.resetToOverview);
    const setWardId = useMakeShiftStore((s) => s.setWardId);
    const phase = useMakeShiftStore((s) => s.phase);
    const currentStep = useMakeShiftStore((s) => s.currentStep);
    const shiftFullyAssigned = useMakeShiftStore((s) => s.shiftFullyAssigned);
    const autoRestoreAttemptedRef = useRef(false);

    useEffect(() => {
        autoRestoreAttemptedRef.current = false;
    }, [wardId]);

    useEffect(() => {
        setWardId(wardId);
    }, [wardId, setWardId]);

    useEffect(() => {
        if (isHydrated || !wardId) return;

        const savedYearMonth = loadPersistedYearMonth();

        if (savedYearMonth && !searchParams.has('year') && !searchParams.has('month')) {
            setYearMonth(savedYearMonth);
        }

        setHydrated();
    }, [isHydrated, wardId, setHydrated, searchParams, setYearMonth]);

    useEffect(() => {
        if (!wardId || !isHydrated || autoRestoreAttemptedRef.current || !currentShiftTeamId) return;

        const st = useMakeShiftStore.getState();
        const fromComposite = loadDraftStep(wardId, currentShiftTeamId, st.year, st.month);
        const fromLegacy = loadPersistedStep();
        const saved = fromComposite ?? fromLegacy;

        if (!saved) return;

        autoRestoreAttemptedRef.current = true;
        startFromStep({
            step: saved,
            openRestoreDraftModal: editor.getPersisted() !== null,
        });

        if (!fromComposite && fromLegacy) {
            saveDraftStep(wardId, currentShiftTeamId, st.year, st.month, saved);
            bumpMaxReachedStep(wardId, currentShiftTeamId, st.year, st.month, saved);
            clearPersistedStep();
        }
    }, [wardId, isHydrated, currentShiftTeamId, year, month, startFromStep, editor]);

    useEffect(() => {
        if (!wardId) {
            initializedWardIdRef.current = null;
            initialQueryShiftTeamIdRef.current = null;

            return;
        }

        if (initializedWardIdRef.current === wardId) return;

        initializedWardIdRef.current = wardId;

        const now = new Date();
        const queryYear = parsePositiveInt(searchParams.get('year'));
        const queryMonth = parsePositiveInt(searchParams.get('month'));
        const queryShiftTeamId = parsePositiveInt(searchParams.get('shiftTeamId'));

        if (queryYear !== null || queryMonth !== null) {
            const hasValidQueryMonth = queryMonth !== null && queryMonth >= 1 && queryMonth <= 12;
            const nextYear = queryYear ?? now.getFullYear();
            const nextMonth = hasValidQueryMonth ? queryMonth : now.getMonth() + 1;

            setYearMonth({year: nextYear, month: nextMonth});
        }

        initialQueryShiftTeamIdRef.current = queryShiftTeamId;
    }, [searchParams, setYearMonth, wardId]);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            if (!wardId) {
                setShiftTeamsStatus('idle');
                setShiftStatus('idle');
                setShiftExists(false);
                setShiftFullyAssigned(false);
                setShiftTeams([]);
                setCurrentShiftTeamId(null);

                return;
            }

            try {
                setShiftTeamsStatus('pending');

                const teams = await WardAPI.getShiftTeams(wardId);

                if (cancelled) return;

                setShiftTeams(teams);
                setShiftTeamsStatus('success');
            } catch {
                if (!cancelled) {
                    setShiftTeamsStatus('error');
                    setShiftStatus('error');
                }
            }
        };

        void run();

        return () => {
            cancelled = true;
        };
    }, [
        reloadToken,
        setCurrentShiftTeamId,
        setShiftExists,
        setShiftFullyAssigned,
        setShiftStatus,
        setShiftTeams,
        setShiftTeamsStatus,
        wardId,
    ]);

    useEffect(() => {
        if (!wardId) return;

        const firstTeamId = shiftTeams[0]?.shiftTeamId ?? null;
        const prevSelectedId = useMakeShiftStore.getState().currentShiftTeamId;
        const queryShiftTeamId = initialQueryShiftTeamIdRef.current;
        const hasPrevSelected = prevSelectedId !== null && shiftTeams.some((team) => team.shiftTeamId === prevSelectedId);
        const hasQuerySelected = queryShiftTeamId !== null && shiftTeams.some((team) => team.shiftTeamId === queryShiftTeamId);
        const nextTeamId = hasQuerySelected ? queryShiftTeamId : hasPrevSelected ? prevSelectedId : firstTeamId;

        setCurrentShiftTeamId(nextTeamId);
    }, [setCurrentShiftTeamId, shiftTeams, wardId]);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            if (!wardId || !currentShiftTeamId) {
                setShiftStatus('idle');
                setShiftExists(false);
                setShiftFullyAssigned(false);

                return;
            }

            setShiftStatus('pending');
            setShiftExists(false);
            setShiftFullyAssigned(false);

            try {
                const shift = await WardAPI.getShift(wardId, currentShiftTeamId, year, month);

                if (cancelled) return;

                setShiftStatus('success');
                // 근무표 존재: 최소 1칸 이상 배정이 있을 때만 true (`/duty`와 동일 — `isDutyShiftWithoutAssignments` 역).
                setShiftExists(!isDutyShiftWithoutAssignments(shift));
                setShiftFullyAssigned(isDutyShiftFullyAssigned(shift));
            } catch {
                if (!cancelled) {
                    setShiftStatus('error');
                    setShiftFullyAssigned(false);
                }
            }
        };

        void run();

        return () => {
            cancelled = true;
        };
    }, [currentShiftTeamId, month, reloadToken, setShiftExists, setShiftFullyAssigned, setShiftStatus, wardId, year]);

    useEffect(() => {
        if (shiftStatus !== 'success' || !shiftFullyAssigned || phase !== 'stepping') return;

        if (currentStep >= 5) return;

        resetToOverview();
    }, [currentStep, phase, resetToOverview, shiftFullyAssigned, shiftStatus]);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            if (!wardId || !currentShiftTeamId) {
                editorRef.current.setDutyValidationInput(null);

                return;
            }

            try {
                const wardConstraint = await WardAPI.getWardConstraint(wardId, currentShiftTeamId);

                if (cancelled) return;

                editorRef.current.setDutyValidationInput({wardConstraint});
            } catch {
                if (!cancelled && shiftStatus !== 'pending') editorRef.current.setDutyValidationInput(null);
            }
        };

        void run();

        return () => {
            cancelled = true;
        };
    }, [currentShiftTeamId, reloadToken, shiftStatus, wardId]);
}
