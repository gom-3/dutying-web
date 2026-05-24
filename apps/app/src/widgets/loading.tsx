import {useLoadingStore} from '@/features/loading/model/store';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';

const Loading = () => {
    const loading = useLoadingStore((state) => state.loading);

    return (
        loading && (
            <div className="fixed z-1005 flex h-screen w-screen items-center justify-center bg-[#0000006e] backdrop-blur-[1px]">
                <LoadingSpinner size={132} />
            </div>
        )
    );
};

export default Loading;
