import {cn} from '@dutying/utils/style';
import {useState} from 'react';
import {events, sendEvent} from '@/analytics';
import {FoldIcon} from '@/shared/assets/svg';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import NavigationBarItemGroups from './NavigationBarItemGroup';

const NAV_WIDTH_EXPANDED = 'w-[216px]';
const NAV_WIDTH_COLLAPSED = 'w-[64px]';
const NavigationBar = () => {
    const {t} = useTypedTranslation();
    const [isFold, setIsFold] = useState(false);

    return (
        <aside
            data-testid="navigation-bar"
            className={cn(
                'sticky top-0 z-[997] h-screen shrink-0 overflow-hidden border-r border-gray-6 bg-white font-apple shadow-[8px_0_24px_rgba(36,36,40,0.04)] transition-[width] duration-300 ease-out',
                isFold ? NAV_WIDTH_COLLAPSED : NAV_WIDTH_EXPANDED,
            )}
        >
            <div className={cn('flex h-full flex-col', isFold ? 'px-2 py-3' : 'px-3 py-4')}>
                <div className={cn('flex min-h-11 items-center', isFold ? 'flex-col gap-2' : 'justify-between')}>
                    {isFold ? (
                        <img src="/img/image-43-2.png" alt="" aria-hidden="true" className="mt-2 size-[22px] shrink-0 object-contain" />
                    ) : (
                        <img src="/img/group-19.png" alt="" aria-hidden="true" className="h-[26px] w-auto max-w-[128px] object-contain" />
                    )}
                    <button
                        data-testid="navigation-bar-fold-trigger"
                        type="button"
                        aria-label={t(isFold ? 'page.navigationBar.expandAria' : 'page.navigationBar.foldAria')}
                        className={cn(
                            'flex size-11 shrink-0 items-center justify-center rounded-[10px] text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1',
                            'focus-visible:ring-2 focus-visible:ring-main-3 focus-visible:ring-offset-2 focus-visible:outline-none',
                        )}
                        onClick={() => {
                            setIsFold((prev) => {
                                sendEvent(prev ? events.navigationBar.spreadNavigation : events.navigationBar.foldNavigation);

                                return !prev;
                            });
                        }}
                    >
                        <FoldIcon className={cn('size-[26px]', isFold ? 'rotate-180' : undefined)} />
                    </button>
                </div>

                <NavigationBarItemGroups collapsed={isFold} />
            </div>
        </aside>
    );
};

export default NavigationBar;
