import * as Sentry from '@sentry/react';
import {useState} from 'react';
import toast from 'react-hot-toast';
import {FileAPI} from '@/shared/api';
import {FILE_TYPE} from '@/shared/api/file/type';
import {uploadImageToS3} from './upload-file';

export const DEFAULT_IMAGE_COUNT = 30;

const useProfileImage = (initialImg?: {profileImgUrl?: string; defaultProfileImgId?: number}) => {
    const [profileImg, setProfileImg] = useState<{profileImgUrl?: string; defaultProfileImgId?: number} | undefined>(initialImg);
    const [isLoading, setIsLoading] = useState(false);
    const setRandomImage = () => {
        setProfileImg({defaultProfileImgId: Math.floor(Math.random() * DEFAULT_IMAGE_COUNT) + 1});
    };
    const setPhotoImage = async (photo: File) => {
        setIsLoading(true);

        const extension = photo.name.split('.').pop()?.toLowerCase() ?? 'jpg';

        try {
            const {presignedUrl, fileUrl} = await FileAPI.getPresignedUrl(FILE_TYPE.PROFILE_IMAGE, extension);

            await uploadImageToS3(presignedUrl, photo);
            setProfileImg({profileImgUrl: fileUrl});
        } catch (e) {
            Sentry.captureException(e, {
                tags: {feature: 'profile-image', action: 'upload'},
                extra: {extension},
            });
            toast.error('프로필 이미지를 업로드하지 못했어요.');
        } finally {
            setIsLoading(false);
        }
    };
    const resetProfileImage = (nextProfileImg?: {profileImgUrl?: string; defaultProfileImgId?: number}) => {
        setProfileImg(nextProfileImg);
    };

    return {
        profileImg,
        isLoading,
        setRandomImage,
        setPhotoImage,
        resetProfileImage,
    };
};

export default useProfileImage;
