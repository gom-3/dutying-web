export type TProfileImageValue = {
    profileImgUrl?: string;
    defaultProfileImgId?: number;
};

type TGetProfileImageSourcesArgs = {
    profileImg?: TProfileImageValue;
    imageBaseUrl?: string;
};

const DEFAULT_PROFILE_IMG_ID = 1;
const normalizeSource = (source?: string) => {
    const trimmedSource = source?.trim();

    return trimmedSource === '' ? undefined : trimmedSource;
};
const getDefaultProfileImageSource = ({defaultProfileImgId, imageBaseUrl}: {defaultProfileImgId?: number; imageBaseUrl?: string}) => {
    if (defaultProfileImgId === undefined || defaultProfileImgId < 1) return undefined;

    const normalizedImageBaseUrl = normalizeSource(imageBaseUrl);

    if (!normalizedImageBaseUrl) return undefined;

    return `${normalizedImageBaseUrl}/profile_img/default/profile${defaultProfileImgId}.png`;
};

export const getProfileImageSources = ({profileImg, imageBaseUrl}: TGetProfileImageSourcesArgs): string[] => {
    const explicitProfileImage = normalizeSource(profileImg?.profileImgUrl);
    const selectedDefaultImage = getDefaultProfileImageSource({
        defaultProfileImgId: profileImg?.defaultProfileImgId,
        imageBaseUrl,
    });
    const fallbackDefaultImage = getDefaultProfileImageSource({
        defaultProfileImgId: DEFAULT_PROFILE_IMG_ID,
        imageBaseUrl,
    });

    return [explicitProfileImage, selectedDefaultImage, fallbackDefaultImage].filter((source, index, sources): source is string => {
        return Boolean(source) && sources.indexOf(source) === index;
    });
};

export const getProfileImageFallbackText = (name?: string) => {
    const firstCharacter = Array.from(name?.trim() ?? '')[0];

    if (!firstCharacter) return '';

    return /^[a-z]$/i.test(firstCharacter) ? firstCharacter.toUpperCase() : firstCharacter;
};
