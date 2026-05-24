import {useLoadingStore} from './model/store';

const useLoadingUseCase = () => {
    const setLoading = useLoadingStore((state) => state.setLoading);

    return {
        setLoading,
    };
};

export default useLoadingUseCase;
