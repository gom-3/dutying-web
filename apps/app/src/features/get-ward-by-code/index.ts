import {useCallback} from 'react';
import {type TWard} from '@/entities/ward';
import {WardAPI} from '@/shared/api';

export default function useGetWardByCode() {
    const getWardByCode = useCallback((code: string): Promise<TWard> => {
        return WardAPI.getWardByCode(code);
    }, []);

    return {getWardByCode};
}
