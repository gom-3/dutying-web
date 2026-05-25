import type {TWardChatMessageResponse, TWardChatUnreadCountResponse} from '@dutying/api/ward';
import {cn} from '@dutying/utils/style';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {ChevronUp, Loader2, MessageCircle, RefreshCcw, SendHorizontal, Users, X} from 'lucide-react';
import {Fragment, type FormEvent, type KeyboardEvent, useEffect, useMemo, useRef, useState} from 'react';
import toast from 'react-hot-toast';
import useAuth from '@/features/auth';
import {WardAPI} from '@/shared/api';
import {Button} from '@/shared/ui/primitives/button';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/shared/ui/primitives/tooltip';

const CHAT_PAGE_SIZE = 30;
const OPEN_REFETCH_INTERVAL_MS = 5000;
const UNREAD_REFETCH_INTERVAL_MS = 15000;
const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
});
const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
});
const wardChatQueryKeys = {
    messages: (wardId: number) => ['ward-chat', 'messages', wardId] as const,
    unread: (wardId: number) => ['ward-chat', 'unread', wardId] as const,
};

function createClientMessageId() {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getMessageTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    return timeFormatter.format(date);
}

function getDateLabel(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    return dateFormatter.format(date);
}

function compareMessages(a: TWardChatMessageResponse, b: TWardChatMessageResponse) {
    const sentAtDiff = Date.parse(a.sentAt) - Date.parse(b.sentAt);

    if (Number.isFinite(sentAtDiff) && sentAtDiff !== 0) return sentAtDiff;

    return a.messageId - b.messageId;
}

function mergeMessages(current: TWardChatMessageResponse[], incoming: TWardChatMessageResponse[]) {
    const messages = new Map(current.map((message) => [message.messageId, message]));

    incoming.forEach((message) => messages.set(message.messageId, message));

    return Array.from(messages.values()).sort(compareMessages);
}

function getNewestMessageId(messages: TWardChatMessageResponse[]) {
    return messages.reduce((newestId, message) => Math.max(newestId, message.messageId), 0);
}

function getUnreadLabel(unreadCount: number) {
    if (unreadCount > 99) return '99+';

    return String(unreadCount);
}

function getSenderInitial(senderName: string) {
    return senderName.trim().slice(0, 1) || '?';
}

function ChatMessage({message, isMine}: {message: TWardChatMessageResponse; isMine: boolean}) {
    const text = message.isDeleted ? '삭제된 메시지입니다' : message.text;

    return (
        <div className={cn('flex w-full gap-2.5', isMine ? 'justify-end' : 'justify-start')}>
            {isMine ? null : (
                <div className="mt-5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EEF3F7] text-[13px] font-bold text-[#526070]">
                    {getSenderInitial(message.senderName)}
                </div>
            )}
            <div className={cn('flex max-w-[78%] flex-col gap-1', isMine ? 'items-end' : 'items-start')}>
                {isMine ? null : <span className="px-1 text-[12px] font-semibold text-gray-3">{message.senderName}</span>}
                <div className={cn('flex items-end gap-1.5', isMine ? 'flex-row-reverse' : 'flex-row')}>
                    <p
                        className={cn(
                            'rounded-[18px] px-3.5 py-2.5 text-[14px] leading-[21px] break-words whitespace-pre-wrap shadow-sm',
                            message.isDeleted
                                ? 'border border-[#E1E6EF] bg-[#F3F5F8] text-gray-4 italic shadow-none'
                                : isMine
                                  ? 'rounded-br-[7px] bg-main-1 text-white shadow-[0_8px_18px_rgba(102,61,250,0.18)]'
                                  : 'rounded-bl-[7px] border border-[#EDF0F4] bg-white text-[#242428]',
                        )}
                    >
                        {text}
                    </p>
                    <span className="mb-1 shrink-0 text-[11px] font-medium text-gray-4">{getMessageTime(message.sentAt)}</span>
                </div>
            </div>
        </div>
    );
}

function MessageSkeleton() {
    return (
        <div className="space-y-4 px-5 py-5">
            {Array.from({length: 4}, (_, index) => (
                <div key={index} className={cn('flex gap-2.5', index % 2 === 0 ? 'justify-start' : 'justify-end')}>
                    {index % 2 === 0 ? <div className="size-8 rounded-full bg-gray-6" /> : null}
                    <div className={cn('h-10 rounded-[18px] bg-gray-6', index % 2 === 0 ? 'w-44' : 'w-32')} />
                </div>
            ))}
        </div>
    );
}

export default function WardChatWidget() {
    const {
        state: {accountId, isDemoExpired, wardId},
    } = useAuth();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState('');
    const [messages, setMessages] = useState<TWardChatMessageResponse[]>([]);
    const [nextCursorMessageId, setNextCursorMessageId] = useState<number | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const acknowledgedMessageIdRef = useRef<number | null>(null);
    const effectiveWardId = wardId ?? 0;
    const isWidgetAvailable = Boolean(wardId) && !isDemoExpired;
    const unreadQuery = useQuery({
        queryKey: wardChatQueryKeys.unread(effectiveWardId),
        queryFn: () => WardAPI.getWardChatUnreadCount(effectiveWardId),
        enabled: isWidgetAvailable,
        refetchInterval: isOpen ? false : UNREAD_REFETCH_INTERVAL_MS,
    });
    const messagesQuery = useQuery({
        queryKey: wardChatQueryKeys.messages(effectiveWardId),
        queryFn: () => WardAPI.getWardChatMessages(effectiveWardId, {size: CHAT_PAGE_SIZE}),
        enabled: isWidgetAvailable && isOpen,
        refetchInterval: isOpen ? OPEN_REFETCH_INTERVAL_MS : false,
    });
    const loadOlderMutation = useMutation({
        mutationFn: (cursorMessageId: number) =>
            WardAPI.getWardChatMessages(effectiveWardId, {
                cursorMessageId,
                size: CHAT_PAGE_SIZE,
            }),
        onSuccess: (data) => {
            setMessages((prev) => mergeMessages(prev, data.messages));
            setNextCursorMessageId(data.nextCursorMessageId ?? null);
        },
    });
    const readMutation = useMutation({
        mutationFn: (lastReadMessageId: number) => WardAPI.readWardChat(effectiveWardId, {lastReadMessageId}),
        onSuccess: () => {
            queryClient.setQueryData<TWardChatUnreadCountResponse>(wardChatQueryKeys.unread(effectiveWardId), (prev) =>
                prev ? {...prev, unreadCount: 0} : prev,
            );
        },
    });
    const sendMutation = useMutation({
        mutationFn: (text: string) =>
            WardAPI.createWardChatMessage(effectiveWardId, {
                text,
                clientMessageId: createClientMessageId(),
            }),
        onSuccess: (message) => {
            setMessages((prev) => mergeMessages(prev, [message]));
            setDraft('');
            void queryClient.invalidateQueries({queryKey: wardChatQueryKeys.messages(effectiveWardId)});
        },
        onError: () => {
            toast.error('메시지를 보내지 못했어요.');
        },
    });
    const unreadCount = unreadQuery.data?.unreadCount ?? messagesQuery.data?.unreadCount ?? 0;
    const hasOlderMessages = typeof nextCursorMessageId === 'number' && nextCursorMessageId > 0;
    const newestMessageId = useMemo(() => getNewestMessageId(messages), [messages]);

    useEffect(() => {
        setMessages([]);
        setNextCursorMessageId(null);
        setDraft('');
        acknowledgedMessageIdRef.current = null;
    }, [effectiveWardId]);

    useEffect(() => {
        if (!messagesQuery.data) return;

        setMessages((prev) => mergeMessages(prev, messagesQuery.data.messages));
        setNextCursorMessageId(messagesQuery.data.nextCursorMessageId ?? null);
    }, [messagesQuery.data]);

    useEffect(() => {
        if (!isOpen || !isWidgetAvailable || newestMessageId <= 0) return;

        if (acknowledgedMessageIdRef.current === newestMessageId) return;

        acknowledgedMessageIdRef.current = newestMessageId;
        readMutation.mutate(newestMessageId);
    }, [isOpen, isWidgetAvailable, newestMessageId, readMutation]);

    useEffect(() => {
        if (!isOpen) return;

        const timer = window.setTimeout(() => textareaRef.current?.focus(), 80);

        return () => window.clearTimeout(timer);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        bottomRef.current?.scrollIntoView({block: 'end'});
    }, [isOpen, messages.length]);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) return;

        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
    }, [draft]);

    if (!isWidgetAvailable) return null;

    const sendDraft = () => {
        const text = draft.trim();

        if (!text || sendMutation.isPending) return;

        sendMutation.mutate(text);
    };
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendDraft();
    };
    const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;

        event.preventDefault();
        sendDraft();
    };
    const handleLoadOlder = () => {
        if (!hasOlderMessages || loadOlderMutation.isPending) return;

        if (typeof nextCursorMessageId !== 'number') return;

        loadOlderMutation.mutate(nextCursorMessageId);
    };

    return (
        <div className="fixed right-4 bottom-4 z-[1200] font-pretendard sm:right-6 sm:bottom-6">
            {isOpen ? (
                <section
                    aria-label="병동톡"
                    className="flex h-[min(640px,calc(100vh-32px))] w-[min(390px,calc(100vw-32px))] animate-in flex-col overflow-hidden rounded-[24px] border border-[#E7EAF0] bg-[#F8FAFC] shadow-[0_24px_70px_rgba(21,24,34,0.22)] duration-200 zoom-in-95 fade-in slide-in-from-bottom-4"
                >
                    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#EDF0F4] bg-white px-5 py-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="flex size-8 items-center justify-center rounded-full bg-main-light text-main-1">
                                    <MessageCircle className="size-[18px]" strokeWidth={2.2} aria-hidden="true" />
                                </span>
                                <h2 className="truncate text-[17px] font-bold text-[#17171C]">병동톡</h2>
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-gray-3">
                                <Users className="size-3.5" strokeWidth={2} aria-hidden="true" />
                                <span>병동 인원 채팅</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="flex size-9 shrink-0 items-center justify-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1 focus-visible:ring-2 focus-visible:ring-main-3 focus-visible:ring-offset-2 focus-visible:outline-none"
                            aria-label="병동톡 닫기"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="size-5" strokeWidth={2.2} aria-hidden="true" />
                        </button>
                    </header>

                    <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-4 py-4" role="log" aria-live="polite">
                        {messagesQuery.isLoading && messages.length === 0 ? <MessageSkeleton /> : null}

                        {messagesQuery.isError && messages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                                <div className="flex size-12 items-center justify-center rounded-full bg-[#EEF3F7] text-gray-3">
                                    <RefreshCcw className="size-5" strokeWidth={2} aria-hidden="true" />
                                </div>
                                <p className="mt-4 text-[15px] font-bold text-sub-1">대화를 불러오지 못했어요.</p>
                                <Button
                                    type="button"
                                    variant="soft"
                                    size="sm"
                                    className="mt-4 h-9 rounded-full px-4"
                                    onClick={() => void messagesQuery.refetch()}
                                >
                                    다시 시도
                                </Button>
                            </div>
                        ) : null}

                        {!messagesQuery.isLoading && !messagesQuery.isError && messages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                                <div className="flex size-14 items-center justify-center rounded-full bg-white text-main-1 shadow-sm">
                                    <MessageCircle className="size-6" strokeWidth={2.1} aria-hidden="true" />
                                </div>
                                <p className="mt-4 text-[15px] font-bold text-sub-1">아직 대화가 없어요.</p>
                                <p className="mt-1 text-[13px] font-medium text-gray-3">첫 메시지를 남겨보세요.</p>
                            </div>
                        ) : null}

                        {messages.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    {hasOlderMessages ? (
                                        <button
                                            type="button"
                                            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#E5E9F0] bg-white px-3 text-[12px] font-bold text-gray-3 shadow-sm transition-colors hover:border-main-3 hover:text-main-1 focus-visible:ring-2 focus-visible:ring-main-3 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60"
                                            disabled={loadOlderMutation.isPending}
                                            onClick={handleLoadOlder}
                                        >
                                            {loadOlderMutation.isPending ? (
                                                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                                            ) : (
                                                <ChevronUp className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
                                            )}
                                            이전 메시지
                                        </button>
                                    ) : (
                                        <span className="rounded-full bg-[#EEF3F7] px-3 py-1.5 text-[11px] font-semibold text-gray-4">
                                            대화의 시작
                                        </span>
                                    )}
                                </div>

                                {messages.map((message, index) => {
                                    const dateLabel = getDateLabel(message.sentAt);
                                    const prevDateLabel = index > 0 ? getDateLabel(messages[index - 1].sentAt) : '';
                                    const showDateLabel = dateLabel && dateLabel !== prevDateLabel;

                                    return (
                                        <Fragment key={message.messageId}>
                                            {showDateLabel ? (
                                                <div className="flex justify-center">
                                                    <span className="rounded-full bg-[#EEF3F7] px-3 py-1.5 text-[11px] font-semibold text-gray-4">
                                                        {dateLabel}
                                                    </span>
                                                </div>
                                            ) : null}
                                            <ChatMessage message={message} isMine={message.senderAccountId === accountId} />
                                        </Fragment>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </div>
                        ) : null}
                    </div>

                    <form className="shrink-0 border-t border-[#EDF0F4] bg-white p-3" onSubmit={handleSubmit}>
                        <div className="flex items-end gap-2 rounded-[20px] border border-[#E1E6EF] bg-[#F8FAFC] px-3 py-2 transition-colors focus-within:border-main-3 focus-within:bg-white">
                            <textarea
                                ref={textareaRef}
                                value={draft}
                                rows={1}
                                placeholder="메시지 입력"
                                className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-2 text-[14px] leading-5 text-sub-1 placeholder:text-gray-4 focus:outline-none"
                                onChange={(event) => setDraft(event.target.value)}
                                onKeyDown={handleTextareaKeyDown}
                            />
                            <button
                                type="submit"
                                aria-label="메시지 보내기"
                                disabled={!draft.trim() || sendMutation.isPending}
                                className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-main-1 text-white transition-colors hover:bg-[#5631E7] focus-visible:ring-2 focus-visible:ring-main-3 focus-visible:ring-offset-2 focus-visible:outline-none disabled:bg-gray-6 disabled:text-gray-4"
                            >
                                {sendMutation.isPending ? (
                                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                                ) : (
                                    <SendHorizontal className="size-4" strokeWidth={2.4} aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            ) : (
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                aria-label={
                                    unreadCount > 0 ? `병동톡 열기, 읽지 않은 메시지 ${getUnreadLabel(unreadCount)}개` : '병동톡 열기'
                                }
                                className="group relative flex size-[60px] items-center justify-center rounded-full bg-main-1 text-white shadow-[0_16px_32px_rgba(102,61,250,0.28)] transition-transform duration-150 hover:scale-[1.03] hover:bg-[#5631E7] focus-visible:ring-2 focus-visible:ring-main-3 focus-visible:ring-offset-2 focus-visible:outline-none"
                                onClick={() => setIsOpen(true)}
                            >
                                <MessageCircle
                                    className="size-7 transition-transform group-hover:scale-105"
                                    strokeWidth={2.2}
                                    aria-hidden="true"
                                />
                                {unreadCount > 0 ? (
                                    <span className="absolute -top-1 -right-1 flex min-w-[24px] items-center justify-center rounded-full border-2 border-white bg-[#E55C6E] px-1.5 text-[11px] leading-5 font-bold text-white">
                                        {getUnreadLabel(unreadCount)}
                                    </span>
                                ) : null}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="rounded-full bg-[#1C2331] px-3 py-1.5 text-[12px] font-semibold text-white">
                            병동톡
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
}
