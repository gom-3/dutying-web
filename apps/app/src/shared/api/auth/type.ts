import type {TAccountResponse} from '@dutying/api/account';
import type {TWardResponse} from '@dutying/api/ward';

export type TDemoStartResponse = {
    wardResDto: TWardResponse;
    accountResDto: TAccountResponse;
    accessToken: string;
};

export type TAdminPasswordLoginRequest = {
    email: string;
    password: string;
};

export type TAdminPasswordSignupRequest = {
    email: string;
    emailVerificationToken?: string;
    password: string;
    name?: string;
    phoneNum?: string;
    profileImgUrl?: string | null;
};

export type TAdminEmailVerificationSendRequest = {
    email: string;
};

export type TAdminEmailVerificationSendResponse = {
    email: string;
    expiresAt?: string;
    debugVerificationToken?: string;
};

export type TAdminPasswordResetRequest = {
    email: string;
};

export type TAdminPasswordResetRequestResponse = {
    email: string;
    expiresAt?: string;
    debugResetToken?: string;
};

export type TAdminPasswordResetConfirmRequest = {
    email: string;
    resetToken: string;
    newPassword: string;
};

export type TAdminSocialProvider = 'KAKAO' | 'APPLE';

export type TAdminSocialProfileRequest = {
    provider: TAdminSocialProvider;
    idToken: string;
    providerAccessToken?: string | null;
};

export type TAdminSocialProfileResponse = {
    provider: TAdminSocialProvider;
    providerUserId?: string;
    email?: string | null;
    name?: string | null;
    phoneNum?: string | null;
    profileImgUrl?: string | null;
    signupToken?: string;
};

export type TAdminSocialSignupRequest = TAdminSocialProfileRequest & {
    signupToken?: string;
    name?: string | null;
    phoneNum?: string | null;
    profileImgUrl?: string | null;
};

export type TAuthTokenResponse = {
    accessToken: string;
};

export interface IAuthAPI {
    // POST
    demoStart: () => Promise<TDemoStartResponse>;
    passwordLogin: (request: TAdminPasswordLoginRequest) => Promise<TAuthTokenResponse>;
    passwordSignup: (request: TAdminPasswordSignupRequest) => Promise<TAuthTokenResponse>;
    sendAdminEmailVerification: (request: TAdminEmailVerificationSendRequest) => Promise<TAdminEmailVerificationSendResponse>;
    requestAdminPasswordReset: (request: TAdminPasswordResetRequest) => Promise<TAdminPasswordResetRequestResponse>;
    resetAdminPassword: (request: TAdminPasswordResetConfirmRequest) => Promise<void>;
    adminSocialProfile: (request: TAdminSocialProfileRequest) => Promise<TAdminSocialProfileResponse>;
    adminSocialSignup: (request: TAdminSocialSignupRequest) => Promise<TAuthTokenResponse>;
    logout: (accessToken: string | null) => Promise<void>;
}
