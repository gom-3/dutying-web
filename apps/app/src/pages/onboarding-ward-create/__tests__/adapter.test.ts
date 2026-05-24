import {describe, expect, it} from 'vitest';
import {type TOnboardingWardParseApiResponse} from '@/shared/api/file/type';
import {
    applyParsedWardData,
    buildCreateWardPayload,
    buildOnboardingParseDraftInjection,
    createInitialDraft,
    getOnboardingUploadFailureMessage,
    isSupportedOnboardingUploadFile,
} from '../model';

describe('OnboardingWardCreatePage adapter', () => {
    it('builds create ward payload outside the UI draft layer', () => {
        const draft = {
            ...createInitialDraft(),
            wardName: '중환자실',
            hospitalName: '듀팅병원',
        };
        const payload = buildCreateWardPayload(draft);

        expect(payload).toHaveProperty('name', draft.wardName);
        expect(payload).toHaveProperty('hospitalName', draft.hospitalName);
        expect(payload.wardShiftTypes).toHaveLength(draft.shiftTypes.length);
        expect(payload.wardShiftTypes[0]).not.toHaveProperty('id');
        expect(payload.shiftTeams).toHaveLength(draft.teams.length);
        expect(payload.shiftTeams[0]).toEqual({
            nurseNames: ['홍길동', '김하늘', '박연우', '이서윤'],
        });
    });

    it('uses a safe fallback name when both ward and hospital names are blank', () => {
        const payload = buildCreateWardPayload(createInitialDraft());

        expect(payload.name).toBe('듀팅 병동');
        expect(payload.hospitalName).toBe('듀팅 병동');
    });

    it('applies parsed response data as draft bootstrap values', () => {
        const draft = createInitialDraft();
        const nextDraft = applyParsedWardData(draft, {
            fileName: 'ward.xlsx',
            wardName: '중환자실',
            hospitalName: '듀팅병원',
            shiftTypes: [
                {name: '데이', shortName: 'D', color: '#111111', classification: 'DAY'},
                {name: '오프', shortName: 'O', color: '#222222', isOff: true, classification: 'OFF'},
            ],
            nurses: [
                {
                    name: '신규 간호사',
                    teamName: 'A팀',
                    possibleShiftShortNames: ['D'],
                    employmentDate: '2025-01-01',
                    level: 2,
                },
            ],
        });

        expect(nextDraft.uploadedFileName).toBe('ward.xlsx');
        expect(nextDraft.wardName).toBe('중환자실');
        expect(nextDraft.hospitalName).toBe('듀팅병원');
        expect(nextDraft.teams).toHaveLength(1);
        expect(nextDraft.teams[0]?.name).toBe('A팀');
        expect(nextDraft.nurses[0]?.teamId).toBe(nextDraft.teams[0]?.id);
        expect(nextDraft.nurses[0]?.possibleShiftTypeIds).toEqual([nextDraft.shiftTypes[0]?.id]);
    });

    it('infers standard shift classifications from parsed short names', () => {
        const draft = createInitialDraft();
        const nextDraft = applyParsedWardData(draft, {
            shiftTypes: [
                {name: '데이', shortName: 'D'},
                {name: '이브닝', shortName: 'E'},
                {name: '나이트', shortName: 'N'},
                {name: '오프', shortName: 'O', isOff: true},
            ],
        });

        expect(nextDraft.shiftTypes.map((shiftType) => shiftType.classification)).toEqual(['DAY', 'EVENING', 'NIGHT', 'OFF']);
    });

    it('falls back to default possible shifts when parsed shift mappings are empty', () => {
        const draft = createInitialDraft();
        const nextDraft = applyParsedWardData(draft, {
            nurses: [
                {
                    name: '신규 간호사',
                    teamName: draft.teams[0]?.name,
                    possibleShiftShortNames: [],
                },
                {
                    name: '다른 간호사',
                    teamName: draft.teams[0]?.name,
                    possibleShiftShortNames: ['UNKNOWN'],
                },
            ],
        });
        const defaultShiftTypeIds = nextDraft.shiftTypes.filter((shiftType) => !shiftType.isOff).map((shiftType) => shiftType.id);

        expect(nextDraft.nurses[0]?.possibleShiftTypeIds).toEqual(defaultShiftTypeIds);
        expect(nextDraft.nurses[1]?.possibleShiftTypeIds).toEqual(defaultShiftTypeIds);
    });

    it('fills missing parsed employmentDate with today', () => {
        const draft = createInitialDraft();
        const today = new Date().toISOString().slice(0, 10);
        const nextDraft = applyParsedWardData(draft, {
            nurses: [
                {
                    name: '신규 간호사',
                    teamName: draft.teams[0]?.name,
                },
            ],
        });

        expect(nextDraft.nurses[0]?.employmentDate).toBe(today);
    });

    it('remaps existing nurse possible shifts by short name after uploaded shift types replace ids', () => {
        const draft = createInitialDraft();
        const dayShift = draft.shiftTypes.find((shiftType) => shiftType.shortName === 'D');
        const eveningShift = draft.shiftTypes.find((shiftType) => shiftType.shortName === 'E');
        const nurseId = draft.nurses[0]?.id ?? '';
        const nurseScopedDraft = {
            ...draft,
            nurses: draft.nurses.map((nurse) =>
                nurse.id === nurseId
                    ? {
                          ...nurse,
                          possibleShiftTypeIds: [dayShift?.id ?? '', eveningShift?.id ?? ''],
                      }
                    : nurse,
            ),
        };
        const nextDraft = applyParsedWardData(nurseScopedDraft, {
            shiftTypes: [
                {name: '데이', shortName: 'D'},
                {name: '미드', shortName: 'M'},
                {name: '오프', shortName: 'O', isOff: true},
            ],
        });
        const remappedNurse = nextDraft.nurses.find((nurse) => nurse.id === nurseId);
        const defaultShiftTypeIds = nextDraft.shiftTypes.filter((shiftType) => !shiftType.isOff).map((shiftType) => shiftType.id);

        expect(remappedNurse?.possibleShiftTypeIds).toEqual([nextDraft.shiftTypes[0]?.id]);
        expect(remappedNurse?.possibleShiftTypeIds).not.toEqual(defaultShiftTypeIds);
    });

    it('falls back nurse team ids to the first uploaded team when previous team names disappear', () => {
        const draft = createInitialDraft();
        const fallbackTeamName = 'A팀';
        const renamedTeamsDraft = {
            ...draft,
            teams: draft.teams.map((team, index) => ({
                ...team,
                name: index === 0 ? fallbackTeamName : `${team.name}-기존`,
            })),
            nurses: draft.nurses.map((nurse, index) => ({
                ...nurse,
                teamId: draft.teams[index === 0 ? 0 : 1]?.id ?? nurse.teamId,
            })),
        };
        const nextDraft = applyParsedWardData(renamedTeamsDraft, {
            teams: [{name: fallbackTeamName}, {name: 'B팀'}],
        });

        expect(nextDraft.teams.map((team) => team.name)).toEqual([fallbackTeamName, 'B팀']);
        expect(nextDraft.nurses.every((nurse) => nurse.teamId === nextDraft.teams[0]?.id)).toBe(true);
    });

    it('merges uploaded skill level config into the existing draft config', () => {
        const draft = createInitialDraft();
        const nextDraft = applyParsedWardData(draft, {
            skillLevelConfig: {
                levelCount: 4,
            },
        });

        expect(nextDraft.skillLevelConfig).toEqual({
            ...draft.skillLevelConfig,
            levelCount: 4,
        });
    });

    it('normalizes parse api responses into draft injection data', () => {
        const response: TOnboardingWardParseApiResponse = {
            wardName: '중환자실',
            hospitalName: '듀팅병원',
            wardShiftTypes: [
                {name: '데이', shortName: 'd'},
                {name: '오프', shortName: 'o', isOff: true},
            ],
            shiftTeams: [{name: 'A팀'}],
            nurses: [
                {
                    name: '신규 간호사',
                    teamName: 'A팀',
                    possibleShiftShortNames: ['d', null],
                },
            ],
            warnings: ['근속 연수가 없는 간호사는 오늘 날짜로 반영되었어요.'],
        };
        const {parsedWardData, warnings} = buildOnboardingParseDraftInjection(response, 'ward.xlsx');

        expect(parsedWardData).toMatchObject({
            fileName: 'ward.xlsx',
            wardName: '중환자실',
            hospitalName: '듀팅병원',
        });
        expect(parsedWardData.shiftTypes?.map((shiftType) => shiftType.shortName)).toEqual(['D', 'O']);
        expect(parsedWardData.teams).toEqual([{name: 'A팀'}]);
        expect(parsedWardData.nurses?.[0]?.possibleShiftShortNames).toEqual(['D']);
        expect(warnings).toEqual(['근속 연수가 없는 간호사는 오늘 날짜로 반영되었어요.']);
    });

    it('collects warnings from failed sheets and rows while trimming parsed upload fields', () => {
        const response: TOnboardingWardParseApiResponse = {
            fileName: ' parsed.xlsx ',
            wardName: ' 중환자실 ',
            hospitalName: ' 듀팅병원 ',
            wardShiftTypes: [
                {name: ' 데이 ', shortName: ' d '},
                {name: ' ', shortName: ' '},
            ],
            shiftTeams: [{name: ' A팀 '}],
            nurses: [
                {
                    name: ' 신규 간호사 ',
                    teamName: ' A팀 ',
                    possibleShiftShortNames: [' d ', null, ' '],
                },
                {
                    name: ' ',
                    teamName: ' ',
                },
            ],
            warnings: ['기본 경고'],
            failedSheets: ['3월'],
            failedRows: ['12행'],
        };
        const {parsedWardData, warnings} = buildOnboardingParseDraftInjection(response, 'fallback.xlsx');

        expect(parsedWardData).toMatchObject({
            fileName: 'parsed.xlsx',
            wardName: '중환자실',
            hospitalName: '듀팅병원',
            shiftTypes: [{name: '데이', shortName: 'D'}],
            teams: [{name: 'A팀'}],
        });
        expect(parsedWardData.nurses).toEqual([
            {
                name: '신규 간호사',
                teamName: 'A팀',
                possibleShiftShortNames: ['D'],
            },
        ]);
        expect(warnings).toEqual(['기본 경고', '시트 "3월" 데이터를 불러오지 못했어요.', '일부 행(12행)을 해석하지 못해 제외했어요.']);
    });

    it('detects supported upload file extensions', () => {
        expect(isSupportedOnboardingUploadFile('march-duty.xlsx')).toBe(true);
        expect(isSupportedOnboardingUploadFile('march-duty.csv')).toBe(true);
        expect(isSupportedOnboardingUploadFile('march-duty.pdf')).toBe(false);
    });

    it('maps network upload failures to a user guidance message', () => {
        expect(getOnboardingUploadFailureMessage(new Error('Network Error'))).toBe(
            '파싱 서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.',
        );
    });
});
