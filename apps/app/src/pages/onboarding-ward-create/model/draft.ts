import {type TCreateWardDTO} from '@dutying/api/ward';
import {type DropResult} from '@hello-pangea/dnd';

export type TOnboardingStep = 1 | 2 | 3 | 4;

export type TOnboardingWardShiftType = TCreateWardDTO['wardShiftTypes'][number] & {
    id: string;
};

export type TOnboardingTeamDraft = {
    id: string;
    name: string;
};

export type TOnboardingNurseDraft = {
    id: string;
    teamId: string;
    name: string;
    memo: string;
    isWorker: boolean;
    employmentDate: string;
    possibleShiftTypeIds: string[];
    level: number | null;
};

export type TSkillPalette = {
    id: string;
    colors: string[];
};

export type TSkillLevelConfig = {
    levelCount: number;
    paletteId: string;
    autoAssign: boolean;
    levelLabels?: Record<number, string>;
};

export type TOnboardingWardDraft = {
    currentStep: TOnboardingStep;
    uploadedFileName: string | null;
    wardName: string;
    hospitalName: string;
    shiftTypes: TOnboardingWardShiftType[];
    teams: TOnboardingTeamDraft[];
    nurses: TOnboardingNurseDraft[];
    skillLevelConfig: TSkillLevelConfig;
};

export type TOnboardingValidationIssueCode =
    | 'missing-hospital-name'
    | 'invalid-ward-name'
    | 'invalid-hospital-name'
    | 'empty-shift-types'
    | 'missing-shift-name'
    | 'duplicate-shift-name'
    | 'missing-shift-short-name'
    | 'duplicate-shift-short-name'
    | 'missing-shift-time'
    | 'invalid-shift-time-format'
    | 'invalid-shift-time-order'
    | 'empty-team'
    | 'empty-team-nurses'
    | 'missing-nurse-name'
    | 'invalid-nurse-name';

export type TOnboardingValidationIssue = {
    code: TOnboardingValidationIssueCode;
    step: TOnboardingStep;
    targetId?: string;
};

export type TOnboardingStepValidation = {
    step: TOnboardingStep;
    isValid: boolean;
    issues: TOnboardingValidationIssue[];
};

export type TOnboardingActionState = {
    canGoPrev: boolean;
    canGoNext: boolean;
    canComplete: boolean;
};

const SKILL_PALETTES: TSkillPalette[] = [
    {id: 'warm', colors: ['#FFF3B8', '#FFE9B8', '#FFD8B8', '#FFB3A7']},
    {id: 'cool', colors: ['#BDE5FF', '#9FD7FF', '#7CC4FF', '#58ABF5']},
    {id: 'violet', colors: ['#E8D9FF', '#D8C3FF', '#C4A8FF', '#A382F5']},
    {id: 'forest', colors: ['#D7F4C9', '#AEE6B8', '#6FCF97', '#2F9E6B']},
];
const DEFAULT_SKILL_LEVEL_CONFIG: TSkillLevelConfig = {
    levelCount: 5,
    paletteId: 'warm',
    autoAssign: true,
};
const MIN_STEP = 1;
const MAX_STEP = 4;

export const MAX_ONBOARDING_TEAMS = 8;
export const MAX_ONBOARDING_SHIFT_TYPES = 10;
export const MAX_ONBOARDING_NURSES = 40;
export const MAX_ONBOARDING_NURSE_NAME_LENGTH = 20;

const REQUIRED_COMPLETION_STEPS: TOnboardingStep[] = [1, 3, 4];
const WARD_IDENTITY_REGEX = /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9\s]{1,20}$/;
const SHIFT_TIME_FORMAT_REGEX = /^\d{2}:\d{2}$/;
const KOREAN_SYLLABLE_REGEX = /[가-힣]/g;
const KOREAN_JAMO_REGEX = /[\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff]/u;
const NAME_SEPARATOR_REGEX = /[\s.'\-・·]/g;

let nextId = 0;

const createId = (prefix: string) => `${prefix}-${nextId++}`;
const createShiftType = (
    input: Omit<TOnboardingWardShiftType, 'id'> & {
        id?: string;
    },
): TOnboardingWardShiftType => ({
    id: input.id ?? createId('shift'),
    ...input,
});
const createNurse = (
    input: Omit<TOnboardingNurseDraft, 'id'> & {
        id?: string;
    },
): TOnboardingNurseDraft => ({
    id: input.id ?? createId('nurse'),
    ...input,
});
const BASE_SHIFT_TYPES = [
    createShiftType({
        name: '데이',
        shortName: 'D',
        startTime: '07:00',
        endTime: '15:00',
        color: '#4DC2AD',
        isDefault: true,
        isOff: false,
        classification: 'DAY',
    }),
    createShiftType({
        name: '이브닝',
        shortName: 'E',
        startTime: '15:00',
        endTime: '23:00',
        color: '#FF8BA5',
        isDefault: true,
        isOff: false,
        classification: 'EVENING',
    }),
    createShiftType({
        name: '나이트',
        shortName: 'N',
        startTime: '23:00',
        endTime: '07:00',
        color: '#3580FF',
        isDefault: true,
        isOff: false,
        classification: 'NIGHT',
    }),
    createShiftType({
        name: '오프',
        shortName: 'O',
        startTime: '',
        endTime: '',
        color: '#465B7A',
        isDefault: true,
        isOff: true,
        classification: 'OFF',
    }),
];
const BASE_TEAMS: TOnboardingTeamDraft[] = [
    {id: createId('team'), name: '간호사 1팀'},
    {id: createId('team'), name: '간호사 2팀'},
    {id: createId('team'), name: '간호사 3팀'},
];
const createBaseNurses = (shiftTypes: TOnboardingWardShiftType[], teams: TOnboardingTeamDraft[]) => {
    const shiftTypeIds = shiftTypes.map((shiftType) => shiftType.id);
    const firstTeamId = teams[0]?.id ?? '';

    return [
        createNurse({
            teamId: firstTeamId,
            name: '홍길동',
            memo: '프리셉터',
            isWorker: true,
            employmentDate: '2019-03-01',
            possibleShiftTypeIds: shiftTypeIds,
            level: 5,
        }),
        createNurse({
            teamId: firstTeamId,
            name: '김하늘',
            memo: '',
            isWorker: true,
            employmentDate: '2020-07-15',
            possibleShiftTypeIds: shiftTypeIds,
            level: 4,
        }),
        createNurse({
            teamId: firstTeamId,
            name: '이서윤',
            memo: '나이트킵',
            isWorker: true,
            employmentDate: '2023-10-10',
            possibleShiftTypeIds: shiftTypeIds,
            level: 2,
        }),
        createNurse({
            teamId: firstTeamId,
            name: '박연우',
            memo: '',
            isWorker: false,
            employmentDate: '2022-02-01',
            possibleShiftTypeIds: shiftTypeIds,
            level: 3,
        }),
    ];
};

export const skillPalettes = SKILL_PALETTES;

export const getSkillPalette = (paletteId: string) => skillPalettes.find((palette) => palette.id === paletteId) ?? skillPalettes[0];

const normalizeSkillPaletteId = (paletteId: string) =>
    skillPalettes.some((palette) => palette.id === paletteId) ? paletteId : skillPalettes[0].id;
const isValidNurseName = (name: string): boolean => {
    const trimmedName = name.trim();

    if (!trimmedName) {
        return false;
    }

    if (KOREAN_JAMO_REGEX.test(trimmedName)) {
        return false;
    }

    if (trimmedName.length > MAX_ONBOARDING_NURSE_NAME_LENGTH) {
        return false;
    }

    const compactName = trimmedName.replace(NAME_SEPARATOR_REGEX, '');

    if (!compactName) {
        return false;
    }

    const koreanSyllableCount = compactName.match(KOREAN_SYLLABLE_REGEX)?.length ?? 0;

    if (/^[가-힣]+$/u.test(compactName) && koreanSyllableCount < 2) {
        return false;
    }

    return true;
};
const parseShiftTimeToMinutes = (value: string): number | null => {
    const normalizedValue = value.trim();

    if (!SHIFT_TIME_FORMAT_REGEX.test(normalizedValue)) return null;

    const [hour, minute] = normalizedValue.split(':').map(Number);

    if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

    return hour * 60 + minute;
};

export const createEmptyShiftType = (): TOnboardingWardShiftType =>
    createShiftType({
        name: '',
        shortName: '',
        startTime: '09:00',
        endTime: '18:00',
        color: '#BFC7D4',
        isDefault: false,
        isOff: false,
        classification: 'OTHER_WORK',
    });

export const createEmptyNurse = (teamId: string, shiftTypes: TOnboardingWardShiftType[]): TOnboardingNurseDraft =>
    createNurse({
        teamId,
        name: `신규 간호사 ${nextId + 1}`,
        memo: '',
        isWorker: true,
        employmentDate: '2024-01-01',
        possibleShiftTypeIds: shiftTypes.map((shiftType) => shiftType.id),
        level: null,
    });

export const createInitialDraft = (): TOnboardingWardDraft => {
    const shiftTypes = BASE_SHIFT_TYPES.map((shiftType) => ({...shiftType}));
    const teams = BASE_TEAMS.map((team) => ({...team}));
    const nurses = createBaseNurses(shiftTypes, teams);

    return {
        currentStep: 1,
        uploadedFileName: null,
        wardName: '',
        hospitalName: '',
        shiftTypes,
        teams,
        nurses: applySkillLevels(nurses, DEFAULT_SKILL_LEVEL_CONFIG),
        skillLevelConfig: DEFAULT_SKILL_LEVEL_CONFIG,
    };
};

export const applySkillLevels = (nurses: TOnboardingNurseDraft[], config: TSkillLevelConfig): TOnboardingNurseDraft[] => {
    const levelCount = Math.min(Math.max(config.levelCount, 2), 5);

    if (!config.autoAssign) {
        return nurses.map((nurse) => ({
            ...nurse,
            level: nurse.level ? Math.min(nurse.level, levelCount) : levelCount,
        }));
    }

    const sortedNurses = nurses
        .map((nurse) => ({nurse}))
        .sort((left, right) => left.nurse.employmentDate.localeCompare(right.nurse.employmentDate));
    const levelById = new Map<string, number>();

    sortedNurses.forEach(({nurse}, index) => {
        const ratio = sortedNurses.length <= 1 ? 0 : index / (sortedNurses.length - 1);
        const level = levelCount - Math.round(ratio * (levelCount - 1));

        levelById.set(nurse.id, Math.max(1, Math.min(levelCount, level)));
    });

    return nurses.map((nurse) => ({
        ...nurse,
        level: levelById.get(nurse.id) ?? levelCount,
    }));
};

export const goToStep = (draft: TOnboardingWardDraft, step: TOnboardingStep): TOnboardingWardDraft => ({
    ...draft,
    currentStep: step,
});

export const goNextStep = (draft: TOnboardingWardDraft): TOnboardingWardDraft => ({
    ...draft,
    currentStep: Math.min(MAX_STEP, draft.currentStep + 1) as TOnboardingStep,
});

export const goPreviousStep = (draft: TOnboardingWardDraft): TOnboardingWardDraft => ({
    ...draft,
    currentStep: Math.max(MIN_STEP, draft.currentStep - 1) as TOnboardingStep,
});

export const updateShiftTypeDraft = (
    draft: TOnboardingWardDraft,
    shiftTypeId: string,
    updater: Partial<TOnboardingWardShiftType>,
): TOnboardingWardDraft => ({
    ...draft,
    shiftTypes: draft.shiftTypes.map((shiftType) => (shiftType.id === shiftTypeId ? {...shiftType, ...updater} : shiftType)),
});

export const addShiftTypeDraft = (draft: TOnboardingWardDraft): TOnboardingWardDraft => {
    if (draft.shiftTypes.length >= MAX_ONBOARDING_SHIFT_TYPES) {
        return draft;
    }

    return {
        ...draft,
        shiftTypes: [...draft.shiftTypes, createEmptyShiftType()],
    };
};

export const deleteShiftTypeDraft = (draft: TOnboardingWardDraft, shiftTypeId: string): TOnboardingWardDraft => ({
    ...draft,
    shiftTypes: draft.shiftTypes.filter((shiftType) => shiftType.id !== shiftTypeId),
    nurses: draft.nurses.map((nurse) => ({
        ...nurse,
        possibleShiftTypeIds: nurse.possibleShiftTypeIds.filter((value) => value !== shiftTypeId),
    })),
});

export const updateNurseDraft = (
    draft: TOnboardingWardDraft,
    nurseId: string,
    updater: Partial<TOnboardingNurseDraft>,
): TOnboardingWardDraft => ({
    ...draft,
    nurses: draft.nurses.map((nurse) => (nurse.id === nurseId ? {...nurse, ...updater} : nurse)),
});

export const updateTeamNameDraft = (draft: TOnboardingWardDraft, teamId: string, teamName: string): TOnboardingWardDraft => {
    const trimmedName = teamName.trim();

    if (!trimmedName) {
        return draft;
    }

    const duplicated = draft.teams.some((team) => team.id !== teamId && team.name.trim() === trimmedName);

    if (duplicated) {
        return draft;
    }

    return {
        ...draft,
        teams: draft.teams.map((team) => (team.id === teamId ? {...team, name: trimmedName} : team)),
    };
};

export const addTeamDraft = (draft: TOnboardingWardDraft) => {
    if (draft.teams.length >= MAX_ONBOARDING_TEAMS) {
        return {
            draft,
            addedTeamId: null,
        };
    }

    const existingTeamNames = new Set(draft.teams.map((team) => team.name.trim()));

    let nextTeamNumber = draft.teams.length + 1;
    let nextTeamName = `간호사 ${nextTeamNumber}팀`;

    while (existingTeamNames.has(nextTeamName)) {
        nextTeamNumber += 1;
        nextTeamName = `간호사 ${nextTeamNumber}팀`;
    }

    const team = {
        id: `team-new-${draft.teams.length + 1}`,
        name: nextTeamName,
    };

    return {
        draft: {
            ...draft,
            teams: [...draft.teams, team],
        },
        addedTeamId: team.id,
    };
};

export const addNurseDraft = (draft: TOnboardingWardDraft, teamId: string): TOnboardingWardDraft => {
    if (!teamId) {
        return draft;
    }

    return {
        ...draft,
        nurses: [...draft.nurses, createEmptyNurse(teamId, draft.shiftTypes)],
    };
};

export const deleteTeamDraft = (draft: TOnboardingWardDraft, teamId: string): TOnboardingWardDraft => ({
    ...draft,
    teams: draft.teams.filter((team) => team.id !== teamId),
    nurses: draft.nurses.filter((nurse) => nurse.teamId !== teamId),
});

export const deleteNurseDraft = (draft: TOnboardingWardDraft, nurseId: string): TOnboardingWardDraft => ({
    ...draft,
    nurses: draft.nurses.filter((nurse) => nurse.id !== nurseId),
});

export const reorderNursesWithinTeam = (
    draft: TOnboardingWardDraft,
    teamId: string,
    result: Pick<DropResult, 'destination' | 'source'>,
): TOnboardingWardDraft => {
    const {destination, source} = result;

    if (!destination || !teamId || destination.index === source.index) {
        return draft;
    }

    const teamNurses = draft.nurses.filter((nurse) => nurse.teamId === teamId);
    const otherNurses = draft.nurses.filter((nurse) => nurse.teamId !== teamId);
    const nextNurses = [...teamNurses];
    const [moved] = nextNurses.splice(source.index, 1);

    if (!moved) {
        return draft;
    }

    nextNurses.splice(destination.index, 0, moved);

    return {
        ...draft,
        nurses: [...otherNurses, ...nextNurses],
    };
};

export const saveSkillLevelConfig = (draft: TOnboardingWardDraft, config: TSkillLevelConfig): TOnboardingWardDraft => {
    const normalizedConfig = {
        ...config,
        paletteId: normalizeSkillPaletteId(config.paletteId),
    };

    return {
        ...draft,
        skillLevelConfig: normalizedConfig,
        nurses: applySkillLevels(draft.nurses, normalizedConfig),
    };
};

const validateShiftTypes = (draft: TOnboardingWardDraft): TOnboardingValidationIssue[] => {
    const issues: TOnboardingValidationIssue[] = [];
    const shiftNameCountByValue = new Map<string, number>();
    const shiftShortNameCountByValue = new Map<string, number>();
    const step: TOnboardingStep = 3;

    if (draft.shiftTypes.length === 0) {
        issues.push({code: 'empty-shift-types', step});
    }

    draft.shiftTypes.forEach((shiftType) => {
        const normalizedName = shiftType.name.trim().toLocaleLowerCase();
        const normalizedShortName = shiftType.shortName.trim().toLocaleUpperCase();

        if (normalizedName) {
            shiftNameCountByValue.set(normalizedName, (shiftNameCountByValue.get(normalizedName) ?? 0) + 1);
        }

        if (normalizedShortName) {
            shiftShortNameCountByValue.set(normalizedShortName, (shiftShortNameCountByValue.get(normalizedShortName) ?? 0) + 1);
        }
    });

    draft.shiftTypes.forEach((shiftType) => {
        const normalizedName = shiftType.name.trim().toLocaleLowerCase();
        const normalizedShortName = shiftType.shortName.trim().toLocaleUpperCase();

        if (!normalizedName) {
            issues.push({code: 'missing-shift-name', step, targetId: shiftType.id});
        } else if ((shiftNameCountByValue.get(normalizedName) ?? 0) > 1) {
            issues.push({code: 'duplicate-shift-name', step, targetId: shiftType.id});
        }

        if (!normalizedShortName) {
            issues.push({code: 'missing-shift-short-name', step, targetId: shiftType.id});
        } else if ((shiftShortNameCountByValue.get(normalizedShortName) ?? 0) > 1) {
            issues.push({code: 'duplicate-shift-short-name', step, targetId: shiftType.id});
        }

        if (shiftType.isOff) {
            return;
        }

        const normalizedStartTime = shiftType.startTime.trim();
        const normalizedEndTime = shiftType.endTime.trim();

        if (!normalizedStartTime || !normalizedEndTime) {
            issues.push({code: 'missing-shift-time', step, targetId: shiftType.id});

            return;
        }

        const startMinutes = parseShiftTimeToMinutes(normalizedStartTime);
        const endMinutes = parseShiftTimeToMinutes(normalizedEndTime);

        if (startMinutes == null || endMinutes == null) {
            issues.push({code: 'invalid-shift-time-format', step, targetId: shiftType.id});

            return;
        }

        const isEndEarlierThanStart = endMinutes < startMinutes;
        const isSameTime = endMinutes === startMinutes;

        if (isSameTime || (isEndEarlierThanStart && shiftType.classification !== 'NIGHT')) {
            issues.push({code: 'invalid-shift-time-order', step, targetId: shiftType.id});
        }
    });

    return issues;
};
const validateWardIdentity = (draft: TOnboardingWardDraft, step: 1): TOnboardingValidationIssue[] => {
    const issues: TOnboardingValidationIssue[] = [];
    const wardName = draft.wardName.trim();
    const hospitalName = draft.hospitalName.trim();

    if (!wardName && !hospitalName) {
        issues.push({code: 'missing-hospital-name', step});
    }

    if (wardName && !WARD_IDENTITY_REGEX.test(wardName)) {
        issues.push({code: 'invalid-ward-name', step});
    }

    if (hospitalName && !WARD_IDENTITY_REGEX.test(hospitalName)) {
        issues.push({code: 'invalid-hospital-name', step});
    }

    return issues;
};
const validateTeamsAndNurses = (draft: TOnboardingWardDraft, step: 4): TOnboardingValidationIssue[] => {
    const issues: TOnboardingValidationIssue[] = [];

    if (draft.teams.length === 0) {
        issues.push({code: 'empty-team', step});
    }

    draft.teams.forEach((team) => {
        const nurses = draft.nurses.filter((nurse) => nurse.teamId === team.id);

        if (nurses.length === 0) {
            issues.push({code: 'empty-team-nurses', step, targetId: team.id});
        }

        nurses.forEach((nurse) => {
            if (!nurse.name.trim()) {
                issues.push({code: 'missing-nurse-name', step, targetId: nurse.id});
            } else if (!isValidNurseName(nurse.name)) {
                issues.push({code: 'invalid-nurse-name', step, targetId: nurse.id});
            }
        });
    });

    return issues;
};

export const getStepValidation = (draft: TOnboardingWardDraft, step = draft.currentStep): TOnboardingStepValidation => {
    let issues: TOnboardingValidationIssue[] = [];

    switch (step) {
        case 1:
            issues = validateWardIdentity(draft, step);
            break;
        case 2:
            issues = [];
            break;
        case 3:
            issues = validateShiftTypes(draft);
            break;
        case 4:
            issues = validateTeamsAndNurses(draft, step);
            break;
    }

    return {
        step,
        isValid: issues.length === 0,
        issues,
    };
};

export const canGoPrev = (draft: Pick<TOnboardingWardDraft, 'currentStep'>): boolean => draft.currentStep > MIN_STEP;

export const canGoNext = (draft: TOnboardingWardDraft): boolean => draft.currentStep < MAX_STEP && getStepValidation(draft).isValid;

export const canComplete = (draft: TOnboardingWardDraft): boolean =>
    draft.currentStep === MAX_STEP && REQUIRED_COMPLETION_STEPS.every((step) => getStepValidation(draft, step).isValid);

export const getCompletionValidationIssues = (draft: TOnboardingWardDraft): TOnboardingValidationIssue[] =>
    REQUIRED_COMPLETION_STEPS.flatMap((step) => getStepValidation(draft, step).issues);

export const getActionState = (draft: TOnboardingWardDraft): TOnboardingActionState => ({
    canGoPrev: canGoPrev(draft),
    canGoNext: canGoNext(draft),
    canComplete: canComplete(draft),
});
