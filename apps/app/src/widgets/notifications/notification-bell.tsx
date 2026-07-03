import {cn} from '@dutying/utils/style';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Bell, Loader2} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router';
import {notificationQueryKeys, notificationQueryOptions} from '@/entities/notification';
import {NotificationAPI} from '@/shared/api';
import type {TNotification} from '@/shared/api/notification';
import ROUTE from '@/shared/constant/path';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';

const NOTIFICATION_LIST_SIZE = 20;
const UNREAD_REFETCH_INTERVAL_MS = 30_000;
const fallbackPathByDomain = (domain?: string | null) => {
    if (domain === 'BOARD' || domain === 'CALENDAR') {
        return ROUTE.BOARD;
    }

    return ROUTE.HOME;
};
const toNavigationPath = (notification: TNotification) => {
    const rawUrl = notification.url?.trim();

    if (!rawUrl) {
        return fallbackPathByDomain(notification.domain);
    }

    if (rawUrl.startsWith('/')) {
        return rawUrl;
    }

    try {
        const parsedUrl = new URL(rawUrl);

        if (parsedUrl.origin === window.location.origin) {
            return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
        }
    } catch {
        return fallbackPathByDomain(notification.domain);
    }

    return fallbackPathByDomain(notification.domain);
};
const formatTime = (value: string | undefined, t: ReturnType<typeof useTypedTranslation>['t']) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60_000);

    if (diffMinutes < 1) return t('page.notifications.justNow');

    if (diffMinutes < 60) return t('page.notifications.minutesAgo', {count: diffMinutes});

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) return t('page.notifications.hoursAgo', {count: diffHours});

    return `${date.getMonth() + 1}.${date.getDate()}`;
};

export function NotificationBell() {
    const {t} = useTypedTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const rootRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const unreadCountQuery = useQuery({
        ...notificationQueryOptions.unreadCount(),
        refetchInterval: UNREAD_REFETCH_INTERVAL_MS,
        retry: 1,
    });
    const notificationsQuery = useQuery({
        ...notificationQueryOptions.list({size: NOTIFICATION_LIST_SIZE}),
        enabled: isOpen,
        retry: 1,
    });
    const markReadMutation = useMutation({
        mutationFn: (notificationId: number) => NotificationAPI.markAsRead(notificationId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: notificationQueryKeys.all()});
        },
    });
    const unreadCount = unreadCountQuery.data ?? 0;
    const unreadLabel = unreadCount > 99 ? '99+' : String(unreadCount);
    const notifications = notificationsQuery.data ?? [];

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!(event.target instanceof Node) || rootRef.current?.contains(event.target)) {
                return;
            }

            setIsOpen(false);
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [isOpen]);

    const handleNotificationClick = async (notification: TNotification) => {
        if (!notification.isRead) {
            await markReadMutation.mutateAsync(notification.id).catch(() => undefined);
        }

        setIsOpen(false);
        navigate(toNavigationPath(notification));
    };

    return (
        <div ref={rootRef} className="fixed top-4 right-5 z-[1002] font-apple">
            <button
                type="button"
                className={cn(
                    'relative grid size-10 place-items-center rounded-full text-gray-3 transition-colors',
                    'hover:text-sub-1 focus-visible:ring-2 focus-visible:ring-main-3 focus-visible:ring-offset-2 focus-visible:outline-none',
                    isOpen && 'text-sub-1',
                )}
                aria-label={t('page.notifications.openAria')}
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <Bell className="size-6 fill-current stroke-current" strokeWidth={1.75} aria-hidden="true" />
                {unreadCount > 0 ? (
                    <span
                        className="absolute top-0 right-0 grid min-w-[18px] place-items-center rounded-full bg-[#E55C6E] px-[5px] font-poppins text-[10px] leading-[18px] font-semibold text-white"
                        aria-label={t('page.notifications.unreadCount', {count: unreadCount})}
                    >
                        {unreadLabel}
                    </span>
                ) : null}
            </button>

            {isOpen ? (
                <section
                    className="absolute top-13 right-0 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-[8px] border border-gray-6 bg-white shadow-[0_24px_80px_rgba(18,23,38,0.18)]"
                    aria-label={t('page.notifications.panelAria')}
                >
                    <div className="flex items-center justify-between border-b border-gray-6 px-4 py-3">
                        <h2 className="text-[15px] leading-5 font-semibold text-sub-1">{t('page.notifications.title')}</h2>
                        <span className="text-[12px] leading-4 font-semibold text-gray-4">
                            {t('page.notifications.unreadShort', {count: unreadCount})}
                        </span>
                    </div>

                    <div className="max-h-[420px] overflow-y-auto py-1">
                        {notificationsQuery.isLoading ? (
                            <div className="grid min-h-[132px] place-items-center text-gray-4">
                                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                            </div>
                        ) : notificationsQuery.isError ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-[13px] leading-5 font-medium text-gray-3">{t('page.notifications.loadFailed')}</p>
                                <button
                                    type="button"
                                    className="mt-3 rounded-[7px] bg-gray-7 px-3 py-2 text-[12px] font-semibold text-sub-1 transition-colors hover:bg-main-light"
                                    onClick={() => void notificationsQuery.refetch()}
                                >
                                    {t('page.notifications.retry')}
                                </button>
                            </div>
                        ) : notifications.length === 0 ? (
                            <p className="px-4 py-10 text-center text-[13px] leading-5 font-medium text-gray-3">
                                {t('page.notifications.empty')}
                            </p>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    type="button"
                                    className={cn(
                                        'flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-7',
                                        !notification.isRead && 'bg-main-light/55',
                                    )}
                                    onClick={() => void handleNotificationClick(notification)}
                                >
                                    <span
                                        className={cn(
                                            'mt-1 size-2 shrink-0 rounded-full',
                                            notification.isRead ? 'bg-gray-5' : 'bg-[#E55C6E]',
                                        )}
                                        aria-hidden="true"
                                    />
                                    <span className="min-w-0 flex-1">
                                        <span
                                            className={cn(
                                                'block text-[13px] leading-5 break-words text-sub-1',
                                                notification.isRead ? 'font-medium' : 'font-semibold',
                                            )}
                                        >
                                            {notification.content}
                                        </span>
                                        <span className="mt-1 block text-[11px] leading-4 font-medium text-gray-4">
                                            {formatTime(notification.createdAt, t)}
                                        </span>
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </section>
            ) : null}
        </div>
    );
}
