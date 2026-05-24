import type {TAccount} from '@/entities/account';
import type {TProfileImageValue} from '@/entities/account/ui/profile-image/model';
import type {TNurse} from '@/entities/nurse';
import type {TWard} from '@/entities/ward';

const editableProfileFields = ['name', 'gender', 'phoneNum', 'employmentDate', 'isWorker'] as const;
const getMeaningfulDisplayName = (name?: string | null) => {
    const trimmedName = name?.trim();

    return trimmedName === '' ? undefined : trimmedName;
};

export const findProfileNurse = (ward: TWard | undefined, accountId: number | null | undefined) => {
    if (!ward || !accountId) return null;

    return ward.shiftTeams.flatMap((shiftTeam) => shiftTeam.nurses).find((nurse) => nurse.accountId === accountId) ?? null;
};

export const isProfileFormDirty = ({
    originalNurse,
    draftNurse,
    profileImg,
}: {
    originalNurse: TNurse | null;
    draftNurse: TNurse | null;
    profileImg?: TProfileImageValue;
}) => {
    if (!originalNurse || !draftNurse) return false;

    return editableProfileFields.some((field) => originalNurse[field] !== draftNurse[field]) || Boolean(profileImg);
};

export const getCurrentProfileImage = (account: TAccount | null, profileImg?: TProfileImageValue): TProfileImageValue => {
    if (profileImg) return profileImg;

    if (account?.profileImgUrl) return {profileImgUrl: account.profileImgUrl};

    return {};
};

export const getProfileDisplayName = (draftNurse: TNurse | null, account: TAccount | null) => {
    const draftName = getMeaningfulDisplayName(draftNurse?.name);
    const accountName = getMeaningfulDisplayName(account?.name);

    return draftName ?? accountName ?? '이름 미등록';
};
