import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen, userEvent} from '@/shared/util/test-utils';
import WardSettingsPage from '../index';

const mockUseWardSettings = vi.fn();
const translations: Record<string, string> = {
    'page.wardSettings.title': '근무 관리',
    'page.wardSettings.tabs.shiftTypes': '근무 유형',
    'page.wardSettings.tabs.constraints': '제약 조건',
    'page.wardSettings.addShiftType': '근무 추가하기',
    'page.wardSettings.type.work': '근무',
    'page.wardSettings.type.leave': '휴무',
    'page.wardSettings.shiftTypes.column.name': '근무명',
    'page.wardSettings.shiftTypes.column.shortName': '약자',
    'page.wardSettings.shiftTypes.column.type': '유형',
    'page.wardSettings.shiftTypes.column.workTime': '근무 시간',
    'page.wardSettings.shiftTypes.column.color': '색상',
    'page.wardSettings.constraints.noTeamsTitle': '등록된 근무팀이 없어요',
    'page.wardSettings.constraints.noTeamsDescription': '제약 조건을 관리하려면 먼저 근무팀을 만들어 주세요.',
    'page.wardSettings.constraints.error': '제약 조건을 불러오지 못했어요',
    'page.wardSettings.constraints.loading': '제약 조건을 불러오는 중이에요',
};

vi.mock('../model/ward-settings-hook', () => ({
    useWardSettings: (...args: unknown[]) => mockUseWardSettings(...args),
}));

vi.mock('@/shared/hook/use-typed-translation', () => ({
    useTypedTranslation: () => ({
        t: (key: string, values?: Record<string, string | number>) => {
            if (key === 'page.wardSettings.shiftTypes.editAria') {
                return `${values?.name ?? ''} 근무 유형 수정`;
            }

            return translations[key] ?? key;
        },
    }),
}));

vi.mock('@/features/create-shift-modal', () => ({
    default: ({open, shiftType}: {open: boolean; shiftType: {name: string} | null}) =>
        open ? <div>{shiftType ? `edit-modal:${shiftType.name}` : 'create-modal'}</div> : null,
}));

type TMockValue = {
    state: {
        currentTab: 'shiftTypes' | 'constraints';
        shiftTypes: Array<{
            wardShiftTypeId: number;
            name: string;
            shortName: string;
            startTime: string;
            endTime: string;
            color: string;
            isDefault: boolean;
            isOff: boolean;
            isCounted: boolean;
            classification: 'DAY' | 'EVENING' | 'NIGHT' | 'OTHER_WORK' | 'OFF' | 'OTHER_LEAVE';
        }>;
        shiftTypesStatus: 'success' | 'pending' | 'error';
        shiftTeams: Array<{shiftTeamId: number; name: string; nurseCnt: number; nurses: []}>;
        shiftTeamsStatus: 'success' | 'pending' | 'error';
        currentShiftTeamId: number | null;
        constraint: {
            maxContinuousWork: boolean;
            maxContinuousWorkVal: number;
            minNightInterval: boolean;
            minNightIntervalVal: number;
            maxContinuousNight: boolean;
            maxContinuousNightVal: number;
            minContinuousNight: boolean;
            minContinuousNightVal: number;
            minOffAssignAfterNight: boolean;
            minOffAssignAfterNightVal: number;
            excludeCertainWorkTypes: boolean;
            excludeNightBeforeReqOff: boolean;
        } | null;
        constraintStatus: 'success' | 'pending' | 'error' | 'idle';
    };
    actions: {
        selectTab: ReturnType<typeof vi.fn>;
        selectShiftTeam: ReturnType<typeof vi.fn>;
        addShiftType: ReturnType<typeof vi.fn>;
        updateShiftType: ReturnType<typeof vi.fn>;
        deleteShiftType: ReturnType<typeof vi.fn>;
        updateConstraint: ReturnType<typeof vi.fn>;
        retryShiftTypes: ReturnType<typeof vi.fn>;
        retryShiftTeams: ReturnType<typeof vi.fn>;
        retryConstraint: ReturnType<typeof vi.fn>;
    };
};

function baseValue() {
    return {
        state: {
            currentTab: 'shiftTypes' as const,
            shiftTypes: [
                {
                    wardShiftTypeId: 1,
                    name: '데이',
                    shortName: 'D',
                    startTime: '07:00',
                    endTime: '15:00',
                    color: '#4dc2ad',
                    isDefault: true,
                    isOff: false,
                    isCounted: true,
                    classification: 'DAY' as const,
                },
            ],
            shiftTypesStatus: 'success' as const,
            shiftTeams: [{shiftTeamId: 1, name: '중환자실 A팀', nurseCnt: 0, nurses: []}],
            shiftTeamsStatus: 'success' as const,
            currentShiftTeamId: 1,
            constraint: {
                maxContinuousWork: true,
                maxContinuousWorkVal: 5,
                minNightInterval: true,
                minNightIntervalVal: 4,
                maxContinuousNight: true,
                maxContinuousNightVal: 3,
                minContinuousNight: false,
                minContinuousNightVal: 2,
                minOffAssignAfterNight: false,
                minOffAssignAfterNightVal: 2,
                excludeCertainWorkTypes: false,
                excludeNightBeforeReqOff: false,
            },
            constraintStatus: 'success' as const,
        },
        actions: {
            selectTab: vi.fn(),
            selectShiftTeam: vi.fn(),
            addShiftType: vi.fn(),
            updateShiftType: vi.fn(),
            deleteShiftType: vi.fn(),
            updateConstraint: vi.fn(),
            retryShiftTypes: vi.fn(),
            retryShiftTeams: vi.fn(),
            retryConstraint: vi.fn(),
        },
    };
}

function createValue(overrides?: {state?: Partial<TMockValue['state']>; actions?: Partial<TMockValue['actions']>}) {
    const value = baseValue();

    return {
        state: {
            ...value.state,
            ...overrides?.state,
        },
        actions: {
            ...value.actions,
            ...overrides?.actions,
        },
    };
}

describe('WardSettingsPage', () => {
    beforeEach(() => {
        mockUseWardSettings.mockReset();
    });

    it('근무 유형 탭에서 피그마 컬럼과 행을 보여준다', () => {
        mockUseWardSettings.mockReturnValue(createValue());

        render(<WardSettingsPage />);

        expect(screen.getByText('근무 관리')).toBeInTheDocument();
        expect(screen.getByText('근무명')).toBeInTheDocument();
        expect(screen.getByText('약자')).toBeInTheDocument();
        expect(screen.getByText('근무 시간')).toBeInTheDocument();
        expect(screen.getByText('데이')).toBeInTheDocument();
        expect(screen.getByText('8h')).toBeInTheDocument();
    });

    it('제약 조건 탭 버튼 클릭 시 탭 전환 액션을 호출한다', async () => {
        const user = userEvent.setup();
        const selectTab = vi.fn();

        mockUseWardSettings.mockReturnValue(
            createValue({
                actions: {
                    selectTab,
                },
            }),
        );

        render(<WardSettingsPage />);

        await user.click(screen.getByRole('button', {name: '제약 조건'}));

        expect(selectTab).toHaveBeenCalledWith('constraints');
    });

    it('근무 추가하기를 누르면 생성 모달을 연다', async () => {
        const user = userEvent.setup();

        mockUseWardSettings.mockReturnValue(createValue());

        render(<WardSettingsPage />);

        await user.click(screen.getByRole('button', {name: '근무 추가하기'}));

        expect(screen.getByText('create-modal')).toBeInTheDocument();
    });

    it('행을 누르면 수정 모달을 연다', async () => {
        const user = userEvent.setup();

        mockUseWardSettings.mockReturnValue(createValue());

        render(<WardSettingsPage />);

        await user.click(screen.getByRole('button', {name: '데이 근무 유형 수정'}));

        expect(screen.getByText('edit-modal:데이')).toBeInTheDocument();
    });

    it('행 내부 스위치에서 Enter를 눌러도 수정 모달이 열리지 않는다', async () => {
        const user = userEvent.setup();
        const updateShiftType = vi.fn();

        mockUseWardSettings.mockReturnValue(
            createValue({
                state: {
                    shiftTypes: [
                        {
                            ...baseValue().state.shiftTypes[0],
                            isDefault: false,
                        },
                    ],
                },
                actions: {
                    updateShiftType,
                },
            }),
        );

        render(<WardSettingsPage />);

        const leaveButton = screen.getByRole('radio', {name: '휴무'});

        leaveButton.focus();
        await user.keyboard('{Enter}');

        expect(updateShiftType).toHaveBeenCalledWith(1, {
            name: '데이',
            shortName: 'D',
            startTime: '07:00',
            endTime: '15:00',
            color: '#4dc2ad',
            isDefault: false,
            isOff: true,
            isCounted: true,
            classification: 'OTHER_LEAVE',
        });
        expect(screen.queryByText('edit-modal:데이')).not.toBeInTheDocument();
    });

    it('제약 조건 탭에서 팀이 없으면 안내 상태를 보여준다', () => {
        mockUseWardSettings.mockReturnValue(
            createValue({
                state: {
                    currentTab: 'constraints',
                    shiftTeams: [],
                    currentShiftTeamId: null,
                    constraintStatus: 'idle',
                },
            }),
        );

        render(<WardSettingsPage />);

        expect(screen.getByText('등록된 근무팀이 없어요')).toBeInTheDocument();
        expect(screen.getByText('제약 조건을 관리하려면 먼저 근무팀을 만들어 주세요.')).toBeInTheDocument();
    });

    it('제약 조건을 불러오는 동안에는 에러 대신 로딩 상태만 보여준다', () => {
        mockUseWardSettings.mockReturnValue(
            createValue({
                state: {
                    currentTab: 'constraints',
                    constraint: null,
                    constraintStatus: 'pending',
                },
            }),
        );

        render(<WardSettingsPage />);

        expect(screen.getByText('제약 조건을 불러오는 중이에요')).toBeInTheDocument();
        expect(screen.queryByText('제약 조건을 불러오지 못했어요')).not.toBeInTheDocument();
    });

    it('제약 조건 로드 실패 상태에서도 다른 팀으로 전환할 수 있다', async () => {
        const user = userEvent.setup();
        const selectShiftTeam = vi.fn();

        mockUseWardSettings.mockReturnValue(
            createValue({
                state: {
                    currentTab: 'constraints',
                    shiftTeams: [
                        {shiftTeamId: 1, name: '중환자실 A팀', nurseCnt: 0, nurses: []},
                        {shiftTeamId: 2, name: '중환자실 B팀', nurseCnt: 0, nurses: []},
                    ],
                    currentShiftTeamId: 1,
                    constraint: null,
                    constraintStatus: 'error',
                },
                actions: {
                    selectShiftTeam,
                },
            }),
        );

        render(<WardSettingsPage />);

        expect(screen.getByText('제약 조건을 불러오지 못했어요')).toBeInTheDocument();

        await user.click(screen.getByRole('button', {name: '중환자실 B팀'}));

        expect(selectShiftTeam).toHaveBeenCalledWith(2);
    });
});
