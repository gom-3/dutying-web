import * as Sentry from '@sentry/react';
import {AccountAPI} from '@/shared/api';
import {RUNTIME_CONFIG} from '@/shared/config/runtime';
import {createStore} from '@/shared/util/create-store';

interface IState {
    imageBaseUrl: string;
    defaultProfileImages: string[];
}

const initialState: IState = {
    imageBaseUrl: '',
    defaultProfileImages: [],
};

export const useProfileImageStore = createStore<IState>(initialState, {name: 'useProfileImageStore'});

const getImageUrls = (images: Awaited<ReturnType<typeof AccountAPI.getDefaultProfileImages>>) => images.map((image) => image.url);

AccountAPI.getDefaultProfileImages().then((images) => {
    const imageUrls = getImageUrls(images);

    useProfileImageStore.setState({
        defaultProfileImages: imageUrls,
        imageBaseUrl: (() => {
            const match = imageUrls[0]?.match(/^(https:\/\/[^/]+)\//);

            return match ? match[1] : RUNTIME_CONFIG.profileImageBaseUrl();
        })(),
    });
});

const DEFAULT_IMAGE_BASE_URL = RUNTIME_CONFIG.profileImageBaseUrl();

export const initializeProfileImageStore = async () => {
    try {
        const images = await AccountAPI.getDefaultProfileImages();
        const imageUrls = getImageUrls(images);
        const match = imageUrls[0]?.match(/^(https:\/\/[^/]+)\//);

        useProfileImageStore.setState({
            defaultProfileImages: imageUrls,
            imageBaseUrl: match ? match[1] : DEFAULT_IMAGE_BASE_URL,
        });
    } catch (error) {
        Sentry.captureException(error, {
            tags: {feature: 'profile-image', action: 'initialize-store'},
        });
        useProfileImageStore.setState({
            imageBaseUrl: DEFAULT_IMAGE_BASE_URL,
        });
    }
};
