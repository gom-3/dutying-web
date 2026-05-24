import {type TCreateNurseDTO} from '@dutying/api/nurse';
import {useCallback, useMemo, useState} from 'react';

export type TCreateAccountStatus = 'idle' | 'loading' | 'success' | 'failure' | 'exception';

type TCreateAccountFeedback = {
    tone: 'neutral' | 'error';
    message: string | null;
};

type TUseCreateAccountParams = {
    submit: (createNurseDTO: TCreateNurseDTO & {profileImg: {profileImgUrl?: string; defaultProfileImgId?: number}}) => Promise<unknown>;
};

const DEFAULT_FEEDBACK: TCreateAccountFeedback = {
    tone: 'neutral',
    message: null,
};
const FEEDBACK_BY_STATUS: Record<Exclude<TCreateAccountStatus, 'idle'>, TCreateAccountFeedback> = {
    loading: {
        tone: 'neutral',
        message: '계정 정보를 저장하고 있어요.',
    },
    success: {
        tone: 'neutral',
        message: '계정 정보를 저장했어요.',
    },
    failure: {
        tone: 'error',
        message: '입력한 계정 정보를 다시 확인해 주세요.',
    },
    exception: {
        tone: 'error',
        message: '계정 생성 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.',
    },
};

function isHandledFailure(error: unknown) {
    const code = typeof error === 'object' && error !== null && 'code' in error ? (error as {code?: number}).code : undefined;

    return code === 400 || code === 401 || code === 404;
}

const useCreateAccount = ({submit}: TUseCreateAccountParams) => {
    const [createAccountStatus, setCreateAccountStatus] = useState<TCreateAccountStatus>('idle');
    const createAccountFeedback = useMemo(() => {
        if (createAccountStatus === 'idle') {
            return DEFAULT_FEEDBACK;
        }

        return FEEDBACK_BY_STATUS[createAccountStatus];
    }, [createAccountStatus]);
    const resetCreateAccountStatus = useCallback(() => {
        setCreateAccountStatus((currentStatus) => (currentStatus === 'idle' || currentStatus === 'loading' ? currentStatus : 'idle'));
    }, []);
    const handleCreateAccountValidationFailure = useCallback(() => {
        setCreateAccountStatus('failure');
    }, []);
    const handleCreateAccount = useCallback(
        async (createNurseDTO: TCreateNurseDTO & {profileImg: {profileImgUrl?: string; defaultProfileImgId?: number}}) => {
            setCreateAccountStatus('loading');

            try {
                await submit(createNurseDTO);
                setCreateAccountStatus('success');
            } catch (error) {
                setCreateAccountStatus(isHandledFailure(error) ? 'failure' : 'exception');
                throw error;
            }
        },
        [submit],
    );

    return {
        createAccountStatus,
        createAccountFeedback,
        isSubmitting: createAccountStatus === 'loading',
        handleCreateAccount,
        handleCreateAccountValidationFailure,
        resetCreateAccountStatus,
    };
};

export default useCreateAccount;
