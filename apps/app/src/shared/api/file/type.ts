import {type TValues} from '@dutying/utils';

export const FILE_TYPE = {
    PROFILE_IMAGE: 'PROFILE_IMAGE',
};

export type TPresignedUrlRequest = TValues<typeof FILE_TYPE>;

export type TOnboardingWardParseApiShiftType = {
    name?: string | null;
    shortName?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    color?: string | null;
    isDefault?: boolean | null;
    isOff?: boolean | null;
    classification?: 'DAY' | 'EVENING' | 'NIGHT' | 'OTHER_WORK' | 'OFF' | 'OTHER_LEAVE' | null;
};

export type TOnboardingWardParseApiTeam = {
    name?: string | null;
};

export type TOnboardingWardParseApiNurse = {
    name?: string | null;
    memo?: string | null;
    isWorker?: boolean | null;
    employmentDate?: string | null;
    level?: number | null;
    teamName?: string | null;
    possibleShiftShortNames?: Array<string | null> | null;
};

export type TOnboardingWardParseApiResponse = {
    fileName?: string | null;
    wardName?: string | null;
    hospitalName?: string | null;
    shiftTypes?: TOnboardingWardParseApiShiftType[] | null;
    wardShiftTypes?: TOnboardingWardParseApiShiftType[] | null;
    teams?: TOnboardingWardParseApiTeam[] | null;
    shiftTeams?: TOnboardingWardParseApiTeam[] | null;
    nurses?: TOnboardingWardParseApiNurse[] | null;
    warnings?: string[] | null;
    failedRows?: string[] | null;
    failedSheets?: string[] | null;
    message?: string | null;
};

export interface IPresignedUrlResponse {
    presignedUrl: string;
    fileUrl: string;
    fileName: string;
    expiresIn: number;
}

export interface IFileAPI {
    // POST
    getPresignedUrl: (fileType: TPresignedUrlRequest, fileExtension: string) => Promise<IPresignedUrlResponse>;
    parseOnboardingWardExcel: (file: File) => Promise<TOnboardingWardParseApiResponse>;
}
