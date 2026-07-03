import {beforeEach, describe, expect, it, vi} from 'vitest';
import toast from 'react-hot-toast';
import {saveWardSkillSettings} from '@/features/ward-skill/model/skill-level';
import {WardAPI} from '@/shared/api';
import {render, screen, userEvent, waitFor, within} from '@/shared/util/test-utils';
import {Constraints} from '../constraints';

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('@/features/auth/model/store', () => ({
    default: (selector: (state: {wardId: number}) => unknown) => selector({wardId: 1}),
}));

vi.mock('../../../model/make-shift-store', () => ({
    useMakeShiftStore: (
        selector: (state: {
            currentShiftTeamId: number;
            shiftTeams: {shiftTeamId: number; name: string; nurseCnt: number; nurses: never[]}[];
            year: number;
            month: number;
        }) => unknown,
    ) =>
        selector({
            currentShiftTeamId: 10,
            shiftTeams: [{shiftTeamId: 10, name: 'A Team', nurseCnt: 2, nurses: []}],
            year: 2026,
            month: 6,
        }),
}));

vi.mock('@/shared/api', () => ({
    WardAPI: {
        getShiftConstraintRuleCandidates: vi.fn(),
        getShiftConstraintRules: vi.fn(),
        updateShiftConstraintRules: vi.fn(),
        getShiftTeamNurses: vi.fn(),
        getShiftTypes: vi.fn(),
    },
}));

const wardApiMocks = vi.mocked(WardAPI);
const recommendedTemplateCodes = [
    'CORE_MAX_CONTINUOUS_WORK',
    'CORE_MIN_NIGHT_INTERVAL',
    'FORBID_N_THEN_D',
    'FORBID_N_THEN_E',
    'FORBID_E_THEN_D',
    'CORE_MAX_CONTINUOUS_NIGHT',
    'CORE_MIN_OFF_AFTER_NIGHT',
    'CORE_EXCLUDE_NIGHT_BEFORE_REQ_OFF',
];
const recommendedDefaultParamsByTemplateCode: Record<string, Record<string, unknown>> = {
    CORE_MAX_CONTINUOUS_WORK: {target: {type: 'ALL'}, count: 5},
    CORE_MIN_NIGHT_INTERVAL: {target: {type: 'ALL'}, count: 5},
    CORE_MAX_CONTINUOUS_NIGHT: {target: {type: 'ALL'}, count: 3},
    CORE_MIN_CONTINUOUS_NIGHT: {target: {type: 'ALL'}, count: 2},
    CORE_MIN_OFF_AFTER_NIGHT: {target: {type: 'ALL'}, count: 2},
    FORBID_N_THEN_D: {target: {type: 'ALL'}},
    FORBID_N_THEN_E: {target: {type: 'ALL'}},
    FORBID_E_THEN_D: {target: {type: 'ALL'}},
    CORE_EXCLUDE_NIGHT_BEFORE_REQ_OFF: {target: {type: 'ALL'}},
};
const recommendedCategoryByTemplateCode: Record<string, string> = {
    FORBID_N_THEN_D: 'FORBIDDEN_PATTERN',
    FORBID_N_THEN_E: 'FORBIDDEN_PATTERN',
    FORBID_E_THEN_D: 'FORBIDDEN_PATTERN',
};
const recommendedTemplates = recommendedTemplateCodes.map((templateCode, index) => ({
    templateCode,
    category: recommendedCategoryByTemplateCode[templateCode] ?? 'CORE',
    displayTemplate: index === 0 ? '연속 근무는 {count}일 이하로 배정해요' : `${templateCode} {count}`,
    severity: 'HARD' as const,
    allowedSeverities: ['HARD' as const, 'SOFT' as const],
    supportedInGenerator: true,
    supportedInValidator: true,
    slots:
        templateCode === 'CORE_EXCLUDE_NIGHT_BEFORE_REQ_OFF' || templateCode.startsWith('FORBID_')
            ? [{key: 'target', label: 'Target', inputType: 'SELECT', optionGroup: 'TARGETS'}]
            : [
                  {key: 'target', label: 'Target', inputType: 'SELECT', optionGroup: 'TARGETS'},
                  {key: 'count', label: 'Count', inputType: 'NUMBER', min: 1, max: 7},
              ],
}));
const recommendedServerRules = recommendedTemplateCodes.map((templateCode, index) => ({
    shiftConstraintRuleId: index + 1,
    templateCode,
    category: recommendedCategoryByTemplateCode[templateCode] ?? 'CORE',
    severity: 'HARD' as const,
    sortOrder: index + 1,
    params: recommendedDefaultParamsByTemplateCode[templateCode],
    selected: true,
    isImportant: true,
}));

describe('Constraints', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.localStorage.clear();
        wardApiMocks.getShiftConstraintRules.mockResolvedValue({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            rules: [],
        });
        wardApiMocks.updateShiftConstraintRules.mockImplementation(async (wardId, shiftTeamId, payload) => ({
            schemaVersion: 1,
            wardId,
            shiftTeamId,
            rules: payload.rules.map((rule, index) => ({
                ...rule,
                shiftConstraintRuleId: rule.shiftConstraintRuleId ?? index + 100,
                category: rule.templateCode === 'SOFT_NO_SAME_DUTY_PAIR' ? 'COMBINATION' : 'CORE',
                displayText: '',
                isValid: true,
                invalidReason: null,
            })),
        }));
        wardApiMocks.getShiftConstraintRuleCandidates.mockResolvedValue({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            options: {
                targets: [{type: 'ALL', label: '전체'}],
                nurses: [
                    {type: 'NURSE', nurseId: 1, label: 'Nurse A', name: 'Nurse A'},
                    {type: 'NURSE', nurseId: 2, label: 'Nurse B', name: 'Nurse B'},
                ],
            },
            templates: [
                ...recommendedTemplates,
                {
                    templateCode: 'SOFT_NO_SAME_DUTY_PAIR',
                    category: 'COMBINATION',
                    displayTemplate: '{nurseA} and {nurseB} should not work together',
                    severity: 'SOFT',
                    allowedSeverities: ['SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [
                        {key: 'nurseA', label: 'Nurse A', inputType: 'SELECT', optionGroup: 'NURSES'},
                        {key: 'nurseB', label: 'Nurse B', inputType: 'SELECT', optionGroup: 'NURSES'},
                    ],
                },
            ],
        });
        wardApiMocks.getShiftTeamNurses.mockResolvedValue([
            {nurseId: 1, name: 'Nurse A', isPreceptor: false},
            {nurseId: 2, name: 'Nurse B', isPreceptor: false},
        ] as never);
        wardApiMocks.getShiftTypes.mockResolvedValue([]);
    });

    it('keeps the rule list empty when the server has no saved rules', async () => {
        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        expect(await screen.findByText('제약조건을 추가하면 여기에 보여요.')).toBeInTheDocument();

        expect(screen.queryByText((content) => content.includes('연속 근무는'))).not.toBeInTheDocument();
        expect(wardApiMocks.updateShiftConstraintRules).not.toHaveBeenCalled();
    });

    it('hides legacy bundled forbidden-pattern templates from the recommended add modal', async () => {
        wardApiMocks.getShiftConstraintRuleCandidates.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            options: {
                targets: [{type: 'ALL', label: 'All'}],
            },
            templates: [
                {
                    templateCode: 'CORE_VISIBLE_SENTINEL',
                    category: 'CORE',
                    displayTemplate: 'VISIBLE_RECOMMENDED_SENTINEL',
                    severity: 'HARD',
                    allowedSeverities: ['HARD', 'SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [],
                },
                {
                    templateCode: 'CORE_FORBIDDEN_DUTY_PATTERNS',
                    category: 'CORE',
                    displayTemplate: 'LEGACY_BUNDLE_SHOULD_HIDE',
                    severity: 'HARD',
                    allowedSeverities: ['HARD', 'SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [],
                },
            ],
        });

        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        const addButton = await waitFor(() => {
            const button = document.getElementById('make_constraint_add_button');

            expect(button).toBeInTheDocument();

            return button as HTMLButtonElement;
        });

        await userEvent.click(addButton);

        expect(await screen.findByText('VISIBLE_RECOMMENDED_SENTINEL')).toBeInTheDocument();
        expect(screen.queryByText('LEGACY_BUNDLE_SHOULD_HIDE')).not.toBeInTheDocument();
        expect(screen.queryByText('CORE')).not.toBeInTheDocument();
    });

    it('uses a single not-alone night template and shows nurse role badges', async () => {
        saveWardSkillSettings(1, {
            config: {
                enabled: true,
                levelCount: 2,
                paletteId: 'warm',
                autoAssign: false,
                levelLabels: {1: '전담', 2: '리더'},
            },
            frozenLevelsByNurseId: {},
        });
        wardApiMocks.getShiftConstraintRuleCandidates.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            options: {
                nurses: [{type: 'NURSE', nurseId: 1, label: '오지현', name: '오지현', proficiency: 1, isPreceptor: true, isPreceptee: true}],
                preceptees: [{type: 'NURSE', nurseId: 1, label: '오지현', name: '오지현', proficiency: 1, isPreceptee: true}],
            },
            templates: [
                {
                    templateCode: 'NURSE_NOT_ALONE_N',
                    category: 'PROFICIENCY',
                    displayTemplate: '{nurse}는 혼자 N나이트 근무를 하면 안 돼요',
                    severity: 'SOFT',
                    allowedSeverities: ['SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [{key: 'nurse', label: 'Nurse', inputType: 'SELECT', optionGroup: 'NURSES'}],
                },
                {
                    templateCode: 'NEW_NURSE_NOT_ALONE_N',
                    category: 'PROFICIENCY',
                    displayTemplate: '{nurse}는 혼자 N나이트 근무를 하면 안 돼요',
                    severity: 'SOFT',
                    allowedSeverities: ['SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [{key: 'nurse', label: 'Nurse', inputType: 'SELECT', optionGroup: 'NURSES'}],
                },
                {
                    templateCode: 'PRECEPTEE_NOT_ALONE_N',
                    category: 'PROFICIENCY',
                    displayTemplate: '{preceptee}는 혼자 N나이트 근무를 하면 안 돼요',
                    severity: 'SOFT',
                    allowedSeverities: ['SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [{key: 'preceptee', label: 'Preceptee', inputType: 'SELECT', optionGroup: 'PRECEPTEES'}],
                },
            ],
        });

        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        const addButton = await waitFor(() => {
            const button = document.getElementById('make_constraint_add_button');

            expect(button).toBeInTheDocument();

            return button as HTMLButtonElement;
        });

        await userEvent.click(addButton);
        await userEvent.click(screen.getByRole('button', {name: '숙련도'}));

        await waitFor(() => {
            expect((document.body.textContent?.match(/혼자/g) ?? [])).toHaveLength(1);
        });
        expect(document.body.textContent).toContain('오지현');

        await userEvent.click(screen.getByRole('button', {name: /오지현/}));

        expect(document.body.textContent).toContain('LV1');
        expect(document.body.textContent).toContain('프리셉터');
        expect(document.body.textContent).toContain('프리셉티');
    });

    it('shows a toast instead of silently removing a duplicate added constraint', async () => {
        wardApiMocks.getShiftConstraintRuleCandidates.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            options: {
                targets: [{type: 'ALL', label: '전체'}],
            },
            templates: [
                {
                    templateCode: 'CORE_VISIBLE_SENTINEL',
                    category: 'CORE',
                    displayTemplate: 'VISIBLE_RECOMMENDED_SENTINEL',
                    severity: 'HARD',
                    allowedSeverities: ['HARD', 'SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [],
                },
            ],
        });

        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        const openAddModal = async () => {
            const addButton = await waitFor(() => {
                const button = document.getElementById('make_constraint_add_button');

                expect(button).toBeInTheDocument();

                return button as HTMLButtonElement;
            });

            await userEvent.click(addButton);
        };

        await openAddModal();
        {
            const modalAddButtons = screen.getAllByRole('button', {name: '제약 조건 추가'});

            await userEvent.click(modalAddButtons[modalAddButtons.length - 1]!);
        }

        await waitFor(() => {
            expect(wardApiMocks.updateShiftConstraintRules).toHaveBeenCalledTimes(1);
        });

        await openAddModal();
        {
            const modalAddButtons = screen.getAllByRole('button', {name: '제약 조건 추가'});

            await userEvent.click(modalAddButtons[modalAddButtons.length - 1]!);
        }

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('중복 제약조건은 삭제하고 기존 조건만 남겼어요.');
        });
        expect(wardApiMocks.updateShiftConstraintRules).toHaveBeenCalledTimes(1);
    });

    it('shows recommended templates in their original modal categories too', async () => {
        wardApiMocks.getShiftConstraintRuleCandidates.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            options: {
                targets: [{type: 'ALL', label: '모든 사람'}],
            },
            templates: [
                {
                    templateCode: 'FORBID_N_THEN_D',
                    category: 'FORBIDDEN_PATTERN',
                    displayTemplate: '{target}은 N나이트 다음 날 D데이 근무를 피해요.',
                    severity: 'SOFT',
                    allowedSeverities: ['HARD', 'SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [{key: 'target', label: 'Target', inputType: 'SELECT', optionGroup: 'TARGETS'}],
                },
                {
                    templateCode: 'CORE_MAX_CONTINUOUS_WORK',
                    category: 'CORE',
                    displayTemplate: '{target}은 {count}일 이상 연속으로 근무하면 안 돼요.',
                    severity: 'HARD',
                    allowedSeverities: ['HARD', 'SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [
                        {key: 'target', label: 'Target', inputType: 'SELECT', optionGroup: 'TARGETS'},
                        {key: 'count', label: 'Count', inputType: 'NUMBER', min: 1, max: 31},
                    ],
                },
            ],
        });

        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        const addButton = await waitFor(() => {
            const button = document.getElementById('make_constraint_add_button');

            expect(button).toBeInTheDocument();

            return button as HTMLButtonElement;
        });

        await userEvent.click(addButton);

        await waitFor(() => {
            expect(document.body.textContent).toContain('다음 날');
            expect(document.body.textContent).toContain('근무를 피해요');
        });

        await userEvent.click(screen.getByRole('button', {name: '금지 패턴'}));

        expect(document.body.textContent).toContain('다음 날');
        expect(document.body.textContent).toContain('근무를 피해요');

        await userEvent.click(screen.getByRole('button', {name: '연속 근무/휴식'}));

        expect(document.body.textContent).toContain('5일 이상 연속으로 근무');
    });

    it('uses worker-management proficiency labels without duplicating the LV template prefix', async () => {
        saveWardSkillSettings(1, {
            config: {
                enabled: true,
                levelCount: 2,
                paletteId: 'warm',
                autoAssign: false,
                levelLabels: {1: '전담', 2: '리더'},
            },
            frozenLevelsByNurseId: {},
        });
        wardApiMocks.getShiftConstraintRuleCandidates.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            options: {
                shiftsWithAll: [{type: 'WARD_SHIFT_TYPE', wardShiftTypeId: 11, label: 'N 나이트', code: 'N', name: '나이트'}],
                proficiencies: [{type: 'PROFICIENCY_AT_LEAST', level: 1, label: '서버값'}],
            },
            templates: [
                {
                    templateCode: 'MIN_PROFICIENCY_STAFF_BY_SHIFT',
                    category: 'PROFICIENCY',
                    displayTemplate: '{shift} 근무에는 LV{level} 이상 간호사가 {count}명 이상 있어야 해요',
                    severity: 'SOFT',
                    allowedSeverities: ['SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [
                        {key: 'shift', label: 'Shift', inputType: 'SELECT', optionGroup: 'SHIFTS_WITH_ALL'},
                        {key: 'level', label: 'Level', inputType: 'SELECT', optionGroup: 'PROFICIENCIES'},
                        {key: 'count', label: 'Count', inputType: 'NUMBER', min: 1, max: 3},
                    ],
                },
            ],
        });
        wardApiMocks.getShiftTypes.mockResolvedValueOnce([
            {wardShiftTypeId: 11, shortName: 'N', name: '나이트', color: '#3B82F6', isActive: true},
        ] as never);

        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        const addButton = await waitFor(() => {
            const button = document.getElementById('make_constraint_add_button');

            expect(button).toBeInTheDocument();

            return button as HTMLButtonElement;
        });

        await userEvent.click(addButton);

        expect(screen.getByRole('button', {name: '리더'})).toBeInTheDocument();
        expect(screen.queryByRole('button', {name: '서버값'})).not.toBeInTheDocument();
        expect(screen.queryByText((content) => content.includes('LV리더'))).not.toBeInTheDocument();

        const modalAddButtons = screen.getAllByRole('button', {name: '제약 조건 추가'});

        await userEvent.click(modalAddButtons[modalAddButtons.length - 1]!);

        await waitFor(() => {
            expect(wardApiMocks.updateShiftConstraintRules).toHaveBeenCalledWith(
                1,
                10,
                expect.objectContaining({
                    rules: expect.arrayContaining([
                        expect.objectContaining({
                            templateCode: 'MIN_PROFICIENCY_STAFF_BY_SHIFT',
                            params: expect.objectContaining({
                                count: 1,
                            }),
                        }),
                    ]),
                }),
            );
        });
    });

    it('hides proficiency constraints from the add modal when worker skill is disabled', async () => {
        saveWardSkillSettings(1, {
            config: {
                enabled: false,
                levelCount: 2,
                paletteId: 'warm',
                autoAssign: false,
                levelLabels: {1: '전담', 2: '리더'},
            },
            frozenLevelsByNurseId: {},
        });
        wardApiMocks.getShiftConstraintRuleCandidates.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            options: {
                shiftsWithAll: [{type: 'WARD_SHIFT_TYPE', wardShiftTypeId: 11, label: 'N 나이트', code: 'N', name: '나이트'}],
                proficiencies: [{type: 'PROFICIENCY_AT_LEAST', level: 1, label: '서버값'}],
                nurses: [
                    {type: 'NURSE', nurseId: 1, label: 'Nurse A', name: 'Nurse A'},
                    {type: 'NURSE', nurseId: 2, label: 'Nurse B', name: 'Nurse B'},
                ],
            },
            templates: [
                {
                    templateCode: 'MIN_PROFICIENCY_STAFF_BY_SHIFT',
                    category: 'PROFICIENCY',
                    displayTemplate: '{shift} 근무에는 LV{level} 이상 간호사가 {count}명 이상 있어야 해요',
                    severity: 'SOFT',
                    allowedSeverities: ['SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [
                        {key: 'shift', label: 'Shift', inputType: 'SELECT', optionGroup: 'SHIFTS_WITH_ALL'},
                        {key: 'level', label: 'Level', inputType: 'SELECT', optionGroup: 'PROFICIENCIES'},
                        {key: 'count', label: 'Count', inputType: 'NUMBER', min: 1, max: 3},
                    ],
                },
                {
                    templateCode: 'SOFT_NO_SAME_DUTY_PAIR',
                    category: 'COMBINATION',
                    displayTemplate: '{nurseA} and {nurseB} should not work together',
                    severity: 'SOFT',
                    allowedSeverities: ['SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [
                        {key: 'nurseA', label: 'Nurse A', inputType: 'SELECT', optionGroup: 'NURSES'},
                        {key: 'nurseB', label: 'Nurse B', inputType: 'SELECT', optionGroup: 'NURSES'},
                    ],
                },
            ],
        });

        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        const addButton = await waitFor(() => {
            const button = document.getElementById('make_constraint_add_button');

            expect(button).toBeInTheDocument();

            return button as HTMLButtonElement;
        });

        await userEvent.click(addButton);

        expect(screen.queryByText((content) => content.includes('근무에는'))).not.toBeInTheDocument();
        expect(screen.queryByRole('button', {name: '리더'})).not.toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Nurse A'})).toBeInTheDocument();
    });

    it('asks for confirmation before deleting or unmarking a recommended rule', async () => {
        wardApiMocks.getShiftConstraintRules.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            rules: recommendedServerRules,
        });

        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        expect(await screen.findAllByRole('button', {name: '모든사람'})).not.toHaveLength(0);

        await userEvent.click(screen.getAllByRole('button', {name: '제약 조건 삭제'})[0]!);
        expect(screen.getByText('권장 조건을 삭제할까요?')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', {name: '유지하기'}));
        await userEvent.click(screen.getAllByRole('checkbox', {name: '중요 표시 해제'})[0]!);

        expect(screen.getByText('중요 표시를 뺄까요?')).toBeInTheDocument();
    });

    it('saves important toggles as severity changes', async () => {
        wardApiMocks.getShiftConstraintRules.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            rules: [
                {
                    shiftConstraintRuleId: 1,
                    templateCode: 'SOFT_NO_SAME_DUTY_PAIR',
                    category: 'COMBINATION',
                    severity: 'HARD',
                    sortOrder: 1,
                    params: {
                        nurseA: {type: 'NURSE', nurseId: 1, label: 'Nurse A'},
                        nurseB: {type: 'NURSE', nurseId: 2, label: 'Nurse B'},
                    },
                    selected: true,
                    isImportant: true,
                },
            ],
        });

        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        expect(await screen.findByRole('button', {name: 'Nurse A'})).toBeInTheDocument();

        await userEvent.click(screen.getAllByRole('checkbox', {name: '중요 표시 해제'})[0]!);

        await waitFor(() => {
            expect(wardApiMocks.updateShiftConstraintRules).toHaveBeenCalledWith(
                1,
                10,
                expect.objectContaining({
                    rules: expect.arrayContaining([
                        expect.objectContaining({
                            templateCode: 'SOFT_NO_SAME_DUTY_PAIR',
                            severity: 'SOFT',
                            isImportant: false,
                        }),
                    ]),
                }),
            );
        });
    });

    it('shows all nurses for the first worker-combination dropdown and excludes that nurse from the next dropdown', async () => {
        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        const addButton = await waitFor(() => {
            const button = document.getElementById('make_constraint_add_button');

            expect(button).toBeInTheDocument();

            return button as HTMLButtonElement;
        });

        await userEvent.click(addButton);
        await userEvent.click(screen.getByRole('button', {name: '근무자 조합'}));
        await userEvent.click(screen.getByRole('button', {name: 'Nurse A'}));

        let listbox = await screen.findByRole('listbox');

        expect(within(listbox).getByRole('option', {name: 'Nurse A'})).toBeInTheDocument();
        expect(within(listbox).getByRole('option', {name: 'Nurse B'})).toBeInTheDocument();

        await userEvent.click(within(listbox).getByRole('option', {name: 'Nurse B'}));
        await userEvent.click(screen.getByRole('button', {name: 'Nurse A'}));

        listbox = await screen.findByRole('listbox');

        expect(within(listbox).getByRole('option', {name: 'Nurse A'})).toBeInTheDocument();
        expect(within(listbox).queryByRole('option', {name: 'Nurse B'})).not.toBeInTheDocument();
    });

    it('saves changed rules through the shared shift constraint rules API', async () => {
        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="flow" />);

        const addButton = await waitFor(() => {
            const button = document.getElementById('make_constraint_add_button');

            expect(button).toBeInTheDocument();

            return button as HTMLButtonElement;
        });

        await userEvent.click(addButton);
        await userEvent.click(screen.getByRole('button', {name: '근무자 조합'}));
        await userEvent.click(document.querySelector<HTMLButtonElement>('button[title="추가"]')!);

        await waitFor(() => {
            expect(wardApiMocks.updateShiftConstraintRules).toHaveBeenCalledWith(
                1,
                10,
                expect.objectContaining({
                    rules: expect.arrayContaining([
                        expect.objectContaining({
                            templateCode: 'SOFT_NO_SAME_DUTY_PAIR',
                            severity: 'SOFT',
                            params: expect.objectContaining({
                                nurseA: expect.objectContaining({type: 'NURSE', nurseId: 1}),
                                nurseB: expect.objectContaining({type: 'NURSE', nurseId: 2}),
                            }),
                            selected: true,
                        }),
                    ]),
                }),
            );
        });
    });

    it('renders server rules with numeric params without crashing', async () => {
        wardApiMocks.getShiftConstraintRuleCandidates.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            options: {},
            templates: [
                {
                    templateCode: 'SOFT_NO_N_TO_D',
                    category: 'FORBIDDEN',
                    displayTemplate: '{target}은 N 다음날 D 근무를 피해요',
                    severity: 'SOFT',
                    allowedSeverities: ['SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [{key: 'target', label: 'Target', inputType: 'SELECT', optionGroup: 'NURSES'}],
                },
            ],
        });
        wardApiMocks.getShiftConstraintRules.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            rules: [
                {
                    shiftConstraintRuleId: 20,
                    templateCode: 'SOFT_NO_N_TO_D',
                    category: 'FORBIDDEN',
                    severity: 'SOFT',
                    sortOrder: 1,
                    params: {target: 1},
                    selected: true,
                    isImportant: false,
                },
            ],
        });

        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        expect(await screen.findByRole('button', {name: 'Nurse A'})).toBeInTheDocument();
    });

    it('renders legacy forbidden pattern duty chips from configured ward shift types', async () => {
        wardApiMocks.getShiftConstraintRuleCandidates.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            options: {
                targets: [{type: 'ALL', label: '전체'}],
            },
            templates: [
                {
                    templateCode: 'FORBID_N_THEN_D',
                    category: 'FORBIDDEN_PATTERN',
                    displayTemplate: '{target}은 N나이트 다음 날 D데이 근무를 피해요.',
                    severity: 'SOFT',
                    allowedSeverities: ['SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [{key: 'target', label: 'Target', inputType: 'SELECT', optionGroup: 'TARGETS'}],
                },
            ],
        });
        wardApiMocks.getShiftConstraintRules.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            rules: [
                {
                    shiftConstraintRuleId: 21,
                    templateCode: 'FORBID_N_THEN_D',
                    category: 'FORBIDDEN_PATTERN',
                    severity: 'SOFT',
                    sortOrder: 1,
                    params: {target: {type: 'ALL'}},
                    selected: true,
                    isImportant: false,
                },
            ],
        });
        wardApiMocks.getShiftTypes.mockResolvedValueOnce([
            {
                wardShiftTypeId: 101,
                name: '야간전담',
                shortName: 'Y',
                color: '#263238',
                isOff: false,
                classification: 'NIGHT',
                startTime: '21:00',
                endTime: '06:00',
                isDefault: false,
                isCounted: true,
            },
            {
                wardShiftTypeId: 102,
                name: '오전근무',
                shortName: 'M',
                color: '#1976D2',
                isOff: false,
                classification: 'DAY',
                startTime: '07:00',
                endTime: '15:00',
                isDefault: false,
                isCounted: true,
            },
        ]);

        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        await waitFor(() => {
            expect(document.body.textContent).toContain('야간전담');
            expect(document.body.textContent).toContain('오전근무');
            expect(document.body.textContent).not.toContain('N나이트');
            expect(document.body.textContent).not.toContain('D데이');
        });
    });

    it('renders slash-prefixed Korean off text as the configured off shift type chip', async () => {
        wardApiMocks.getShiftConstraintRuleCandidates.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            options: {
                targets: [{type: 'ALL', label: '전체'}],
            },
            templates: [
                {
                    templateCode: 'CORE_EXCLUDE_NIGHT_BEFORE_REQ_OFF',
                    category: 'FORBIDDEN_PATTERN',
                    displayTemplate: '신청한 /오프 전날에는 N나이트 근무를 하면 안 돼요.',
                    severity: 'SOFT',
                    allowedSeverities: ['SOFT'],
                    supportedInGenerator: true,
                    supportedInValidator: true,
                    slots: [{key: 'target', label: 'Target', inputType: 'SELECT', optionGroup: 'TARGETS'}],
                },
            ],
        });
        wardApiMocks.getShiftConstraintRules.mockResolvedValueOnce({
            schemaVersion: 1,
            wardId: 1,
            shiftTeamId: 10,
            rules: [
                {
                    shiftConstraintRuleId: 22,
                    templateCode: 'CORE_EXCLUDE_NIGHT_BEFORE_REQ_OFF',
                    category: 'FORBIDDEN_PATTERN',
                    severity: 'SOFT',
                    sortOrder: 1,
                    params: {target: {type: 'ALL'}},
                    selected: true,
                    isImportant: false,
                },
            ],
        });
        wardApiMocks.getShiftTypes.mockResolvedValueOnce([
            {
                wardShiftTypeId: 201,
                name: '휴무',
                shortName: 'R',
                color: '#6B7280',
                isOff: true,
                classification: 'OFF',
                startTime: '',
                endTime: '',
                isDefault: false,
                isCounted: false,
            },
            {
                wardShiftTypeId: 202,
                name: '야간전담',
                shortName: 'Y',
                color: '#263238',
                isOff: false,
                classification: 'NIGHT',
                startTime: '21:00',
                endTime: '06:00',
                isDefault: false,
                isCounted: true,
            },
        ]);

        render(<Constraints wardId={1} shiftTeamId={10} shiftTeams={[]} year={2026} month={6} variant="settings" />);

        await waitFor(() => {
            expect(document.body.textContent).toContain('휴무');
            expect(document.body.textContent).toContain('야간전담');
            expect(document.body.textContent).not.toContain('/오프');
            expect(document.body.textContent).not.toContain('N나이트');
        });
    });
});
