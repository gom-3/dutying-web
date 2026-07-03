import {cn} from '@dutying/utils/style';
import {useQuery} from '@tanstack/react-query';
import {CircleUserRound} from 'lucide-react';
import {useState} from 'react';
import {Link} from 'react-router';
import {notificationQueryOptions} from '@/entities/notification';
import {getWardDisplayCode, getWardDisplayIdentity, getWardDisplayTitle} from '@/entities/ward';
import useAuth from '@/features/auth';
import {isWardAdminAccessToken} from '@/features/auth/model/admin-token';
import useEditWard from '@/features/edit-ward';
import {useTotalPendingRequestCount} from '@/features/request-shift/model/use-total-pending-request-count';
import {HomeIcon, HomeIconSelected} from '@/shared/assets/svg';
import ROUTE, {type TRoute} from '@/shared/constant/path';
import {type TI18nKey, useTypedTranslation} from '@/shared/hook/use-typed-translation';
import WardCodeGuideModal from '@/widgets/ward-code-guide-modal';
import NavigationBarItem, {type TNavigationBarItemIcon} from './NavigationBarItem';

type TNavItem = {
    path?: TRoute;
    activePaths?: TRoute[];
    icon: TNavigationBarItemIcon;
    text?: string;
    textKey?: TI18nKey;
    disabled?: boolean;
};

type TNavSection = {
    labelKey: TI18nKey;
    items: TNavItem[];
};

const navigationImageIcon = (name: string): TNavigationBarItemIcon => ({
    kind: 'image',
    defaultSrc: `/img/navigation/${name}-default.png`,
    hoverSrc: `/img/navigation/${name}-hover.png`,
    activeSrc: `/img/navigation/${name}-active.png`,
});
const navigationIcons = {
    make: navigationImageIcon('make'),
    request: navigationImageIcon('request'),
    board: navigationImageIcon('board'),
    member: navigationImageIcon('member'),
    wardSettings: navigationImageIcon('ward-settings'),
    wardInfo: navigationImageIcon('ward-info'),
} as const;
const homeItem: TNavItem = {
    path: ROUTE.HOME,
    icon: {
        kind: 'component',
        Icon: HomeIcon,
        SelectedIcon: HomeIconSelected,
    },
    textKey: 'page.navigationBar.home',
};
const sections: TNavSection[] = [
    {
        labelKey: 'page.navigationBar.sections.operations',
        items: [
            {
                path: ROUTE.MAKE,
                activePaths: [ROUTE.MAKE, ROUTE.DUTY],
                icon: navigationIcons.make,
                textKey: 'page.navigationBar.items.make',
            },
            {
                path: ROUTE.REQUEST,
                icon: navigationIcons.request,
                textKey: 'page.navigationBar.items.request',
            },
            {
                path: ROUTE.BOARD,
                icon: navigationIcons.board,
                textKey: 'page.navigationBar.items.board',
            },
        ],
    },
    {
        labelKey: 'page.navigationBar.sections.settings',
        items: [
            {
                path: ROUTE.MEMBER,
                icon: navigationIcons.member,
                textKey: 'page.navigationBar.items.member',
            },
            {
                path: ROUTE.WARD_SETTINGS,
                icon: navigationIcons.wardSettings,
                textKey: 'page.navigationBar.items.wardSettings',
            },
            {
                path: ROUTE.WARD_INFO_SETTINGS,
                activePaths: [ROUTE.WARD_INFO_SETTINGS, ROUTE.WARD_ADMINS],
                icon: navigationIcons.wardInfo,
                textKey: 'page.navigationBar.items.wardInfoSettings',
            },
        ],
    },
];
const accountItem: TNavItem = {
    path: ROUTE.PROFILE,
    icon: {
        kind: 'component',
        Icon: CircleUserRound,
    },
    textKey: 'page.navigationBar.items.account',
};

type TNavigationBarItemGroupsProps = {
    collapsed?: boolean;
    stableCollapsedLayout?: boolean;
    onItemNavigate?: () => void;
};

type TWardIdentityProps = {
    collapsed: boolean;
    onItemNavigate?: () => void;
    ward?: {
        hospitalName?: string;
        name?: string;
        code?: string;
    };
};

const WardIdentity = ({collapsed, onItemNavigate, ward}: TWardIdentityProps) => {
    const {t} = useTypedTranslation();
    const {supportingName, primaryName} = getWardDisplayIdentity(ward);
    const wardTitle = getWardDisplayTitle(ward);
    const wardCode = getWardDisplayCode(ward);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const wardCodeButton = (
        <button
            type="button"
            aria-label={t('page.navigationBar.wardCodeGuideAria', {wardCode})}
            className="inline-flex shrink-0 items-center rounded-full bg-main-light px-2.5 py-1 transition-colors hover:bg-main-4 focus-visible:ring-2 focus-visible:ring-main-3 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={() => setIsGuideOpen(true)}
        >
            <span className="font-poppins text-[11px] leading-none font-semibold text-main-1">{wardCode}</span>
        </button>
    );

    if (collapsed) {
        return null;
    }

    return (
        <>
            <div className="mb-5 [@media(max-height:760px)]:mb-3">
                <div className="mb-4 h-px w-full bg-gray-6 [@media(max-height:760px)]:mb-3" />
                <div className="px-2">
                    {supportingName ? (
                        <>
                            <div className="flex items-start justify-between gap-2">
                                <p
                                    className="min-w-0 flex-1 truncate pt-0.5 text-[10px] leading-4 font-semibold text-gray-4"
                                    title={supportingName}
                                >
                                    {supportingName}
                                </p>
                                {wardCodeButton}
                            </div>
                            <p
                                className="mt-1 truncate text-[16px] leading-5 font-bold text-sub-1 [@media(max-height:760px)]:mt-0.5 [@media(max-height:760px)]:text-[15px] [@media(max-height:760px)]:leading-[18px]"
                                title={primaryName}
                            >
                                {primaryName}
                            </p>
                        </>
                    ) : (
                        <div className="flex items-start justify-between gap-2">
                            <p
                                className="min-w-0 flex-1 truncate text-[16px] leading-5 font-bold text-sub-1 [@media(max-height:760px)]:text-[15px] [@media(max-height:760px)]:leading-[18px]"
                                title={primaryName}
                            >
                                {primaryName}
                            </p>
                            {wardCodeButton}
                        </div>
                    )}
                </div>
                <div className="mt-3 [@media(max-height:760px)]:mt-2">
                    <NavigationBarItem
                        path={homeItem.path}
                        activePaths={homeItem.activePaths}
                        icon={homeItem.icon}
                        text={homeItem.text ?? t(homeItem.textKey!)}
                        disabled={homeItem.disabled}
                        onNavigate={onItemNavigate}
                    />
                </div>
            </div>
            <WardCodeGuideModal open={isGuideOpen} wardCode={wardCode} wardTitle={wardTitle} onClose={() => setIsGuideOpen(false)} />
        </>
    );
};
const NavigationBarItemGroups = ({collapsed = false, stableCollapsedLayout = false, onItemNavigate}: TNavigationBarItemGroupsProps) => {
    const {t} = useTypedTranslation();
    const {
        state: {accessToken},
    } = useAuth();
    const {
        state: {ward, watingNurses},
    } = useEditWard();
    const waitingCount = watingNurses?.length ?? 0;
    const pendingRequestCount = useTotalPendingRequestCount();
    const isWardAdmin = isWardAdminAccessToken(accessToken);
    const boardUnreadCountQuery = useQuery({
        ...notificationQueryOptions.unreadCount('BOARD'),
        enabled: isWardAdmin,
        refetchInterval: 30_000,
        retry: 1,
    });
    const hasBoardUnreadNotification = isWardAdmin && (boardUnreadCountQuery.data ?? 0) > 0;

    return (
        <nav
            aria-label={t('page.navigationBar.ariaLabel')}
            className={cn(
                'flex min-h-0 w-full flex-1 flex-col',
                collapsed || stableCollapsedLayout ? 'mt-5 [@media(max-height:720px)]:mt-3' : 'mt-6 [@media(max-height:760px)]:mt-4',
            )}
        >
            <div>
                {collapsed || stableCollapsedLayout ? (
                    <div className="mb-4 [@media(max-height:720px)]:mb-3">
                        <NavigationBarItem
                            path={homeItem.path}
                            activePaths={homeItem.activePaths}
                            icon={homeItem.icon}
                            text={homeItem.text ?? t(homeItem.textKey!)}
                            collapsed={collapsed}
                            alignWithCollapsedIcon={stableCollapsedLayout}
                            disabled={homeItem.disabled}
                            onNavigate={onItemNavigate}
                        />
                    </div>
                ) : null}
                {stableCollapsedLayout ? null : <WardIdentity collapsed={collapsed} onItemNavigate={onItemNavigate} ward={ward} />}
                {sections.map((section, sectionIndex) => (
                    <div
                        key={section.labelKey}
                        className={cn(
                            sectionIndex === 0
                                ? 'mt-0'
                                : collapsed || stableCollapsedLayout
                                  ? 'mt-4 [@media(max-height:720px)]:mt-3'
                                  : 'mt-7 [@media(max-height:760px)]:mt-4',
                        )}
                    >
                        <div
                            className={cn(
                                'h-px bg-gray-6',
                                collapsed || stableCollapsedLayout
                                    ? 'mx-auto mb-4 w-8 [@media(max-height:720px)]:mb-3'
                                    : 'mb-4 w-full [@media(max-height:760px)]:mb-3',
                            )}
                        />
                        {collapsed || stableCollapsedLayout ? null : (
                            <div className="px-3 pb-2 text-[12px] font-semibold text-gray-4 [@media(max-height:760px)]:pb-1 [@media(max-height:760px)]:text-[11px]">
                                {t(section.labelKey)}
                            </div>
                        )}
                        <div
                            className={cn(
                                'flex flex-col',
                                collapsed || stableCollapsedLayout
                                    ? 'gap-2 [@media(max-height:720px)]:gap-1'
                                    : 'gap-1.5 [@media(max-height:760px)]:gap-1',
                            )}
                        >
                            {section.items.map((item) => (
                                <NavigationBarItem
                                    key={item.path ?? item.textKey ?? item.text}
                                    path={item.path}
                                    activePaths={item.activePaths}
                                    icon={item.icon}
                                    text={item.text ?? t(item.textKey!)}
                                    collapsed={collapsed}
                                    alignWithCollapsedIcon={stableCollapsedLayout}
                                    disabled={item.disabled}
                                    badgeCount={
                                        item.path === ROUTE.MEMBER ? waitingCount : item.path === ROUTE.REQUEST ? pendingRequestCount : 0
                                    }
                                    badgeDot={item.path === ROUTE.BOARD && hasBoardUnreadNotification}
                                    onNavigate={onItemNavigate}
                                />
                            ))}
                            {section.labelKey === 'page.navigationBar.sections.settings' ? (
                                <>
                                    <div
                                        className={cn(
                                            'h-px bg-gray-6',
                                            collapsed || stableCollapsedLayout
                                                ? 'mx-auto my-4 w-8 [@media(max-height:720px)]:my-2.5'
                                                : 'my-4 w-full [@media(max-height:760px)]:my-2.5',
                                        )}
                                    />
                                    <NavigationBarItem
                                        path={accountItem.path}
                                        activePaths={accountItem.activePaths}
                                        icon={accountItem.icon}
                                        text={accountItem.text ?? t(accountItem.textKey!)}
                                        collapsed={collapsed}
                                        alignWithCollapsedIcon={stableCollapsedLayout}
                                        disabled={accountItem.disabled}
                                        onNavigate={onItemNavigate}
                                    />
                                </>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
            <div
                className={cn(
                    'mt-auto shrink-0',
                    collapsed || stableCollapsedLayout ? 'pt-4 [@media(max-height:720px)]:pt-2' : 'pt-5 [@media(max-height:760px)]:pt-3',
                )}
            >
                <div
                    className={cn(
                        'h-px bg-gray-6',
                        collapsed || stableCollapsedLayout
                            ? 'mx-auto mb-4 w-8 [@media(max-height:720px)]:mb-3'
                            : 'mb-4 w-full [@media(max-height:760px)]:mb-3',
                    )}
                />
                <Link
                    to={ROUTE.DUTYING}
                    className="mx-auto block w-fit rounded-[4px] px-1 py-1 text-center font-apple text-[12px] leading-4 font-medium text-gray-4 transition-colors hover:text-gray-3 focus-visible:ring-2 focus-visible:ring-main-3 focus-visible:ring-offset-2 focus-visible:outline-none [@media(max-height:720px)]:py-0.5"
                    onClick={onItemNavigate}
                >
                    {t('page.navigationBar.items.dutying')}
                </Link>
            </div>
        </nav>
    );
};

export default NavigationBarItemGroups;
