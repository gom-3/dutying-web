import {cn} from '@dutying/utils/style';
import {useQuery} from '@tanstack/react-query';
import {useEffect, useMemo, useRef, useState} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router';
import {getWardDisplayCode, getWardDisplayTitle, wardQueryOptions} from '@/entities/ward';
import useAuth from '@/features/auth';
import {isWardAdminAccessToken} from '@/features/auth/model/admin-token';
import ROUTE from '@/shared/constant/path';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import NavigationBar from '@/widgets/navigation-bar';
import {useNavigationBarFoldStore} from '@/widgets/navigation-bar/navigation-bar-fold-store';
import {NotificationBell} from '@/widgets/notifications/notification-bell';
import WardChatWidget from '@/widgets/ward-chat';
import WardCodeGuideModal from '@/widgets/ward-code-guide-modal';

const WARD_CREATED_GUIDE_STORAGE_KEY = 'dutying:onboardingWardCreatedGuide';
const WORKSPACE_NAV_AUTO_FOLD_WIDTH = 1536;
const DEFAULT_NAV_AUTO_FOLD_WIDTH = 1280;
const NAV_AUTO_FOLD_ROUTES = new Set<string>([ROUTE.MAKE, ROUTE.MEMBER]);

type TWardCreatedGuidePayload = {
    wardCode?: string | null;
    wardTitle?: string | null;
};

type TMainLayoutLocationState = {
    onboardingWardCreated?: true | TWardCreatedGuidePayload;
} | null;

const normalizeWardCreatedGuidePayload = (value: unknown): TWardCreatedGuidePayload | null => {
    if (value === true) {
        return {};
    }

    if (!value || typeof value !== 'object') {
        return null;
    }

    return value as TWardCreatedGuidePayload;
};
const readStoredWardCreatedGuidePayload = () => {
    const rawPayload = window.sessionStorage.getItem(WARD_CREATED_GUIDE_STORAGE_KEY);

    if (!rawPayload) {
        return null;
    }

    try {
        return normalizeWardCreatedGuidePayload(JSON.parse(rawPayload));
    } catch {
        return null;
    }
};
const shouldAutoFoldNavigation = (pathname: string, viewportWidth: number) =>
    viewportWidth < DEFAULT_NAV_AUTO_FOLD_WIDTH || (NAV_AUTO_FOLD_ROUTES.has(pathname) && viewportWidth < WORKSPACE_NAV_AUTO_FOLD_WIDTH);

export const MainLayout = () => {
    const {t} = useTypedTranslation();
    const {
        state: {accessToken, wardId},
    } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const layoutRef = useRef<HTMLDivElement>(null);
    const previousResponsiveStateRef = useRef<{pathname: string; shouldAutoFold: boolean} | null>(null);
    const locationState = location.state as TMainLayoutLocationState;
    const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
    const locationGuidePayload = useMemo(
        () => normalizeWardCreatedGuidePayload(locationState?.onboardingWardCreated),
        [locationState?.onboardingWardCreated],
    );
    const [createdWardGuidePayload, setCreatedWardGuidePayload] = useState<TWardCreatedGuidePayload | null>(null);
    const isNavigationFolded = useNavigationBarFoldStore((state) => state.isFold);
    const wardQuery = useQuery({
        ...wardQueryOptions.id(wardId ?? -1),
        enabled: wardId !== null,
        staleTime: 1000 * 60 * 5,
    });
    const wardCode = createdWardGuidePayload?.wardCode ?? getWardDisplayCode(wardQuery.data, t('entity.ward.codeChecking'));
    const wardTitle = createdWardGuidePayload?.wardTitle ?? getWardDisplayTitle(wardQuery.data);
    const shouldFoldNavigation = shouldAutoFoldNavigation(location.pathname, viewportWidth);
    const shouldUseCompactNavigation = shouldFoldNavigation || (viewportWidth < WORKSPACE_NAV_AUTO_FOLD_WIDTH && isNavigationFolded);
    const shouldKeepStableVerticalScroll = location.pathname === ROUTE.WARD_SETTINGS;
    const shouldShowNotificationBell = isWardAdminAccessToken(accessToken);

    useEffect(() => {
        const guidePayload = locationGuidePayload ?? readStoredWardCreatedGuidePayload();

        if (!guidePayload) {
            return;
        }

        window.sessionStorage.removeItem(WARD_CREATED_GUIDE_STORAGE_KEY);
        setCreatedWardGuidePayload(guidePayload);

        if (locationGuidePayload) {
            navigate(`${location.pathname}${location.search}`, {replace: true, state: null});
        }
    }, [location.pathname, location.search, locationGuidePayload, navigate]);

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const previousResponsiveState = previousResponsiveStateRef.current;
        const routeChanged = previousResponsiveState?.pathname !== location.pathname;
        const becameAutoFolded = previousResponsiveState?.shouldAutoFold !== true && shouldFoldNavigation;
        const navigationState = useNavigationBarFoldStore.getState();

        previousResponsiveStateRef.current = {
            pathname: location.pathname,
            shouldAutoFold: shouldFoldNavigation,
        };

        if (shouldFoldNavigation) {
            if (routeChanged || becameAutoFolded || !navigationState.isFold) {
                navigationState.collapse('auto');
            }
        }
    }, [location.pathname, shouldFoldNavigation]);

    useEffect(() => {
        if (!shouldFoldNavigation) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            const layoutElement = layoutRef.current;
            const navigationElement = layoutElement?.querySelector('[data-testid="navigation-bar"]');

            if (!navigationElement || !(event.target instanceof Node) || navigationElement.contains(event.target)) {
                return;
            }

            const navigationState = useNavigationBarFoldStore.getState();

            if (!navigationState.isFold) {
                navigationState.collapse('auto');
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [shouldFoldNavigation]);

    return (
        <div ref={layoutRef} className="flex h-full w-full bg-main-bg">
            <WardCodeGuideModal
                open={createdWardGuidePayload !== null}
                wardCode={wardCode}
                wardTitle={wardTitle}
                onClose={() => setCreatedWardGuidePayload(null)}
            />
            <NavigationBar compactMode={shouldUseCompactNavigation} />
            <main className={cn('min-w-0 flex-1 overflow-x-auto', shouldKeepStableVerticalScroll && 'overflow-y-scroll')}>
                <Outlet />
            </main>
            {shouldShowNotificationBell ? <NotificationBell /> : null}
            <WardChatWidget />
        </div>
    );
};
