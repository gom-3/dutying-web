import {cn} from '@dutying/utils/style';
import {useState} from 'react';
import {useNavigate} from 'react-router';
import {events, sendEvent} from '@/analytics';
import {FoldIcon, LogoV2} from '@/shared/assets/svg';
import ROUTE from '@/shared/constant/path';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import NavigationBarItemGroups from './NavigationBarItemGroup';

const NAV_WIDTH_EXPANDED = 'w-[172px]';
const NAV_WIDTH_COLLAPSED = 'w-[48px]';

const NavigationBar = () => {
    const navigate = useNavigate();
    const {t} = useTypedTranslation();
    const [isFold, setIsFold] = useState(false);

    return (
        <aside
            data-testid="navigation-bar"
            className={cn(
                'sticky top-0 z-997 h-screen shrink-0 overflow-hidden border-r border-gray-6 bg-white font-apple transition-[width] duration-300 ease-out',
                isFold ? NAV_WIDTH_COLLAPSED : NAV_WIDTH_EXPANDED,
            )}
        >
            {isFold ? (
                <div className="flex h-full flex-col items-center pt-[13px]">
                    <button
                        data-testid="navigation-bar-fold-trigger"
                        type="button"
                        aria-label={t('page.navigationBar.expandAria')}
                        className="flex size-[30px] items-center justify-center"
                        onClick={() => {
                            setIsFold(false);
                            sendEvent(events.navigationBar.spreadNavigation);
                        }}
                    >
                        <FoldIcon className="h-[30px] w-[30px] rotate-180 text-gray-5" />
                    </button>
                </div>
            ) : (
                <div className="relative flex h-full w-full flex-col">
                    <div className="px-[20px]">
                        <button
                            type="button"
                            aria-label={t('page.navigationBar.foldAria')}
                            className="absolute top-[13px] right-[9px] flex size-[30px] items-center justify-center"
                            onClick={() => {
                                setIsFold(true);
                                sendEvent(events.navigationBar.foldNavigation);
                            }}
                        >
                            <FoldIcon className="h-[30px] w-[30px] text-gray-5" />
                        </button>

                        <LogoV2 className="mt-[85px] size-[28px]" />

                        <div className="mt-6 w-full">
                            <button
                                type="button"
                                className="w-full cursor-pointer rounded-[7px] border border-gray-6 bg-gray-7 py-[11px] text-[16px] font-medium text-gray-3"
                                onClick={() => navigate(ROUTE.DUTY)}
                            >
                                {t('page.navigationBar.home')}
                            </button>
                        </div>
                    </div>

                    <NavigationBarItemGroups />
                </div>
            )}
        </aside>
    );
};

export default NavigationBar;
