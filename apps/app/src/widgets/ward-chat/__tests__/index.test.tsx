import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {ReactNode} from 'react';
import {beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import WardChatWidget from '../index';

const wardApiMock = vi.hoisted(() => ({
    createWardChatMessage: vi.fn(),
    getWardChatMessages: vi.fn(),
    getWardChatUnreadCount: vi.fn(),
    readWardChat: vi.fn(),
}));

vi.mock('@/features/auth', () => ({
    default: () => ({
        state: {
            accountId: 100,
            isDemoExpired: false,
            wardId: 1,
        },
    }),
}));

vi.mock('@/shared/api', () => ({
    WardAPI: wardApiMock,
}));

function renderWithQueryClient(children: ReactNode) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return render(<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);
}

describe('WardChatWidget', () => {
    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        wardApiMock.getWardChatUnreadCount.mockResolvedValue({moimId: 1, wardId: 1, unreadCount: 5});
        wardApiMock.getWardChatMessages.mockResolvedValue({
            messages: [
                {
                    messageId: 1,
                    moimId: 1,
                    wardId: 1,
                    senderAccountId: 101,
                    senderName: '수간호사',
                    text: '오늘 신규 입원 2명 예정입니다.',
                    sentAt: '2026-05-25T04:56:01.462Z',
                    isDeleted: false,
                },
            ],
            nextCursorMessageId: null,
            lastReadMessageId: 0,
            unreadCount: 5,
        });
        wardApiMock.readWardChat.mockResolvedValue(undefined);
        wardApiMock.createWardChatMessage.mockResolvedValue({
            messageId: 2,
            moimId: 1,
            wardId: 1,
            senderAccountId: 100,
            senderName: '나',
            text: '확인했습니다.',
            sentAt: '2026-05-25T04:57:01.462Z',
            isDeleted: false,
        });
    });

    it('shows the floating button with unread count', async () => {
        renderWithQueryClient(<WardChatWidget />);

        expect(await screen.findByRole('button', {name: '병동톡 열기, 읽지 않은 메시지 5개'})).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('opens messages and sends a chat message', async () => {
        const user = userEvent.setup();

        renderWithQueryClient(<WardChatWidget />);

        await user.click(await screen.findByRole('button', {name: '병동톡 열기, 읽지 않은 메시지 5개'}));

        expect(await screen.findByText('오늘 신규 입원 2명 예정입니다.')).toBeInTheDocument();
        await waitFor(() => expect(wardApiMock.readWardChat).toHaveBeenCalledWith(1, {lastReadMessageId: 1}));

        await user.type(screen.getByPlaceholderText('메시지 입력'), '확인했습니다.');
        await user.click(screen.getByRole('button', {name: '메시지 보내기'}));

        await waitFor(() =>
            expect(wardApiMock.createWardChatMessage).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    text: '확인했습니다.',
                }),
            ),
        );
        expect(await screen.findByText('확인했습니다.')).toBeInTheDocument();
    });
});
