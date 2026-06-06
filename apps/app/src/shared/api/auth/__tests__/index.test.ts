import {beforeEach, describe, expect, it, vi} from 'vitest';
import AuthAPI from '..';

const {mockPost} = vi.hoisted(() => ({
    mockPost: vi.fn(),
}));

vi.mock('../../client', () => ({
    default: {
        post: mockPost,
    },
}));

describe('AuthAPI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('uses the ward admin password login endpoint', async () => {
        const payload = {email: 'admin@example.com', password: 'password123'};
        const response = {accessToken: 'admin-token'};

        mockPost.mockResolvedValue({data: response});

        await expect(AuthAPI.passwordLogin(payload)).resolves.toBe(response);

        expect(mockPost).toHaveBeenCalledWith('/auth/admin/password/login', payload);
    });

    it('uses the ward admin password signup endpoint', async () => {
        const payload = {name: '김관리', email: 'admin@example.com', password: 'password123', emailVerificationToken: 'verify-token'};
        const response = {accessToken: 'admin-token'};

        mockPost.mockResolvedValue({data: response});

        await expect(AuthAPI.passwordSignup(payload)).resolves.toBe(response);

        expect(mockPost).toHaveBeenCalledWith('/auth/admin/password/signup', payload);
    });

    it('uses the ward admin email verification send endpoint', async () => {
        const payload = {email: 'admin@example.com'};
        const response = {email: 'admin@example.com', debugVerificationToken: 'verify-token'};

        mockPost.mockResolvedValue({data: response});

        await expect(AuthAPI.sendAdminEmailVerification(payload)).resolves.toBe(response);

        expect(mockPost).toHaveBeenCalledWith('/auth/admin/email-verifications', payload);
    });

    it('uses the ward admin password reset request endpoint', async () => {
        const payload = {email: 'admin@example.com'};
        const response = {email: 'admin@example.com', debugResetToken: 'reset-token'};

        mockPost.mockResolvedValue({data: response});

        await expect(AuthAPI.requestAdminPasswordReset(payload)).resolves.toBe(response);

        expect(mockPost).toHaveBeenCalledWith('/auth/admin/password-reset-requests', payload);
    });

    it('uses the ward admin password reset confirm endpoint', async () => {
        const payload = {email: 'admin@example.com', resetToken: 'reset-token', newPassword: 'new-password123'};

        mockPost.mockResolvedValue({data: undefined});

        await expect(AuthAPI.resetAdminPassword(payload)).resolves.toBeUndefined();

        expect(mockPost).toHaveBeenCalledWith('/auth/admin/password-reset', payload);
    });

    it('uses the ward admin social profile endpoint', async () => {
        const payload = {provider: 'KAKAO' as const, idToken: 'id-token'};
        const response = {provider: 'KAKAO' as const, email: 'admin@example.com'};

        mockPost.mockResolvedValue({data: response});

        await expect(AuthAPI.adminSocialProfile(payload)).resolves.toBe(response);

        expect(mockPost).toHaveBeenCalledWith('/auth/admin/social/profile', payload);
    });

    it('uses the ward admin social signup endpoint', async () => {
        const payload = {provider: 'KAKAO' as const, idToken: 'id-token', signupToken: 'signup-token'};
        const response = {accessToken: 'admin-token'};

        mockPost.mockResolvedValue({data: response});

        await expect(AuthAPI.adminSocialSignup(payload)).resolves.toBe(response);

        expect(mockPost).toHaveBeenCalledWith('/auth/admin/social/signup', payload);
    });
});
