import axiosInstance from '../client';
import {
    type IAuthAPI,
    type TAdminEmailVerificationSendRequest,
    type TAdminEmailVerificationSendResponse,
    type TAdminPasswordLoginRequest,
    type TAdminPasswordResetConfirmRequest,
    type TAdminPasswordResetRequest,
    type TAdminPasswordResetRequestResponse,
    type TAdminPasswordSignupRequest,
    type TAdminSocialProfileRequest,
    type TAdminSocialProfileResponse,
    type TAdminSocialSignupRequest,
    type TAuthTokenResponse,
    type TDemoStartResponse,
} from './type';

class AuthAPI implements IAuthAPI {
    demoStart = async () => (await axiosInstance.post<TDemoStartResponse>('/demo/start')).data;
    passwordLogin = async (request: TAdminPasswordLoginRequest) =>
        (await axiosInstance.post<TAuthTokenResponse>('/auth/admin/password/login', request)).data;
    passwordSignup = async (request: TAdminPasswordSignupRequest) =>
        (await axiosInstance.post<TAuthTokenResponse>('/auth/admin/password/signup', request)).data;
    sendAdminEmailVerification = async (request: TAdminEmailVerificationSendRequest) =>
        (await axiosInstance.post<TAdminEmailVerificationSendResponse>('/auth/admin/email-verifications', request)).data;
    requestAdminPasswordReset = async (request: TAdminPasswordResetRequest) =>
        (await axiosInstance.post<TAdminPasswordResetRequestResponse>('/auth/admin/password-reset-requests', request)).data;
    resetAdminPassword = async (request: TAdminPasswordResetConfirmRequest) =>
        (await axiosInstance.post<void>('/auth/admin/password-reset', request)).data;
    adminSocialProfile = async (request: TAdminSocialProfileRequest) =>
        (await axiosInstance.post<TAdminSocialProfileResponse>('/auth/admin/social/profile', request)).data;
    adminSocialSignup = async (request: TAdminSocialSignupRequest) =>
        (await axiosInstance.post<TAuthTokenResponse>('/auth/admin/social/signup', request)).data;
    logout = async (accessToken: string | null) => (await axiosInstance.post('/token/blacklist', {accessToken})).data;
}

export default new AuthAPI();
