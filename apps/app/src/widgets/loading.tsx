import {useLoadingStore} from '@/features/loading/model/store';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import PageState from '@/shared/ui/PageState';

const Loading = () => {
    const {t} = useTypedTranslation();
    const loading = useLoadingStore((state) => state.loading);
    const loadingColor = useLoadingStore((state) => state.loadingColor);

    return (
        loading && (
            <div className="fixed z-1005 flex h-screen w-screen items-center justify-center bg-[#0000006e] backdrop-blur-[1px]">
                <PageState tone="loading" layout="screen" loadingColor={loadingColor} title={t('page.state.loadingTitle')} />
            </div>
        )
    );
};

export default Loading;
