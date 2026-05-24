import {describe, expect, it} from 'vitest';
import {
    addNurseDraft,
    addShiftTypeDraft,
    addTeamDraft,
    canComplete,
    canGoNext,
    createInitialDraft,
    deleteTeamDraft,
    deleteShiftTypeDraft,
    getStepValidation,
    MAX_ONBOARDING_SHIFT_TYPES,
    reorderNursesWithinTeam,
    saveSkillLevelConfig,
    updateNurseDraft,
    updateShiftTypeDraft,
} from '../model';

describe('OnboardingWardCreatePage model', () => {
    it('requires at least one ward identity name on the first step', () => {
        const initialDraft = createInitialDraft();

        expect(getStepValidation(initialDraft, 1).issues).toEqual([{code: 'missing-hospital-name', step: 1}]);

        const withHospitalName = {
            ...initialDraft,
            hospitalName: '듀팅병원',
        };

        expect(getStepValidation(withHospitalName, 1).isValid).toBe(true);
    });

    it('returns validation issues for invalid shift types', () => {
        const initialDraft = createInitialDraft();
        const extraShiftDraft = addShiftTypeDraft({
            ...initialDraft,
            currentStep: 3,
        });
        const validation = getStepValidation(extraShiftDraft, 3);

        expect(validation.isValid).toBe(false);
        expect(validation.issues.map((issue) => issue.code)).toEqual(
            expect.arrayContaining(['missing-shift-name', 'missing-shift-short-name']),
        );
        expect(canGoNext(extraShiftDraft)).toBe(false);
    });

    it('blocks duplicate shift names and short names', () => {
        const initialDraft = createInitialDraft();
        const firstShift = initialDraft.shiftTypes[0];
        const secondShift = initialDraft.shiftTypes[1];

        if (!firstShift || !secondShift) {
            throw new Error('base shift types are required for this test');
        }

        const duplicateDraft = updateShiftTypeDraft(
            {
                ...initialDraft,
                currentStep: 3,
            },
            secondShift.id,
            {
                name: firstShift.name,
                shortName: firstShift.shortName,
            },
        );
        const validation = getStepValidation(duplicateDraft, 3);

        expect(validation.issues).toEqual(
            expect.arrayContaining([
                {code: 'duplicate-shift-name', step: 3, targetId: firstShift.id},
                {code: 'duplicate-shift-name', step: 3, targetId: secondShift.id},
                {code: 'duplicate-shift-short-name', step: 3, targetId: firstShift.id},
                {code: 'duplicate-shift-short-name', step: 3, targetId: secondShift.id},
            ]),
        );
        expect(canGoNext(duplicateDraft)).toBe(false);
    });

    it('limits shift types to the maximum count', () => {
        const draft = createInitialDraft();
        const maxShiftDraft = Array.from({length: MAX_ONBOARDING_SHIFT_TYPES - draft.shiftTypes.length}).reduce(
            (acc) => addShiftTypeDraft(acc),
            draft,
        );

        expect(maxShiftDraft.shiftTypes).toHaveLength(MAX_ONBOARDING_SHIFT_TYPES);

        const afterExceeded = addShiftTypeDraft(maxShiftDraft);

        expect(afterExceeded.shiftTypes).toHaveLength(MAX_ONBOARDING_SHIFT_TYPES);
    });

    it('deletes a team and all nurses in that team', () => {
        const draft = createInitialDraft();
        const targetTeamId = draft.teams[0]?.id ?? '';
        const teamNurseIds = draft.nurses.filter((nurse) => nurse.teamId === targetTeamId).map((nurse) => nurse.id);
        const nextDraft = deleteTeamDraft(draft, targetTeamId);

        expect(nextDraft.teams.some((team) => team.id === targetTeamId)).toBe(false);
        expect(nextDraft.nurses.some((nurse) => teamNurseIds.includes(nurse.id))).toBe(false);
    });

    it('adds a nurse with all shift types selected by default', () => {
        const draft = createInitialDraft();
        const teamId = draft.teams[0]?.id ?? '';
        const nextDraft = addNurseDraft(draft, teamId);
        const addedNurse = nextDraft.nurses.at(-1);

        expect(addedNurse).toBeDefined();
        expect(addedNurse?.possibleShiftTypeIds).toEqual(nextDraft.shiftTypes.map((shiftType) => shiftType.id));
    });

    it('removes deleted shift ids from nurse possible shifts', () => {
        const draft = createInitialDraft();
        const deletedShiftId = draft.shiftTypes[0]?.id ?? '';
        const nextDraft = deleteShiftTypeDraft(draft, deletedShiftId);

        expect(nextDraft.shiftTypes.some((shiftType) => shiftType.id === deletedShiftId)).toBe(false);
        expect(nextDraft.nurses.every((nurse) => !nurse.possibleShiftTypeIds.includes(deletedShiftId))).toBe(true);
    });

    it('flags empty teams and missing nurse names in nurse steps', () => {
        const draft = createInitialDraft();
        const {draft: draftWithTeam} = addTeamDraft({
            ...draft,
            currentStep: 4,
        });
        const nurseId = draftWithTeam.nurses[0]?.id ?? '';
        const invalidDraft = updateNurseDraft(draftWithTeam, nurseId, {name: ''});
        const validation = getStepValidation(invalidDraft, 4);

        expect(validation.isValid).toBe(false);
        expect(validation.issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(['empty-team-nurses', 'missing-nurse-name']));
        expect(canGoNext(invalidDraft)).toBe(false);
    });

    it('flags invalid nurse names when korean input has incomplete jamo or too short syllables', () => {
        const draft = createInitialDraft();
        const nurseId = draft.nurses[0]?.id ?? '';
        const jamoNameDraft = updateNurseDraft(
            {
                ...draft,
                currentStep: 4,
            },
            nurseId,
            {name: 'ㄱㅣㅁ'},
        );
        const shortKoreanNameDraft = updateNurseDraft(jamoNameDraft, nurseId, {name: '홍'});

        expect(getStepValidation(jamoNameDraft, 4).issues).toEqual(
            expect.arrayContaining([{code: 'invalid-nurse-name', step: 4, targetId: nurseId}]),
        );
        expect(getStepValidation(shortKoreanNameDraft, 4).issues).toEqual(
            expect.arrayContaining([{code: 'invalid-nurse-name', step: 4, targetId: nurseId}]),
        );
        expect(canGoNext(shortKoreanNameDraft)).toBe(false);
    });

    it('allows off shifts without times but blocks working shifts without times', () => {
        const draft = createInitialDraft();
        const offShiftId = draft.shiftTypes.find((shiftType) => shiftType.isOff)?.id ?? '';
        const workingShiftId = draft.shiftTypes.find((shiftType) => !shiftType.isOff)?.id ?? '';
        const withoutOffTimes = updateShiftTypeDraft(draft, offShiftId, {startTime: '', endTime: ''});
        const withoutWorkingStartTime = updateShiftTypeDraft(withoutOffTimes, workingShiftId, {startTime: ''});
        const validation = getStepValidation(withoutWorkingStartTime, 3);

        expect(validation.issues).toEqual(expect.arrayContaining([{code: 'missing-shift-time', step: 3, targetId: workingShiftId}]));
        expect(validation.issues).not.toEqual(expect.arrayContaining([{code: 'missing-shift-time', step: 3, targetId: offShiftId}]));
    });

    it('flags invalid shift time format', () => {
        const draft = createInitialDraft();
        const workingShiftId = draft.shiftTypes.find((shiftType) => shiftType.classification === 'DAY')?.id ?? '';
        const invalidFormatDraft = updateShiftTypeDraft(
            {
                ...draft,
                currentStep: 3,
            },
            workingShiftId,
            {startTime: '24:00'},
        );
        const validation = getStepValidation(invalidFormatDraft, 3);

        expect(validation.issues).toEqual(expect.arrayContaining([{code: 'invalid-shift-time-format', step: 3, targetId: workingShiftId}]));
        expect(canGoNext(invalidFormatDraft)).toBe(false);
    });

    it('flags invalid shift time order when end time is earlier than start time', () => {
        const draft = createInitialDraft();
        const dayShiftId = draft.shiftTypes.find((shiftType) => shiftType.classification === 'DAY')?.id ?? '';
        const invalidOrderDraft = updateShiftTypeDraft(
            {
                ...draft,
                currentStep: 3,
            },
            dayShiftId,
            {
                startTime: '12:00',
                endTime: '11:00',
            },
        );
        const validation = getStepValidation(invalidOrderDraft, 3);

        expect(validation.issues).toEqual(expect.arrayContaining([{code: 'invalid-shift-time-order', step: 3, targetId: dayShiftId}]));
        expect(canGoNext(invalidOrderDraft)).toBe(false);
    });

    it('allows overnight order for night shifts', () => {
        const draft = createInitialDraft();
        const nightShiftId = draft.shiftTypes.find((shiftType) => shiftType.classification === 'NIGHT')?.id;
        const validation = getStepValidation(
            {
                ...draft,
                currentStep: 3,
            },
            3,
        );
        const nightOrderIssue = validation.issues.find(
            (issue) => issue.code === 'invalid-shift-time-order' && issue.targetId === nightShiftId,
        );

        expect(nightOrderIssue).toBeUndefined();
    });

    it('reports empty-team when all onboarding teams are removed', () => {
        const draft = createInitialDraft();
        const withoutTeams = {
            ...draft,
            currentStep: 4 as const,
            teams: [],
            nurses: [],
        };
        const validation = getStepValidation(withoutTeams, 4);

        expect(validation.isValid).toBe(false);
        expect(validation.issues).toEqual([{code: 'empty-team', step: 4}]);
        expect(canGoNext(withoutTeams)).toBe(false);
    });

    it('keeps nurse order changes scoped to the active team', () => {
        const draft = createInitialDraft();
        const activeTeamId = draft.teams[0]?.id ?? '';
        const otherTeamId = draft.teams[1]?.id ?? '';
        const otherTeamNurse = {
            ...draft.nurses[0]!,
            id: 'other-team-nurse',
            teamId: otherTeamId,
            name: '다른 팀 간호사',
        };
        const draftWithOtherTeamNurse = {
            ...draft,
            nurses: [...draft.nurses, otherTeamNurse],
        };
        const teamNursesBefore = draftWithOtherTeamNurse.nurses.filter((nurse) => nurse.teamId === activeTeamId);
        const reordered = reorderNursesWithinTeam(draftWithOtherTeamNurse, activeTeamId, {
            source: {droppableId: activeTeamId, index: 0},
            destination: {droppableId: activeTeamId, index: 1},
        });
        const teamNursesAfter = reordered.nurses.filter((nurse) => nurse.teamId === activeTeamId);

        expect(teamNursesAfter[0]?.id).toBe(teamNursesBefore[1]?.id);
        expect(reordered.nurses.find((nurse) => nurse.id === otherTeamNurse.id)?.teamId).toBe(otherTeamId);
    });

    it('allows completion only when step 4 validation passes', () => {
        const draft = createInitialDraft();
        const withSecondTeamNurse = addNurseDraft(draft, draft.teams[1]!.id);
        const withAllTeamNurses = addNurseDraft(withSecondTeamNurse, draft.teams[2]!.id);
        const step4Draft = {
            ...withAllTeamNurses,
            currentStep: 4 as const,
            hospitalName: '듀팅병원',
        };
        const validShiftDraft = updateShiftTypeDraft(step4Draft, step4Draft.shiftTypes[0]!.id, {name: '데이 근무'});
        const validNurseDraft = updateNurseDraft(validShiftDraft, validShiftDraft.nurses[0]!.id, {name: '홍길동'});

        expect(canComplete(validNurseDraft)).toBe(true);

        const invalidDraft = updateNurseDraft(validNurseDraft, validNurseDraft.nurses[0]!.id, {name: ''});

        expect(canComplete(invalidDraft)).toBe(false);
    });

    it('blocks completion when an earlier required step is invalid', () => {
        const draft = createInitialDraft();
        const withSecondTeamNurse = addNurseDraft(draft, draft.teams[1]!.id);
        const withAllTeamNurses = addNurseDraft(withSecondTeamNurse, draft.teams[2]!.id);
        const invalidShiftDraft = addShiftTypeDraft({
            ...withAllTeamNurses,
            currentStep: 4,
            hospitalName: '듀팅병원',
        });

        expect(getStepValidation(invalidShiftDraft, 3).isValid).toBe(false);
        expect(getStepValidation(invalidShiftDraft, 4).isValid).toBe(true);
        expect(canComplete(invalidShiftDraft)).toBe(false);
    });

    it('clamps nurse levels to the configured range when auto assignment is disabled', () => {
        const draft = createInitialDraft();
        const withCustomLevels = {
            ...draft,
            nurses: draft.nurses.map((nurse, index) => ({
                ...nurse,
                level: index === 0 ? null : 5,
            })),
        };
        const nextDraft = saveSkillLevelConfig(withCustomLevels, {
            levelCount: 3,
            paletteId: 'cool',
            autoAssign: false,
        });

        expect(nextDraft.skillLevelConfig).toEqual({
            levelCount: 3,
            paletteId: 'cool',
            autoAssign: false,
        });
        expect(nextDraft.nurses.map((nurse) => nurse.level)).toEqual([3, 3, 3, 3]);
    });
});
