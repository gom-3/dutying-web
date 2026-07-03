import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {ReactNode} from 'react';
import {MemoryRouter} from 'react-router';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import BoardPage from '..';

const {
    mockUseAuth,
    mockGetPosts,
    mockGetDeadlines,
    mockGetSchedules,
    mockGetPostId,
    mockGetScheduleId,
    mockCreatePost,
    mockDeletePost,
    mockCreateSchedule,
    mockUpdateSchedule,
    mockDeleteSchedule,
    mockLikePost,
    mockUnlikePost,
    mockCheckPost,
    mockUncheckPost,
    mockGetPost,
    mockGetComments,
    mockGetCheckers,
    mockCreateComment,
    mockCreateReply,
    mockDeleteComment,
} = vi.hoisted(() => ({
    mockUseAuth: vi.fn(),
    mockGetPosts: vi.fn(),
    mockGetDeadlines: vi.fn(),
    mockGetSchedules: vi.fn(),
    mockGetPostId: vi.fn(),
    mockGetScheduleId: vi.fn(),
    mockCreatePost: vi.fn(),
    mockDeletePost: vi.fn(),
    mockCreateSchedule: vi.fn(),
    mockUpdateSchedule: vi.fn(),
    mockDeleteSchedule: vi.fn(),
    mockLikePost: vi.fn(),
    mockUnlikePost: vi.fn(),
    mockCheckPost: vi.fn(),
    mockUncheckPost: vi.fn(),
    mockGetPost: vi.fn(),
    mockGetComments: vi.fn(),
    mockGetCheckers: vi.fn(),
    mockCreateComment: vi.fn(),
    mockCreateReply: vi.fn(),
    mockDeleteComment: vi.fn(),
}));

vi.mock('@/features/auth', () => ({
    default: () => mockUseAuth(),
}));

vi.mock('@/shared/api', () => ({
    BoardAPI: {
        getPosts: mockGetPosts,
        getPost: mockGetPost,
        getComments: mockGetComments,
        getCheckers: mockGetCheckers,
        getDeadlines: mockGetDeadlines,
        getSchedules: mockGetSchedules,
        createPost: mockCreatePost,
        deletePost: mockDeletePost,
        createSchedule: mockCreateSchedule,
        updateSchedule: mockUpdateSchedule,
        deleteSchedule: mockDeleteSchedule,
        likePost: mockLikePost,
        unlikePost: mockUnlikePost,
        checkPost: mockCheckPost,
        uncheckPost: mockUncheckPost,
        createComment: mockCreateComment,
        createReply: mockCreateReply,
        deleteComment: mockDeleteComment,
        getPostId: mockGetPostId,
        getScheduleId: mockGetScheduleId,
    },
}));

vi.mock('../ui/board-tutorial', () => ({
    BoardTutorial: () => null,
}));

function renderPage(children: ReactNode, initialEntry = '/') {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </MemoryRouter>,
    );
}

describe('BoardPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({
            state: {
                wardId: 287,
                accountId: 1,
                accountMeStatus: 'success',
                _loaded: true,
                isAuth: true,
            },
            actions: {
                handleGetAccountMe: vi.fn(),
            },
        });
        mockGetPosts.mockResolvedValue({posts: [], hasNext: false});
        mockGetDeadlines.mockResolvedValue([]);
        mockGetSchedules.mockResolvedValue([]);
        mockGetPost.mockResolvedValue(null);
        mockGetComments.mockResolvedValue({comments: []});
        mockGetCheckers.mockResolvedValue({checkers: [], checkedUserNames: []});
        mockGetPostId.mockImplementation((post: {postId?: number; id?: number}) => post.postId ?? post.id ?? 0);
        mockGetScheduleId.mockImplementation((schedule: {scheduleId?: number; id?: number}) => schedule.scheduleId ?? schedule.id ?? 0);
    });

    it('shows common board skeletons while the board data is loading', () => {
        mockGetPosts.mockReturnValue(new Promise(() => undefined));
        mockGetDeadlines.mockReturnValue(new Promise(() => undefined));
        mockGetSchedules.mockReturnValue(new Promise(() => undefined));

        renderPage(<BoardPage />);

        expect(screen.getByTestId('board-post-list-skeleton')).toBeInTheDocument();
        expect(screen.getByTestId('board-deadline-calendar-skeleton')).toBeInTheDocument();
    });

    it('matches the backend post content length contract in the composer', async () => {
        const user = userEvent.setup();
        const {container} = renderPage(<BoardPage />);

        await waitFor(() => expect(mockGetPosts).toHaveBeenCalled());
        await user.click(container.querySelector<HTMLButtonElement>('#board_create_button')!);

        const contentTextarea = container.querySelector<HTMLTextAreaElement>('#board_composer_required_fields textarea');

        expect(contentTextarea).not.toBeNull();
        expect(contentTextarea).toHaveAttribute('maxLength', '5000');
    });

    it('shows post list engagement metrics only when they have counts, except views', async () => {
        mockGetPosts.mockResolvedValue({
            posts: [
                {
                    postId: 1,
                    title: 'zero metrics',
                    content: 'plain body',
                    writerName: 'writer',
                    viewCount: 0,
                    likeCount: 0,
                    checkCount: 0,
                    commentCount: 0,
                },
                {
                    postId: 2,
                    title: 'active metrics',
                    content: 'plain body',
                    writerName: 'writer',
                    viewCount: 7,
                    likeCount: 2,
                    checkCount: 3,
                    commentCount: 4,
                },
            ],
            hasNext: false,
        });

        renderPage(<BoardPage />);

        const zeroMetricsPost = (await screen.findByText('zero metrics')).closest('button');
        const activeMetricsPost = (await screen.findByText('active metrics')).closest('button');

        expect(zeroMetricsPost).not.toBeNull();
        expect(activeMetricsPost).not.toBeNull();

        expect(zeroMetricsPost!.querySelectorAll('svg')).toHaveLength(1);
        expect(within(zeroMetricsPost!).getByText('0')).toHaveClass('text-gray-3');

        expect(activeMetricsPost!.querySelectorAll('svg')).toHaveLength(4);
        expect(within(activeMetricsPost!).getByText('7')).toHaveClass('text-gray-3');
        expect(within(activeMetricsPost!).getByText('2')).toHaveClass('text-red');
        expect(within(activeMetricsPost!).getByText('3')).toHaveClass('text-[#217A43]');
        expect(within(activeMetricsPost!).getByText('4')).toHaveClass('text-main-1');
    });

    it('marks today on the ward calendar', async () => {
        const today = new Date();
        const todayLabel = `${today.getMonth() + 1}월 ${today.getDate()}일 일정 0건`;

        renderPage(<BoardPage />);

        const todayCell = await screen.findByRole('button', {name: todayLabel});
        const todayBadge = within(todayCell).getByText(String(today.getDate()));

        expect(todayCell).toHaveAttribute('aria-current', 'date');
        expect(todayBadge).toHaveClass('rounded-full', 'bg-[#3182F6]', 'text-white');
    });

    it('creates an all-day ward schedule spanning multiple days', async () => {
        const user = userEvent.setup();
        const tomorrow = new Date();

        tomorrow.setDate(tomorrow.getDate() + 1);

        const threeDaysLater = new Date();

        threeDaysLater.setDate(threeDaysLater.getDate() + 3);

        const tomorrowKey = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(
            tomorrow.getDate(),
        ).padStart(2, '0')}`;
        const threeDaysLaterKey = `${threeDaysLater.getFullYear()}-${String(threeDaysLater.getMonth() + 1).padStart(2, '0')}-${String(
            threeDaysLater.getDate(),
        ).padStart(2, '0')}`;

        mockCreateSchedule.mockResolvedValue({
            scheduleId: 1,
            title: '신규 교육',
            content: '',
            scheduleDate: tomorrowKey,
            startDate: tomorrowKey,
            endDate: threeDaysLaterKey,
            allDay: true,
        });

        renderPage(<BoardPage />);

        await user.click(await screen.findByRole('button', {name: '병동 일정 등록'}));

        const dialog = await screen.findByRole('dialog', {name: '병동 일정 등록'});

        await user.type(within(dialog).getByPlaceholderText('제목을 입력하세요'), '신규 교육');
        await user.click(within(dialog).getByRole('button', {name: /시작일/}));
        await user.click(within(dialog).getByRole('button', {name: '내일'}));
        await user.click(within(dialog).getByRole('button', {name: /종료일/}));
        await user.click(within(dialog).getByRole('button', {name: '3일 후'}));
        await user.click(within(dialog).getByRole('button', {name: '등록'}));

        await waitFor(() =>
            expect(mockCreateSchedule).toHaveBeenCalledWith(287, {
                title: '신규 교육',
                content: undefined,
                scheduleDate: tomorrowKey,
                startDate: tomorrowKey,
                endDate: threeDaysLaterKey,
                allDay: true,
                isAllDay: true,
                startTime: null,
                endTime: null,
            }),
        );
    });

    it('keeps only the latest opened schedule date picker visible', async () => {
        const user = userEvent.setup();

        renderPage(<BoardPage />);

        await user.click(await screen.findByRole('button', {name: '병동 일정 등록'}));

        const dialog = await screen.findByRole('dialog', {name: '병동 일정 등록'});

        await user.click(within(dialog).getByRole('button', {name: /시작일/}));

        expect(within(dialog).getByText('일정 시작일')).toBeInTheDocument();

        await user.click(within(dialog).getByRole('button', {name: /종료일/}));

        expect(within(dialog).queryByText('일정 시작일')).not.toBeInTheDocument();
        expect(within(dialog).getByText('일정 종료일')).toBeInTheDocument();
    });

    it('creates a timed ward schedule with required start and end times', async () => {
        const user = userEvent.setup();

        mockCreateSchedule.mockResolvedValue({
            scheduleId: 2,
            title: '인수인계',
            content: '',
            scheduleDate: '2026-06-06',
            startDate: '2026-06-06',
            endDate: '2026-06-06',
            allDay: false,
            startTime: '09:00',
            endTime: '10:00',
        });

        renderPage(<BoardPage />);

        await user.click(await screen.findByRole('button', {name: '병동 일정 등록'}));

        const dialog = await screen.findByRole('dialog', {name: '병동 일정 등록'});

        await user.type(within(dialog).getByPlaceholderText('제목을 입력하세요'), '인수인계');
        await user.click(within(dialog).getByLabelText('종일'));
        await user.click(within(dialog).getByRole('button', {name: '등록'}));

        await waitFor(() =>
            expect(mockCreateSchedule).toHaveBeenCalledWith(
                287,
                expect.objectContaining({
                    title: '인수인계',
                    allDay: false,
                    isAllDay: false,
                    startTime: '09:00',
                    endTime: '10:00',
                }),
            ),
        );
    });

    it('opens an existing ward schedule in view mode before allowing edit', async () => {
        const user = userEvent.setup();
        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(
            2,
            '0',
        )}`;

        mockGetSchedules.mockResolvedValue([
            {
                scheduleId: 42,
                title: '정기 회의',
                content: 'A팀 회의',
                scheduleDate: todayKey,
                startDate: todayKey,
                endDate: todayKey,
                allDay: false,
                startTime: '09:00:00',
                endTime: '10:00:00',
                editableByMe: true,
                deletableByMe: true,
            },
        ]);

        renderPage(<BoardPage />);

        const scheduleButton = (await screen.findByText('정기 회의')).closest('button');

        expect(scheduleButton).not.toBeNull();

        await user.click(scheduleButton!);

        const viewDialog = await screen.findByRole('dialog', {name: '병동 일정 보기'});

        expect(within(viewDialog).getByRole('heading', {name: '정기 회의'})).toBeInTheDocument();
        expect(within(viewDialog).queryByText('제목')).not.toBeInTheDocument();
        expect(within(viewDialog).getByText('날짜 및 시간')).toBeInTheDocument();
        expect(within(viewDialog).getByText('09:00-10:00')).toBeInTheDocument();
        expect(within(viewDialog).queryByText('종일')).not.toBeInTheDocument();
        expect(within(viewDialog).queryByRole('button', {name: '수정'})).not.toBeInTheDocument();

        await user.click(within(viewDialog).getByRole('button', {name: '병동 일정 수정'}));

        const editDialog = await screen.findByRole('dialog', {name: '병동 일정 수정'});

        await user.click(within(editDialog).getByRole('button', {name: '수정'}));

        await waitFor(() =>
            expect(mockUpdateSchedule).toHaveBeenCalledWith(287, 42, {
                title: '정기 회의',
                content: 'A팀 회의',
                scheduleDate: todayKey,
                startDate: todayKey,
                endDate: todayKey,
                allDay: false,
                isAllDay: false,
                startTime: '09:00',
                endTime: '10:00',
            }),
        );
    });

    it('shows all-day multi-day schedules clearly in the view modal', async () => {
        const user = userEvent.setup();
        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(
            2,
            '0',
        )}`;
        const tomorrow = new Date(today);

        tomorrow.setDate(tomorrow.getDate() + 1);

        const tomorrowKey = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(
            tomorrow.getDate(),
        ).padStart(2, '0')}`;

        mockGetSchedules.mockResolvedValue([
            {
                scheduleId: 43,
                title: '종일 워크숍',
                content: '',
                scheduleDate: todayKey,
                startDate: todayKey,
                endDate: tomorrowKey,
                isAllDay: true,
                startTime: null,
                endTime: null,
                editableByMe: true,
                deletableByMe: true,
            },
        ]);

        renderPage(<BoardPage />);

        const scheduleButton = (await screen.findByText('종일 워크숍')).closest('button');

        expect(scheduleButton).not.toBeNull();

        await user.click(scheduleButton!);

        const viewDialog = await screen.findByRole('dialog', {name: '병동 일정 보기'});

        expect(within(viewDialog).getByRole('heading', {name: '종일 워크숍'})).toBeInTheDocument();
        expect(within(viewDialog).getByText('날짜 및 시간')).toBeInTheDocument();
        expect(within(viewDialog).getByText('종일')).toBeInTheDocument();
        expect(within(viewDialog).queryByText('시간 미정')).not.toBeInTheDocument();
    });

    it('keeps all-day checked when the backend returns snake_case all-day fields', async () => {
        const user = userEvent.setup();
        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(
            2,
            '0',
        )}`;

        mockGetSchedules.mockResolvedValue([
            {
                scheduleId: 44,
                title: '종일 교육',
                content: '',
                scheduleDate: todayKey,
                start_date: todayKey,
                end_date: todayKey,
                all_day: 'true',
                start_time: null,
                end_time: null,
                editable_by_me: 1,
                deletable_by_me: 1,
            },
        ]);

        renderPage(<BoardPage />);

        const scheduleButton = (await screen.findByText('종일 교육')).closest('button');

        expect(scheduleButton).not.toBeNull();

        await user.click(scheduleButton!);

        const viewDialog = await screen.findByRole('dialog', {name: '병동 일정 보기'});

        expect(within(viewDialog).getByText('종일')).toBeInTheDocument();

        await user.click(within(viewDialog).getByRole('button', {name: '병동 일정 수정'}));

        const editDialog = await screen.findByRole('dialog', {name: '병동 일정 수정'});

        expect(within(editDialog).getByLabelText('종일')).toBeChecked();
    });
});
