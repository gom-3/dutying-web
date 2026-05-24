import {screen, waitFor, within} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import type * as SharedApiModule from '@/shared/api';
import {render, userEvent} from '@/shared/util/test-utils';
import OnboardingWardCreatePage from '../index';

const toastSuccess = vi.fn();
const toastError = vi.fn();
const mockCreateWard = vi.fn();
const mockNavigate = vi.fn();
const mockParseOnboardingWardExcel = vi.fn();
const TEST_IDENTITY_NAME = '테스트 병동';
const typedTranslations = {
    'page.onboardingWardCreate.skillLevelModal.title': '숙련도 단계 설정',
    'page.onboardingWardCreate.skillLevelModal.description': '숙련도 기준, 단계, 용어, 색상은 자유롭게 맞춤 설정할 수 있어요',
    'page.onboardingWardCreate.skillLevelModal.colorLabel': '색상',
    'page.onboardingWardCreate.skillLevelModal.high': '높음',
    'page.onboardingWardCreate.skillLevelModal.low': '낮음',
    'page.onboardingWardCreate.skillLevelModal.levelLabel': '숙련도',
    'page.onboardingWardCreate.skillLevelModal.categoryLabel': '구분',
    'page.onboardingWardCreate.skillLevelModal.autoAssign': '자동 배정',
    'page.onboardingWardCreate.skillLevelModal.autoAssignTooltip': '등록된 간호사 목록을 단계별로 분배해서 자동으로 1차 배정해요.',
    'page.onboardingWardCreate.skillLevelModal.cancel': '닫기',
    'page.onboardingWardCreate.skillLevelModal.complete': '완료',
} as const;

vi.mock('react-hot-toast', () => ({
    default: {
        success: (...args: unknown[]) => toastSuccess(...args),
        error: (...args: unknown[]) => toastError(...args),
    },
}));

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('@/features/register', () => ({
    default: () => ({
        actions: {
            createWard: mockCreateWard,
        },
    }),
}));

vi.mock('@/features/auth', () => ({
    default: () => ({
        state: {
            accountMe: {
                status: 'WARD_SELECT_PENDING',
            },
        },
    }),
}));

vi.mock('@/shared/hook/use-typed-translation', () => ({
    useTypedTranslation: () => ({
        t: (key: string, values?: Record<string, string | number>) => {
            if (key === 'page.onboardingWardCreate.skillLevelModal.levelCountOption') {
                return `${values?.levelCount ?? ''}단계`;
            }

            if (key === 'page.onboardingWardCreate.skillLevelModal.levelDisplay') {
                return `LV. ${values?.level ?? ''}`;
            }

            return typedTranslations[key as keyof typeof typedTranslations] ?? key;
        },
    }),
}));

vi.mock('@/shared/api', async () => {
    const actual = (await vi.importActual('@/shared/api')) as typeof SharedApiModule;

    return {
        ...actual,
        FileAPI: {
            ...actual.FileAPI,
            parseOnboardingWardExcel: (...args: unknown[]) => mockParseOnboardingWardExcel(...args),
        },
    };
});

const prepareValidFinalStep = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.clear(screen.getByLabelText(/병원명 또는 병동명/));
    await user.type(screen.getByLabelText(/병원명 또는 병동명/), TEST_IDENTITY_NAME);
    await user.click(screen.getByRole('button', {name: '다음'}));
};

const moveToShiftTypeStep = async (user: ReturnType<typeof userEvent.setup>) => {
    await prepareValidFinalStep(user);
    await user.click(screen.getByRole('button', {name: '건너뛰기'}));
};

const moveToNurseStep = async (user: ReturnType<typeof userEvent.setup>) => {
    await moveToShiftTypeStep(user);
    await user.click(screen.getByRole('button', {name: '다음'}));
};

const prepareValidCreationState = async (user: ReturnType<typeof userEvent.setup>) => {
    await moveToNurseStep(user);
    await user.click(screen.getByRole('button', {name: /간호사 2팀/}));
    await user.click(screen.getAllByRole('button', {name: '간호사 추가하기'})[0]);
    await user.click(screen.getByRole('button', {name: /간호사 3팀/}));
    await user.click(screen.getAllByRole('button', {name: '간호사 추가하기'})[0]);
    await user.click(screen.getByRole('button', {name: /간호사 1팀/}));
};

describe('OnboardingWardCreatePage', () => {
    beforeEach(() => {
        mockCreateWard.mockReset();
        mockNavigate.mockReset();
        toastSuccess.mockReset();
        toastError.mockReset();
        mockParseOnboardingWardExcel.mockReset();
    });

    it('uploads a file, injects parsed data, and moves through onboarding steps', async () => {
        const user = userEvent.setup();
        const {container} = render(<OnboardingWardCreatePage />);
        await prepareValidFinalStep(user);
        const uploadInput = container.querySelector('input[type="file"]') as HTMLInputElement;

        mockParseOnboardingWardExcel.mockResolvedValue({
            wardName: '중환자실',
            hospitalName: '듀팅병원',
            shiftTypes: [
                {name: '데이', shortName: 'D'},
                {name: '오프', shortName: 'O', isOff: true},
            ],
            teams: [{name: 'A팀'}],
            nurses: [
                {
                    name: '신규 간호사',
                    teamName: 'A팀',
                    possibleShiftShortNames: ['D'],
                    employmentDate: '2025-01-01',
                },
            ],
        });

        await user.upload(uploadInput, new File(['mock'], 'march-duty.xlsx', {type: 'application/vnd.ms-excel'}));

        await waitFor(() => {
            expect(screen.getByText('업로드됨: march-duty.xlsx')).toBeInTheDocument();
        });

        expect(mockParseOnboardingWardExcel).toHaveBeenCalledTimes(1);
        expect(toastSuccess).toHaveBeenCalledWith('엑셀 데이터를 불러왔어요.');

        await user.click(screen.getByRole('button', {name: '다음'}));

        expect(screen.getByText('근무명')).toBeInTheDocument();
        expect(screen.getByDisplayValue('데이')).toBeInTheDocument();
        expect(screen.getByDisplayValue('오프')).toBeInTheDocument();

        await user.click(screen.getByRole('button', {name: '다음'}));

        expect(screen.getAllByText('간호사 추가하기')[0]).toBeInTheDocument();
        expect(screen.getByDisplayValue('신규 간호사')).toBeInTheDocument();
    });

    it('shows upload warnings when the parse api partially succeeds', async () => {
        const user = userEvent.setup();
        const {container} = render(<OnboardingWardCreatePage />);
        await prepareValidFinalStep(user);
        const uploadInput = container.querySelector('input[type="file"]') as HTMLInputElement;

        mockParseOnboardingWardExcel.mockResolvedValue({
            nurses: [{name: '신규 간호사', teamName: 'A팀'}],
            warnings: ['2행 데이터를 해석하지 못했어요.'],
        });

        await user.upload(uploadInput, new File(['mock'], 'march-duty.xlsx', {type: 'application/vnd.ms-excel'}));

        await waitFor(() => {
            expect(screen.getByTestId('upload-warning')).toBeInTheDocument();
        });

        expect(screen.getByText('2행 데이터를 해석하지 못했어요.')).toBeInTheDocument();
        expect(toastError).toHaveBeenCalledWith('일부 데이터만 반영했어요. 누락된 항목을 확인해 주세요.');
    });

    it('shows upload error guidance when the parse api fails', async () => {
        const user = userEvent.setup();
        const {container} = render(<OnboardingWardCreatePage />);
        await prepareValidFinalStep(user);
        const uploadInput = container.querySelector('input[type="file"]') as HTMLInputElement;

        mockParseOnboardingWardExcel.mockRejectedValue(new Error('업로드한 파일 형식이 올바르지 않습니다.'));

        await user.upload(uploadInput, new File(['mock'], 'march-duty.xlsx', {type: 'application/vnd.ms-excel'}));

        await waitFor(() => {
            expect(screen.getByTestId('upload-error')).toBeInTheDocument();
        });

        expect(screen.getByText('업로드한 파일 형식이 올바르지 않습니다.')).toBeInTheDocument();
        expect(toastError).toHaveBeenCalledWith('업로드한 파일 형식이 올바르지 않습니다.');
    });

    it('blocks next in step 1 when identity name is empty and shows toast on click', async () => {
        const user = userEvent.setup();

        render(<OnboardingWardCreatePage />);

        const nextButton = screen.getByRole('button', {name: '다음'});

        expect(nextButton).toHaveAttribute('aria-disabled', 'true');

        await user.click(nextButton);

        expect(toastError).toHaveBeenCalledWith('병원명 또는 병동명을 입력해 주세요.');
    });

    it('disables next in step 3 when a shift type is invalid', async () => {
        const user = userEvent.setup();

        render(<OnboardingWardCreatePage />);

        await moveToShiftTypeStep(user);
        await user.click(screen.getByRole('button', {name: '근무 유형 추가하기'}));

        expect(screen.getByRole('button', {name: '다음'})).toHaveAttribute('aria-disabled', 'true');
    });

    it('disables next in step 3 when shift names are duplicated', async () => {
        const user = userEvent.setup();

        render(<OnboardingWardCreatePage />);

        await moveToShiftTypeStep(user);

        const shiftNameInputs = screen.getAllByPlaceholderText('근무명');

        await user.clear(shiftNameInputs[1] as HTMLInputElement);
        await user.type(shiftNameInputs[1] as HTMLInputElement, '데이');

        expect(screen.getAllByText('중복된 근무명은 사용할 수 없어요.')).toHaveLength(2);
        expect(screen.getByRole('button', {name: '다음'})).toHaveAttribute('aria-disabled', 'true');
    });

    it('auto formats numeric shift time input to HH:mm', async () => {
        const user = userEvent.setup();

        render(<OnboardingWardCreatePage />);

        await moveToShiftTypeStep(user);

        const dayStartTimeInput = screen.getAllByDisplayValue('07:00')[0] as HTMLInputElement;

        await user.clear(dayStartTimeInput);
        await user.type(dayStartTimeInput, '1200');

        expect(dayStartTimeInput).toHaveValue('12:00');
    });

    it('disables next in step 3 when shift time order is invalid', async () => {
        const user = userEvent.setup();

        render(<OnboardingWardCreatePage />);

        await moveToShiftTypeStep(user);

        const dayStartTimeInput = screen.getAllByDisplayValue('07:00')[0] as HTMLInputElement;
        const dayEndTimeInput = screen.getAllByDisplayValue('15:00')[0] as HTMLInputElement;

        await user.clear(dayStartTimeInput);
        await user.type(dayStartTimeInput, '1200');
        await user.clear(dayEndTimeInput);
        await user.type(dayEndTimeInput, '1100');

        expect(screen.getByText('퇴근 시간은 출근 시간보다 늦어야 해요.')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: '다음'})).toHaveAttribute('aria-disabled', 'true');
    });

    it('prevents adding more than 10 shift types', async () => {
        const user = userEvent.setup();

        render(<OnboardingWardCreatePage />);

        await moveToShiftTypeStep(user);

        const addShiftButton = screen.getByRole('button', {name: '근무 유형 추가하기'});

        for (let index = 0; index < 6; index += 1) {
            await user.click(addShiftButton);
        }

        expect(screen.getAllByPlaceholderText('근무명')).toHaveLength(10);

        await user.click(addShiftButton);

        expect(screen.getAllByPlaceholderText('근무명')).toHaveLength(10);
    });

    it('removes empty teams before completion instead of blocking submit', async () => {
        const user = userEvent.setup();

        mockCreateWard.mockResolvedValue(undefined);

        render(<OnboardingWardCreatePage />);

        await moveToNurseStep(user);
        await user.click(screen.getByRole('button', {name: /팀 추가하기/}));

        expect(screen.getByRole('button', {name: '완료'})).toHaveAttribute('aria-disabled', 'false');

        await user.click(screen.getByRole('button', {name: '완료'}));

        await waitFor(() => {
            expect(mockCreateWard).toHaveBeenCalledTimes(1);
        });
        const [submittedPayload] = mockCreateWard.mock.calls[0] as [Record<string, unknown>, unknown?];
        const submittedShiftTeams = submittedPayload.shiftTeams as {nurseNames: string[]}[];

        expect(submittedShiftTeams).toHaveLength(1);
        expect(submittedShiftTeams[0]).toEqual(expect.objectContaining({nurseNames: ['홍길동', '김하늘', '이서윤', '박연우']}));
    });

    it('shows team delete confirm modal and deletes team with nurses', async () => {
        const user = userEvent.setup();

        render(<OnboardingWardCreatePage />);

        await moveToNurseStep(user);

        await user.click(screen.getByRole('button', {name: '팀 삭제하기'}));

        const confirmDialog = screen.getByRole('dialog');

        expect(within(confirmDialog).getByText('팀을 삭제할까요?')).toBeInTheDocument();
        expect(within(confirmDialog).getByText(/팀을 삭제하면 소속 간호사/)).toBeInTheDocument();

        await user.click(within(confirmDialog).getByRole('button', {name: '삭제하기'}));

        await waitFor(() => {
            expect(toastSuccess).toHaveBeenCalledWith('팀을 삭제했어요. 팀에 속한 간호사도 함께 삭제했어요.');
        });
        expect(screen.queryByRole('button', {name: /간호사 1팀/})).not.toBeInTheDocument();
    });

    it('disables next in step 4 when a nurse name is empty', async () => {
        const user = userEvent.setup();

        render(<OnboardingWardCreatePage />);

        await moveToNurseStep(user);

        const nurseInputs = screen.getAllByDisplayValue(/홍길동|김하늘|박연우|이서윤/);

        await user.clear(nurseInputs[0] as HTMLInputElement);

        expect(screen.getByRole('button', {name: '완료'})).toHaveAttribute('aria-disabled', 'true');
    });

    it('keeps next disabled on upload step until a file is uploaded', async () => {
        const user = userEvent.setup();

        render(<OnboardingWardCreatePage />);

        await prepareValidFinalStep(user);

        const nextButton = screen.getByRole('button', {name: '다음'});

        expect(nextButton).toHaveAttribute('aria-disabled', 'true');

        await user.click(nextButton);

        expect(toastError).toHaveBeenCalledWith('근무표 파일을 업로드하거나 건너뛰기를 눌러주세요.');
    });

    it('shows skip only on upload step and moves to the next step when clicked', async () => {
        const user = userEvent.setup();

        render(<OnboardingWardCreatePage />);

        await prepareValidFinalStep(user);

        expect(screen.getByRole('button', {name: '건너뛰기'})).toBeInTheDocument();
        await user.click(screen.getByRole('button', {name: '건너뛰기'}));

        expect(screen.getByText('근무명')).toBeInTheDocument();
        expect(screen.queryByRole('button', {name: '건너뛰기'})).not.toBeInTheDocument();
    });

    it('shows toast and auto navigates to duty after ward creation succeeds', async () => {
        const user = userEvent.setup();

        let resolveCreateWard!: () => void;

        mockCreateWard.mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    resolveCreateWard = resolve;
                }),
        );

        render(<OnboardingWardCreatePage />);

        await prepareValidCreationState(user);
        await user.click(screen.getByRole('button', {name: '숙련도 설정'}));

        const skillLevelDialog = screen.getByRole('dialog');

        await user.click(within(skillLevelDialog).getByRole('button', {name: '숙련도 단계'}));
        await user.click(within(skillLevelDialog).getByRole('option', {name: '3단계'}));
        await user.click(within(screen.getByRole('dialog')).getByRole('button', {name: '완료'}));

        expect(screen.getAllByText((content) => content.includes('LV. 3')).length).toBeGreaterThan(0);

        await user.click(screen.getByRole('button', {name: '완료'}));

        expect(mockCreateWard).toHaveBeenCalledWith(
            expect.objectContaining({
                name: TEST_IDENTITY_NAME,
                hospitalName: TEST_IDENTITY_NAME,
                shiftTeams: expect.any(Array),
                wardShiftTypes: expect.any(Array),
            }),
            {navigateOnLinked: false},
        );

        resolveCreateWard();

        await waitFor(() => {
            expect(toastSuccess).toHaveBeenCalledWith('병동 생성을 완료했어요.');
        });

        expect(screen.queryByTestId('ward-create-success')).not.toBeInTheDocument();
        await waitFor(
            () => {
                expect(mockNavigate).toHaveBeenCalledWith('/duty?onboardingWardCreated=1', {replace: true});
            },
            {timeout: 2_000},
        );
    }, 10_000);

    it('shows toast only and allows retry when ward creation fails', async () => {
        const user = userEvent.setup();

        mockCreateWard.mockRejectedValueOnce(new Error('서버 오류입니다.'));
        mockCreateWard.mockResolvedValueOnce(undefined);

        render(<OnboardingWardCreatePage />);

        await prepareValidCreationState(user);
        await user.click(screen.getByRole('button', {name: '완료'}));

        await waitFor(() => {
            expect(toastError).toHaveBeenCalledWith('서버 오류입니다.');
        });

        expect(screen.queryByTestId('ward-create-error')).not.toBeInTheDocument();
        await user.click(screen.getByRole('button', {name: '완료'}));

        await waitFor(
            () => {
                expect(mockNavigate).toHaveBeenCalledWith('/duty?onboardingWardCreated=1', {replace: true});
            },
            {timeout: 2_000},
        );

        expect(mockCreateWard).toHaveBeenCalledTimes(2);
    });
});
