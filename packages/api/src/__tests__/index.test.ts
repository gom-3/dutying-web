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
});
