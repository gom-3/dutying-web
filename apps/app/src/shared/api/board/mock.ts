import type {TCreateWardBoardPostDTO, TWardBoardChecker, TWardBoardComment, TWardBoardDeadline, TWardBoardPost} from './index';

type TMockBoardState = {
    posts: TWardBoardPost[];
    commentsByPostId: Record<number, TWardBoardComment[]>;
    checkersByPostId: Record<number, TWardBoardChecker[]>;
    nextPostId: number;
    nextCommentId: number;
};

export const MOCK_BOARD_WARD_ID = 9999;

const MOCK_CURRENT_USER = {
    accountId: 1000,
    name: '나',
};
const pad2 = (value: number) => value.toString().padStart(2, '0');
const toDateKey = (date: Date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
const addDays = (date: Date, days: number) => {
    const nextDate = new Date(date);

    nextDate.setDate(nextDate.getDate() + days);

    return nextDate;
};
const toIsoOffset = (days: number, hours: number) => {
    const date = addDays(new Date(), days);

    date.setHours(hours, 0, 0, 0);

    return date.toISOString();
};
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const getPostId = (post: TWardBoardPost) => post.postId ?? post.id ?? 0;
const getCommentId = (comment: TWardBoardComment) => comment.commentId ?? comment.id ?? 0;
const countComments = (comments: TWardBoardComment[]): number =>
    comments.reduce((sum, comment) => sum + 1 + countComments(comment.replies ?? []), 0);
const createComment = (
    commentId: number,
    content: string,
    authorName: string,
    createdAt: string,
    replies: TWardBoardComment[] = [],
): TWardBoardComment => ({
    id: commentId,
    commentId,
    content,
    authorName,
    isMine: authorName === MOCK_CURRENT_USER.name,
    createdAt,
    modifiedAt: createdAt,
    replies,
});

function createInitialState(): TMockBoardState {
    const today = new Date();
    const todayKey = toDateKey(today);
    const tomorrowKey = toDateKey(addDays(today, 1));
    const threeDaysLaterKey = toDateKey(addDays(today, 3));
    const nextWeekKey = toDateKey(addDays(today, 7));
    const overdueKey = toDateKey(addDays(today, -1));
    const posts: TWardBoardPost[] = [
        {
            id: 101,
            postId: 101,
            title: '6월 병동 감염관리 교육 일정 안내',
            content:
                '다음 주 화요일 15:00에 감염관리 교육이 진행됩니다.\n\n전 직원 참석 대상이며, 야간 근무자는 녹화본 확인 후 체크 부탁드려요.',
            authorName: '수간호사 김서연',
            writerName: '수간호사 김서연',
            createdAt: toIsoOffset(-1, 9),
            modifiedAt: toIsoOffset(-1, 9),
            isMine: false,
            isNotice: true,
            viewCount: 48,
            likeCount: 11,
            isLikedByMe: false,
            checkCount: 4,
            isCheckedByMe: false,
            checkedUserNames: ['박하은', '이유진', '최민서', '정서윤'],
            commentCount: 2,
            deadlineDate: threeDaysLaterKey,
        },
        {
            id: 102,
            postId: 102,
            title: '이번 달 희망 휴무 최종 확인 요청',
            content: '근무표 확정 전 마지막 확인입니다.\n\n누락된 희망 휴무나 교대 요청이 있으면 오늘 안으로 댓글에 남겨 주세요.',
            authorName: '듀티 담당 이지현',
            writerName: '듀티 담당 이지현',
            createdAt: toIsoOffset(0, 8),
            modifiedAt: toIsoOffset(0, 8),
            isMine: false,
            isNotice: false,
            viewCount: 32,
            likeCount: 6,
            isLikedByMe: true,
            checkCount: 2,
            isCheckedByMe: false,
            checkedUserNames: ['문서아', '윤다인'],
            commentCount: 3,
            deadlineDate: todayKey,
        },
        {
            id: 103,
            postId: 103,
            title: '신규 입사자 프리셉터 배정 공유',
            content:
                '다음 주부터 신규 입사자 2명이 병동에 합류합니다.\n\nA팀은 김민지 선생님, B팀은 오하린 선생님이 프리셉터로 함께해 주세요.',
            authorName: '교육 담당 박소영',
            writerName: '교육 담당 박소영',
            createdAt: toIsoOffset(-2, 14),
            modifiedAt: toIsoOffset(-2, 14),
            isMine: false,
            isNotice: false,
            viewCount: 27,
            likeCount: 9,
            isLikedByMe: false,
            checkCount: 5,
            isCheckedByMe: true,
            checkedUserNames: ['나', '김민지', '오하린', '정서윤', '한지우'],
            commentCount: 1,
            deadlineDate: nextWeekKey,
        },
        {
            id: 104,
            postId: 104,
            title: '물품실 정리 담당 순번표',
            content: '물품실 재고 위치가 조금 바뀌었습니다.\n\n이번 주는 E팀, 다음 주는 N팀 순서로 정리 담당을 맡아 주세요.',
            authorName: '차지 간호사 한지우',
            writerName: '차지 간호사 한지우',
            createdAt: toIsoOffset(-4, 11),
            modifiedAt: toIsoOffset(-4, 11),
            isMine: false,
            isNotice: false,
            viewCount: 19,
            likeCount: 3,
            isLikedByMe: false,
            checkCount: 0,
            isCheckedByMe: false,
            checkedUserNames: [],
            commentCount: 0,
        },
        {
            id: 105,
            postId: 105,
            title: '낙상 고위험 환자 라운딩 체크',
            content: '낙상 고위험 환자 라운딩 체크리스트가 업데이트되었습니다.\n\n각 듀티 인계 전 체크리스트 완료 여부를 확인해 주세요.',
            authorName: 'QA 담당 백하늘',
            writerName: 'QA 담당 백하늘',
            createdAt: toIsoOffset(-3, 16),
            modifiedAt: toIsoOffset(-3, 16),
            isMine: false,
            isNotice: false,
            viewCount: 41,
            likeCount: 7,
            isLikedByMe: false,
            checkCount: 1,
            isCheckedByMe: false,
            checkedUserNames: ['김가은'],
            commentCount: 1,
            deadlineDate: overdueKey,
        },
        {
            id: 106,
            postId: 106,
            title: '휴게실 커피머신 점검 완료',
            content: '커피머신 점검이 끝났습니다. 물통과 캡슐함 비움만 함께 챙겨 주세요.',
            authorName: '총무 정서윤',
            writerName: '총무 정서윤',
            createdAt: toIsoOffset(-5, 10),
            modifiedAt: toIsoOffset(-5, 10),
            isMine: false,
            isNotice: false,
            viewCount: 13,
            likeCount: 2,
            isLikedByMe: false,
            checkCount: 0,
            isCheckedByMe: false,
            checkedUserNames: [],
            commentCount: 0,
            deadlineDate: tomorrowKey,
        },
    ];
    const commentsByPostId: TMockBoardState['commentsByPostId'] = {
        101: [
            createComment(1001, '야간 근무자는 교육 자료 링크도 같이 공유되나요?', '오하린', toIsoOffset(-1, 10), [
                createComment(1002, '네, 교육 당일 오전에 링크 올려둘게요.', '수간호사 김서연', toIsoOffset(-1, 11)),
            ]),
        ],
        102: [
            createComment(1003, '16일 N 근무 교대 가능하신 분 있으면 알려 주세요.', '반예진', toIsoOffset(0, 9)),
            createComment(1004, '저는 18일 D 희망 휴무 누락되어 확인 부탁드려요.', '차유나', toIsoOffset(0, 10), [
                createComment(1005, '확인했어요. 반영해 둘게요.', '듀티 담당 이지현', toIsoOffset(0, 11)),
            ]),
        ],
        103: [createComment(1006, '신규 선생님 환영 준비 같이 챙기겠습니다.', '김민지', toIsoOffset(-2, 15))],
        105: [createComment(1007, '업데이트된 체크리스트 파일도 게시판에 올려 주세요.', '박하은', toIsoOffset(-3, 17))],
    };
    const checkersByPostId: TMockBoardState['checkersByPostId'] = {
        101: [
            {accountId: 11, name: '박하은'},
            {accountId: 12, name: '이유진'},
            {accountId: 13, name: '최민서'},
            {accountId: 14, name: '정서윤'},
        ],
        102: [
            {accountId: 21, name: '문서아'},
            {accountId: 22, name: '윤다인'},
        ],
        103: [
            {accountId: MOCK_CURRENT_USER.accountId, name: MOCK_CURRENT_USER.name},
            {accountId: 31, name: '김민지'},
            {accountId: 32, name: '오하린'},
            {accountId: 33, name: '정서윤'},
            {accountId: 34, name: '한지우'},
        ],
        105: [{accountId: 41, name: '김가은'}],
    };

    return {
        posts,
        commentsByPostId,
        checkersByPostId,
        nextPostId: 107,
        nextCommentId: 1008,
    };
}

class MockBoardAPI {
    private state: TMockBoardState = createInitialState();

    private findPost(postId: number) {
        return this.state.posts.find((post) => getPostId(post) === postId);
    }

    private syncPostCounts(postId: number) {
        const post = this.findPost(postId);

        if (!post) return;

        const comments = this.state.commentsByPostId[postId] ?? [];
        const checkers = this.state.checkersByPostId[postId] ?? [];

        post.commentCount = countComments(comments);
        post.checkCount = checkers.length;
        post.checkedUserNames = checkers.map((checker) => checker.name);
        post.isCheckedByMe = checkers.some((checker) => checker.accountId === MOCK_CURRENT_USER.accountId);
    }

    private findComment(comments: TWardBoardComment[], commentId: number): TWardBoardComment | null {
        for (const comment of comments) {
            if (getCommentId(comment) === commentId) return comment;

            const reply = this.findComment(comment.replies ?? [], commentId);

            if (reply) return reply;
        }

        return null;
    }

    private removeComment(comments: TWardBoardComment[], commentId: number): {comments: TWardBoardComment[]; removed: boolean} {
        let removed = false;

        const nextComments = comments
            .filter((comment) => {
                const shouldRemove = getCommentId(comment) === commentId;

                if (shouldRemove) removed = true;

                return !shouldRemove;
            })
            .map((comment) => {
                const result = this.removeComment(comment.replies ?? [], commentId);

                if (result.removed) removed = true;

                return {
                    ...comment,
                    replies: result.comments,
                };
            });

        return {comments: nextComments, removed};
    }

    public async getPosts(_wardId: number, options?: {cursorId?: number; size?: number; keyword?: string}) {
        const keyword = options?.keyword?.trim().toLowerCase() ?? '';
        const size = options?.size ?? this.state.posts.length;
        const cursorId = options?.cursorId ?? Number.MAX_SAFE_INTEGER;
        const filteredPosts = this.state.posts
            .filter((post) => getPostId(post) < cursorId)
            .filter((post) => {
                if (!keyword) return true;

                return [post.title, post.content, post.writerName, post.authorName].some((value) => value?.toLowerCase().includes(keyword));
            })
            .sort((left, right) => {
                if (left.isNotice !== right.isNotice) return left.isNotice ? -1 : 1;

                return new Date(right.createdAt ?? '').getTime() - new Date(left.createdAt ?? '').getTime();
            });
        const posts = filteredPosts.slice(0, size);

        return {
            posts: clone(posts),
            nextCursorId: undefined,
            hasNext: filteredPosts.length > posts.length,
        };
    }

    public async getPost(_wardId: number, postId: number) {
        const post = this.findPost(postId);

        if (!post) {
            throw new Error('게시글을 찾을 수 없어요.');
        }

        return clone(post);
    }

    public async createPost(_wardId: number, post: TCreateWardBoardPostDTO) {
        const postId = this.state.nextPostId++;
        const createdAt = new Date().toISOString();
        const nextPost: TWardBoardPost = {
            id: postId,
            postId,
            title: post.title,
            content: post.content,
            authorName: MOCK_CURRENT_USER.name,
            writerName: MOCK_CURRENT_USER.name,
            createdAt,
            modifiedAt: createdAt,
            isMine: true,
            isNotice: false,
            viewCount: 0,
            likeCount: 0,
            isLikedByMe: false,
            checkCount: 0,
            isCheckedByMe: false,
            checkedUserNames: [],
            imageUrls: post.imageUrls ?? [],
            commentCount: 0,
            deadlineDate: post.deadlineDate,
        };

        this.state.posts = [nextPost, ...this.state.posts];
        this.state.commentsByPostId[postId] = [];
        this.state.checkersByPostId[postId] = [];

        return clone(nextPost);
    }

    public async deletePost(_wardId: number, postId: number) {
        this.state.posts = this.state.posts.filter((post) => getPostId(post) !== postId);
        delete this.state.commentsByPostId[postId];
        delete this.state.checkersByPostId[postId];
    }

    public async likePost(_wardId: number, postId: number) {
        const post = this.findPost(postId);

        if (!post || post.isLikedByMe) return;

        post.isLikedByMe = true;
        post.likeCount = (post.likeCount ?? 0) + 1;
    }

    public async unlikePost(_wardId: number, postId: number) {
        const post = this.findPost(postId);

        if (!post?.isLikedByMe) return;

        post.isLikedByMe = false;
        post.likeCount = Math.max(0, (post.likeCount ?? 0) - 1);
    }

    public async checkPost(_wardId: number, postId: number) {
        const checkers = this.state.checkersByPostId[postId] ?? [];

        if (checkers.some((checker) => checker.accountId === MOCK_CURRENT_USER.accountId)) return;

        this.state.checkersByPostId[postId] = [...checkers, MOCK_CURRENT_USER];
        this.syncPostCounts(postId);
    }

    public async uncheckPost(_wardId: number, postId: number) {
        const checkers = this.state.checkersByPostId[postId] ?? [];

        this.state.checkersByPostId[postId] = checkers.filter((checker) => checker.accountId !== MOCK_CURRENT_USER.accountId);
        this.syncPostCounts(postId);
    }

    public async getCheckers(_wardId: number, postId: number) {
        const checkers = this.state.checkersByPostId[postId] ?? [];

        return {
            checkers: clone(checkers),
            checkedUserNames: checkers.map((checker) => checker.name),
        };
    }

    public async getComments(_wardId: number, postId: number, options?: {cursorId?: number; size?: number}) {
        const cursorId = options?.cursorId ?? Number.MAX_SAFE_INTEGER;
        const size = options?.size ?? Number.MAX_SAFE_INTEGER;
        const comments = (this.state.commentsByPostId[postId] ?? []).filter((comment) => getCommentId(comment) < cursorId).slice(0, size);

        return {
            comments: clone(comments),
            nextCursorId: undefined,
        };
    }

    public async createComment(_wardId: number, postId: number, comment: {content: string}) {
        const createdAt = new Date().toISOString();
        const nextComment = createComment(this.state.nextCommentId++, comment.content, MOCK_CURRENT_USER.name, createdAt);

        this.state.commentsByPostId[postId] = [nextComment, ...(this.state.commentsByPostId[postId] ?? [])];
        this.syncPostCounts(postId);

        return clone(nextComment);
    }

    public async deleteComment(_wardId: number, commentId: number) {
        for (const [postId, comments] of Object.entries(this.state.commentsByPostId)) {
            const result = this.removeComment(comments, commentId);

            if (!result.removed) continue;

            this.state.commentsByPostId[Number(postId)] = result.comments;
            this.syncPostCounts(Number(postId));

            return;
        }
    }

    public async createReply(_wardId: number, commentId: number, comment: {content: string}) {
        const createdAt = new Date().toISOString();
        const nextReply = createComment(this.state.nextCommentId++, comment.content, MOCK_CURRENT_USER.name, createdAt);

        for (const [postId, comments] of Object.entries(this.state.commentsByPostId)) {
            const parent = this.findComment(comments, commentId);

            if (!parent) continue;

            parent.replies = [...(parent.replies ?? []), nextReply];
            this.syncPostCounts(Number(postId));

            return clone(nextReply);
        }

        throw new Error('댓글을 찾을 수 없어요.');
    }

    public async getDeadlines(_wardId: number, startDate: string, endDate: string) {
        const deadlines: TWardBoardDeadline[] = this.state.posts
            .filter((post) => Boolean(post.deadlineDate) && post.deadlineDate! >= startDate && post.deadlineDate! <= endDate)
            .map((post) => ({
                postId: getPostId(post),
                postTitle: post.title,
                deadlineDate: post.deadlineDate!,
                writerName: post.writerName ?? post.authorName,
            }))
            .sort((left, right) => left.deadlineDate.localeCompare(right.deadlineDate));

        return clone(deadlines);
    }

    public getPostId(post: TWardBoardPost) {
        return getPostId(post);
    }
}

export default new MockBoardAPI();
