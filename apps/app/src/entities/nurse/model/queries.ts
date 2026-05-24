import {queryOptions} from '@tanstack/react-query';
import {NurseAPI} from '@/shared/api';

export const nurseQueryKeys = {
    all: () => ['nurse'],
    id: (nurseId: number) => [...nurseQueryKeys.all(), 'id', nurseId],
};

export const nurseQueryOptions = {
    id: (nurseId: number) =>
        queryOptions({
            queryKey: nurseQueryKeys.id(nurseId),
            queryFn: () => NurseAPI.getNurse(nurseId),
        }),
};
