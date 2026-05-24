export type TAccountStatus = 'INITIAL' | 'NURSE_INFO_PENDING' | 'WARD_SELECT_PENDING' | 'WARD_ENTRY_PENDING' | 'LINKED' | 'DEMO';

export type TAccount = {
    accountId: number;
    nurseId: number | null;
    wardId: number | null;
    shiftTeamId: number | null;
    email: string;
    name: string;
    /** @deprecated use profileImgUrl */
    profileImgBase64?: string;
    profileImgUrl: string;
    isManager: boolean;
    status: TAccountStatus;
};
