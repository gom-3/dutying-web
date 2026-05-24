import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import useRefresh, {REFRESH_DEMO_EXPIRED_REDIRECT_ERROR} from '@/features/refresh';
import ROUTE from '@/shared/constant/path';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import PageState from '@/shared/ui/PageState';

function RefreshPage() {
    const {refresh} = useRefresh();
    const {search} = useLocation();
    const {t} = useTypedTranslation();
    const rawNext = new URLSearchParams(search).get('next');
    const next = rawNext?.startsWith('/') && !rawNext.startsWith('//') ? rawNext : undefined;

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                await refresh();

                if (cancelled) return;

                location.replace(next ?? ROUTE.MAKE);
            } catch (error) {
                if (cancelled) return;

                if (error instanceof Error && error.message === REFRESH_DEMO_EXPIRED_REDIRECT_ERROR) {
                    return;
                }

                location.replace(ROUTE.ROOT);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [refresh, next]);

    return <PageState tone="loading" layout="screen" title={t('page.refresh.loading')} description={t('page.state.loadingDescription')} />;
}

export default RefreshPage;
