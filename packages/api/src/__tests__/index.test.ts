import {describe, expect, it, vi} from 'vitest';
import type {IApiClient} from '../client';
import {createAccountApi, createNurseApi, createWardApi} from '../index';

const createClient = (): IApiClient => ({
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
});

describe('@dutying/api public entry', () => {
    it('exposes the package factories from the root export', () => {
        expect(createAccountApi).toBeTypeOf('function');
        expect(createNurseApi).toBeTypeOf('function');
        expect(createWardApi).toBeTypeOf('function');
    });

    it('keeps account and ward factories callable through the package root', async () => {
        const client = createClient();
        const getMock = client.get as ReturnType<typeof vi.fn>;
        const postMock = client.post as ReturnType<typeof vi.fn>;

        getMock.mockResolvedValueOnce({data: {accountId: 12}});
        postMock.mockResolvedValueOnce({data: undefined});

        const accountApi = createAccountApi(client);
        const wardApi = createWardApi(client);

        await expect(accountApi.getAccountMe()).resolves.toEqual({accountId: 12});
        await expect(wardApi.postShift(7, 3, 2026, 3)).resolves.toBeUndefined();

        expect(getMock).toHaveBeenCalledWith('/accounts/me');
        expect(postMock).toHaveBeenCalledWith('/wards/7/shift-teams/3/post?year=2026&month=03');
    });

    it('builds ward chat endpoints', async () => {
        const client = createClient();
        const getMock = client.get as ReturnType<typeof vi.fn>;
        const postMock = client.post as ReturnType<typeof vi.fn>;
        const putMock = client.put as ReturnType<typeof vi.fn>;

        getMock.mockResolvedValueOnce({
            data: {
                messages: [],
                nextCursorMessageId: 11,
                lastReadMessageId: 10,
                unreadCount: 1,
            },
        });
        postMock.mockResolvedValueOnce({data: {messageId: 12}});
        putMock.mockResolvedValueOnce({data: undefined});
        getMock.mockResolvedValueOnce({data: {moimId: 2, wardId: 7, unreadCount: 1}});
        getMock.mockResolvedValueOnce({data: [{moimId: 2, wardId: 7, unreadCount: 1}]});

        const wardApi = createWardApi(client);

        await expect(wardApi.getWardChatMessages(7, {cursorMessageId: 10, size: 30})).resolves.toMatchObject({
            nextCursorMessageId: 11,
        });
        await expect(wardApi.createWardChatMessage(7, {text: 'hello', clientMessageId: 'client-1'})).resolves.toEqual({messageId: 12});
        await expect(wardApi.readWardChat(7, {lastReadMessageId: 12})).resolves.toBeUndefined();
        await expect(wardApi.getWardChatUnreadCount(7)).resolves.toEqual({moimId: 2, wardId: 7, unreadCount: 1});
        await expect(wardApi.getMyWardChatUnreadCounts()).resolves.toEqual([{moimId: 2, wardId: 7, unreadCount: 1}]);

        expect(getMock).toHaveBeenNthCalledWith(1, '/wards/7/chat/messages?cursorMessageId=10&size=30');
        expect(postMock).toHaveBeenCalledWith('/wards/7/chat/messages', {text: 'hello', clientMessageId: 'client-1'});
        expect(putMock).toHaveBeenCalledWith('/wards/7/chat/read', {lastReadMessageId: 12});
        expect(getMock).toHaveBeenNthCalledWith(2, '/wards/7/chat/unread-count');
        expect(getMock).toHaveBeenNthCalledWith(3, '/wards/chat/unread-counts');
    });
});
