import {cn} from '@dutying/utils/style';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    Heart,
    MessageCircle,
    Plus,
    RefreshCcw,
    Search,
    Send,
    X,
} from 'lucide-react';
import {type FormEvent, useEffect, useMemo, useRef, useState} from 'react';
import useAuth from '@/features/auth';
import {BoardAPI} from '@/shared/api';
import {type TCreateWardBoardPostDTO, type TWardBoardComment, type TWardBoardDeadline, type TWardBoardPost} from '@/shared/api/board';
import PageState from '@/shared/ui/PageState';

type TBoardFilter = 'all' | 'deadline' | 'unchecked' | 'notice';

const POST_PAGE_SIZE = 40;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const initialPostDraft: TCreateWardBoardPostDTO = {
    title: '',
    content: '',
    deadlineDate: '',
};
const filterLabels: Record<TBoardFilter, string> = {
    all: '전체',
    deadline: '마감',
    unchecked: '미체크',
    notice: '공지',
};
const boardQueryKeys = {
    all: ['ward-board'] as const,
    postsRoot: (wardId: number) => [...boardQueryKeys.all, 'posts', wardId] as const,
    posts: (wardId: number, keyword: string) => [...boardQueryKeys.postsRoot(wardId), {keyword}] as const,
    post: (wardId: number, postId: number) => [...boardQueryKeys.all, 'post', wardId, postId] as const,
    comments: (wardId: number, postId: number) => [...boardQueryKeys.all, 'comments', wardId, postId] as const,
    checkers: (wardId: number, postId: number) => [...boardQueryKeys.all, 'checkers', wardId, postId] as const,
    deadlinesRoot: (wardId: number) => [...boardQueryKeys.all, 'deadlines', wardId] as const,
    deadlines: (wardId: number, year: number, month: number) => [...boardQueryKeys.deadlinesRoot(wardId), year, month] as const,
};
const getPostId = (post: TWardBoardPost) => BoardAPI.getPostId(post);
const getCommentId = (comment: TWardBoardComment) => comment.commentId ?? comment.id ?? 0;
const getAuthorName = (post: TWardBoardPost) => post.writerName ?? post.authorName ?? '작성자';
const pad2 = (value: number) => value.toString().padStart(2, '0');
const toDateKey = (date: Date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
const parseDateKey = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map(Number);

    return new Date(year, month - 1, day);
};
const addDays = (date: Date, days: number) => {
    const nextDate = new Date(date);

    nextDate.setDate(nextDate.getDate() + days);

    return nextDate;
};
const formatDate = (dateKey: string) => {
    const date = parseDateKey(dateKey);

    if (Number.isNaN(date.getTime())) return dateKey;

    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};
const formatDateTime = (value?: string) => {
    if (!value) return '방금';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '방금';

    return `${date.getMonth() + 1}.${date.getDate()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};
const formatMonthTitle = (year: number, month: number) => `${year}년 ${month}월`;
const makePreview = (content: string) => content.replace(/\s+/g, ' ').trim();
const getMonthBounds = (year: number, month: number) => ({
    startDate: toDateKey(new Date(year, month - 1, 1)),
    endDate: toDateKey(new Date(year, month, 0)),
});
const getCalendarCells = (year: number, month: number) => {
    const firstDate = new Date(year, month - 1, 1);
    const startDate = new Date(firstDate);

    startDate.setDate(firstDate.getDate() - firstDate.getDay());

    return Array.from({length: 42}, (_, index) => {
        const date = new Date(startDate);

        date.setDate(startDate.getDate() + index);

        return {
            date,
            key: toDateKey(date),
            inMonth: date.getMonth() === month - 1,
        };
    });
};
const getDeadlineMeta = (deadlineDate?: string) => {
    if (!deadlineDate) return null;

    const today = parseDateKey(toDateKey(new Date()));
    const deadline = parseDateKey(deadlineDate);
    const diff = Math.round((deadline.getTime() - today.getTime()) / MS_PER_DAY);

    if (diff < 0) return {label: '마감 지남', tone: 'overdue' as const};

    if (diff === 0) return {label: '오늘 마감', tone: 'today' as const};

    if (diff <= 3) return {label: `D-${diff}`, tone: 'soon' as const};

    return {label: formatDate(deadlineDate), tone: 'normal' as const};
};

function Metric({icon: Icon, label}: {icon: typeof Eye; label: string | number}) {
    return (
        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-gray-3">
            <Icon className="size-3.5" strokeWidth={1.9} aria-hidden="true" />
            {label}
        </span>
    );
}

function DeadlineBadge({deadlineDate, checked}: {deadlineDate?: string; checked?: boolean}) {
    const meta = getDeadlineMeta(deadlineDate);

    if (!meta) return null;

    return (
        <span
            className={cn(
                'inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-[12px] font-semibold whitespace-nowrap',
                checked
                    ? 'bg-[#EEF8F1] text-[#217A43]'
                    : meta.tone === 'overdue'
                      ? 'bg-[#FFF1F3] text-[#D8495F]'
                      : meta.tone === 'today'
                        ? 'bg-[#FFF6E7] text-[#B06B00]'
                        : meta.tone === 'soon'
                          ? 'bg-main-light text-main-1'
                          : 'bg-gray-7 text-gray-3',
            )}
        >
            {checked ? '체크 완료' : meta.label}
        </span>
    );
}

function PostListItem({post, selected, onSelect}: {post: TWardBoardPost; selected: boolean; onSelect: () => void}) {
    const deadlineMeta = getDeadlineMeta(post.deadlineDate);
    const preview = makePreview(post.content);
    const hasMeta = Boolean(post.isNotice) || Boolean(post.deadlineDate);

    return (
        <button
            type="button"
            className={cn(
                'flex w-full flex-col items-stretch rounded-[8px] px-4 py-3 text-left transition-colors',
                selected ? 'bg-[#F3F0FF]' : 'bg-white hover:bg-gray-7',
                post.deadlineDate && !post.isCheckedByMe && deadlineMeta?.tone !== 'normal' ? 'ring-1 ring-[#F1D5DA]' : undefined,
            )}
            onClick={onSelect}
        >
            {hasMeta ? (
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    {post.isNotice ? (
                        <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-[#EDF6FF] px-2 text-[11px] font-semibold text-[#2468B2]">
                            공지
                        </span>
                    ) : null}
                    <DeadlineBadge deadlineDate={post.deadlineDate} checked={post.isCheckedByMe} />
                </div>
            ) : null}
            <p className="truncate text-[15px] font-semibold text-sub-1">{post.title}</p>
            <p className="mt-1.5 line-clamp-2 min-h-10 text-[13px] leading-5 text-gray-3">{preview || '내용 없음'}</p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span className="truncate text-[12px] font-medium text-sub-2.5">
                    {getAuthorName(post)} · {formatDateTime(post.createdAt)}
                </span>
                <span className="flex shrink-0 items-center gap-3">
                    <Metric icon={Eye} label={post.viewCount ?? 0} />
                    <Metric icon={Heart} label={post.likeCount ?? 0} />
                    <Metric icon={CheckCircle2} label={post.checkCount ?? 0} />
                    <Metric icon={MessageCircle} label={post.commentCount ?? 0} />
                </span>
            </div>
        </button>
    );
}

function CommentThread({
    comments,
    replyingCommentId,
    replyDraft,
    disabled,
    onStartReply,
    onCancelReply,
    onChangeReply,
    onSubmitReply,
}: {
    comments: TWardBoardComment[];
    replyingCommentId: number | null;
    replyDraft: string;
    disabled: boolean;
    onStartReply: (commentId: number) => void;
    onCancelReply: () => void;
    onChangeReply: (value: string) => void;
    onSubmitReply: (commentId: number) => void;
}) {
    return (
        <div className="space-y-3">
            {comments.map((comment) => {
                const commentId = getCommentId(comment);
                const isReplying = replyingCommentId === commentId;

                return (
                    <div key={`${commentId}-${comment.createdAt ?? comment.content}`} className="rounded-[8px] bg-gray-7 px-3.5 py-3">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[13px] font-semibold text-sub-1">{comment.authorName ?? '작성자'}</span>
                            <span className="text-[11px] font-medium text-gray-4">{formatDateTime(comment.createdAt)}</span>
                        </div>
                        <p className="mt-2 text-[13px] leading-5 whitespace-pre-line text-sub-2">{comment.content}</p>
                        <div className="mt-2 flex justify-end">
                            <button
                                type="button"
                                className="h-7 rounded-[7px] px-2.5 text-[12px] font-semibold text-gray-3 transition-colors hover:bg-white hover:text-sub-1"
                                onClick={() => onStartReply(commentId)}
                            >
                                답글
                            </button>
                        </div>

                        {isReplying ? (
                            <div className="mt-2 flex gap-2">
                                <input
                                    value={replyDraft}
                                    onChange={(event) => onChangeReply(event.target.value)}
                                    placeholder="답글을 입력해 주세요"
                                    className="h-9 min-w-0 flex-1 rounded-[8px] bg-white px-3 text-[13px] text-sub-1 ring-1 ring-transparent transition outline-none focus:ring-main-3"
                                />
                                <button
                                    type="button"
                                    className="h-9 rounded-[8px] bg-sub-1 px-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#3A3A42] disabled:cursor-not-allowed disabled:opacity-40"
                                    disabled={disabled || !replyDraft.trim()}
                                    onClick={() => onSubmitReply(commentId)}
                                >
                                    등록
                                </button>
                                <button
                                    type="button"
                                    className="h-9 w-9 rounded-[8px] text-gray-4 transition-colors hover:bg-white hover:text-sub-1"
                                    onClick={onCancelReply}
                                    aria-label="답글 취소"
                                    title="답글 취소"
                                >
                                    <X className="size-4" aria-hidden="true" />
                                </button>
                            </div>
                        ) : null}

                        {comment.replies?.length ? (
                            <div className="mt-3 border-l border-gray-6 pl-3">
                                <CommentThread
                                    comments={comment.replies}
                                    replyingCommentId={replyingCommentId}
                                    replyDraft={replyDraft}
                                    disabled={disabled}
                                    onStartReply={onStartReply}
                                    onCancelReply={onCancelReply}
                                    onChangeReply={onChangeReply}
                                    onSubmitReply={onSubmitReply}
                                />
                            </div>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}

function DeadlinePicker({value, onChange}: {value?: string; onChange: (deadlineDate: string) => void}) {
    const todayKey = toDateKey(new Date());
    const today = parseDateKey(todayKey);
    const [isOpen, setIsOpen] = useState(false);
    const [viewMonth, setViewMonth] = useState(() => {
        const initialDate = value ? parseDateKey(value) : today;

        return {
            year: initialDate.getFullYear(),
            month: initialDate.getMonth() + 1,
        };
    });
    const pickerRef = useRef<HTMLDivElement>(null);
    const cells = useMemo(() => getCalendarCells(viewMonth.year, viewMonth.month), [viewMonth]);
    const quickChoices = [
        {label: '오늘', date: today},
        {label: '내일', date: addDays(today, 1)},
        {label: '3일 후', date: addDays(today, 3)},
    ];

    useEffect(() => {
        if (!isOpen) return;

        const nextDate = value ? parseDateKey(value) : new Date();

        if (Number.isNaN(nextDate.getTime())) return;

        setViewMonth({
            year: nextDate.getFullYear(),
            month: nextDate.getMonth() + 1,
        });
    }, [isOpen, value]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const handlePointerDown = (event: MouseEvent) => {
            if (!pickerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const moveViewMonth = (delta: number) => {
        setViewMonth((current) => {
            const nextDate = new Date(current.year, current.month - 1 + delta, 1);

            return {
                year: nextDate.getFullYear(),
                month: nextDate.getMonth() + 1,
            };
        });
    };
    const selectDate = (dateKey: string) => {
        onChange(dateKey);
        setIsOpen(false);
    };
    const clearDate = () => {
        onChange('');
        setIsOpen(false);
    };

    return (
        <div ref={pickerRef} className="relative grid max-w-[300px] gap-1.5">
            <span className="text-[13px] font-semibold text-sub-2">마감일</span>
            <button
                type="button"
                className={cn(
                    'flex h-12 w-full items-center justify-between gap-3 rounded-[10px] px-3.5 text-left ring-1 transition',
                    isOpen
                        ? 'bg-white shadow-[0_8px_24px_rgba(49,130,246,0.12)] ring-[#CFE0FF]'
                        : 'bg-gray-7 ring-transparent hover:bg-white',
                )}
                onClick={() => setIsOpen((current) => !current)}
                aria-expanded={isOpen}
            >
                <span className="flex min-w-0 items-center gap-2.5">
                    <span
                        className={cn(
                            'grid h-7 w-7 shrink-0 place-items-center rounded-full',
                            value ? 'bg-[#EEF6FF] text-[#3182F6]' : 'bg-white text-gray-4',
                        )}
                    >
                        <CalendarDays className="size-4" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 truncate text-[14px] font-semibold text-sub-1">
                        {value ? `${formatDate(value)} 마감` : '선택 안 함'}
                    </span>
                </span>
                <ChevronRight
                    className={cn('size-4 shrink-0 text-gray-4 transition-transform', isOpen ? 'rotate-90 text-[#3182F6]' : undefined)}
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            </button>

            {isOpen ? (
                <div className="absolute bottom-full left-0 z-50 mb-2 w-[320px] max-w-[calc(100vw-48px)] rounded-[16px] bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.16)] ring-1 ring-gray-6">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[13px] font-semibold text-gray-3">마감일 선택</p>
                            <p className="mt-1 text-[18px] font-semibold text-sub-1">{value ? formatDate(value) : '선택 안 함'}</p>
                        </div>
                        <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                            onClick={() => setIsOpen(false)}
                            aria-label="마감일 선택 닫기"
                            title="마감일 선택 닫기"
                        >
                            <X className="size-4" strokeWidth={1.8} aria-hidden="true" />
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-2">
                        {quickChoices.map((choice) => {
                            const choiceKey = toDateKey(choice.date);
                            const isSelected = value === choiceKey;

                            return (
                                <button
                                    key={choice.label}
                                    type="button"
                                    className={cn(
                                        'h-9 rounded-[9px] text-[13px] font-semibold transition-colors',
                                        isSelected
                                            ? 'bg-[#3182F6] text-white'
                                            : 'bg-gray-7 text-sub-2 hover:bg-[#EEF6FF] hover:text-[#3182F6]',
                                    )}
                                    onClick={() => selectDate(choiceKey)}
                                >
                                    {choice.label}
                                </button>
                            );
                        })}
                        <button
                            type="button"
                            className={cn(
                                'h-9 rounded-[9px] text-[13px] font-semibold transition-colors',
                                value ? 'bg-gray-7 text-sub-2 hover:bg-gray-6' : 'bg-[#F1F5F9] text-gray-3',
                            )}
                            onClick={clearDate}
                        >
                            없음
                        </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                            onClick={() => moveViewMonth(-1)}
                            aria-label="이전 달"
                            title="이전 달"
                        >
                            <ChevronLeft className="size-4" strokeWidth={1.8} aria-hidden="true" />
                        </button>
                        <span className="text-[15px] font-semibold text-sub-1">{formatMonthTitle(viewMonth.year, viewMonth.month)}</span>
                        <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                            onClick={() => moveViewMonth(1)}
                            aria-label="다음 달"
                            title="다음 달"
                        >
                            <ChevronRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
                        </button>
                    </div>

                    <div className="mt-3 grid grid-cols-7 text-center text-[11px] font-semibold text-gray-4">
                        {['일', '월', '화', '수', '목', '금', '토'].map((dayLabel) => (
                            <span key={dayLabel} className="h-7 leading-7">
                                {dayLabel}
                            </span>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((cell) => {
                            const isSelected = value === cell.key;
                            const isToday = cell.key === todayKey;

                            return (
                                <button
                                    key={cell.key}
                                    type="button"
                                    className={cn(
                                        'grid h-9 place-items-center rounded-full text-[13px] font-semibold transition-colors',
                                        cell.inMonth ? 'text-sub-2' : 'text-gray-5',
                                        isSelected
                                            ? 'bg-[#3182F6] text-white shadow-[0_6px_14px_rgba(49,130,246,0.24)]'
                                            : 'hover:bg-gray-7 hover:text-sub-1',
                                        isToday && !isSelected ? 'text-[#3182F6] ring-1 ring-[#BFD7FF]' : undefined,
                                    )}
                                    onClick={() => selectDate(cell.key)}
                                    aria-label={`${formatDate(cell.key)} 선택`}
                                >
                                    {cell.date.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function DeadlineCalendar({
    year,
    month,
    deadlines,
    onMoveMonth,
    onSelectPost,
}: {
    year: number;
    month: number;
    deadlines: TWardBoardDeadline[];
    onMoveMonth: (delta: number) => void;
    onSelectPost: (postId: number) => void;
}) {
    const cells = useMemo(() => getCalendarCells(year, month), [month, year]);
    const deadlinesByDate = useMemo(
        () =>
            deadlines.reduce<Map<string, TWardBoardDeadline[]>>((map, deadline) => {
                const current = map.get(deadline.deadlineDate) ?? [];

                map.set(deadline.deadlineDate, [...current, deadline]);

                return map;
            }, new Map()),
        [deadlines],
    );

    return (
        <aside className="min-w-0 rounded-[8px] bg-white p-4">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <p className="text-[13px] font-semibold text-gray-3">병동 캘린더</p>
                    <h2 className="mt-1 text-[20px] font-semibold text-sub-1">{formatMonthTitle(year, month)}</h2>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                        onClick={() => onMoveMonth(-1)}
                        aria-label="이전 달"
                        title="이전 달"
                    >
                        <ChevronLeft className="size-4" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                        onClick={() => onMoveMonth(1)}
                        aria-label="다음 달"
                        title="다음 달"
                    >
                        <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-gray-4">
                {['일', '월', '화', '수', '목', '금', '토'].map((dayLabel) => (
                    <span key={dayLabel} className="h-6 leading-6">
                        {dayLabel}
                    </span>
                ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
                {cells.map((cell) => {
                    const dayDeadlines = deadlinesByDate.get(cell.key) ?? [];
                    const hasDeadline = dayDeadlines.length > 0;

                    return (
                        <button
                            key={cell.key}
                            type="button"
                            className={cn(
                                'relative aspect-square rounded-[8px] text-[12px] font-semibold transition-colors',
                                cell.inMonth ? 'text-sub-2' : 'text-gray-5',
                                hasDeadline ? 'bg-main-light text-main-1 hover:bg-main-4' : 'hover:bg-gray-7',
                            )}
                            disabled={!hasDeadline}
                            onClick={() => onSelectPost(dayDeadlines[0].postId)}
                            aria-label={`${formatDate(cell.key)} 마감 ${dayDeadlines.length}건`}
                        >
                            {cell.date.getDate()}
                            {hasDeadline ? (
                                <span className="absolute right-1.5 bottom-1.5 h-1.5 w-1.5 rounded-full bg-main-1" aria-hidden="true" />
                            ) : null}
                        </button>
                    );
                })}
            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-semibold text-sub-1">이번 달 마감</h3>
                    <span className="text-[12px] font-semibold text-gray-4">{deadlines.length}건</span>
                </div>
                <div className="mt-3 space-y-2">
                    {deadlines.length === 0 ? (
                        <p className="rounded-[8px] bg-gray-7 px-3 py-3 text-[13px] text-gray-3">마감 글을 등록하면 여기에 보여요.</p>
                    ) : (
                        deadlines.slice(0, 5).map((deadline) => (
                            <button
                                key={`${deadline.postId}-${deadline.deadlineDate}`}
                                type="button"
                                className="flex w-full items-center gap-3 rounded-[8px] bg-gray-7 px-3 py-2.5 text-left transition-colors hover:bg-main-light"
                                onClick={() => onSelectPost(deadline.postId)}
                            >
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-white text-[12px] font-bold text-main-1">
                                    {formatDate(deadline.deadlineDate).replace('월 ', '.').replace('일', '')}
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-[13px] font-semibold text-sub-1">{deadline.postTitle}</span>
                                    <span className="mt-0.5 block truncate text-[11px] font-medium text-gray-3">
                                        {deadline.writerName ?? '작성자'}
                                    </span>
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
}

function BoardPage() {
    const {
        state: {wardId, accountMeStatus, _loaded, isAuth},
        actions: {handleGetAccountMe},
    } = useAuth();
    const queryClient = useQueryClient();
    const today = new Date();
    const [keywordInput, setKeywordInput] = useState('');
    const [keyword, setKeyword] = useState('');
    const [filter, setFilter] = useState<TBoardFilter>('all');
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [postDraft, setPostDraft] = useState<TCreateWardBoardPostDTO>(initialPostDraft);
    const [commentDraft, setCommentDraft] = useState('');
    const [replyDraft, setReplyDraft] = useState('');
    const [replyingCommentId, setReplyingCommentId] = useState<number | null>(null);
    const [calendarMonth, setCalendarMonth] = useState({year: today.getFullYear(), month: today.getMonth() + 1});
    const {startDate, endDate} = useMemo(() => getMonthBounds(calendarMonth.year, calendarMonth.month), [calendarMonth]);
    const bootstrapPending = !_loaded || (isAuth && wardId === null && (accountMeStatus === 'idle' || accountMeStatus === 'loading'));
    const bootstrapError = isAuth && wardId === null && accountMeStatus === 'error';
    const postsQuery = useQuery({
        queryKey: wardId ? boardQueryKeys.posts(wardId, keyword) : boardQueryKeys.posts(0, keyword),
        queryFn: () => BoardAPI.getPosts(wardId!, {size: POST_PAGE_SIZE, keyword}),
        enabled: Boolean(wardId),
    });
    const selectedPostQuery = useQuery({
        queryKey: wardId && selectedPostId ? boardQueryKeys.post(wardId, selectedPostId) : boardQueryKeys.post(0, 0),
        queryFn: () => BoardAPI.getPost(wardId!, selectedPostId!),
        enabled: Boolean(wardId && selectedPostId),
    });
    const commentsQuery = useQuery({
        queryKey: wardId && selectedPostId ? boardQueryKeys.comments(wardId, selectedPostId) : boardQueryKeys.comments(0, 0),
        queryFn: () => BoardAPI.getComments(wardId!, selectedPostId!, {size: 50}),
        enabled: Boolean(wardId && selectedPostId),
    });
    const checkersQuery = useQuery({
        queryKey: wardId && selectedPostId ? boardQueryKeys.checkers(wardId, selectedPostId) : boardQueryKeys.checkers(0, 0),
        queryFn: () => BoardAPI.getCheckers(wardId!, selectedPostId!),
        enabled: Boolean(wardId && selectedPostId),
    });
    const deadlinesQuery = useQuery({
        queryKey: wardId ? boardQueryKeys.deadlines(wardId, calendarMonth.year, calendarMonth.month) : boardQueryKeys.deadlines(0, 0, 0),
        queryFn: () => BoardAPI.getDeadlines(wardId!, startDate, endDate),
        enabled: Boolean(wardId),
    });
    const posts = postsQuery.data?.posts ?? [];
    const selectedPost = selectedPostQuery.data ?? posts.find((post) => getPostId(post) === selectedPostId) ?? null;
    const comments = commentsQuery.data?.comments ?? [];
    const checkers = checkersQuery.data?.checkers ?? [];
    const filteredPosts = useMemo(
        () =>
            posts.filter((post) => {
                if (filter === 'deadline') return Boolean(post.deadlineDate);

                if (filter === 'unchecked') return Boolean(post.deadlineDate && !post.isCheckedByMe);

                if (filter === 'notice') return Boolean(post.isNotice);

                return true;
            }),
        [filter, posts],
    );
    const filterCounts = useMemo(
        () => ({
            all: posts.length,
            deadline: posts.filter((post) => Boolean(post.deadlineDate)).length,
            unchecked: posts.filter((post) => Boolean(post.deadlineDate && !post.isCheckedByMe)).length,
            notice: posts.filter((post) => Boolean(post.isNotice)).length,
        }),
        [posts],
    );
    const invalidateSelectedPost = async (postId: number) => {
        if (!wardId) return;

        await Promise.all([
            queryClient.invalidateQueries({queryKey: boardQueryKeys.postsRoot(wardId)}),
            queryClient.invalidateQueries({queryKey: boardQueryKeys.post(wardId, postId)}),
            queryClient.invalidateQueries({queryKey: boardQueryKeys.checkers(wardId, postId)}),
        ]);
    };
    const createPostMutation = useMutation({
        mutationFn: (draft: TCreateWardBoardPostDTO) => BoardAPI.createPost(wardId!, draft),
        onSuccess: async (post) => {
            if (!wardId) return;

            const postId = getPostId(post);

            setPostDraft(initialPostDraft);
            setIsComposerOpen(false);
            setSelectedPostId(postId || null);
            await Promise.all([
                queryClient.invalidateQueries({queryKey: boardQueryKeys.postsRoot(wardId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.deadlinesRoot(wardId)}),
            ]);
        },
    });
    const likeMutation = useMutation({
        mutationFn: (post: TWardBoardPost) => {
            const postId = getPostId(post);

            return post.isLikedByMe ? BoardAPI.unlikePost(wardId!, postId) : BoardAPI.likePost(wardId!, postId);
        },
        onSuccess: async (_data, post) => {
            await invalidateSelectedPost(getPostId(post));
        },
    });
    const checkMutation = useMutation({
        mutationFn: (post: TWardBoardPost) => {
            const postId = getPostId(post);

            return post.isCheckedByMe ? BoardAPI.uncheckPost(wardId!, postId) : BoardAPI.checkPost(wardId!, postId);
        },
        onSuccess: async (_data, post) => {
            await invalidateSelectedPost(getPostId(post));
        },
    });
    const createCommentMutation = useMutation({
        mutationFn: (content: string) => BoardAPI.createComment(wardId!, selectedPostId!, {content}),
        onSuccess: async () => {
            if (!wardId || !selectedPostId) return;

            setCommentDraft('');
            await Promise.all([
                queryClient.invalidateQueries({queryKey: boardQueryKeys.comments(wardId, selectedPostId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.post(wardId, selectedPostId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.postsRoot(wardId)}),
            ]);
        },
    });
    const createReplyMutation = useMutation({
        mutationFn: ({commentId, content}: {commentId: number; content: string}) => BoardAPI.createReply(wardId!, commentId, {content}),
        onSuccess: async () => {
            if (!wardId || !selectedPostId) return;

            setReplyDraft('');
            setReplyingCommentId(null);
            await Promise.all([
                queryClient.invalidateQueries({queryKey: boardQueryKeys.comments(wardId, selectedPostId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.post(wardId, selectedPostId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.postsRoot(wardId)}),
            ]);
        },
    });
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setKeyword(keywordInput.trim());
    };
    const clearSearch = () => {
        setKeyword('');
        setKeywordInput('');
    };
    const handleCreatePost = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const title = postDraft.title.trim();
        const content = postDraft.content.trim();

        if (!title || !content) return;

        createPostMutation.mutate({
            title,
            content,
            deadlineDate: postDraft.deadlineDate?.length ? postDraft.deadlineDate : undefined,
        });
    };
    const handleCreateComment = () => {
        const content = commentDraft.trim();

        if (!content || !selectedPostId) return;

        createCommentMutation.mutate(content);
    };
    const handleCreateReply = (commentId: number) => {
        const content = replyDraft.trim();

        if (!content) return;

        createReplyMutation.mutate({commentId, content});
    };
    const moveCalendarMonth = (delta: number) => {
        setCalendarMonth((current) => {
            const next = new Date(current.year, current.month - 1 + delta, 1);

            return {
                year: next.getFullYear(),
                month: next.getMonth() + 1,
            };
        });
    };
    const retry = () => {
        if (wardId) {
            void postsQuery.refetch();
            void deadlinesQuery.refetch();

            return;
        }

        void handleGetAccountMe().catch(() => undefined);
    };
    const canSubmitPost = postDraft.title.trim().length > 0 && postDraft.content.trim().length > 0;
    const canSubmitComment = commentDraft.trim().length > 0 && Boolean(selectedPostId);
    const isCommentBusy = createCommentMutation.isPending || createReplyMutation.isPending;

    if (bootstrapPending) {
        return (
            <div className="flex h-full w-full items-center justify-center px-8">
                <PageState tone="loading" title="게시판을 준비하고 있어요" description="병동 정보를 확인하는 중이에요." className="py-0" />
            </div>
        );
    }

    if (bootstrapError) {
        return (
            <div className="flex h-full w-full items-center justify-center px-8">
                <PageState
                    tone="error"
                    title="병동 정보를 불러오지 못했어요"
                    description="잠시 후 다시 시도해 주세요."
                    action={{label: '다시 시도', onClick: retry}}
                    className="py-0"
                />
            </div>
        );
    }

    if (!wardId) {
        return (
            <div className="flex h-full w-full items-center justify-center px-8">
                <PageState
                    tone="empty"
                    title="병동에 연결하면 게시판을 쓸 수 있어요"
                    description="병동 연결 후 게시판을 사용할 수 있어요."
                    className="py-0"
                />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#FAF8FB] px-5 py-5 font-apple lg:px-10 lg:py-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-[13px] font-semibold text-gray-3">병동 소통</p>
                    <h1 className="mt-1 text-[32px] font-semibold text-sub-1">게시판</h1>
                    <p className="mt-2 text-[14px] leading-6 text-gray-3">공지, 요청, 마감 체크를 한곳에서 관리해요.</p>
                </div>
                <button
                    type="button"
                    className="h-10 rounded-[8px] bg-sub-1 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-[#3A3A42]"
                    onClick={() => {
                        setIsComposerOpen(true);
                        setSelectedPostId(null);
                    }}
                >
                    <Plus className="mr-1.5 size-4" aria-hidden="true" />
                    글쓰기
                </button>
            </div>

            <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-full rounded-[12px] bg-[#3D4658] p-0.5">
                    <div className="scrollbar-hide flex max-w-full gap-1 overflow-x-auto whitespace-nowrap">
                        {(Object.keys(filterLabels) as TBoardFilter[]).map((filterKey) => (
                            <button
                                key={filterKey}
                                type="button"
                                className={cn(
                                    'h-8 min-w-[76px] rounded-[9px] px-3 text-[12px] font-semibold transition-colors',
                                    filter === filterKey ? 'bg-white text-sub-1' : 'text-[#B8C0CF] hover:text-white',
                                )}
                                onClick={() => setFilter(filterKey)}
                            >
                                {filterLabels[filterKey]}
                                <span className="ml-1 font-poppins text-[11px] opacity-70">{filterCounts[filterKey]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSearch} className="flex min-w-0 items-center gap-2">
                    <div className="flex h-10 min-w-[220px] flex-1 items-center rounded-[8px] bg-white px-3 ring-1 ring-transparent transition focus-within:ring-main-3 lg:w-[320px]">
                        <Search className="size-4 shrink-0 text-gray-4" aria-hidden="true" />
                        <input
                            value={keywordInput}
                            onChange={(event) => setKeywordInput(event.target.value)}
                            placeholder="제목, 내용 검색"
                            className="min-w-0 flex-1 bg-transparent px-2 text-[14px] text-sub-1 outline-none placeholder:text-gray-4"
                        />
                        {keyword ? (
                            <button
                                type="button"
                                className="grid h-6 w-6 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                                onClick={clearSearch}
                                aria-label="검색어 지우기"
                                title="검색어 지우기"
                            >
                                <X className="size-3.5" aria-hidden="true" />
                            </button>
                        ) : null}
                    </div>
                    <button
                        type="submit"
                        className="h-10 rounded-[8px] bg-white px-3 text-[13px] font-semibold text-sub-2 transition-colors hover:bg-gray-7"
                    >
                        검색
                    </button>
                </form>
            </div>

            <div className="mt-5 grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(320px,0.9fr)_minmax(420px,1.25fr)_320px]">
                <section className="flex min-h-[520px] min-w-0 flex-col rounded-[8px] bg-white/70 p-3">
                    <div className="mb-2 flex items-center justify-between px-1">
                        <h2 className="text-[15px] font-semibold text-sub-1">게시글</h2>
                        <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-[8px] text-gray-4 transition-colors hover:bg-white hover:text-sub-1"
                            onClick={() => void postsQuery.refetch()}
                            aria-label="게시글 새로고침"
                            title="게시글 새로고침"
                        >
                            <RefreshCcw className={cn('size-4', postsQuery.isFetching ? 'animate-spin' : undefined)} aria-hidden="true" />
                        </button>
                    </div>
                    {postsQuery.isPending ? (
                        <PageState tone="loading" title="게시글을 불러오고 있어요" className="py-0" />
                    ) : postsQuery.isError ? (
                        <PageState
                            tone="error"
                            title="게시글을 불러오지 못했어요"
                            description="잠시 후 다시 시도해 주세요."
                            action={{label: '다시 시도', onClick: () => void postsQuery.refetch()}}
                            className="py-0"
                        />
                    ) : filteredPosts.length === 0 ? (
                        <PageState
                            tone="empty"
                            title="게시글을 등록하면 여기에 보여요"
                            description="조건을 바꾸거나 새 글을 등록해 보세요."
                            className="py-0"
                        />
                    ) : (
                        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                            {filteredPosts.map((post) => {
                                const postId = getPostId(post);

                                return (
                                    <PostListItem
                                        key={postId}
                                        post={post}
                                        selected={selectedPostId === postId}
                                        onSelect={() => {
                                            setIsComposerOpen(false);
                                            setSelectedPostId(postId);
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="min-h-[520px] min-w-0 rounded-[8px] bg-white p-5">
                    {isComposerOpen ? (
                        <form className="flex h-full min-h-0 flex-col" onSubmit={handleCreatePost}>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[13px] font-semibold text-gray-3">새 게시글</p>
                                    <h2 className="mt-1 text-[24px] font-semibold text-sub-1">병동에 공유하기</h2>
                                </div>
                                <button
                                    type="button"
                                    className="grid h-9 w-9 place-items-center rounded-[8px] text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                                    onClick={() => setIsComposerOpen(false)}
                                    aria-label="글쓰기 닫기"
                                    title="글쓰기 닫기"
                                >
                                    <X className="size-4" aria-hidden="true" />
                                </button>
                            </div>

                            <div className="mt-5 grid gap-4">
                                <label className="grid gap-1.5">
                                    <span className="text-[13px] font-semibold text-sub-2">제목</span>
                                    <input
                                        value={postDraft.title}
                                        onChange={(event) => setPostDraft((current) => ({...current, title: event.target.value}))}
                                        maxLength={100}
                                        className="h-11 rounded-[8px] bg-gray-7 px-3.5 text-[15px] text-sub-1 ring-1 ring-transparent transition outline-none focus:bg-white focus:ring-main-3"
                                        placeholder="예: 6월 감염관리 교육 확인"
                                    />
                                </label>
                                <label className="grid gap-1.5">
                                    <span className="text-[13px] font-semibold text-sub-2">내용</span>
                                    <textarea
                                        value={postDraft.content}
                                        onChange={(event) => setPostDraft((current) => ({...current, content: event.target.value}))}
                                        maxLength={5000}
                                        className="min-h-[220px] resize-none rounded-[8px] bg-gray-7 px-3.5 py-3 text-[15px] leading-6 text-sub-1 ring-1 ring-transparent transition outline-none focus:bg-white focus:ring-main-3"
                                        placeholder="공유할 내용을 입력해 주세요"
                                    />
                                </label>
                                <DeadlinePicker
                                    value={postDraft.deadlineDate}
                                    onChange={(deadlineDate) => setPostDraft((current) => ({...current, deadlineDate}))}
                                />
                            </div>

                            <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                                <div className="flex items-center gap-2 text-[13px] font-medium text-gray-3">
                                    <CalendarDays className="size-4 text-main-1" aria-hidden="true" />
                                    {postDraft.deadlineDate ? `${formatDate(postDraft.deadlineDate)} 마감` : '마감일 없음'}
                                </div>
                                <button
                                    type="submit"
                                    className="h-10 rounded-[8px] bg-main-1 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-main-2 disabled:cursor-not-allowed disabled:opacity-40"
                                    disabled={!canSubmitPost || createPostMutation.isPending}
                                >
                                    등록
                                </button>
                            </div>
                        </form>
                    ) : selectedPost ? (
                        <div className="flex h-full min-h-0 flex-col">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {selectedPost.isNotice ? (
                                            <span className="inline-flex h-6 items-center rounded-full bg-[#EDF6FF] px-2.5 text-[12px] font-semibold text-[#2468B2]">
                                                공지
                                            </span>
                                        ) : null}
                                        <DeadlineBadge deadlineDate={selectedPost.deadlineDate} checked={selectedPost.isCheckedByMe} />
                                    </div>
                                    <h2 className="mt-3 text-[26px] leading-8 font-semibold text-sub-1">{selectedPost.title}</h2>
                                    <p className="mt-2 text-[13px] font-medium text-gray-3">
                                        {getAuthorName(selectedPost)} · {formatDateTime(selectedPost.createdAt)}
                                    </p>
                                </div>
                                {selectedPostQuery.isFetching ? (
                                    <span className="inline-flex h-7 items-center rounded-full bg-gray-7 px-2.5 text-[12px] font-semibold text-gray-3">
                                        업데이트 중
                                    </span>
                                ) : null}
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className={cn(
                                        'h-9 rounded-[8px] px-3 text-[13px] font-semibold transition-colors',
                                        selectedPost.isLikedByMe
                                            ? 'bg-[#FFF1F5] text-red'
                                            : 'bg-gray-7 text-sub-2 hover:bg-[#FFF1F5] hover:text-red',
                                    )}
                                    onClick={() => likeMutation.mutate(selectedPost)}
                                    disabled={likeMutation.isPending}
                                >
                                    <Heart
                                        className="mr-1.5 size-4"
                                        fill={selectedPost.isLikedByMe ? 'currentColor' : 'none'}
                                        aria-hidden="true"
                                    />
                                    {selectedPost.likeCount ?? 0}
                                </button>
                                <button
                                    type="button"
                                    className={cn(
                                        'h-9 rounded-[8px] px-3 text-[13px] font-semibold transition-colors',
                                        selectedPost.isCheckedByMe
                                            ? 'bg-[#EEF8F1] text-[#217A43]'
                                            : 'bg-main-light text-main-1 hover:bg-main-4',
                                    )}
                                    onClick={() => checkMutation.mutate(selectedPost)}
                                    disabled={checkMutation.isPending}
                                >
                                    <CheckCircle2 className="mr-1.5 size-4" aria-hidden="true" />
                                    {selectedPost.isCheckedByMe ? '체크 완료' : '완료 체크'}
                                </button>
                                <span className="inline-flex h-9 items-center rounded-[8px] bg-gray-7 px-3 text-[13px] font-semibold text-gray-3">
                                    <Eye className="mr-1.5 size-4" aria-hidden="true" />
                                    조회 {selectedPost.viewCount ?? 0}
                                </span>
                            </div>

                            <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
                                <article className="text-[15px] leading-7 whitespace-pre-line text-sub-2">{selectedPost.content}</article>

                                {selectedPost.imageUrls?.length ? (
                                    <div className="mt-5 grid grid-cols-2 gap-2">
                                        {selectedPost.imageUrls.map((imageUrl) => (
                                            <img
                                                key={imageUrl}
                                                src={imageUrl}
                                                alt=""
                                                className="aspect-video w-full rounded-[8px] object-cover"
                                                loading="lazy"
                                            />
                                        ))}
                                    </div>
                                ) : null}

                                <div className="mt-6 rounded-[8px] bg-gray-7 px-4 py-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-[#217A43]" aria-hidden="true" />
                                            <span className="text-[14px] font-semibold text-sub-1">
                                                체크 {selectedPost.checkCount ?? 0}명
                                            </span>
                                        </div>
                                        {selectedPost.deadlineDate ? (
                                            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-gray-3">
                                                <Clock3 className="size-3.5" aria-hidden="true" />
                                                {formatDate(selectedPost.deadlineDate)}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {checkers.length === 0 ? (
                                            <span className="text-[13px] text-gray-3">체크한 사람이 생기면 여기에 보여요.</span>
                                        ) : (
                                            checkers.slice(0, 12).map((checker) => (
                                                <span
                                                    key={`${checker.accountId ?? checker.name}-${checker.name}`}
                                                    className="inline-flex h-7 items-center rounded-full bg-white px-2.5 text-[12px] font-semibold text-sub-2"
                                                >
                                                    {checker.name}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[16px] font-semibold text-sub-1">댓글 {selectedPost.commentCount ?? 0}</h3>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <input
                                            value={commentDraft}
                                            onChange={(event) => setCommentDraft(event.target.value)}
                                            placeholder="댓글을 입력해 주세요"
                                            className="h-10 min-w-0 flex-1 rounded-[8px] bg-gray-7 px-3 text-[14px] text-sub-1 ring-1 ring-transparent transition outline-none focus:bg-white focus:ring-main-3"
                                        />
                                        <button
                                            type="button"
                                            className="h-10 rounded-[8px] bg-sub-1 px-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#3A3A42] disabled:cursor-not-allowed disabled:opacity-40"
                                            disabled={!canSubmitComment || createCommentMutation.isPending}
                                            onClick={handleCreateComment}
                                        >
                                            <Send className="mr-1.5 size-4" aria-hidden="true" />
                                            등록
                                        </button>
                                    </div>

                                    <div className="mt-4">
                                        {commentsQuery.isPending ? (
                                            <PageState tone="loading" title="댓글을 불러오고 있어요" className="py-0" />
                                        ) : comments.length === 0 ? (
                                            <p className="rounded-[8px] bg-gray-7 px-3 py-4 text-center text-[13px] text-gray-3">
                                                첫 댓글을 남겨보세요.
                                            </p>
                                        ) : (
                                            <CommentThread
                                                comments={comments}
                                                replyingCommentId={replyingCommentId}
                                                replyDraft={replyDraft}
                                                disabled={isCommentBusy}
                                                onStartReply={(commentId) => {
                                                    setReplyingCommentId(commentId);
                                                    setReplyDraft('');
                                                }}
                                                onCancelReply={() => {
                                                    setReplyingCommentId(null);
                                                    setReplyDraft('');
                                                }}
                                                onChangeReply={setReplyDraft}
                                                onSubmitReply={handleCreateReply}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[480px] items-center justify-center">
                            <PageState
                                tone="empty"
                                title="게시글을 선택해 주세요"
                                description="목록에서 글을 열면 체크 현황과 댓글을 볼 수 있어요."
                                className="py-0"
                            />
                        </div>
                    )}
                </section>

                <DeadlineCalendar
                    year={calendarMonth.year}
                    month={calendarMonth.month}
                    deadlines={deadlinesQuery.data ?? []}
                    onMoveMonth={moveCalendarMonth}
                    onSelectPost={(postId) => {
                        setIsComposerOpen(false);
                        setSelectedPostId(postId);
                    }}
                />
            </div>
        </div>
    );
}

export default BoardPage;
