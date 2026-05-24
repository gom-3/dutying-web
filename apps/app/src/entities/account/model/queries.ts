import {queryOptions} from '@tanstack/react-query';
import {AccountAPI} from '@/shared/api';

export const accountQueryKeys = {
    all: () => ['account'],
    id: (accountId: number) => [...accountQueryKeys.all(), 'id', accountId],
    me: () => [...accountQueryKeys.all(), 'me'],
    waiting: () => [...accountQueryKeys.all(), 'waiting'],
    defaultProfileImages: () => [...accountQueryKeys.all(), 'default-profile-images'],
};

export const accountQueryOptions = {
    id: (accountId: number) =>
        queryOptions({
            queryKey: accountQueryKeys.id(accountId),
            queryFn: () => AccountAPI.getAccount(accountId),
        }),
    me: () =>
        queryOptions({
            queryKey: accountQueryKeys.me(),
            queryFn: () => AccountAPI.getAccountMe(),
        }),
    waiting: () =>
        queryOptions({
            queryKey: accountQueryKeys.waiting(),
            queryFn: () => AccountAPI.getAccountMeWaiting(),
        }),
    defaultProfileImages: () =>
        queryOptions({
            queryKey: accountQueryKeys.defaultProfileImages(),
            queryFn: () => AccountAPI.getDefaultProfileImages(),
            staleTime: 'static',
        }),
};
