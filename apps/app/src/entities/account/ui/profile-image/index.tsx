import {cn} from '@dutying/utils/style';
import {useEffect, useState} from 'react';
import {PersonIcon} from '@/shared/assets/svg';
import {RUNTIME_CONFIG} from '@/shared/config/runtime';
import {getProfileImageFallbackText, getProfileImageSources, type TProfileImageValue} from './model';

interface IProfileImageProps
    extends Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, 'src' | 'type'> {
    profileImg?: TProfileImageValue;
    name?: string;
}

export const ProfileImage = ({profileImg, name, className, alt, onError, ...props}: IProfileImageProps) => {
    const imageBaseUrl = RUNTIME_CONFIG.profileImageBaseUrl();
    const [failedSources, setFailedSources] = useState<string[]>([]);
    const imageSources = getProfileImageSources({profileImg, imageBaseUrl});
    const currentSource = imageSources.find((source) => !failedSources.includes(source));
    const accessibleAlt = alt ?? `${name?.trim() ?? '사용자'} 프로필 이미지`;
    const fallbackText = getProfileImageFallbackText(name);

    useEffect(() => {
        setFailedSources([]);
    }, [imageBaseUrl, profileImg?.defaultProfileImgId, profileImg?.profileImgUrl]);

    if (!currentSource) {
        return (
            <div
                role="img"
                aria-label={accessibleAlt}
                className={cn('flex items-center justify-center rounded-full bg-sub-3 text-white', className)}
            >
                {fallbackText ? (
                    <span className="font-apple text-[clamp(1.125rem,3vw,2.5rem)] font-semibold">{fallbackText}</span>
                ) : (
                    <PersonIcon className="h-[46%] w-[46%]" aria-hidden="true" />
                )}
            </div>
        );
    }

    return (
        <img
            className={cn('rounded-full object-cover object-center', className)}
            alt={accessibleAlt}
            src={currentSource}
            onError={(event) => {
                onError?.(event);
                setFailedSources((prevFailedSources) =>
                    prevFailedSources.includes(currentSource) ? prevFailedSources : [...prevFailedSources, currentSource],
                );
            }}
            {...props}
        />
    );
};
