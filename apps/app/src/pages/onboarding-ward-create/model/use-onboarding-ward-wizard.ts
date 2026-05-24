import {type DropResult} from '@hello-pangea/dnd';
import * as Sentry from '@sentry/react';
import {useEffect, useMemo, useState} from 'react';
import toast from 'react-hot-toast';
import useRegister from '@/features/register';
import {FileAPI} from '@/shared/api';
import {
    applyParsedWardData,
    buildOnboardingParseDraftInjection,
    getOnboardingUploadFailureMessage,
    isSupportedOnboardingUploadFile,
} from './adapter';
import {
    addNurseDraft,
    addShiftTypeDraft,
    addTeamDraft,
    canComplete,
    canGoNext,
    canGoPrev,
    createInitialDraft,
    deleteNurseDraft,
    deleteShiftTypeDraft,
    deleteTeamDraft,
    getCompletionValidationIssues,
    getStepValidation,
    goNextStep as goNextStepDraft,
    goPreviousStep as goPreviousStepDraft,
    MAX_ONBOARDING_NURSES,
    MAX_ONBOARDING_TEAMS,
    saveSkillLevelConfig,
    type TOnboardingNurseDraft,
    type TOnboardingWardDraft,
    type TSkillLevelConfig,
    updateNurseDraft,
    updateShiftTypeDraft,
    updateTeamNameDraft,
} from './draft';
import {sortNursesByMode} from './sort';
import {createOnboardingWardCreateExecutor} from './submission';
import type {TSortMode} from './types';

const MAX_STEP = 4;

type TSubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';
type TUploadStatus = 'idle' | 'uploading' | 'success' | 'warning' | 'error';

const reorderByIndex = <T>(items: T[], sourceIndex: number, destinationIndex: number) => {
    const next = [...items];
    const [moved] = next.splice(sourceIndex, 1);

    if (!moved) {
        return items;
    }

    next.splice(destinationIndex, 0, moved);

    return next;
};
const replaceTeamNurses = (draft: TOnboardingWardDraft, teamId: string, nextTeamNurses: TOnboardingNurseDraft[]): TOnboardingWardDraft => {
    const nextNurses: TOnboardingNurseDraft[] = [];

    let teamCursor = 0;

    draft.nurses.forEach((nurse) => {
        if (nurse.teamId !== teamId) {
            nextNurses.push(nurse);

            return;
        }

        const replacement = nextTeamNurses[teamCursor++];

        if (replacement) {
            nextNurses.push(replacement);
        }
    });

    if (teamCursor < nextTeamNurses.length) {
        nextNurses.push(...nextTeamNurses.slice(teamCursor));
    }

    return {
        ...draft,
        nurses: nextNurses,
    };
};
const enforceWorkerGroupOrder = (teamNurses: TOnboardingNurseDraft[]) => sortNursesByMode(teamNurses, 'manual');
const getWorkerBoundaryIndex = (teamNurses: TOnboardingNurseDraft[]) => {
    const firstOffIndex = teamNurses.findIndex((nurse) => !nurse.isWorker);

    return firstOffIndex === -1 ? teamNurses.length : firstOffIndex;
};
const insertAtWorkerBoundary = (teamNurses: TOnboardingNurseDraft[], nurse: TOnboardingNurseDraft) => {
    const nextTeamNurses = [...teamNurses];

    nextTeamNurses.splice(getWorkerBoundaryIndex(nextTeamNurses), 0, nurse);

    return nextTeamNurses;
};
const removeEmptyTeamsForCompletion = (draft: TOnboardingWardDraft): TOnboardingWardDraft => {
    const nurseCountByTeamId = new Map<string, number>();

    draft.nurses.forEach((nurse) => {
        nurseCountByTeamId.set(nurse.teamId, (nurseCountByTeamId.get(nurse.teamId) ?? 0) + 1);
    });

    const nextTeams = draft.teams.filter((team) => (nurseCountByTeamId.get(team.id) ?? 0) > 0);

    if (nextTeams.length === draft.teams.length) {
        return draft;
    }

    const nextTeamIdSet = new Set(nextTeams.map((team) => team.id));
    const nextNurses = draft.nurses.filter((nurse) => nextTeamIdSet.has(nurse.teamId));

    return {
        ...draft,
        teams: nextTeams,
        nurses: nextNurses,
    };
};

function useOnboardingWardWizard() {
    const {
        actions: {createWard},
    } = useRegister();
    const [draft, setDraft] = useState<TOnboardingWardDraft>(() => createInitialDraft());
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [sortMode, setSortModeState] = useState<TSortMode>('manual');
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [isSkillLevelEnabled, setIsSkillLevelEnabled] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<TSubmissionStatus>('idle');
    const [uploadStatus, setUploadStatus] = useState<TUploadStatus>('idle');
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadWarnings, setUploadWarnings] = useState<string[]>([]);
    const onboardingWardCreateExecutor = useMemo(() => createOnboardingWardCreateExecutor(createWard), [createWard]);

    useEffect(() => {
        if (!selectedTeamId && draft.teams[0]) {
            setSelectedTeamId(draft.teams[0].id);
        }
    }, [draft.teams, selectedTeamId]);

    useEffect(() => {
        if (!isSkillLevelEnabled && sortMode === 'skill') {
            setSortModeState('manual');
        }
    }, [isSkillLevelEnabled, sortMode]);

    const selectedTeamExists = draft.teams.some((team) => team.id === selectedTeamId);
    const activeTeamId = selectedTeamExists ? selectedTeamId : (draft.teams[0]?.id ?? '');
    const draftForCompletion = removeEmptyTeamsForCompletion(draft);
    const currentStepValidation = getStepValidation(draft.currentStep === MAX_STEP ? draftForCompletion : draft);
    const completionValidationIssues = getCompletionValidationIssues(draftForCompletion);
    const setSortMode = (nextSortMode: TSortMode) => {
        if (nextSortMode === 'skill' && !isSkillLevelEnabled) {
            setSortModeState('manual');

            return;
        }

        setSortModeState(nextSortMode);
    };
    const goNextStep = () => {
        setDraft((prev) => goNextStepDraft(prev));
    };
    const goPreviousStep = () => {
        setDraft((prev) => goPreviousStepDraft(prev));
    };
    const updateWardIdentity = (updater: Partial<Pick<TOnboardingWardDraft, 'wardName' | 'hospitalName'>>) => {
        setDraft((prev) => ({...prev, ...updater}));
    };
    const updateShiftType = (shiftTypeId: string, updater: Parameters<typeof updateShiftTypeDraft>[2]) => {
        setDraft((prev) => updateShiftTypeDraft(prev, shiftTypeId, updater));
    };
    const addShiftType = () => {
        setDraft((prev) => addShiftTypeDraft(prev));
    };
    const deleteShiftType = (shiftTypeId: string) => {
        setDraft((prev) => deleteShiftTypeDraft(prev, shiftTypeId));
    };
    const updateNurse = (nurseId: string, updater: Parameters<typeof updateNurseDraft>[2]) => {
        setDraft((prev) => {
            const targetNurse = prev.nurses.find((nurse) => nurse.id === nurseId);

            if (!targetNurse) {
                return prev;
            }

            const nextNurse = {...targetNurse, ...updater};
            const isWorkerToggled =
                typeof updater.isWorker === 'boolean' && targetNurse.isWorker !== updater.isWorker && sortMode === 'manual';

            if (!isWorkerToggled) {
                return updateNurseDraft(prev, nurseId, updater);
            }

            const teamNurses = prev.nurses.filter((nurse) => nurse.teamId === targetNurse.teamId);
            const nextTeamNurses = teamNurses.filter((nurse) => nurse.id !== nurseId);
            const reorderedTeamNurses = insertAtWorkerBoundary(nextTeamNurses, nextNurse);

            return replaceTeamNurses(prev, targetNurse.teamId, enforceWorkerGroupOrder(reorderedTeamNurses));
        });
    };
    const addTeam = () => {
        if (draft.teams.length >= MAX_ONBOARDING_TEAMS) {
            toast.error('팀은 최대 8개까지 추가할 수 있어요.');

            return;
        }

        const {draft: nextDraft, addedTeamId} = addTeamDraft(draft);

        setDraft(nextDraft);

        if (addedTeamId) {
            const addedTeamName = nextDraft.teams.find((team) => team.id === addedTeamId)?.name ?? '???';

            setSelectedTeamId(addedTeamId);
            toast.success(`${addedTeamName}을 추가했어요.`, {position: 'bottom-center'});
        }
    };
    const addNurse = () => {
        const targetTeamId = activeTeamId || draft.teams[0]?.id;

        if (targetTeamId) {
            const teamNurseCount = draft.nurses.filter((nurse) => nurse.teamId === targetTeamId).length;

            if (teamNurseCount >= MAX_ONBOARDING_NURSES) {
                toast.error('한 팀에는 간호사를 최대 40명까지 추가할 수 있어요.');

                return;
            }

            const targetTeamName = draft.teams.find((team) => team.id === targetTeamId)?.name ?? '?좏깮???';

            setDraft((prev) => addNurseDraft(prev, targetTeamId));
            toast.success(`${targetTeamName}에 간호사를 추가했어요.`, {position: 'bottom-center'});

            return;
        }

        const {draft: withTeamDraft, addedTeamId} = addTeamDraft(draft);

        if (!addedTeamId) {
            toast.error('팀은 최대 8개까지 추가할 수 있어요.');

            return;
        }

        const addedTeamName = withTeamDraft.teams.find((team) => team.id === addedTeamId)?.name ?? '???';

        setDraft(addNurseDraft(withTeamDraft, addedTeamId));
        setSelectedTeamId(addedTeamId);
        toast.success(`${addedTeamName}을 추가하고 간호사도 등록했어요.`, {position: 'bottom-center'});
    };
    const deleteActiveTeam = () => {
        if (!activeTeamId) {
            return;
        }

        const deletedTeamNurseCount = draft.nurses.filter((nurse) => nurse.teamId === activeTeamId).length;
        const nextDraft = deleteTeamDraft(draft, activeTeamId);

        setDraft(nextDraft);
        setSelectedTeamId(nextDraft.teams[0]?.id ?? '');

        if (deletedTeamNurseCount > 0) {
            toast.success('팀을 삭제했어요. 팀에 속한 간호사도 함께 삭제했어요.');
        }
    };
    const deleteNurse = (nurseId: string) => {
        if (!draft.nurses.some((nurse) => nurse.id === nurseId)) {
            return;
        }

        setDraft((prev) => deleteNurseDraft(prev, nurseId));
        toast.success('간호사를 삭제했어요.');
    };
    const updateTeamName = (teamId: string, teamName: string) => {
        setDraft((prev) => updateTeamNameDraft(prev, teamId, teamName));
    };
    const handleNurseDragEnd = ({destination, source}: DropResult) => {
        if (!destination) {
            return;
        }

        if (source.droppableId !== destination.droppableId || source.index === destination.index) {
            return;
        }

        const teamId = source.droppableId;

        setDraft((prev) => {
            const teamNurses = prev.nurses.filter((nurse) => nurse.teamId === teamId);

            if (teamNurses.length === 0) {
                return prev;
            }

            const displayedTeamNurses = sortNursesByMode(teamNurses, sortMode);
            const sourceNurse = displayedTeamNurses[source.index];

            if (!sourceNurse) {
                return prev;
            }

            const onCount = displayedTeamNurses.filter((nurse) => nurse.isWorker).length;
            const lastIndex = displayedTeamNurses.length - 1;
            const destinationIndex = Math.max(0, Math.min(destination.index, lastIndex));

            if (sortMode === 'manual') {
                const crossesWorkerBoundary = sourceNurse.isWorker ? destinationIndex >= onCount : destinationIndex < onCount;

                if (crossesWorkerBoundary) {
                    return prev;
                }
            }

            if (destinationIndex === source.index) {
                return prev;
            }

            const reorderedTeamNurses = reorderByIndex(displayedTeamNurses, source.index, destinationIndex);

            if (reorderedTeamNurses === displayedTeamNurses) {
                return prev;
            }

            return replaceTeamNurses(
                prev,
                teamId,
                sortMode === 'manual' ? reorderedTeamNurses : enforceWorkerGroupOrder(reorderedTeamNurses),
            );
        });

        if (sortMode !== 'manual') {
            setSortModeState('manual');
        }
    };
    const applyUploadedFile = async (file: File) => {
        if (!isSupportedOnboardingUploadFile(file.name)) {
            const message = '엑셀 파일(.xlsx, .xls, .csv)만 업로드할 수 있어요.';

            setUploadStatus('error');
            setUploadError(message);
            setUploadWarnings([]);
            toast.error(message);

            return;
        }

        setUploadStatus('uploading');
        setUploadError(null);
        setUploadWarnings([]);

        try {
            const response = await FileAPI.parseOnboardingWardExcel(file);
            const {parsedWardData, warnings} = buildOnboardingParseDraftInjection(response, file.name);

            setDraft((prev) => applyParsedWardData(prev, parsedWardData));
            setUploadWarnings(warnings);
            setUploadStatus(warnings.length > 0 ? 'warning' : 'success');

            if (warnings.length > 0) {
                toast.error('일부 데이터만 반영했어요. 누락된 항목을 확인해 주세요.');
            } else {
                toast.success('엑셀 데이터를 불러왔어요.');
            }
        } catch (error) {
            const message = getOnboardingUploadFailureMessage(error);

            setUploadStatus('error');
            setUploadError(message);
            setUploadWarnings([]);
            toast.error(message);
        }
    };
    const saveSkillConfig = (config: TSkillLevelConfig) => {
        setDraft((prev) => saveSkillLevelConfig(prev, config));
        setIsSkillLevelEnabled(true);
        toast.success('숙련도 설정을 간호사 목록에 반영했어요.');
    };
    const disableSkillConfig = () => {
        setIsSkillLevelEnabled(false);

        if (sortMode === 'skill') {
            setSortModeState('manual');
        }

        toast.success('숙련도 설정 사용을 껐어요.');
    };
    const complete = async () => {
        if (submissionStatus === 'submitting') {
            return;
        }

        const nextDraft = removeEmptyTeamsForCompletion(draft);

        if (nextDraft !== draft) {
            setDraft(nextDraft);

            if (!nextDraft.teams.some((team) => team.id === activeTeamId)) {
                setSelectedTeamId(nextDraft.teams[0]?.id ?? '');
            }
        }

        if (!canComplete(nextDraft)) {
            return;
        }

        setSubmissionStatus('submitting');

        try {
            const submission = await onboardingWardCreateExecutor(nextDraft);

            setSubmissionStatus('success');
            toast.success(submission.successMessage);
        } catch (error) {
            Sentry.captureException(error, {
                tags: {feature: 'onboarding-ward-create'},
                extra: {step: draft.currentStep},
            });
            setSubmissionStatus('error');
            toast.error('병동을 만들지 못했어요. 다시 시도해 주세요.');
        }
    };
    const skipOrComplete = () => {
        if (draft.currentStep === MAX_STEP) {
            void complete();

            return;
        }

        goNextStep();
    };

    return {
        draft,
        activeTeamId,
        setSelectedTeamId,
        sortMode,
        setSortMode,
        showSkillModal,
        setShowSkillModal,
        isSkillLevelEnabled,
        goNextStep,
        goPreviousStep,
        updateWardIdentity,
        skipOrComplete,
        addShiftType,
        updateShiftType,
        deleteShiftType,
        addTeam,
        addNurse,
        deleteActiveTeam,
        deleteNurse,
        updateNurse,
        updateTeamName,
        handleNurseDragEnd,
        applyUploadedFile,
        uploadStatus,
        uploadError,
        uploadWarnings,
        saveSkillConfig,
        disableSkillConfig,
        complete,
        canAddTeam: draft.teams.length < MAX_ONBOARDING_TEAMS,
        submissionStatus,
        currentStepValidation,
        completionValidationIssues,
        canGoPrev: canGoPrev(draft),
        canGoNext: canGoNext(draft),
        canComplete: canComplete(draftForCompletion),
    };
}

export default useOnboardingWardWizard;



