import {cn} from '@dutying/utils/style';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
    CalendarDays,
    CalendarPlus,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    Heart,
    ImagePlus,
    MessageCircle,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import {type FormEvent, type KeyboardEvent, type ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {useSearchParams} from 'react-router';
import useAuth from '@/features/auth';
import i18n from '@/i18n';
import {BoardAPI} from '@/shared/api';
import {
    type TCreateWardBoardPostDTO,
    type TCreateWardBoardScheduleDTO,
    type TWardBoardComment,
    type TWardBoardDeadline,
    type TWardBoardPost,
    type TWardBoardSchedule,
    type TUpdateWardBoardScheduleDTO,
} from '@/shared/api/board';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import PageState from '@/shared/ui/PageState';
import {Skeleton} from '@/shared/ui/primitives/skeleton';
import {BoardTutorial, type TBoardTutorialMode} from './ui/board-tutorial';

const POST_PAGE_SIZE = 40;
const POST_LIST_TITLE_MAX_LENGTH = 24;
const POST_LIST_CONTENT_MAX_LENGTH = 72;
const POST_CONTENT_MAX_LENGTH = 5000;
const SCHEDULE_TITLE_MAX_LENGTH = 60;
const SCHEDULE_CONTENT_MAX_LENGTH = 300;
const DEADLINE_DDAY_VISIBLE_DAYS = 3;
const POST_IMAGE_MAX_COUNT = 5;
const POST_IMAGE_MAX_SIZE_MB = 5;
const POST_IMAGE_MAX_SIZE_BYTES = POST_IMAGE_MAX_SIZE_MB * 1024 * 1024;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const BOARD_I18N_PREFIX = 'page.board.';
const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
const initialPostDraft: TCreateWardBoardPostDTO = {
    title: '',
    content: '',
    deadlineDate: '',
};

type TPostImageAttachment = {
    id: string;
    name: string;
    size: number;
    url: string;
};

type TScheduleDraft = {
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    allDay: boolean;
    startTime: string;
    endTime: string;
};

type TScheduleModalMode = 'create' | 'edit' | 'view';
type TScheduleDatePickerId = 'start' | 'end';

type TCalendarEvent =
    | {
          kind: 'schedule';
          key: string;
          date: string;
          title: string;
          meta: string;
          schedule: TWardBoardSchedule;
      }
    | {
          kind: 'deadline';
          key: string;
          date: string;
          title: string;
          meta: string;
          deadline: TWardBoardDeadline;
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
    schedulesRoot: (wardId: number) => [...boardQueryKeys.all, 'schedules', wardId] as const,
    schedules: (wardId: number, year: number, month: number) => [...boardQueryKeys.schedulesRoot(wardId), year, month] as const,
};
const boardT = (key: string, options?: Record<string, string | number | boolean | null | undefined>) =>
    i18n.t(`${BOARD_I18N_PREFIX}${key}`, options);
const getPostId = (post: TWardBoardPost) => BoardAPI.getPostId(post);
const getScheduleId = (schedule: TWardBoardSchedule) => BoardAPI.getScheduleId(schedule);
const getCommentId = (comment: TWardBoardComment) => comment.commentId ?? comment.id ?? 0;
const getAuthorName = (post: TWardBoardPost) => post.writerName ?? post.authorName ?? boardT('common.author');
const readBooleanLike = (value: unknown) => {
    if (typeof value === 'boolean') return value;

    if (typeof value === 'number') return value === 1;

    if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase();

        if (normalizedValue === 'true' || normalizedValue === '1') return true;

        if (normalizedValue === 'false' || normalizedValue === '0') return false;
    }

    return undefined;
};
const getScheduleWriterName = (schedule: TWardBoardSchedule) =>
    schedule.writerName ?? schedule.writer_name ?? schedule.authorName ?? schedule.author_name ?? boardT('common.author');
const getScheduleSourceType = (schedule: TWardBoardSchedule) => schedule.sourceType ?? schedule.source_type;
const isBoardDeadlineSchedule = (schedule: TWardBoardSchedule) => getScheduleSourceType(schedule) === 'BOARD_DEADLINE';
const isManualSchedule = (schedule: TWardBoardSchedule) => !getScheduleSourceType(schedule) || getScheduleSourceType(schedule) === 'MANUAL';
const canEditSchedule = (schedule: TWardBoardSchedule) =>
    isManualSchedule(schedule) && (readBooleanLike(schedule.editableByMe ?? schedule.editable_by_me) ?? schedule.isMine ?? false);
const canDeleteSchedule = (schedule: TWardBoardSchedule) =>
    isManualSchedule(schedule) && (readBooleanLike(schedule.deletableByMe ?? schedule.deletable_by_me) ?? schedule.isMine ?? false);
const getDeadlineEventKey = (deadline: Pick<TWardBoardDeadline, 'postId' | 'deadlineDate'>) =>
    `deadline-${deadline.postId}-${deadline.deadlineDate}`;
const getDeadlineFromSchedule = (schedule: TWardBoardSchedule): TWardBoardDeadline | null => {
    const sourcePostId = schedule.sourcePostId ?? schedule.source_post_id ?? 0;

    if (!sourcePostId) return null;

    return {
        postId: sourcePostId,
        postTitle: schedule.title,
        deadlineDate: schedule.scheduleDate ?? schedule.schedule_date ?? getScheduleStartDate(schedule),
        writerName: schedule.writerName ?? schedule.authorName,
    };
};
const pad2 = (value: number) => value.toString().padStart(2, '0');
const toDateKey = (date: Date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
const parseDateKey = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map(Number);

    return new Date(year, month - 1, day);
};
const isDateKeyInMonth = (dateKey: string, year: number, month: number) => {
    const date = parseDateKey(dateKey);

    return !Number.isNaN(date.getTime()) && date.getFullYear() === year && date.getMonth() + 1 === month;
};
const compareDateKey = (a: string, b: string) => a.localeCompare(b);
const addDays = (date: Date, days: number) => {
    const nextDate = new Date(date);

    nextDate.setDate(nextDate.getDate() + days);

    return nextDate;
};
const formatDate = (dateKey: string) => {
    const date = parseDateKey(dateKey);

    if (Number.isNaN(date.getTime())) return dateKey;

    return boardT('date.monthDay', {month: date.getMonth() + 1, day: date.getDate()});
};
const formatCompactDate = (dateKey: string) => {
    const date = parseDateKey(dateKey);

    if (Number.isNaN(date.getTime())) return dateKey;

    return boardT('date.compactMonthDay', {month: date.getMonth() + 1, day: date.getDate()});
};
const formatDateRange = (startDate: string, endDate: string) =>
    startDate === endDate ? formatDate(startDate) : `${formatDate(startDate)} - ${formatDate(endDate)}`;
const formatDateTime = (value?: string) => {
    if (!value) return boardT('date.justNow');

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return boardT('date.justNow');

    return `${date.getMonth() + 1}.${date.getDate()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};
const formatMonthTitle = (year: number, month: number) => boardT('date.monthTitle', {year, month});
const formatDateSelectAria = (dateKey: string) => boardT('date.selectAria', {date: formatDate(dateKey)});
const getWeekdayLabels = () => WEEKDAY_KEYS.map((key) => boardT(`date.weekdays.${key}`));
const getQuickChoices = (today: Date) => [
    {label: boardT('date.quick.today'), date: today},
    {label: boardT('date.quick.tomorrow'), date: addDays(today, 1)},
    {label: boardT('date.quick.inThreeDays'), date: addDays(today, 3)},
];
const makePreview = (content: string) => content.replace(/\s+/g, ' ').trim();
const truncateText = (value: string, maxLength: number) => {
    if (value.length <= maxLength) return value;

    return `${value.slice(0, maxLength).trimEnd()}...`;
};
const createClientId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener('load', () => resolve(String(reader.result)));
        reader.addEventListener('error', () => reject(reader.error ?? new Error('Failed to read file')));
        reader.readAsDataURL(file);
    });
const isSubmitEnter = (event: KeyboardEvent<HTMLTextAreaElement>) =>
    event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing;
const resizeTextareaToContent = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
};
const getMonthBounds = (year: number, month: number) => ({
    startDate: toDateKey(new Date(year, month - 1, 1)),
    endDate: toDateKey(new Date(year, month, 0)),
});
const createInitialScheduleDraft = (scheduleDate = toDateKey(new Date())): TScheduleDraft => ({
    title: '',
    content: '',
    startDate: scheduleDate,
    endDate: scheduleDate,
    allDay: true,
    startTime: '',
    endTime: '',
});
const normalizeTimeInput = (value?: string | null) => (value ? value.slice(0, 5) : '');
const normalizeScheduleDateRange = (startDate: string, endDate?: string) => {
    const normalizedEndDate = endDate ?? startDate;

    if (!startDate) return {startDate: '', endDate: normalizedEndDate};

    return {
        startDate,
        endDate: compareDateKey(normalizedEndDate, startDate) < 0 ? startDate : normalizedEndDate,
    };
};
const getScheduleStartDate = (schedule: TWardBoardSchedule) =>
    schedule.startDate ?? schedule.start_date ?? schedule.scheduleDate ?? schedule.schedule_date;
const getScheduleEndDate = (schedule: TWardBoardSchedule) =>
    normalizeScheduleDateRange(
        getScheduleStartDate(schedule),
        schedule.endDate ?? schedule.end_date ?? schedule.scheduleDate ?? schedule.schedule_date,
    ).endDate;
const getScheduleAllDay = (schedule: TWardBoardSchedule) =>
    readBooleanLike(schedule.allDay ?? schedule.isAllDay ?? schedule.all_day ?? schedule.is_all_day) ?? false;
const getScheduleStartTime = (schedule: TWardBoardSchedule) => schedule.startTime ?? schedule.start_time;
const getScheduleEndTime = (schedule: TWardBoardSchedule) => schedule.endTime ?? schedule.end_time;
const getDateKeysInRange = (startDate: string, endDate: string) => {
    const start = parseDateKey(startDate);
    const end = parseDateKey(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [startDate].filter(Boolean);

    const dates: string[] = [];
    const cursor = new Date(start);
    const maxVisibleDays = 370;

    while (compareDateKey(toDateKey(cursor), toDateKey(end)) <= 0 && dates.length < maxVisibleDays) {
        dates.push(toDateKey(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }

    return dates;
};
const formatScheduleTimeRange = (startTime?: string | null, endTime?: string | null, allDay = false) => {
    if (allDay) return boardT('date.allDay');

    const start = normalizeTimeInput(startTime);
    const end = normalizeTimeInput(endTime);

    if (start && end) return `${start}-${end}`;

    return start || end || '';
};
const formatScheduleDateTime = (dateKey: string, time?: string | null) => {
    const normalizedTime = normalizeTimeInput(time);

    return normalizedTime ? `${formatDate(dateKey)} ${normalizedTime}` : formatDate(dateKey);
};
const getScheduleDateTimeDetail = (draft: TScheduleDraft) => {
    if (draft.allDay) {
        return {
            primary: formatDateRange(draft.startDate, draft.endDate),
            badge: boardT('date.allDay'),
        };
    }

    const timeRange = formatScheduleTimeRange(draft.startTime, draft.endTime);

    if (draft.startDate === draft.endDate) {
        return {
            primary: formatDate(draft.startDate),
            secondary: timeRange || boardT('date.timeUnknown'),
        };
    }

    return {
        primary: `${formatScheduleDateTime(draft.startDate, draft.startTime)} - ${formatScheduleDateTime(draft.endDate, draft.endTime)}`,
        secondary: timeRange ? undefined : boardT('date.timeUnknown'),
    };
};
const toSchedulePayload = (draft: TScheduleDraft): TCreateWardBoardScheduleDTO => ({
    title: draft.title.trim(),
    content: draft.content.trim() || undefined,
    scheduleDate: draft.startDate,
    startDate: draft.startDate,
    endDate: draft.endDate,
    allDay: draft.allDay,
    isAllDay: draft.allDay,
    startTime: draft.allDay ? null : normalizeTimeInput(draft.startTime),
    endTime: draft.allDay ? null : normalizeTimeInput(draft.endTime),
});
const getDefaultScheduleDateForMonth = (year: number, month: number) => {
    const today = new Date();

    if (today.getFullYear() === year && today.getMonth() + 1 === month) {
        return toDateKey(today);
    }

    return toDateKey(new Date(year, month - 1, 1));
};
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
const getDeadlineMeta = (deadlineDate?: string, options?: {forceDday?: boolean}) => {
    if (!deadlineDate) return null;

    const today = parseDateKey(toDateKey(new Date()));
    const deadline = parseDateKey(deadlineDate);
    const diff = Math.round((deadline.getTime() - today.getTime()) / MS_PER_DAY);

    if (diff < 0) return {label: boardT('deadline.overdue'), tone: 'overdue' as const};

    if (diff === 0) return {label: boardT('deadline.today'), tone: 'today' as const};

    if (diff > 0 && options?.forceDday) {
        if (diff > DEADLINE_DDAY_VISIBLE_DAYS) return null;

        return {label: `D-${diff}`, tone: 'soon' as const};
    }

    if (diff <= DEADLINE_DDAY_VISIBLE_DAYS) return {label: `D-${diff}`, tone: 'soon' as const};

    return {label: formatDate(deadlineDate), tone: 'normal' as const};
};

function Metric({
    icon: Icon,
    value,
    alwaysVisible = false,
    className,
}: {
    icon: typeof Eye;
    value: number;
    alwaysVisible?: boolean;
    className?: string;
}) {
    if (!alwaysVisible && value <= 0) return null;

    return (
        <span className={cn('inline-flex items-center gap-1 text-[12px] font-medium whitespace-nowrap text-gray-3', className)}>
            <Icon className="size-3.5" strokeWidth={1.9} aria-hidden="true" />
            {value}
        </span>
    );
}

function DeadlineBadge({deadlineDate, forceDday = false}: {deadlineDate?: string; forceDday?: boolean}) {
    const meta = getDeadlineMeta(deadlineDate, {forceDday});

    if (!meta) return null;

    return (
        <span
            className={cn(
                'inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-[12px] font-semibold whitespace-nowrap',
                meta.tone === 'overdue'
                    ? 'bg-[#FFF1F3] text-[#D8495F]'
                    : meta.tone === 'today'
                      ? 'bg-[#FFF6E7] text-[#B06B00]'
                      : meta.tone === 'soon'
                        ? 'bg-[#F3F0FF] text-main-1'
                        : 'bg-gray-7 text-gray-3',
            )}
        >
            {meta.label}
        </span>
    );
}

function PostListSkeleton({count = 5}: {count?: number}) {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-label={boardT('list.loading')}
            data-testid="board-post-list-skeleton"
            className="min-h-0 flex-1 overflow-hidden pr-1"
        >
            {Array.from({length: count}).map((_, index) => (
                <div key={index} className="flex w-full flex-col border-b border-gray-6 px-4 py-3 last:border-b-0">
                    <div className="flex min-w-0 gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mt-1 flex items-center justify-between gap-3">
                                <Skeleton className="h-4 w-7/12 rounded-full bg-gray-6" />
                                {index % 3 === 0 ? <Skeleton className="h-6 w-12 shrink-0 rounded-full bg-gray-6" /> : null}
                            </div>
                            <div className="mt-3 grid gap-2">
                                <Skeleton className="h-3.5 w-full rounded-full bg-gray-6/80" />
                                <Skeleton className="h-3.5 w-9/12 rounded-full bg-gray-6/80" />
                            </div>
                            <div className="mt-4 flex items-center justify-between gap-3">
                                <Skeleton className="h-3.5 w-5/12 rounded-full bg-gray-6" />
                                <div className="flex shrink-0 items-center gap-2.5">
                                    <Skeleton className="h-3.5 w-7 rounded-full bg-gray-6" />
                                    <Skeleton className="h-3.5 w-7 rounded-full bg-gray-6" />
                                    <Skeleton className="h-3.5 w-7 rounded-full bg-gray-6" />
                                </div>
                            </div>
                        </div>
                        {index % 2 === 0 ? (
                            <Skeleton className="mt-1 h-[72px] w-[72px] shrink-0 rounded-[8px] bg-gray-6 sm:h-[86px] sm:w-[86px]" />
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    );
}

function PostListItem({post, selected, onSelect}: {post: TWardBoardPost; selected: boolean; onSelect: () => void}) {
    const title = truncateText(post.title, POST_LIST_TITLE_MAX_LENGTH);
    const preview = truncateText(makePreview(post.content), POST_LIST_CONTENT_MAX_LENGTH);
    const thumbnailUrl = post.imageUrls?.[0];

    return (
        <button
            type="button"
            className={cn(
                'flex w-full flex-col items-stretch border-b border-gray-6 px-4 py-3 text-left transition-colors last:border-b-0',
                selected ? 'bg-[#F3F0FF]' : 'bg-white hover:bg-gray-7',
            )}
            onClick={onSelect}
        >
            <div className="flex min-w-0 gap-3">
                <div className="min-w-0 flex-1">
                    <div className="mt-1 flex items-center justify-between gap-3">
                        <p className="min-w-0 flex-1 truncate text-[15px] leading-6 font-semibold text-sub-1">{title}</p>
                        <DeadlineBadge deadlineDate={post.deadlineDate} forceDday />
                    </div>
                    <p className="mt-2.5 line-clamp-2 min-h-[42px] text-[13px] leading-[21px] text-gray-3">
                        {preview || boardT('common.noContent')}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="truncate text-[12px] font-medium text-sub-2.5">
                            {getAuthorName(post)} · {formatDateTime(post.createdAt)}
                        </span>
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:shrink-0">
                            <Metric icon={Eye} value={post.viewCount ?? 0} alwaysVisible />
                            <Metric icon={Heart} value={post.likeCount ?? 0} className="text-red" />
                            <Metric icon={CheckCircle2} value={post.checkCount ?? 0} className="text-[#217A43]" />
                            <Metric icon={MessageCircle} value={post.commentCount ?? 0} className="text-main-1" />
                        </span>
                    </div>
                </div>
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt=""
                        className="mt-1 h-[72px] w-[72px] shrink-0 rounded-[8px] object-cover sm:h-[86px] sm:w-[86px]"
                        loading="lazy"
                    />
                ) : null}
            </div>
        </button>
    );
}

function BoardDetailSkeleton() {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-label={boardT('state.loadingTitle')}
            data-testid="board-detail-skeleton"
            className="flex h-full min-h-0 flex-col"
        >
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <Skeleton className="h-6 w-16 rounded-full bg-gray-6" />
                    <Skeleton className="mt-4 h-7 w-8/12 rounded-full bg-gray-6" />
                    <Skeleton className="mt-3 h-3.5 w-4/12 rounded-full bg-gray-6/80" />
                </div>
                <Skeleton className="h-9 w-28 shrink-0 rounded-[8px] bg-gray-6" />
            </div>
            <div className="mt-5 flex items-center gap-4">
                <Skeleton className="h-5 w-10 rounded-full bg-gray-6" />
                <Skeleton className="h-5 w-10 rounded-full bg-gray-6" />
                <Skeleton className="h-5 w-10 rounded-full bg-gray-6" />
            </div>
            <div className="mt-6 min-h-0 flex-1 overflow-hidden pr-1">
                <div className="grid gap-3">
                    <Skeleton className="h-4 w-full rounded-full bg-gray-6/80" />
                    <Skeleton className="h-4 w-11/12 rounded-full bg-gray-6/80" />
                    <Skeleton className="h-4 w-10/12 rounded-full bg-gray-6/80" />
                    <Skeleton className="h-4 w-7/12 rounded-full bg-gray-6/80" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-2">
                    <Skeleton className="aspect-video rounded-[8px] bg-gray-6" />
                    <Skeleton className="aspect-video rounded-[8px] bg-gray-6" />
                </div>
                <div className="mt-6">
                    <Skeleton className="h-4 w-24 rounded-full bg-gray-6" />
                    <div className="mt-3 flex items-start gap-1.5">
                        <Skeleton className="h-12 min-w-0 flex-1 rounded-[8px] bg-gray-6/80" />
                        <Skeleton className="h-12 w-12 rounded-[8px] bg-gray-6" />
                    </div>
                    <CommentThreadSkeleton className="mt-3" count={2} />
                </div>
            </div>
        </div>
    );
}

function CommentThreadSkeleton({count = 3, className}: {count?: number; className?: string}) {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-label={boardT('comment.loading')}
            data-testid="board-comment-skeleton"
            className={cn('space-y-2', className)}
        >
            {Array.from({length: count}).map((_, index) => (
                <div key={index} className="rounded-[8px] bg-gray-7 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                        <Skeleton className="h-3.5 w-24 rounded-full bg-gray-6" />
                        <Skeleton className="h-3 w-14 rounded-full bg-gray-6" />
                    </div>
                    <div className="mt-2 grid gap-1.5">
                        <Skeleton className="h-3.5 w-full rounded-full bg-gray-6/80" />
                        <Skeleton className="h-3.5 w-7/12 rounded-full bg-gray-6/80" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function CommentThread({
    comments,
    replyingCommentId,
    replyDraft,
    disabled,
    depth = 0,
    deletingCommentId,
    onStartReply,
    onCancelReply,
    onChangeReply,
    onSubmitReply,
    onDeleteComment,
}: {
    comments: TWardBoardComment[];
    replyingCommentId: number | null;
    replyDraft: string;
    disabled: boolean;
    depth?: number;
    deletingCommentId?: number | null;
    onStartReply: (commentId: number) => void;
    onCancelReply: () => void;
    onChangeReply: (value: string) => void;
    onSubmitReply: (commentId: number) => void;
    onDeleteComment: (commentId: number) => void;
}) {
    const canReply = depth === 0;
    const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        resizeTextareaToContent(replyTextareaRef.current);
    }, [replyDraft, replyingCommentId]);

    return (
        <div className="space-y-2">
            {comments.map((comment) => {
                const commentId = getCommentId(comment);
                const isReplying = replyingCommentId === commentId;

                return (
                    <div key={`${commentId}-${comment.createdAt ?? comment.content}`} className="rounded-[8px] bg-gray-7 px-3 py-2.5">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[13px] font-semibold text-sub-1">{comment.authorName ?? boardT('common.author')}</span>
                            <span className="text-[11px] font-medium text-gray-4">{formatDateTime(comment.createdAt)}</span>
                        </div>
                        <p className="mt-1.5 text-[13px] leading-[18px] whitespace-pre-line text-sub-2">{comment.content}</p>
                        {canReply || comment.isMine ? (
                            <div className="mt-1 flex justify-end gap-1.5">
                                {comment.isMine ? (
                                    <button
                                        type="button"
                                        className="h-6 rounded-[7px] px-2 text-[11px] font-semibold text-gray-3 transition-colors hover:bg-white hover:text-[#D8495F] disabled:cursor-not-allowed disabled:opacity-40"
                                        disabled={disabled || deletingCommentId === commentId}
                                        onClick={() => onDeleteComment(commentId)}
                                    >
                                        {boardT('common.delete')}
                                    </button>
                                ) : null}
                                {canReply ? (
                                    <button
                                        type="button"
                                        className="h-6 rounded-[7px] px-2 text-[11px] font-semibold text-gray-3 transition-colors hover:bg-white hover:text-sub-1"
                                        disabled={disabled}
                                        onClick={() => onStartReply(commentId)}
                                    >
                                        {boardT('common.reply')}
                                    </button>
                                ) : null}
                            </div>
                        ) : null}

                        {canReply && isReplying ? (
                            <div className="mt-1.5 flex items-start gap-1.5">
                                <textarea
                                    ref={replyTextareaRef}
                                    value={replyDraft}
                                    onChange={(event) => onChangeReply(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (!isSubmitEnter(event)) return;

                                        event.preventDefault();

                                        if (!disabled && replyDraft.trim()) {
                                            onSubmitReply(commentId);
                                        }
                                    }}
                                    placeholder={boardT('comment.replyPlaceholder')}
                                    rows={1}
                                    className="min-h-10 min-w-0 flex-1 resize-none overflow-hidden rounded-[7px] bg-white px-2.5 py-3 text-[12px] leading-4 text-sub-1 ring-1 ring-transparent transition outline-none ring-inset focus:ring-main-3"
                                />
                                <button
                                    type="button"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-[7px] bg-sub-1 px-0 text-[12px] font-semibold text-white transition-colors hover:bg-[#3A3A42] disabled:cursor-not-allowed disabled:opacity-40"
                                    disabled={disabled || !replyDraft.trim()}
                                    onClick={() => onSubmitReply(commentId)}
                                >
                                    {boardT('common.submit')}
                                </button>
                                <button
                                    type="button"
                                    className="h-10 w-10 rounded-[7px] text-gray-4 transition-colors hover:bg-white hover:text-sub-1"
                                    onClick={onCancelReply}
                                    aria-label={boardT('comment.cancelReply')}
                                    title={boardT('comment.cancelReply')}
                                >
                                    <X className="size-4" aria-hidden="true" />
                                </button>
                            </div>
                        ) : null}

                        {canReply && comment.replies?.length ? (
                            <div className="mt-2 border-l border-gray-6 pl-2.5">
                                <CommentThread
                                    comments={comment.replies}
                                    replyingCommentId={replyingCommentId}
                                    replyDraft={replyDraft}
                                    disabled={disabled}
                                    depth={depth + 1}
                                    deletingCommentId={deletingCommentId}
                                    onStartReply={onStartReply}
                                    onCancelReply={onCancelReply}
                                    onChangeReply={onChangeReply}
                                    onSubmitReply={onSubmitReply}
                                    onDeleteComment={onDeleteComment}
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
    const quickChoices = getQuickChoices(today);

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
        const handleKeyDown = (event: globalThis.KeyboardEvent) => {
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
        <div id="board_composer_deadline_picker" ref={pickerRef} className="relative grid w-full max-w-full gap-1.5 sm:max-w-[300px]">
            <span className="text-[13px] font-semibold text-sub-2">{boardT('deadline.label')}</span>
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
                        {value ? boardT('deadline.selectedSuffix', {date: formatDate(value)}) : boardT('deadline.noSelection')}
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
                            <p className="text-[13px] font-semibold text-gray-3">{boardT('deadline.pickerTitle')}</p>
                            <p className="mt-1 text-[18px] font-semibold text-sub-1">
                                {value ? formatDate(value) : boardT('deadline.noSelection')}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                            onClick={() => setIsOpen(false)}
                            aria-label={boardT('deadline.closePicker')}
                            title={boardT('deadline.closePicker')}
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
                            {boardT('common.none')}
                        </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                            onClick={() => moveViewMonth(-1)}
                            aria-label={boardT('date.prevMonth')}
                            title={boardT('date.prevMonth')}
                        >
                            <ChevronLeft className="size-4" strokeWidth={1.8} aria-hidden="true" />
                        </button>
                        <span className="text-[15px] font-semibold text-sub-1">{formatMonthTitle(viewMonth.year, viewMonth.month)}</span>
                        <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                            onClick={() => moveViewMonth(1)}
                            aria-label={boardT('date.nextMonth')}
                            title={boardT('date.nextMonth')}
                        >
                            <ChevronRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
                        </button>
                    </div>

                    <div className="mt-3 grid grid-cols-7 text-center text-[11px] font-semibold text-gray-4">
                        {getWeekdayLabels().map((dayLabel) => (
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
                                    aria-label={formatDateSelectAria(cell.key)}
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

function ScheduleDatePicker({
    pickerId,
    label,
    value,
    invalid,
    minDate,
    popoverAlign = 'left',
    openPickerId,
    onOpenPickerChange,
    disabled,
    onChange,
}: {
    pickerId: TScheduleDatePickerId;
    label: string;
    value: string;
    invalid: boolean;
    minDate?: string;
    popoverAlign?: 'left' | 'right';
    openPickerId: TScheduleDatePickerId | null;
    onOpenPickerChange: (pickerId: TScheduleDatePickerId | null) => void;
    disabled: boolean;
    onChange: (scheduleDate: string) => void;
}) {
    const todayKey = toDateKey(new Date());
    const today = useMemo(() => parseDateKey(todayKey), [todayKey]);
    const isOpen = openPickerId === pickerId;
    const [viewMonth, setViewMonth] = useState(() => {
        const initialDate = value ? parseDateKey(value) : today;

        return {
            year: initialDate.getFullYear(),
            month: initialDate.getMonth() + 1,
        };
    });
    const pickerRef = useRef<HTMLDivElement>(null);
    const cells = useMemo(() => getCalendarCells(viewMonth.year, viewMonth.month), [viewMonth]);
    const quickChoices = getQuickChoices(today);

    useEffect(() => {
        if (!isOpen) return;

        const nextDate = value ? parseDateKey(value) : today;

        if (Number.isNaN(nextDate.getTime())) return;

        setViewMonth({
            year: nextDate.getFullYear(),
            month: nextDate.getMonth() + 1,
        });
    }, [isOpen, today, value]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const handlePointerDown = (event: MouseEvent) => {
            if (!pickerRef.current?.contains(event.target as Node)) {
                onOpenPickerChange(null);
            }
        };
        const handleKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Escape') {
                onOpenPickerChange(null);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onOpenPickerChange]);

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
        if (minDate && compareDateKey(dateKey, minDate) < 0) return;

        onChange(dateKey);
        onOpenPickerChange(null);
    };
    const isDateDisabled = (dateKey: string) => Boolean(minDate && compareDateKey(dateKey, minDate) < 0);

    return (
        <div ref={pickerRef} className="relative grid gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-sub-2">
                {label}
                <span className="h-[3px] w-[3px] rounded-full bg-[#E85D75]" aria-hidden="true" />
            </span>
            <button
                type="button"
                className={cn(
                    'flex h-11 w-full items-center justify-between gap-3 rounded-[8px] px-3.5 text-left ring-1 transition outline-none disabled:cursor-default disabled:opacity-100',
                    isOpen ? 'bg-white shadow-[0_8px_24px_rgba(49,130,246,0.12)] ring-[#CFE0FF]' : 'bg-gray-7 hover:bg-white',
                    invalid ? 'bg-white ring-[#E85D75]' : isOpen ? undefined : 'ring-transparent focus:ring-main-3',
                )}
                onClick={() => {
                    if (!disabled) onOpenPickerChange(isOpen ? null : pickerId);
                }}
                disabled={disabled}
                aria-label={boardT('date.datePickerButtonAria', {label, value: value ? formatDate(value) : boardT('date.datePlaceholder')})}
                aria-expanded={isOpen}
                aria-required="true"
                aria-invalid={invalid}
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
                    <span className="min-w-0 truncate text-[15px] font-semibold text-sub-1">
                        {value ? formatDate(value) : boardT('date.datePlaceholder')}
                    </span>
                </span>
                <ChevronRight
                    className={cn('size-4 shrink-0 text-gray-4 transition-transform', isOpen ? 'rotate-90 text-[#3182F6]' : undefined)}
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            </button>

            {isOpen ? (
                <div
                    className={cn(
                        'absolute top-full z-50 mt-2 w-[304px] max-w-[calc(100vw-48px)] rounded-[14px] bg-white p-3.5 shadow-[0_20px_60px_rgba(15,23,42,0.16)] ring-1 ring-gray-6',
                        popoverAlign === 'right' ? 'right-0' : 'left-0',
                    )}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[12px] font-semibold text-gray-3">{boardT('schedule.datePickerHeader', {label})}</p>
                            <p className="mt-0.5 text-[16px] font-semibold text-sub-1">
                                {value ? formatDate(value) : boardT('date.datePlaceholder')}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                            onClick={() => onOpenPickerChange(null)}
                            aria-label={boardT('schedule.datePickerClose')}
                            title={boardT('schedule.datePickerClose')}
                        >
                            <X className="size-4" strokeWidth={1.8} aria-hidden="true" />
                        </button>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-1.5">
                        {quickChoices.map((choice) => {
                            const choiceKey = toDateKey(choice.date);
                            const isSelected = value === choiceKey;
                            const choiceDisabled = isDateDisabled(choiceKey);

                            return (
                                <button
                                    key={choice.label}
                                    type="button"
                                    className={cn(
                                        'h-8 rounded-[8px] text-[12px] font-semibold transition-colors',
                                        isSelected
                                            ? 'bg-[#3182F6] text-white'
                                            : choiceDisabled
                                              ? 'bg-gray-7 text-gray-5'
                                              : 'bg-gray-7 text-sub-2 hover:bg-[#EEF6FF] hover:text-[#3182F6]',
                                    )}
                                    disabled={choiceDisabled}
                                    onClick={() => selectDate(choiceKey)}
                                >
                                    {choice.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                            onClick={() => moveViewMonth(-1)}
                            aria-label={boardT('date.prevMonth')}
                            title={boardT('date.prevMonth')}
                        >
                            <ChevronLeft className="size-4" strokeWidth={1.8} aria-hidden="true" />
                        </button>
                        <span className="text-[15px] font-semibold text-sub-1">{formatMonthTitle(viewMonth.year, viewMonth.month)}</span>
                        <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                            onClick={() => moveViewMonth(1)}
                            aria-label={boardT('date.nextMonth')}
                            title={boardT('date.nextMonth')}
                        >
                            <ChevronRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
                        </button>
                    </div>

                    <div className="mt-2 grid grid-cols-7 text-center text-[11px] font-semibold text-gray-4">
                        {getWeekdayLabels().map((dayLabel) => (
                            <span key={dayLabel} className="h-6 leading-6">
                                {dayLabel}
                            </span>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((cell) => {
                            const isSelected = value === cell.key;
                            const isToday = cell.key === todayKey;
                            const cellDisabled = isDateDisabled(cell.key);

                            return (
                                <button
                                    key={cell.key}
                                    type="button"
                                    className={cn(
                                        'grid aspect-square w-full place-items-center rounded-full text-[12px] font-semibold transition-colors',
                                        cell.inMonth ? 'text-sub-2' : 'text-gray-5',
                                        isSelected
                                            ? 'bg-[#3182F6] text-white shadow-[0_6px_14px_rgba(49,130,246,0.24)]'
                                            : cellDisabled
                                              ? 'text-gray-5'
                                              : 'hover:bg-gray-7 hover:text-sub-1',
                                        isToday && !isSelected ? 'text-[#3182F6] ring-1 ring-[#BFD7FF]' : undefined,
                                    )}
                                    disabled={cellDisabled}
                                    onClick={() => selectDate(cell.key)}
                                    aria-label={formatDateSelectAria(cell.key)}
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

function ScheduleTimeInput({
    label,
    value,
    disabled,
    onChange,
}: {
    label: string;
    value: string;
    disabled: boolean;
    onChange: (time: string) => void;
}) {
    return (
        <label className="group grid min-w-0 gap-1.5">
            <span className="text-[11px] font-semibold text-gray-3">{label}</span>
            <span
                className={cn(
                    'flex h-11 min-w-0 items-center gap-2 rounded-[8px] bg-gray-7 px-3 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-main-3',
                    disabled ? 'cursor-default opacity-100' : undefined,
                )}
            >
                <Clock3 className={cn('size-4 shrink-0', value ? 'text-[#3182F6]' : 'text-gray-4')} strokeWidth={1.8} aria-hidden="true" />
                <input
                    type="time"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    disabled={disabled}
                    aria-label={boardT('schedule.timeInputAria', {label})}
                    className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-sub-1 outline-none disabled:cursor-default disabled:opacity-100"
                />
            </span>
        </label>
    );
}

function ScheduleTimeRangePicker({
    draft,
    disabled,
    onChange,
}: {
    draft: TScheduleDraft;
    disabled: boolean;
    onChange: (draft: TScheduleDraft) => void;
}) {
    return (
        <div className="grid gap-2">
            <span className="text-[13px] font-semibold text-sub-2">{boardT('schedule.time')}</span>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                <ScheduleTimeInput
                    label={boardT('schedule.startTime')}
                    value={draft.startTime}
                    disabled={disabled}
                    onChange={(startTime) => onChange({...draft, startTime})}
                />
                <span className="text-[13px] font-semibold text-gray-4">~</span>
                <ScheduleTimeInput
                    label={boardT('schedule.endTime')}
                    value={draft.endTime}
                    disabled={disabled}
                    onChange={(endTime) => onChange({...draft, endTime})}
                />
            </div>
        </div>
    );
}

function ScheduleDetailField({
    label,
    children,
    icon: Icon,
    className,
    contentClassName,
}: {
    label: string;
    children: ReactNode;
    icon?: typeof CalendarDays;
    className?: string;
    contentClassName?: string;
}) {
    return (
        <div className={cn('grid gap-1.5', className)}>
            <span className="text-[13px] font-semibold text-sub-2">{label}</span>
            <div
                className={cn(
                    'flex min-h-11 items-center gap-2 rounded-[8px] bg-gray-7 px-3.5 py-3 text-[14px] leading-5 font-semibold text-sub-1',
                    contentClassName,
                )}
            >
                {Icon ? <Icon className="size-4 shrink-0 text-main-1" aria-hidden="true" /> : null}
                <div className="min-w-0 flex-1">{children}</div>
            </div>
        </div>
    );
}

function WardScheduleModal({
    mode,
    draft,
    submitAttempted,
    disabled,
    deleting,
    onChange,
    onSubmit,
    onClose,
    onDelete,
    onEdit,
}: {
    mode: TScheduleModalMode;
    draft: TScheduleDraft;
    submitAttempted: boolean;
    disabled: boolean;
    deleting: boolean;
    onChange: (draft: TScheduleDraft) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onClose: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
}) {
    const isEditMode = mode === 'edit';
    const isViewMode = mode === 'view';
    const isTitleInvalid = submitAttempted && !draft.title.trim();
    const isStartDateInvalid = submitAttempted && !draft.startDate;
    const isEndDateInvalid = submitAttempted && (!draft.endDate || compareDateKey(draft.endDate, draft.startDate) < 0);
    const isTimeMissingInvalid = submitAttempted && !draft.allDay && (!draft.startTime || !draft.endTime);
    const isTimeRangeInvalid =
        submitAttempted &&
        !draft.allDay &&
        draft.startDate === draft.endDate &&
        Boolean(draft.startTime && draft.endTime && draft.startTime >= draft.endTime);
    const [openDatePicker, setOpenDatePicker] = useState<TScheduleDatePickerId | null>(null);
    const modalTitle = isViewMode
        ? boardT('schedule.modalView')
        : isEditMode
          ? boardT('schedule.modalEdit')
          : boardT('schedule.modalCreate');
    const headerTitle = isViewMode ? draft.title || modalTitle : modalTitle;
    const detailDateTime = getScheduleDateTimeDetail(draft);
    const updateStartDate = (startDate: string) => {
        onChange({
            ...draft,
            startDate,
            endDate: draft.endDate && compareDateKey(draft.endDate, startDate) >= 0 ? draft.endDate : startDate,
        });
    };
    const updateEndDate = (endDate: string) => {
        onChange({
            ...draft,
            endDate: compareDateKey(endDate, draft.startDate) < 0 ? draft.startDate : endDate,
        });
    };
    const updateAllDay = (allDay: boolean) => {
        onChange({
            ...draft,
            allDay,
            startTime: allDay ? '' : draft.startTime || '09:00',
            endTime: allDay ? '' : draft.endTime || '10:00',
        });
    };
    const modal = (
        <div
            className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/45 px-4 py-6"
            role="presentation"
            onMouseDown={onClose}
        >
            <form
                role="dialog"
                aria-modal="true"
                aria-label={boardT('schedule.modalAria', {title: modalTitle})}
                className="w-full max-w-[440px] rounded-[16px] bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
                onMouseDown={(event) => event.stopPropagation()}
                onSubmit={onSubmit}
                noValidate
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-gray-3">{boardT('schedule.sectionTitle')}</p>
                        <h2 className="mt-1 text-[22px] leading-7 font-semibold break-words text-sub-1">{headerTitle}</h2>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                        {isViewMode && onEdit ? (
                            <button
                                type="button"
                                className="grid h-9 w-9 place-items-center rounded-[8px] text-gray-4 transition-colors hover:bg-main-light hover:text-main-1"
                                onClick={onEdit}
                                aria-label={boardT('schedule.editAria')}
                                title={boardT('schedule.editAria')}
                            >
                                <Pencil className="size-4" aria-hidden="true" />
                            </button>
                        ) : null}
                        <button
                            type="button"
                            className="grid h-9 w-9 place-items-center rounded-[8px] text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                            onClick={onClose}
                            aria-label={boardT('schedule.closeAria')}
                            title={boardT('schedule.closeAria')}
                        >
                            <X className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {isViewMode ? (
                    <div className="mt-5 grid gap-4">
                        <ScheduleDetailField label={boardT('schedule.dateTime')} icon={CalendarDays} contentClassName="items-start">
                            <div className="grid gap-1">
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                    <span className="min-w-0 break-words">{detailDateTime.primary}</span>
                                    {detailDateTime.badge ? (
                                        <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-main-light px-2.5 text-[12px] font-semibold text-main-1">
                                            {detailDateTime.badge}
                                        </span>
                                    ) : null}
                                </div>
                                {detailDateTime.secondary ? (
                                    <span className="text-[12px] leading-4 font-medium text-gray-3">{detailDateTime.secondary}</span>
                                ) : null}
                            </div>
                        </ScheduleDetailField>
                        <ScheduleDetailField label={boardT('schedule.memo')} contentClassName="min-h-[112px] items-start font-medium">
                            <p className={cn('min-h-5 whitespace-pre-line', draft.content.trim() ? 'text-sub-1' : 'text-gray-4')}>
                                {draft.content.trim() || boardT('schedule.noMemo')}
                            </p>
                        </ScheduleDetailField>
                    </div>
                ) : (
                    <div className="mt-5 grid gap-4">
                        <label className="grid gap-1.5">
                            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-sub-2">
                                {boardT('schedule.title')}
                                <span className="h-[3px] w-[3px] rounded-full bg-[#E85D75]" aria-hidden="true" />
                            </span>
                            <input
                                value={draft.title}
                                onChange={(event) => onChange({...draft, title: event.target.value})}
                                maxLength={SCHEDULE_TITLE_MAX_LENGTH}
                                aria-required="true"
                                aria-invalid={isTitleInvalid}
                                className={cn(
                                    'h-11 w-full rounded-[8px] bg-gray-7 px-3.5 text-[15px] text-sub-1 ring-1 transition outline-none focus:bg-white',
                                    isTitleInvalid ? 'bg-white ring-[#E85D75] focus:ring-[#E85D75]' : 'ring-transparent focus:ring-main-3',
                                )}
                                placeholder={boardT('schedule.titlePlaceholder')}
                            />
                            {isTitleInvalid ? (
                                <span className="text-[11px] font-medium text-[#E85D75]">{boardT('schedule.titleRequired')}</span>
                            ) : null}
                        </label>

                        <div className="grid gap-1.5">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                                <ScheduleDatePicker
                                    pickerId="start"
                                    label={boardT('schedule.startDate')}
                                    value={draft.startDate}
                                    invalid={isStartDateInvalid}
                                    openPickerId={openDatePicker}
                                    onOpenPickerChange={setOpenDatePicker}
                                    disabled={false}
                                    onChange={updateStartDate}
                                />
                                <ScheduleDatePicker
                                    pickerId="end"
                                    label={boardT('schedule.endDate')}
                                    value={draft.endDate}
                                    invalid={isEndDateInvalid}
                                    minDate={draft.startDate}
                                    popoverAlign="right"
                                    openPickerId={openDatePicker}
                                    onOpenPickerChange={setOpenDatePicker}
                                    disabled={false}
                                    onChange={updateEndDate}
                                />
                            </div>
                            {isStartDateInvalid || isEndDateInvalid ? (
                                <span className="text-[11px] font-medium text-[#E85D75]">{boardT('schedule.periodRequired')}</span>
                            ) : null}
                        </div>

                        <label className="flex h-10 items-center justify-between rounded-[8px] bg-gray-7 px-3.5">
                            <span className="text-[13px] font-semibold text-sub-2">{boardT('date.allDay')}</span>
                            <input
                                type="checkbox"
                                checked={draft.allDay}
                                onChange={(event) => updateAllDay(event.target.checked)}
                                aria-label={boardT('date.allDay')}
                                className="h-4 w-4 accent-main-1"
                            />
                        </label>

                        {!draft.allDay ? (
                            <div className="grid gap-1.5">
                                <ScheduleTimeRangePicker draft={draft} disabled={false} onChange={onChange} />
                                {isTimeMissingInvalid ? (
                                    <span className="text-[11px] font-medium text-[#E85D75]">{boardT('schedule.timeMissing')}</span>
                                ) : isTimeRangeInvalid ? (
                                    <span className="text-[11px] font-medium text-[#E85D75]">{boardT('schedule.timeRangeInvalid')}</span>
                                ) : null}
                            </div>
                        ) : null}

                        <label className="grid gap-1.5">
                            <span className="text-[13px] font-semibold text-sub-2">{boardT('schedule.memo')}</span>
                            <textarea
                                value={draft.content}
                                onChange={(event) => onChange({...draft, content: event.target.value})}
                                maxLength={SCHEDULE_CONTENT_MAX_LENGTH}
                                rows={4}
                                className="min-h-[112px] w-full resize-none rounded-[8px] bg-gray-7 px-3.5 py-3 text-[14px] leading-5 text-sub-1 ring-1 ring-transparent transition outline-none focus:bg-white focus:ring-main-3"
                                placeholder={boardT('schedule.memoPlaceholder')}
                            />
                            <span className="justify-self-end text-[11px] font-medium text-gray-4">
                                {draft.content.length}/{SCHEDULE_CONTENT_MAX_LENGTH}
                            </span>
                        </label>
                    </div>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                    {isEditMode && onDelete ? (
                        <button
                            type="button"
                            className="inline-flex h-10 items-center gap-1.5 px-1 text-[13px] font-semibold text-[#D8495F] transition-colors hover:text-[#B93249] disabled:cursor-not-allowed disabled:opacity-40"
                            disabled={disabled || deleting}
                            onClick={onDelete}
                        >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                            {boardT('common.delete')}
                        </button>
                    ) : (
                        <span />
                    )}
                    <div className="ml-auto flex items-center gap-2">
                        <button
                            type="button"
                            className="h-10 rounded-[8px] bg-gray-7 px-4 text-[13px] font-semibold text-sub-2 transition-colors hover:bg-gray-6"
                            onClick={onClose}
                        >
                            {isViewMode ? boardT('common.close') : boardT('common.cancel')}
                        </button>
                        {!isViewMode ? (
                            <button
                                type="submit"
                                className="h-10 rounded-[8px] bg-main-1 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-main-1-hover disabled:cursor-not-allowed disabled:opacity-40"
                                disabled={disabled || deleting}
                            >
                                {isEditMode ? boardT('common.update') : boardT('common.submit')}
                            </button>
                        ) : null}
                    </div>
                </div>
            </form>
        </div>
    );

    if (typeof document === 'undefined') return modal;

    return createPortal(modal, document.body);
}

function DeadlineCalendar({
    year,
    month,
    selectedDateKey,
    deadlines,
    schedules,
    onMoveMonth,
    onSelectPost,
    onCreateSchedule,
    onOpenSchedule,
}: {
    year: number;
    month: number;
    selectedDateKey?: string | null;
    deadlines: TWardBoardDeadline[];
    schedules: TWardBoardSchedule[];
    onMoveMonth: (delta: number) => void;
    onSelectPost: (postId: number) => void;
    onCreateSchedule: (dateKey?: string) => void;
    onOpenSchedule: (schedule: TWardBoardSchedule) => void;
}) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const cells = useMemo(() => getCalendarCells(year, month), [month, year]);
    const {calendarEvents, monthEvents} = useMemo(() => {
        const manualSchedules = schedules.filter((schedule) => !isBoardDeadlineSchedule(schedule));
        const scheduleMonthEvents = manualSchedules.map<TCalendarEvent>((schedule) => {
            const startDate = getScheduleStartDate(schedule);
            const endDate = getScheduleEndDate(schedule);
            const timeRange = formatScheduleTimeRange(
                getScheduleStartTime(schedule),
                getScheduleEndTime(schedule),
                getScheduleAllDay(schedule),
            );
            const dateRange = formatDateRange(startDate, endDate);

            return {
                kind: 'schedule',
                key: `schedule-${getScheduleId(schedule)}`,
                date: startDate,
                title: schedule.title,
                meta: `${dateRange} · ${timeRange || getScheduleWriterName(schedule)}`,
                schedule,
            };
        });
        const scheduleCalendarEvents = manualSchedules
            .filter((schedule) => !isBoardDeadlineSchedule(schedule))
            .flatMap<TCalendarEvent>((schedule) => {
                const startDate = getScheduleStartDate(schedule);
                const endDate = getScheduleEndDate(schedule);
                const timeRange = formatScheduleTimeRange(
                    getScheduleStartTime(schedule),
                    getScheduleEndTime(schedule),
                    getScheduleAllDay(schedule),
                );

                return getDateKeysInRange(startDate, endDate).map((dateKey) => ({
                    kind: 'schedule',
                    key: `schedule-${getScheduleId(schedule)}-${dateKey}`,
                    date: dateKey,
                    title: schedule.title,
                    meta: timeRange || getScheduleWriterName(schedule),
                    schedule,
                }));
            });
        const deadlineSchedules = schedules
            .filter(isBoardDeadlineSchedule)
            .map(getDeadlineFromSchedule)
            .filter((deadline): deadline is TWardBoardDeadline => Boolean(deadline));
        const deadlineScheduleKeys = new Set(deadlineSchedules.map(getDeadlineEventKey));
        const deadlineEvents = [
            ...deadlineSchedules,
            ...deadlines.filter((deadline) => !deadlineScheduleKeys.has(getDeadlineEventKey(deadline))),
        ].map<TCalendarEvent>((deadline) => ({
            kind: 'deadline',
            key: getDeadlineEventKey(deadline),
            date: deadline.deadlineDate,
            title: deadline.postTitle,
            meta: boardT('schedule.postDeadline'),
            deadline,
        }));
        const sortEvents = (events: TCalendarEvent[]) =>
            [...events].sort((a, b) => {
                if (a.date !== b.date) return a.date.localeCompare(b.date);

                if (a.kind !== b.kind) return a.kind === 'schedule' ? -1 : 1;

                return a.title.localeCompare(b.title);
            });

        return {
            calendarEvents: sortEvents([...scheduleCalendarEvents, ...deadlineEvents]),
            monthEvents: sortEvents([...scheduleMonthEvents, ...deadlineEvents]),
        };
    }, [deadlines, schedules]);
    const eventsByDate = useMemo(
        () =>
            calendarEvents.reduce<Map<string, TCalendarEvent[]>>((map, event) => {
                const current = map.get(event.date) ?? [];

                map.set(event.date, [...current, event]);

                return map;
            }, new Map()),
        [calendarEvents],
    );
    const defaultScheduleDate = getDefaultScheduleDateForMonth(year, month);
    const todayKey = toDateKey(new Date());
    const visibleEvents = selectedDate ? (eventsByDate.get(selectedDate) ?? []) : monthEvents;

    useEffect(() => {
        setSelectedDate(selectedDateKey && isDateKeyInMonth(selectedDateKey, year, month) ? selectedDateKey : null);
    }, [month, selectedDateKey, year]);

    return (
        <aside className="min-w-0 rounded-[8px] bg-white p-3">
            <div className="grid gap-4">
                <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <p className="text-[12px] font-semibold text-gray-3">{boardT('schedule.calendarTitle')}</p>
                            <h2 className="mt-0.5 text-[18px] font-semibold text-sub-1">{formatMonthTitle(year, month)}</h2>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                id="board_schedule_create_button"
                                type="button"
                                className="grid h-7 w-7 place-items-center rounded-[7px] bg-main-1 text-white transition-colors hover:bg-main-1-hover"
                                onClick={() => onCreateSchedule(defaultScheduleDate)}
                                aria-label={boardT('schedule.createAria')}
                                title={boardT('schedule.createAria')}
                            >
                                <CalendarPlus className="size-3.5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="grid h-7 w-7 place-items-center rounded-[7px] text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                                onClick={() => onMoveMonth(-1)}
                                aria-label={boardT('date.prevMonth')}
                                title={boardT('date.prevMonth')}
                            >
                                <ChevronLeft className="size-3.5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="grid h-7 w-7 place-items-center rounded-[7px] text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                                onClick={() => onMoveMonth(1)}
                                aria-label={boardT('date.nextMonth')}
                                title={boardT('date.nextMonth')}
                            >
                                <ChevronRight className="size-3.5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold text-gray-4">
                        {getWeekdayLabels().map((dayLabel) => (
                            <span key={dayLabel} className="h-5 leading-5">
                                {dayLabel}
                            </span>
                        ))}
                    </div>
                    <div className="mt-1 grid grid-cols-7 gap-0.5">
                        {cells.map((cell) => {
                            const dayEvents = eventsByDate.get(cell.key) ?? [];
                            const hasSchedule = dayEvents.some((event) => event.kind === 'schedule');
                            const hasEvent = dayEvents.length > 0;
                            const isSelected = selectedDate === cell.key;
                            const isToday = cell.key === todayKey;

                            return (
                                <button
                                    key={cell.key}
                                    type="button"
                                    className={cn(
                                        'relative grid aspect-square place-items-center rounded-[7px] text-[11px] font-semibold transition-colors disabled:cursor-default',
                                        cell.inMonth ? 'text-sub-2' : 'text-gray-5',
                                        isSelected
                                            ? 'bg-sub-1 text-white hover:bg-sub-1'
                                            : hasSchedule
                                              ? 'bg-main-light text-main-1 hover:bg-main-4'
                                              : hasEvent
                                                ? 'bg-[#EEF6FF] text-[#2468B2] hover:bg-[#DCEBFF]'
                                                : cell.inMonth
                                                  ? 'hover:bg-gray-7'
                                                  : undefined,
                                    )}
                                    disabled={!cell.inMonth}
                                    aria-current={isToday ? 'date' : undefined}
                                    onClick={() => {
                                        setSelectedDate(cell.key);
                                    }}
                                    aria-label={boardT('schedule.dayAria', {
                                        date: formatDate(cell.key),
                                        count: dayEvents.length,
                                        selectedSuffix: isSelected ? boardT('schedule.selectedSuffix') : '',
                                    })}
                                >
                                    <span
                                        className={cn(
                                            'relative z-10 grid size-5 place-items-center rounded-full',
                                            isToday && !isSelected ? 'bg-[#3182F6] text-white' : undefined,
                                        )}
                                    >
                                        {cell.date.getDate()}
                                    </span>
                                    {hasEvent ? (
                                        <span className="absolute right-1 bottom-1 flex gap-0.5" aria-hidden="true">
                                            {dayEvents.slice(0, 2).map((event) => (
                                                <span
                                                    key={event.key}
                                                    className={cn(
                                                        'h-1 w-1 rounded-full',
                                                        event.kind === 'schedule' ? 'bg-main-1' : 'bg-[#3182F6]',
                                                    )}
                                                />
                                            ))}
                                        </span>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[13px] font-semibold text-sub-1">
                            {selectedDate
                                ? boardT('schedule.selectedDateTitle', {date: formatDate(selectedDate)})
                                : boardT('schedule.monthEventsTitle')}
                        </h3>
                        <span className="text-[11px] font-semibold text-gray-4">
                            {boardT('common.count', {count: visibleEvents.length})}
                        </span>
                    </div>
                    <div className="mt-2.5 space-y-1.5">
                        {visibleEvents.length === 0 ? (
                            <p className="rounded-[8px] bg-gray-7 px-2.5 py-2.5 text-[12px] leading-5 text-gray-3">
                                {selectedDate ? boardT('schedule.noSelectedDateEvents') : boardT('schedule.noMonthEvents')}
                            </p>
                        ) : (
                            visibleEvents.slice(0, 6).map((event) => (
                                <button
                                    key={event.key}
                                    type="button"
                                    className="flex w-full items-center gap-2 rounded-[8px] bg-gray-7 px-2.5 py-2 text-left transition-colors hover:bg-main-light"
                                    onClick={() => {
                                        if (event.kind === 'schedule') {
                                            onOpenSchedule(event.schedule);

                                            return;
                                        }

                                        if (event.deadline.postId) onSelectPost(event.deadline.postId);
                                    }}
                                >
                                    <span
                                        className={cn(
                                            'grid h-8 w-8 shrink-0 place-items-center rounded-[7px] bg-white text-[11px] font-bold',
                                            event.kind === 'schedule' ? 'text-main-1' : 'text-[#2468B2]',
                                        )}
                                    >
                                        {formatCompactDate(event.date)}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-[12px] font-semibold text-sub-1">{event.title}</span>
                                        <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-gray-3">
                                            <span
                                                className={cn(
                                                    'h-1.5 w-1.5 shrink-0 rounded-full',
                                                    event.kind === 'schedule' ? 'bg-main-1' : 'bg-[#3182F6]',
                                                )}
                                                aria-hidden="true"
                                            />
                                            <span className="truncate">{event.meta}</span>
                                        </span>
                                    </span>
                                    {event.kind === 'schedule' && canEditSchedule(event.schedule) ? (
                                        <Pencil className="size-3.5 shrink-0 text-gray-4" aria-hidden="true" />
                                    ) : null}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}

function DeadlineCalendarSkeleton() {
    const calendarCells = Array.from({length: 35});
    const weekdayLabels = getWeekdayLabels();

    return (
        <aside
            role="status"
            aria-busy="true"
            aria-label={boardT('state.loadingTitle')}
            data-testid="board-deadline-calendar-skeleton"
            className="min-w-0 rounded-[8px] bg-white p-3"
        >
            <div className="grid gap-4">
                <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <Skeleton className="h-3 w-20 rounded-full bg-gray-6" />
                            <Skeleton className="mt-2 h-5 w-28 rounded-full bg-gray-6" />
                        </div>
                        <div className="flex items-center gap-1">
                            <Skeleton className="h-7 w-7 rounded-[7px] bg-main-4" />
                            <Skeleton className="h-7 w-7 rounded-[7px] bg-gray-6" />
                            <Skeleton className="h-7 w-7 rounded-[7px] bg-gray-6" />
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold text-gray-4">
                        {weekdayLabels.map((dayLabel) => (
                            <span key={dayLabel} className="h-5 leading-5">
                                {dayLabel}
                            </span>
                        ))}
                    </div>
                    <div className="mt-1 grid grid-cols-7 gap-0.5">
                        {calendarCells.map((_, index) => (
                            <div key={index} className="grid aspect-square place-items-center rounded-[7px] bg-gray-7">
                                <Skeleton
                                    className={cn('size-5 rounded-full', index % 7 === 2 || index % 11 === 0 ? 'bg-main-4' : 'bg-gray-6')}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="min-w-0">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24 rounded-full bg-gray-6" />
                        <Skeleton className="h-3 w-9 rounded-full bg-gray-6" />
                    </div>
                    <div className="mt-2.5 space-y-1.5">
                        {Array.from({length: 3}).map((_, index) => (
                            <div key={index} className="flex w-full items-center gap-2 rounded-[8px] bg-gray-7 px-2.5 py-2">
                                <Skeleton className="h-8 w-8 shrink-0 rounded-[7px] bg-white" />
                                <span className="min-w-0 flex-1">
                                    <Skeleton className="h-3.5 w-8/12 rounded-full bg-gray-6" />
                                    <Skeleton className="mt-2 h-2.5 w-6/12 rounded-full bg-gray-6/80" />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}

function BoardPage() {
    useTypedTranslation();

    const {
        state: {wardId, accountId, accountMeStatus, _loaded, isAuth},
        actions: {handleGetAccountMe},
    } = useAuth();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const today = new Date();
    const notificationPostId = useMemo(() => {
        const value = Number(searchParams.get('postId'));

        return Number.isFinite(value) && value > 0 ? value : null;
    }, [searchParams]);
    const notificationCalendarDate = useMemo(() => {
        const value = searchParams.get('calendarDate');

        if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

        return Number.isNaN(parseDateKey(value).getTime()) ? null : value;
    }, [searchParams]);
    const [keywordInput, setKeywordInput] = useState('');
    const [keyword, setKeyword] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [postDraft, setPostDraft] = useState<TCreateWardBoardPostDTO>(initialPostDraft);
    const [postDraftSubmitAttempted, setPostDraftSubmitAttempted] = useState(false);
    const [postImageAttachments, setPostImageAttachments] = useState<TPostImageAttachment[]>([]);
    const [postImageError, setPostImageError] = useState('');
    const [isPostImageReading, setIsPostImageReading] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
    const [commentDraft, setCommentDraft] = useState('');
    const [replyDraft, setReplyDraft] = useState('');
    const [replyingCommentId, setReplyingCommentId] = useState<number | null>(null);
    const [calendarMonth, setCalendarMonth] = useState({year: today.getFullYear(), month: today.getMonth() + 1});
    const [scheduleModalMode, setScheduleModalMode] = useState<TScheduleModalMode | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<TWardBoardSchedule | null>(null);
    const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);
    const [scheduleDraft, setScheduleDraft] = useState<TScheduleDraft>(() => createInitialScheduleDraft());
    const [scheduleDraftSubmitAttempted, setScheduleDraftSubmitAttempted] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
    const postImageInputRef = useRef<HTMLInputElement>(null);
    const postTitleInputRef = useRef<HTMLInputElement>(null);
    const postContentTextareaRef = useRef<HTMLTextAreaElement>(null);
    const {startDate, endDate} = useMemo(() => getMonthBounds(calendarMonth.year, calendarMonth.month), [calendarMonth]);
    const isSearchVisible = isSearchOpen || Boolean(keyword);
    const activeWardId = wardId;
    const bootstrapPending = !_loaded || (isAuth && wardId === null && (accountMeStatus === 'idle' || accountMeStatus === 'loading'));
    const bootstrapError = isAuth && wardId === null && accountMeStatus === 'error';
    const postsQuery = useQuery({
        queryKey: activeWardId ? boardQueryKeys.posts(activeWardId, keyword) : boardQueryKeys.posts(0, keyword),
        queryFn: () => BoardAPI.getPosts(activeWardId!, {size: POST_PAGE_SIZE, keyword}),
        enabled: Boolean(activeWardId),
    });
    const selectedPostQuery = useQuery({
        queryKey: activeWardId && selectedPostId ? boardQueryKeys.post(activeWardId, selectedPostId) : boardQueryKeys.post(0, 0),
        queryFn: () => BoardAPI.getPost(activeWardId!, selectedPostId!),
        enabled: Boolean(activeWardId && selectedPostId),
    });
    const commentsQuery = useQuery({
        queryKey: activeWardId && selectedPostId ? boardQueryKeys.comments(activeWardId, selectedPostId) : boardQueryKeys.comments(0, 0),
        queryFn: () => BoardAPI.getComments(activeWardId!, selectedPostId!, {size: 50}),
        enabled: Boolean(activeWardId && selectedPostId),
    });
    const checkersQuery = useQuery({
        queryKey: activeWardId && selectedPostId ? boardQueryKeys.checkers(activeWardId, selectedPostId) : boardQueryKeys.checkers(0, 0),
        queryFn: () => BoardAPI.getCheckers(activeWardId!, selectedPostId!),
        enabled: Boolean(activeWardId && selectedPostId),
    });
    const deadlinesQuery = useQuery({
        queryKey: activeWardId
            ? boardQueryKeys.deadlines(activeWardId, calendarMonth.year, calendarMonth.month)
            : boardQueryKeys.deadlines(0, 0, 0),
        queryFn: () => BoardAPI.getDeadlines(activeWardId!, startDate, endDate),
        enabled: Boolean(activeWardId),
    });
    const schedulesQuery = useQuery({
        queryKey: activeWardId
            ? boardQueryKeys.schedules(activeWardId, calendarMonth.year, calendarMonth.month)
            : boardQueryKeys.schedules(0, 0, 0),
        queryFn: () => BoardAPI.getSchedules(activeWardId!, startDate, endDate),
        enabled: Boolean(activeWardId),
    });

    useEffect(() => {
        if (!notificationPostId || selectedPostId === notificationPostId) return;

        setIsComposerOpen(false);
        setSelectedPostId(notificationPostId);
    }, [notificationPostId, selectedPostId]);

    useEffect(() => {
        if (!notificationCalendarDate) return;

        const date = parseDateKey(notificationCalendarDate);

        setCalendarMonth({year: date.getFullYear(), month: date.getMonth() + 1});
    }, [notificationCalendarDate]);

    const posts = postsQuery.data?.posts ?? [];
    const schedules = schedulesQuery.data ?? [];
    const selectedPost = selectedPostQuery.data ?? posts.find((post) => getPostId(post) === selectedPostId) ?? null;
    const comments = commentsQuery.data?.comments ?? [];
    const checkers = checkersQuery.data?.checkers ?? [];
    const isPostTitleInvalid = postDraftSubmitAttempted && !postDraft.title.trim();
    const isPostContentInvalid = postDraftSubmitAttempted && !postDraft.content.trim();

    useEffect(() => {
        if (!isSearchVisible) return;

        searchInputRef.current?.focus();
    }, [isSearchVisible]);

    useEffect(() => {
        resizeTextareaToContent(commentTextareaRef.current);
    }, [commentDraft]);

    useEffect(() => {
        if (!isComposerOpen) return;

        resizeTextareaToContent(postContentTextareaRef.current);
    }, [isComposerOpen, postDraft.content]);

    useEffect(() => {
        setPreviewImageUrl(null);
    }, [selectedPostId, isComposerOpen]);

    useEffect(() => {
        if (!previewImageUrl) return undefined;

        const handleKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Escape') {
                setPreviewImageUrl(null);
            }
        };
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [previewImageUrl]);

    useEffect(() => {
        if (!scheduleModalMode) return undefined;

        const handleKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Escape') {
                setScheduleModalMode(null);
                setSelectedSchedule(null);
                setEditingScheduleId(null);
                setScheduleDraftSubmitAttempted(false);
            }
        };
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [scheduleModalMode]);

    const invalidateSelectedPost = async (postId: number) => {
        if (!activeWardId) return;

        await Promise.all([
            queryClient.invalidateQueries({queryKey: boardQueryKeys.postsRoot(activeWardId)}),
            queryClient.invalidateQueries({queryKey: boardQueryKeys.post(activeWardId, postId)}),
            queryClient.invalidateQueries({queryKey: boardQueryKeys.checkers(activeWardId, postId)}),
        ]);
    };
    const createPostMutation = useMutation({
        mutationFn: (draft: TCreateWardBoardPostDTO) => BoardAPI.createPost(activeWardId!, draft),
        onSuccess: async (post) => {
            if (!activeWardId) return;

            const postId = getPostId(post);

            setPostDraft(initialPostDraft);
            setPostDraftSubmitAttempted(false);
            setPostImageAttachments([]);
            setPostImageError('');

            if (postImageInputRef.current) postImageInputRef.current.value = '';

            setIsComposerOpen(false);
            setSelectedPostId(postId || null);
            await Promise.all([
                queryClient.invalidateQueries({queryKey: boardQueryKeys.postsRoot(activeWardId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.deadlinesRoot(activeWardId)}),
            ]);
        },
    });
    const deletePostMutation = useMutation({
        mutationFn: (postId: number) => BoardAPI.deletePost(activeWardId!, postId),
        onSuccess: async (_data, postId) => {
            if (!activeWardId) return;

            setPreviewImageUrl(null);
            setSelectedPostId(null);
            setIsComposerOpen(false);
            queryClient.removeQueries({queryKey: boardQueryKeys.post(activeWardId, postId)});
            await Promise.all([
                queryClient.invalidateQueries({queryKey: boardQueryKeys.postsRoot(activeWardId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.deadlinesRoot(activeWardId)}),
            ]);
        },
    });
    const createScheduleMutation = useMutation({
        mutationFn: (draft: TCreateWardBoardScheduleDTO) => BoardAPI.createSchedule(activeWardId!, draft),
        onSuccess: async () => {
            if (!activeWardId) return;

            setScheduleModalMode(null);
            setSelectedSchedule(null);
            setEditingScheduleId(null);
            setScheduleDraft(createInitialScheduleDraft());
            setScheduleDraftSubmitAttempted(false);
            await queryClient.invalidateQueries({queryKey: boardQueryKeys.schedulesRoot(activeWardId)});
        },
    });
    const updateScheduleMutation = useMutation({
        mutationFn: ({scheduleId, draft}: {scheduleId: number; draft: TUpdateWardBoardScheduleDTO}) =>
            BoardAPI.updateSchedule(activeWardId!, scheduleId, draft),
        onSuccess: async () => {
            if (!activeWardId) return;

            setScheduleModalMode(null);
            setSelectedSchedule(null);
            setEditingScheduleId(null);
            setScheduleDraft(createInitialScheduleDraft());
            setScheduleDraftSubmitAttempted(false);
            await queryClient.invalidateQueries({queryKey: boardQueryKeys.schedulesRoot(activeWardId)});
        },
    });
    const deleteScheduleMutation = useMutation({
        mutationFn: (scheduleId: number) => BoardAPI.deleteSchedule(activeWardId!, scheduleId),
        onSuccess: async () => {
            if (!activeWardId) return;

            setScheduleModalMode(null);
            setSelectedSchedule(null);
            setEditingScheduleId(null);
            setScheduleDraft(createInitialScheduleDraft());
            setScheduleDraftSubmitAttempted(false);
            await queryClient.invalidateQueries({queryKey: boardQueryKeys.schedulesRoot(activeWardId)});
        },
    });
    const likeMutation = useMutation({
        mutationFn: (post: TWardBoardPost) => {
            const postId = getPostId(post);

            return post.isLikedByMe ? BoardAPI.unlikePost(activeWardId!, postId) : BoardAPI.likePost(activeWardId!, postId);
        },
        onSuccess: async (_data, post) => {
            await invalidateSelectedPost(getPostId(post));
        },
    });
    const checkMutation = useMutation({
        mutationFn: (post: TWardBoardPost) => {
            const postId = getPostId(post);

            return post.isCheckedByMe ? BoardAPI.uncheckPost(activeWardId!, postId) : BoardAPI.checkPost(activeWardId!, postId);
        },
        onSuccess: async (_data, post) => {
            await invalidateSelectedPost(getPostId(post));
        },
    });
    const createCommentMutation = useMutation({
        mutationFn: (content: string) => BoardAPI.createComment(activeWardId!, selectedPostId!, {content}),
        onSuccess: async () => {
            if (!activeWardId || !selectedPostId) return;

            setCommentDraft('');
            await Promise.all([
                queryClient.invalidateQueries({queryKey: boardQueryKeys.comments(activeWardId, selectedPostId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.post(activeWardId, selectedPostId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.postsRoot(activeWardId)}),
            ]);
        },
    });
    const createReplyMutation = useMutation({
        mutationFn: ({commentId, content}: {commentId: number; content: string}) =>
            BoardAPI.createReply(activeWardId!, commentId, {content}),
        onSuccess: async () => {
            if (!activeWardId || !selectedPostId) return;

            setReplyDraft('');
            setReplyingCommentId(null);
            await Promise.all([
                queryClient.invalidateQueries({queryKey: boardQueryKeys.comments(activeWardId, selectedPostId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.post(activeWardId, selectedPostId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.postsRoot(activeWardId)}),
            ]);
        },
    });
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: number) => BoardAPI.deleteComment(activeWardId!, commentId),
        onMutate: (commentId) => {
            setDeletingCommentId(commentId);
        },
        onSuccess: async (_data, commentId) => {
            if (!activeWardId || !selectedPostId) return;

            if (replyingCommentId === commentId) {
                setReplyingCommentId(null);
                setReplyDraft('');
            }

            await Promise.all([
                queryClient.invalidateQueries({queryKey: boardQueryKeys.comments(activeWardId, selectedPostId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.post(activeWardId, selectedPostId)}),
                queryClient.invalidateQueries({queryKey: boardQueryKeys.postsRoot(activeWardId)}),
            ]);
        },
        onSettled: () => {
            setDeletingCommentId(null);
        },
    });
    const isScheduleBusy = createScheduleMutation.isPending || updateScheduleMutation.isPending || deleteScheduleMutation.isPending;
    const closeScheduleModal = () => {
        if (isScheduleBusy) return;

        setScheduleModalMode(null);
        setSelectedSchedule(null);
        setEditingScheduleId(null);
        setScheduleDraftSubmitAttempted(false);
    };
    const openCreateSchedule = (dateKey = getDefaultScheduleDateForMonth(calendarMonth.year, calendarMonth.month)) => {
        setScheduleDraft(createInitialScheduleDraft(dateKey));
        setScheduleDraftSubmitAttempted(false);
        setSelectedSchedule(null);
        setEditingScheduleId(null);
        setScheduleModalMode('create');
    };
    const openSchedule = (schedule: TWardBoardSchedule) => {
        const scheduleId = getScheduleId(schedule);
        const startDate = getScheduleStartDate(schedule);
        const endDate = getScheduleEndDate(schedule);
        const allDay = getScheduleAllDay(schedule);

        if (!scheduleId) return;

        setScheduleDraft({
            title: schedule.title,
            content: schedule.content ?? '',
            startDate,
            endDate,
            allDay,
            startTime: allDay ? '' : normalizeTimeInput(getScheduleStartTime(schedule)),
            endTime: allDay ? '' : normalizeTimeInput(getScheduleEndTime(schedule)),
        });
        setScheduleDraftSubmitAttempted(false);
        setSelectedSchedule(schedule);
        setEditingScheduleId(scheduleId);
        setScheduleModalMode('view');
    };
    const openEditSchedule = () => {
        if (!selectedSchedule || !canEditSchedule(selectedSchedule)) return;

        setScheduleDraftSubmitAttempted(false);
        setScheduleModalMode('edit');
    };
    const handleSubmitSchedule = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (scheduleModalMode === 'view') return;

        setScheduleDraftSubmitAttempted(true);

        const payload = toSchedulePayload(scheduleDraft);

        if (!payload.title || !payload.scheduleDate || !scheduleDraft.endDate) return;

        if (compareDateKey(scheduleDraft.endDate, scheduleDraft.startDate) < 0) return;

        if (!scheduleDraft.allDay && (!scheduleDraft.startTime || !scheduleDraft.endTime)) return;

        if (
            !scheduleDraft.allDay &&
            scheduleDraft.startDate === scheduleDraft.endDate &&
            scheduleDraft.startTime &&
            scheduleDraft.endTime &&
            scheduleDraft.startTime >= scheduleDraft.endTime
        ) {
            return;
        }

        if (scheduleModalMode === 'edit') {
            if (!editingScheduleId) return;

            updateScheduleMutation.mutate({scheduleId: editingScheduleId, draft: payload});

            return;
        }

        createScheduleMutation.mutate(payload);
    };
    const handleDeleteSchedule = () => {
        if (!editingScheduleId || !selectedSchedule || !canDeleteSchedule(selectedSchedule)) return;

        if (!globalThis.confirm(boardT('confirm.deleteSchedule'))) return;

        deleteScheduleMutation.mutate(editingScheduleId);
    };
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setKeyword(keywordInput.trim());
    };
    const handleToggleSearch = () => {
        if (isSearchVisible && !keyword && !keywordInput.trim()) {
            setIsSearchOpen(false);

            return;
        }

        setIsSearchOpen(true);
    };
    const clearSearch = () => {
        setKeyword('');
        setKeywordInput('');
        searchInputRef.current?.focus();
    };
    const handleDeletePost = (post: TWardBoardPost) => {
        const postId = getPostId(post);

        if (!post.isMine || !postId) return;

        if (!globalThis.confirm(boardT('confirm.deletePost'))) return;

        deletePostMutation.mutate(postId);
    };
    const handleDeleteComment = (commentId: number) => {
        if (!commentId) return;

        if (!globalThis.confirm(boardT('confirm.deleteComment'))) return;

        deleteCommentMutation.mutate(commentId);
    };
    const handleSelectPostImages = async (files: FileList | null) => {
        const selectedFiles = Array.from(files ?? []);

        if (postImageInputRef.current) postImageInputRef.current.value = '';

        if (!selectedFiles.length) return;

        const availableCount = POST_IMAGE_MAX_COUNT - postImageAttachments.length;

        if (availableCount <= 0) {
            setPostImageError(boardT('composer.maxImageCount', {count: POST_IMAGE_MAX_COUNT}));

            return;
        }

        const nextFiles = selectedFiles.slice(0, availableCount);
        const validFiles: File[] = [];

        let nextError = selectedFiles.length > availableCount ? boardT('composer.maxImageCount', {count: POST_IMAGE_MAX_COUNT}) : '';

        nextFiles.forEach((file) => {
            if (!file.type.startsWith('image/')) {
                nextError = boardT('composer.imageOnly');

                return;
            }

            if (file.size > POST_IMAGE_MAX_SIZE_BYTES) {
                nextError = boardT('composer.maxImageSize', {size: POST_IMAGE_MAX_SIZE_MB});

                return;
            }

            validFiles.push(file);
        });

        if (!validFiles.length) {
            setPostImageError(nextError);

            return;
        }

        setIsPostImageReading(true);
        setPostImageError(nextError);

        try {
            const attachments = await Promise.all(
                validFiles.map(async (file) => ({
                    id: createClientId(),
                    name: file.name,
                    size: file.size,
                    url: await readFileAsDataUrl(file),
                })),
            );

            setPostImageAttachments((current) => [...current, ...attachments].slice(0, POST_IMAGE_MAX_COUNT));
        } catch {
            setPostImageError(boardT('composer.imageReadFailed'));
        } finally {
            setIsPostImageReading(false);
        }
    };
    const handleRemovePostImage = (attachmentId: string) => {
        setPostImageAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId));
        setPostImageError('');
    };
    const handleCreatePost = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPostDraftSubmitAttempted(true);

        if (isPostImageReading) return;

        const title = postDraft.title.trim();
        const content = postDraft.content.trim();

        if (!title) {
            postTitleInputRef.current?.focus();

            return;
        }

        if (!content) {
            postContentTextareaRef.current?.focus();

            return;
        }

        createPostMutation.mutate({
            title,
            content,
            imageUrls: postImageAttachments.map((attachment) => attachment.url),
            deadlineDate: postDraft.deadlineDate?.length ? postDraft.deadlineDate : undefined,
        });
    };
    const handleCreateComment = () => {
        const content = commentDraft.trim();

        if (!content || !selectedPostId) return;

        createCommentMutation.mutate(content);
    };
    const handleCommentKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (!isSubmitEnter(event)) return;

        event.preventDefault();

        if (canSubmitComment && !createCommentMutation.isPending) {
            handleCreateComment();
        }
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
        if (activeWardId) {
            void postsQuery.refetch();
            void deadlinesQuery.refetch();
            void schedulesQuery.refetch();

            return;
        }

        void handleGetAccountMe().catch(() => undefined);
    };
    const canSubmitComment = commentDraft.trim().length > 0 && Boolean(selectedPostId);
    const isCommentBusy = createCommentMutation.isPending || createReplyMutation.isPending;
    const boardTutorialMode: TBoardTutorialMode = isComposerOpen ? 'composer' : selectedPost ? 'detail' : 'list';

    if (bootstrapPending) {
        return (
            <div className="flex h-full w-full items-center justify-center px-8">
                <PageState
                    tone="loading"
                    title={boardT('state.loadingTitle')}
                    description={boardT('state.loadingDescription')}
                    className="py-0"
                />
            </div>
        );
    }

    if (bootstrapError) {
        return (
            <div className="flex h-full w-full items-center justify-center px-8">
                <PageState
                    tone="error"
                    title={boardT('state.wardLoadFailedTitle')}
                    description={boardT('state.retryDescription')}
                    action={{label: boardT('state.retry'), onClick: retry}}
                    className="py-0"
                />
            </div>
        );
    }

    if (!activeWardId) {
        return (
            <div className="flex h-full w-full items-center justify-center px-8">
                <PageState
                    tone="empty"
                    title={boardT('state.noWardTitle')}
                    description={boardT('state.noWardDescription')}
                    className="py-0"
                />
            </div>
        );
    }

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-[1520px] min-w-[1120px] flex-col bg-main-bg px-4 py-4 font-apple sm:px-5 sm:py-5 lg:px-6 lg:py-6 2xl:px-10 2xl:py-7">
            <div className="min-w-0">
                <h1 className="text-[28px] font-semibold text-sub-1 sm:text-[32px]">{boardT('title')}</h1>
                <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <p className="min-w-0 text-[14px] leading-6 text-gray-3">{boardT('description')}</p>
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            id="board_create_button"
                            type="button"
                            className="inline-flex h-10 items-center justify-center rounded-[8px] bg-sub-1 px-4 text-[14px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#3A3A42]"
                            onClick={() => {
                                setPostDraftSubmitAttempted(false);
                                setIsComposerOpen(true);
                                setSelectedPostId(null);
                            }}
                        >
                            <Plus className="mr-1.5 size-4" aria-hidden="true" />
                            {boardT('common.write')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-3 grid min-h-0 flex-1 grid-cols-[minmax(260px,0.7fr)_minmax(460px,1.35fr)_minmax(280px,320px)] gap-4">
                <section
                    id="board_post_list"
                    className="flex min-h-[360px] min-w-0 flex-col rounded-[8px] bg-white p-3 sm:min-h-[420px] lg:min-h-[520px]"
                >
                    <div className="mb-2 flex items-center justify-between px-1">
                        <h2 className="text-[15px] font-semibold text-sub-1">{boardT('list.title')}</h2>
                        <button
                            id="board_search_button"
                            type="button"
                            className={cn(
                                'grid h-8 w-8 place-items-center rounded-[8px] transition-colors',
                                isSearchVisible ? 'bg-gray-7 text-sub-1' : 'text-gray-4 hover:bg-gray-7 hover:text-sub-1',
                            )}
                            onClick={handleToggleSearch}
                            aria-label={boardT('list.searchAria')}
                            title={boardT('list.searchAria')}
                            aria-expanded={isSearchVisible}
                        >
                            <Search className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                    {isSearchVisible ? (
                        <form onSubmit={handleSearch} className="mb-2 px-1">
                            <div className="flex h-11 items-center rounded-[12px] bg-gray-7 px-3 transition-colors focus-within:bg-[#F2F4F6]">
                                <Search className="size-4 shrink-0 text-gray-4" aria-hidden="true" />
                                <input
                                    ref={searchInputRef}
                                    value={keywordInput}
                                    onChange={(event) => setKeywordInput(event.target.value)}
                                    placeholder={boardT('list.searchPlaceholder')}
                                    className="min-w-0 flex-1 bg-transparent px-2 text-[14px] font-medium text-sub-1 outline-none placeholder:text-gray-4"
                                />
                                {keywordInput || keyword ? (
                                    <button
                                        type="button"
                                        className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gray-6 text-gray-4 transition-colors hover:bg-gray-5 hover:text-sub-1"
                                        onClick={clearSearch}
                                        aria-label={boardT('list.clearSearch')}
                                        title={boardT('list.clearSearch')}
                                    >
                                        <X className="size-3.5" aria-hidden="true" />
                                    </button>
                                ) : null}
                            </div>
                        </form>
                    ) : null}
                    {postsQuery.isPending ? (
                        <PostListSkeleton />
                    ) : postsQuery.isError ? (
                        <PageState
                            tone="error"
                            title={boardT('list.loadFailed')}
                            description={boardT('state.retryDescription')}
                            action={{label: boardT('state.retry'), onClick: () => void postsQuery.refetch()}}
                            className="py-0"
                        />
                    ) : posts.length === 0 ? (
                        <PageState
                            tone="empty"
                            title={boardT('list.empty')}
                            className="px-0 py-0 sm:px-0"
                            contentClassName="px-1 sm:px-1"
                            titleClassName="mx-auto max-w-full text-center text-[15px] break-normal whitespace-nowrap"
                        />
                    ) : (
                        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                            {posts.map((post) => {
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

                <section className="min-h-[420px] min-w-0 rounded-[8px] bg-white p-4 sm:min-h-[520px] sm:p-5">
                    {isComposerOpen ? (
                        <form id="board_composer_panel" className="flex h-full min-h-0 flex-col" onSubmit={handleCreatePost} noValidate>
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-gray-3">{boardT('composer.newPost')}</p>
                                    <h2 className="mt-1 text-[22px] font-semibold text-sub-1 sm:text-[24px]">
                                        {boardT('composer.shareTitle')}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    className="grid h-9 w-9 place-items-center rounded-[8px] text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1"
                                    onClick={() => {
                                        setPostDraftSubmitAttempted(false);
                                        setIsComposerOpen(false);
                                    }}
                                    aria-label={boardT('composer.closeAria')}
                                    title={boardT('composer.closeAria')}
                                >
                                    <X className="size-4" aria-hidden="true" />
                                </button>
                            </div>

                            <div className="mt-5 grid gap-4">
                                <div id="board_composer_required_fields" className="grid gap-4">
                                    <label className="grid gap-1.5">
                                        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-sub-2">
                                            {boardT('composer.title')}
                                            <span className="h-[3px] w-[3px] rounded-full bg-[#E85D75]" aria-hidden="true" />
                                        </span>
                                        <input
                                            ref={postTitleInputRef}
                                            value={postDraft.title}
                                            onChange={(event) => setPostDraft((current) => ({...current, title: event.target.value}))}
                                            maxLength={100}
                                            aria-required="true"
                                            aria-invalid={isPostTitleInvalid}
                                            className={cn(
                                                'h-11 w-full rounded-[8px] bg-gray-7 px-3.5 text-[15px] text-sub-1 ring-1 transition outline-none focus:bg-white',
                                                isPostTitleInvalid
                                                    ? 'bg-white ring-[#E85D75] focus:ring-[#E85D75]'
                                                    : 'ring-transparent focus:ring-main-3',
                                            )}
                                            placeholder={boardT('composer.titlePlaceholder')}
                                        />
                                    </label>
                                    <label className="grid gap-1.5">
                                        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-sub-2">
                                            {boardT('composer.content')}
                                            <span className="h-[3px] w-[3px] rounded-full bg-[#E85D75]" aria-hidden="true" />
                                        </span>
                                        <textarea
                                            ref={postContentTextareaRef}
                                            value={postDraft.content}
                                            onChange={(event) => setPostDraft((current) => ({...current, content: event.target.value}))}
                                            maxLength={POST_CONTENT_MAX_LENGTH}
                                            aria-required="true"
                                            aria-invalid={isPostContentInvalid}
                                            className={cn(
                                                'min-h-[180px] w-full resize-none overflow-hidden rounded-[8px] bg-gray-7 px-3.5 py-3 text-[15px] leading-6 text-sub-1 ring-1 transition outline-none focus:bg-white sm:min-h-[220px]',
                                                isPostContentInvalid
                                                    ? 'bg-white ring-[#E85D75] focus:ring-[#E85D75]'
                                                    : 'ring-transparent focus:ring-main-3',
                                            )}
                                            placeholder={boardT('composer.contentPlaceholder')}
                                        />
                                        <span className="justify-self-end text-[11px] font-medium text-gray-4">
                                            {postDraft.content.length}/{POST_CONTENT_MAX_LENGTH}
                                        </span>
                                    </label>
                                </div>
                                <div id="board_composer_options" className="grid gap-4">
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-[13px] font-semibold text-sub-2">{boardT('composer.image')}</span>
                                            <span className="font-poppins text-[11px] font-semibold text-gray-4">
                                                {postImageAttachments.length}/{POST_IMAGE_MAX_COUNT}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {postImageAttachments.map((attachment) => (
                                                <div
                                                    key={attachment.id}
                                                    className="group relative h-20 w-20 overflow-hidden rounded-[8px] bg-gray-7"
                                                >
                                                    <img src={attachment.url} alt="" className="h-full w-full object-cover" />
                                                    <button
                                                        type="button"
                                                        className="absolute top-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/70"
                                                        onClick={() => handleRemovePostImage(attachment.id)}
                                                        aria-label={boardT('common.removeNamed', {name: attachment.name})}
                                                        title={boardT('common.removeNamed', {name: attachment.name})}
                                                    >
                                                        <X className="size-3" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            ))}
                                            {postImageAttachments.length < POST_IMAGE_MAX_COUNT ? (
                                                <button
                                                    type="button"
                                                    className="flex h-20 min-w-20 flex-col items-center justify-center gap-1 rounded-[8px] bg-gray-7 px-3 text-gray-3 transition-colors hover:bg-[#F2F4F6] hover:text-sub-1 disabled:cursor-not-allowed disabled:opacity-50"
                                                    onClick={() => postImageInputRef.current?.click()}
                                                    disabled={isPostImageReading}
                                                >
                                                    <ImagePlus className="size-5" strokeWidth={1.8} aria-hidden="true" />
                                                    <span className="text-[12px] font-semibold">
                                                        {isPostImageReading ? boardT('composer.addingImage') : boardT('common.add')}
                                                    </span>
                                                </button>
                                            ) : null}
                                        </div>
                                        <input
                                            ref={postImageInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(event) => void handleSelectPostImages(event.currentTarget.files)}
                                        />
                                        <div className="flex items-center justify-between gap-3 text-[11px] font-medium">
                                            <span className={postImageError ? 'text-[#E85D75]' : 'text-gray-4'}>
                                                {postImageError ||
                                                    boardT('composer.imageLimit', {
                                                        count: POST_IMAGE_MAX_COUNT,
                                                        size: POST_IMAGE_MAX_SIZE_MB,
                                                    })}
                                            </span>
                                        </div>
                                    </div>
                                    <DeadlinePicker
                                        value={postDraft.deadlineDate}
                                        onChange={(deadlineDate) => setPostDraft((current) => ({...current, deadlineDate}))}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    id="board_composer_submit"
                                    type="submit"
                                    className="h-10 w-full rounded-[8px] bg-main-1 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-main-1-hover disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                                    disabled={createPostMutation.isPending || isPostImageReading}
                                >
                                    {boardT('common.submit')}
                                </button>
                            </div>
                        </form>
                    ) : selectedPostQuery.isPending && selectedPostId && !selectedPost ? (
                        <BoardDetailSkeleton />
                    ) : selectedPost ? (
                        <div id="board_detail_panel" className="flex h-full min-h-0 flex-col">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    {selectedPost.isNotice ? (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex h-6 items-center rounded-full bg-[#EDF6FF] px-2.5 text-[12px] font-semibold text-[#2468B2]">
                                                {boardT('common.notice')}
                                            </span>
                                        </div>
                                    ) : null}
                                    <h2
                                        className={cn(
                                            'text-[22px] leading-8 font-semibold break-words text-sub-1 sm:text-[26px]',
                                            selectedPost.isNotice ? 'mt-3' : undefined,
                                        )}
                                    >
                                        {selectedPost.title}
                                    </h2>
                                    <p className="mt-2 text-[13px] font-medium text-gray-3">
                                        {getAuthorName(selectedPost)} · {formatDateTime(selectedPost.createdAt)}
                                    </p>
                                </div>
                                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                                    {selectedPost.deadlineDate ? (
                                        <div className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-gray-7 px-3 text-[12px] font-semibold text-sub-1">
                                            <Clock3 className="size-3.5 text-main-1" aria-hidden="true" />
                                            <span className="text-gray-3">{boardT('deadline.label')}</span>
                                            <span>{formatDate(selectedPost.deadlineDate)}</span>
                                        </div>
                                    ) : null}
                                    {selectedPost.isMine ? (
                                        <button
                                            type="button"
                                            className="grid h-8 w-8 place-items-center rounded-[8px] text-[#D8495F] transition-colors hover:bg-[#FFF1F3] hover:text-[#B93249] disabled:cursor-not-allowed disabled:opacity-40"
                                            disabled={deletePostMutation.isPending}
                                            onClick={() => handleDeletePost(selectedPost)}
                                            aria-label={boardT('detail.deletePost')}
                                            title={boardT('detail.deletePost')}
                                        >
                                            <Trash2 className="size-4" aria-hidden="true" />
                                        </button>
                                    ) : null}
                                </div>
                            </div>

                            <div id="board_post_actions" className="mt-5 flex flex-wrap items-center gap-4">
                                <button
                                    type="button"
                                    className={cn(
                                        'inline-flex h-7 items-center gap-1.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                                        selectedPost.isLikedByMe ? 'text-red' : 'text-gray-3 hover:text-red',
                                    )}
                                    onClick={() => likeMutation.mutate(selectedPost)}
                                    disabled={likeMutation.isPending}
                                    aria-label={selectedPost.isLikedByMe ? boardT('detail.unlike') : boardT('detail.like')}
                                    title={selectedPost.isLikedByMe ? boardT('detail.unlike') : boardT('detail.like')}
                                >
                                    <Heart
                                        className="size-4"
                                        fill={selectedPost.isLikedByMe ? 'currentColor' : 'none'}
                                        aria-hidden="true"
                                    />
                                    {selectedPost.likeCount ?? 0}
                                </button>
                                <button
                                    type="button"
                                    className={cn(
                                        'inline-flex h-7 items-center gap-1.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                                        selectedPost.isCheckedByMe ? 'text-[#217A43]' : 'text-gray-3 hover:text-[#217A43]',
                                    )}
                                    onClick={() => checkMutation.mutate(selectedPost)}
                                    disabled={checkMutation.isPending}
                                    aria-label={selectedPost.isCheckedByMe ? boardT('detail.uncheck') : boardT('detail.check')}
                                    title={selectedPost.isCheckedByMe ? boardT('detail.uncheck') : boardT('detail.check')}
                                >
                                    {selectedPost.isCheckedByMe ? (
                                        <span
                                            className="grid size-4 place-items-center rounded-full bg-[#217A43] text-white"
                                            aria-hidden="true"
                                        >
                                            <Check className="size-3" strokeWidth={3} />
                                        </span>
                                    ) : (
                                        <CheckCircle2 className="size-4" aria-hidden="true" />
                                    )}
                                    {selectedPost.checkCount ?? 0}
                                </button>
                                <span className="inline-flex h-7 items-center gap-1.5 text-[13px] font-semibold text-gray-3">
                                    <Eye className="size-4" aria-hidden="true" />
                                    {selectedPost.viewCount ?? 0}
                                </span>
                            </div>

                            <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
                                <article className="text-[15px] leading-7 whitespace-pre-line text-sub-2">{selectedPost.content}</article>

                                {selectedPost.imageUrls?.length ? (
                                    <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {selectedPost.imageUrls.map((imageUrl, index) => (
                                            <button
                                                key={`${imageUrl}-${index}`}
                                                type="button"
                                                className="group overflow-hidden rounded-[8px] bg-gray-7 text-left transition outline-none focus-visible:ring-2 focus-visible:ring-main-3"
                                                onClick={() => setPreviewImageUrl(imageUrl)}
                                                aria-label={boardT('detail.attachedImagePreview', {index: index + 1})}
                                                title={boardT('detail.imagePreview')}
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt=""
                                                    className="aspect-video w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                                                    loading="lazy"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                ) : null}

                                {checkers.length > 0 ? (
                                    <div className="mt-6 rounded-[8px] bg-gray-7 px-4 py-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="grid size-4 place-items-center rounded-full bg-[#217A43] text-white"
                                                    aria-hidden="true"
                                                >
                                                    <Check className="size-3" strokeWidth={3} />
                                                </span>
                                                <span className="text-[14px] font-semibold text-sub-1">
                                                    {boardT('detail.checkedPeople', {count: selectedPost.checkCount ?? 0})}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {checkers.slice(0, 12).map((checker) => (
                                                <span
                                                    key={`${checker.accountId ?? checker.name}-${checker.name}`}
                                                    className="inline-flex h-7 items-center rounded-full bg-white px-2.5 text-[12px] font-semibold text-sub-2"
                                                >
                                                    {checker.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[15px] font-semibold text-sub-1">
                                            {boardT('comment.title', {count: selectedPost.commentCount ?? 0})}
                                        </h3>
                                    </div>
                                    <div
                                        id="board_comment_form"
                                        className="mt-2 flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-start"
                                    >
                                        <textarea
                                            ref={commentTextareaRef}
                                            value={commentDraft}
                                            onChange={(event) => setCommentDraft(event.target.value)}
                                            onKeyDown={handleCommentKeyDown}
                                            placeholder={boardT('comment.placeholder')}
                                            rows={1}
                                            className="min-h-12 min-w-0 flex-1 resize-none overflow-hidden rounded-[8px] bg-gray-7 px-3 py-[14px] text-[13px] leading-5 text-sub-1 ring-1 ring-transparent transition outline-none ring-inset focus:bg-white focus:ring-main-3"
                                        />
                                        <button
                                            type="button"
                                            className="inline-flex h-12 w-12 items-center justify-center rounded-[8px] bg-sub-1 px-0 text-[12px] font-semibold text-white transition-colors hover:bg-[#3A3A42] disabled:cursor-not-allowed disabled:opacity-40"
                                            disabled={!canSubmitComment || createCommentMutation.isPending}
                                            onClick={handleCreateComment}
                                        >
                                            {boardT('common.submit')}
                                        </button>
                                    </div>

                                    <div className="mt-3">
                                        {commentsQuery.isPending ? (
                                            <CommentThreadSkeleton />
                                        ) : comments.length > 0 ? (
                                            <CommentThread
                                                comments={comments}
                                                replyingCommentId={replyingCommentId}
                                                replyDraft={replyDraft}
                                                disabled={isCommentBusy}
                                                deletingCommentId={deletingCommentId}
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
                                                onDeleteComment={handleDeleteComment}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[320px] items-center justify-center sm:min-h-[480px]">
                            <PageState
                                tone="empty"
                                title={boardT('detail.selectPost')}
                                className="py-0"
                                visual={
                                    <img
                                        src="/img/board-empty-nurse.png"
                                        alt=""
                                        aria-hidden="true"
                                        draggable={false}
                                        className="h-auto w-[153px] object-contain"
                                    />
                                }
                            />
                        </div>
                    )}
                </section>

                <div id="board_deadline_calendar" className="min-w-0">
                    {deadlinesQuery.isPending || schedulesQuery.isPending ? (
                        <DeadlineCalendarSkeleton />
                    ) : (
                        <DeadlineCalendar
                            year={calendarMonth.year}
                            month={calendarMonth.month}
                            selectedDateKey={notificationCalendarDate}
                            deadlines={deadlinesQuery.data ?? []}
                            schedules={schedules}
                            onMoveMonth={moveCalendarMonth}
                            onSelectPost={(postId) => {
                                setIsComposerOpen(false);
                                setSelectedPostId(postId);
                            }}
                            onCreateSchedule={openCreateSchedule}
                            onOpenSchedule={openSchedule}
                        />
                    )}
                </div>
            </div>
            {scheduleModalMode ? (
                <WardScheduleModal
                    mode={scheduleModalMode}
                    draft={scheduleDraft}
                    submitAttempted={scheduleDraftSubmitAttempted}
                    disabled={createScheduleMutation.isPending || updateScheduleMutation.isPending}
                    deleting={deleteScheduleMutation.isPending}
                    onChange={setScheduleDraft}
                    onSubmit={handleSubmitSchedule}
                    onClose={closeScheduleModal}
                    onEdit={
                        scheduleModalMode === 'view' && selectedSchedule && canEditSchedule(selectedSchedule) ? openEditSchedule : undefined
                    }
                    onDelete={
                        scheduleModalMode === 'edit' && selectedSchedule && canDeleteSchedule(selectedSchedule)
                            ? handleDeleteSchedule
                            : undefined
                    }
                />
            ) : null}
            <BoardTutorial
                accountId={accountId}
                canStart={postsQuery.isSuccess && deadlinesQuery.isSuccess && schedulesQuery.isSuccess && !previewImageUrl}
                mode={boardTutorialMode}
            />
            {previewImageUrl ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
                    role="dialog"
                    aria-modal="true"
                    aria-label={boardT('detail.imagePreview')}
                    onClick={() => setPreviewImageUrl(null)}
                >
                    <div className="relative max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-sub-1 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-colors hover:bg-white"
                            onClick={() => setPreviewImageUrl(null)}
                            aria-label={boardT('detail.closeImage')}
                            title={boardT('detail.closeImage')}
                        >
                            <X className="size-4" aria-hidden="true" />
                        </button>
                        <img
                            src={previewImageUrl}
                            alt=""
                            className="max-h-[82vh] max-w-full rounded-[8px] bg-white object-contain shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default BoardPage;
