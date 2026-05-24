import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen, userEvent} from '@/shared/util/test-utils';
import RegisterWard from '../register-ward';

const mockNavigate = vi.fn();
const mockCreateWard = vi.fn();
const mockGetWardShiftValidationMessage = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('@/features/register', () => ({
    default: () => ({
        state: {
            accountMe: {
                status: 'WARD_SELECT_PENDING',
            },
        },
        actions: {
            createWard: mockCreateWard,
        },
    }),
}));

vi.mock('@/features/register-ward/model/ward', async () => {
    const actual = await vi.importActual('@/features/register-ward/model/ward');

    return {
        ...actual,
        getWardShiftValidationMessage: (...args: unknown[]) => mockGetWardShiftValidationMessage(...args),
    };
});

describe('RegisterWard', () => {
    beforeEach(() => {
        mockNavigate.mockReset();
        mockCreateWard.mockReset();
        mockGetWardShiftValidationMessage.mockReset();
    });

    it('renders an inline validation message and blocks submission when shift validation fails', async () => {
        const user = userEvent.setup();

        mockGetWardShiftValidationMessage.mockReturnValue('근무 이름을 입력해주세요.');

        render(<RegisterWard />);

        await user.type(screen.getAllByRole('textbox')[0], '듀팅병원');
        await user.type(screen.getAllByRole('textbox')[1], '중환자실');
        await user.click(screen.getByRole('button', {name: '저장'}));

        expect(mockCreateWard).not.toHaveBeenCalled();
        expect(screen.getByRole('alert')).toHaveTextContent('근무 이름을 입력해주세요.');
    });
});
