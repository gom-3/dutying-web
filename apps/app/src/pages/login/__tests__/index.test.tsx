import type {ReactNode} from 'react';
import {MemoryRouter, Route, Routes} from 'react-router';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import ROUTE from '@/shared/constant/path';
import {render, screen, userEvent} from '@/shared/util/test-utils';
import LoginPage from '../index';

const {mockHandleLogin, mockPasswordSignup, mockSendAdminEmailVerification, mockRequestAdminPasswordReset, mockResetAdminPassword} =
    vi.hoisted(() => ({
        mockHandleLogin: vi.fn(),
        mockPasswordSignup: vi.fn(),
        mockSendAdminEmailVerification: vi.fn(),
        mockRequestAdminPasswordReset: vi.fn(),
        mockResetAdminPassword: vi.fn(),
    }));

vi.mock('react-responsive-carousel', () => ({
    Carousel: ({children}: {children: ReactNode}) => <div>{children}</div>,
}));

vi.mock('@/features/auth', () => ({
    default: () => ({
        actions: {
            handleDevSignupBypass: vi.fn(),
            handleLogin: mockHandleLogin,
        },
    }),
}));

vi.mock('@/shared/api', () => ({
    AuthAPI: {
        passwordLogin: vi.fn(),
        passwordSignup: mockPasswordSignup,
        sendAdminEmailVerification: mockSendAdminEmailVerification,
        requestAdminPasswordReset: mockRequestAdminPasswordReset,
        resetAdminPassword: mockResetAdminPassword,
    },
}));

describe('LoginPage', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv('VITE_APP_PUBLIC_URL', 'https://app.dutying.net');
        vi.stubEnv('VITE_SERVER_URL', 'https://api.dutying.net');
    });

    it('renders sign-in as the default admin login page with a signup link', () => {
        render(
            <MemoryRouter initialEntries={[ROUTE.SIGN_IN]}>
                <Routes>
                    <Route path={ROUTE.SIGN_IN} element={<LoginPage />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByRole('heading', {name: '로그인'})).toBeInTheDocument();
        expect(screen.queryByLabelText('병원명 또는 기관명')).not.toBeInTheDocument();
        expect(screen.getByRole('link', {name: '회원가입'})).toHaveAttribute('href', ROUTE.SIGN_UP);
        expect(screen.getByRole('link', {name: '비밀번호 찾기'})).toHaveAttribute('href', `${ROUTE.SIGN_IN}?mode=password-reset`);
        expect(screen.getByRole('link', {name: '카카오로 계속하기'})).toHaveAttribute(
            'href',
            'https://api.dutying.net/oauth2/authorization/admin/kakao?nextPageUrl=https%3A%2F%2Fapp.dutying.net%2Fmake',
        );
        expect(screen.getByRole('link', {name: 'Apple로 계속하기'})).toHaveAttribute(
            'href',
            'https://api.dutying.net/oauth2/authorization/admin/apple?nextPageUrl=https%3A%2F%2Fapp.dutying.net%2Fmake',
        );
    });

    it('renders sign-up as a separate account page with social buttons', () => {
        render(
            <MemoryRouter initialEntries={[`${ROUTE.SIGN_UP}?reason=demo-expired&next=%2Fregister`]}>
                <Routes>
                    <Route path={ROUTE.SIGN_UP} element={<LoginPage />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText('체험 계정을 정식 계정으로 전환해요')).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: '회원가입'})).toBeInTheDocument();
        expect(screen.getByLabelText('이름')).toBeInTheDocument();
        expect(screen.getByLabelText('이메일')).toBeInTheDocument();
        expect(screen.queryByLabelText('병원명 또는 기관명')).not.toBeInTheDocument();
        expect(screen.getByRole('link', {name: '로그인'})).toHaveAttribute('href', ROUTE.SIGN_IN);
        expect(screen.getByRole('link', {name: '카카오로 시작하기'})).toHaveAttribute(
            'href',
            'https://api.dutying.net/oauth2/authorization/admin/kakao?nextPageUrl=https%3A%2F%2Fapp.dutying.net%2Fregister%3FsocialSignup%3D1',
        );
    });

    it('requests email verification and sends the returned token when signing up', async () => {
        const user = userEvent.setup();

        mockSendAdminEmailVerification.mockResolvedValueOnce({email: 'admin@example.com', debugVerificationToken: 'verify-token'});
        mockPasswordSignup.mockResolvedValueOnce({accessToken: 'admin-token'});

        render(
            <MemoryRouter initialEntries={[ROUTE.SIGN_UP]}>
                <Routes>
                    <Route path={ROUTE.SIGN_UP} element={<LoginPage />} />
                </Routes>
            </MemoryRouter>,
        );

        await user.type(screen.getByLabelText('이름'), '김관리');
        await user.type(screen.getByLabelText('이메일'), 'admin@example.com');
        await user.click(screen.getByRole('button', {name: '인증'}));
        await user.type(screen.getByLabelText('비밀번호'), 'password1234');
        await user.type(screen.getByLabelText('비밀번호 확인'), 'password1234');
        await user.click(screen.getByRole('button', {name: '계정 만들기'}));

        expect(mockSendAdminEmailVerification).toHaveBeenCalledWith({email: 'admin@example.com'});
        expect(mockPasswordSignup).toHaveBeenCalledWith({
            name: '김관리',
            email: 'admin@example.com',
            emailVerificationToken: 'verify-token',
            password: 'password1234',
        });
        expect(mockHandleLogin).toHaveBeenCalledWith('admin-token', ROUTE.REGISTER);
    });

    it('requests a password reset code and submits a new password', async () => {
        const user = userEvent.setup();

        mockRequestAdminPasswordReset.mockResolvedValueOnce({email: 'admin@example.com', debugResetToken: 'reset-token'});
        mockResetAdminPassword.mockResolvedValueOnce(undefined);

        render(
            <MemoryRouter initialEntries={[`${ROUTE.SIGN_IN}?mode=password-reset`]}>
                <Routes>
                    <Route path={ROUTE.SIGN_IN} element={<LoginPage />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByRole('heading', {name: '비밀번호 재설정'})).toBeInTheDocument();
        expect(screen.queryByRole('link', {name: '카카오로 계속하기'})).not.toBeInTheDocument();

        await user.type(screen.getByLabelText('이메일'), 'admin@example.com');
        await user.click(screen.getByRole('button', {name: '메일 보내기'}));

        const resetCodeInput = await screen.findByLabelText('재설정 코드');

        expect(resetCodeInput).toHaveValue('reset-token');

        await user.type(screen.getByLabelText('새 비밀번호'), 'new-password123');
        await user.type(screen.getByLabelText('새 비밀번호 확인'), 'new-password123');
        await user.click(screen.getByRole('button', {name: '비밀번호 변경'}));

        expect(mockRequestAdminPasswordReset).toHaveBeenCalledWith({email: 'admin@example.com'});
        expect(mockResetAdminPassword).toHaveBeenCalledWith({
            email: 'admin@example.com',
            resetToken: 'reset-token',
            newPassword: 'new-password123',
        });
        expect(await screen.findByText('비밀번호가 변경됐어요. 새 비밀번호로 로그인해 주세요.')).toBeInTheDocument();
    });
});
