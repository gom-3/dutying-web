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
    'page.wardSettings.constraints.teamLabel': '근무팀',
    'page.wardSettings.constraints.teamDescription': '제약 조건은 근무팀별로 관리돼요.',
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

vi.mock('@/pages/make-shift/ui/steps/constraints', () => ({
    Constraints: ({wardId, shiftTeamId, variant}: {wardId?: number | null; shiftTeamId?: number | null; variant?: string}) => (
        <div data-testid="shift-constraint-rules">
            {`rules:${wardId ?? 'none'}:${shiftTeamId ?? 'none'}:${variant ?? 'flow'}`}
        </div>
    ),
}));

type TMockValue = {
    state: {
        wardId: number | null;
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
    };
    actions: {
        selectTab: ReturnType<typeof vi.fn>;
        selectShiftTeam: ReturnType<typeof vi.fn>;
        addShiftType: ReturnType<typeof vi.fn>;
        updateShiftType: ReturnType<typeof vi.fn>;
        deleteShiftType: ReturnType<typeof vi.fn>;
        retryShiftTypes: ReturnType<typeof vi.fn>;
        retryShiftTeams: ReturnType<typeof vi.fn>;
    };
};

function baseValue() {
    return {
        state: {
            wardId: 1,
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
        },
        actions: {
            selectTab: vi.fn(),
            selectShiftTeam: vi.fn(),
            addShiftType: vi.fn(),
            updateShiftType: vi.fn(),
            deleteShiftType: vi.fn(),
            retryShiftTypes: vi.fn(),
            retryShiftTeams: vi.fn(),
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
        expect(screen.getByDisplayValue('데이')).toBeInTheDocument();
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

    it('근무 유형 추가하기를 누르면 새 근무 유형 행을 추가한다', async () => {
        const user = userEvent.setup();

        mockUseWardSettings.mockReturnValue(createValue());

        render(<WardSettingsPage />);

        await user.click(screen.getByRole('button', {name: '근무 유형 추가하기'}));

        expect(screen.getByDisplayValue('새 근무')).toBeInTheDocument();
    });

    it('색상 버튼을 누르면 색상 팔레트를 연다', async () => {
        const user = userEvent.setup();

        mockUseWardSettings.mockReturnValue(createValue());

        render(<WardSettingsPage />);

        await user.click(screen.getByRole('button', {name: '데이 색상 선택'}));

        expect(screen.getByRole('button', {name: '#9AD7CB 선택'})).toBeInTheDocument();
    });

    it('휴무 버튼을 누르면 draft만 휴무 상태로 바꾼다', async () => {
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

        const leaveButton = screen.getByRole('button', {name: '휴무'});

        await user.click(leaveButton);

        expect(updateShiftType).not.toHaveBeenCalled();
        expect(screen.getAllByDisplayValue('-')).toHaveLength(2);
        expect(screen.queryByText('edit-modal:데이')).not.toBeInTheDocument();
    });

    it('제약 조건 탭에서 팀이 없으면 안내 상태를 보여준다', () => {
        mockUseWardSettings.mockReturnValue(
            createValue({
                state: {
                    currentTab: 'constraints',
                    shiftTeams: [],
                    currentShiftTeamId: null,
                },
            }),
        );

        render(<WardSettingsPage />);

        expect(screen.getByText('등록된 근무팀이 없어요')).toBeInTheDocument();
        expect(screen.getByText('제약 조건을 관리하려면 먼저 근무팀을 만들어 주세요.')).toBeInTheDocument();
    });

    it('제약 조건 탭에서 근무표 플로우의 제약조건 UI를 보여준다', () => {
        mockUseWardSettings.mockReturnValue(
            createValue({
                state: {
                    currentTab: 'constraints',
                },
            }),
        );

        render(<WardSettingsPage />);

        expect(screen.getByText('근무팀')).toBeInTheDocument();
        expect(screen.getByTestId('shift-constraint-rules')).toHaveTextContent('rules:1:1:settings');
    });

    it('제약 조건 탭에서 다른 팀으로 전환할 수 있다', async () => {
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
                },
                actions: {
                    selectShiftTeam,
                },
            }),
        );

        render(<WardSettingsPage />);

        await user.click(screen.getByRole('button', {name: '중환자실 B팀'}));

        expect(selectShiftTeam).toHaveBeenCalledWith(2);
    });
});
