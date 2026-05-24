import type {TAccount, TAccountStatus} from '@dutying/domain';
import type {TWardResponse} from '../ward';

export type {TAccountStatus};

export type TAccountResponse = TAccount;
export type TDefaultProfileImageResponse = {
    id: number;
    url: string;
};

export interface IAccountAPI {
    getAccount: (accountId: number) => Promise<TAccountResponse>;
    getAccountMe: () => Promise<TAccountResponse>;
    getAccountMeWaiting: () => Promise<TWardResponse>;
    getDefaultProfileImages: () => Promise<TDefaultProfileImageResponse[]>;
    editAccount: (dto: TEditProfileRequest) => Promise<TAccountResponse>;
    editAccountStatus: (accountId: number, status: TAccountStatus) => Promise<TAccountResponse>;
    initAccount: (dto: TEditProfileRequest) => Promise<TAccountResponse>;
    deleteAccount: (accountId: number) => Promise<void>;
}

export type TEditProfileRequest = {
    accountId: number;
    name: string;
    profileImgUrl?: string;
    defaultProfileImgId?: number;
};
