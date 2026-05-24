import axiosInstance from '../client';
import {type IFileAPI, type IPresignedUrlResponse, type TOnboardingWardParseApiResponse, type TPresignedUrlRequest} from './type';

class FileAPI implements IFileAPI {
    public async getPresignedUrl(fileType: TPresignedUrlRequest, fileExtension: string) {
        return (
            await axiosInstance.post<IPresignedUrlResponse>(`/files/presigned-url`, {
                fileType,
                fileExtension,
            })
        ).data;
    }

    public async parseOnboardingWardExcel(file: File) {
        const formData = new FormData();

        formData.append('file', file);

        return (
            await axiosInstance.post<TOnboardingWardParseApiResponse>(`/files/wards/onboarding/parse`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
        ).data;
    }
}

export default new FileAPI();
