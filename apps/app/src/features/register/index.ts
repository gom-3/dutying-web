import {type TCreateNurseDTO} from '@dutying/api/nurse';
import {type TCreateWardDTO} from '@dutying/api/ward';
import {useQuery} from '@tanstack/react-query';
import {useCallback} from 'react';
import {useNavigate} from 'react-router';
import {type TAccount} from '@/entities/account';
import {accountQueryOptions} from '@/entities/account/model/queries';
import useAuth from '@/features/auth';
import useLoadingUseCase from '@/features/loading';
import useTutorialUseCase from '@/features/tutorial';
import {AccountAPI, NurseAPI, WardAPI} from '@/shared/api';
import ROUTE from '@/shared/constant/path';
import {showActionErrorFeedback} from '@/shared/util/feedback';

type TChangeAccountStatusOptions = {
    navigateOnLinked?: boolean;
};

type TCreateWardOptions = {
    navigateOnLinked?: boolean;
};

const useRegister = () => {
    const {
        state: {accountMe, accountId},
        actions: {handleGetAccountMe},
    } = useAuth();
    const {initTutorial} = useTutorialUseCase();
    const {setLoading} = useLoadingUseCase();
    const navigate = useNavigate();
    const changeAccountStatus = useCallback(
        async ({accountId, status, options}: {accountId: number; status: TAccount['status']; options?: TChangeAccountStatusOptions}) => {
            try {
                const updatedAccount = await AccountAPI.editAccountStatus(accountId, status);

                void handleGetAccountMe().catch(() => undefined);

                if (updatedAccount.status === 'LINKED' && options?.navigateOnLinked !== false) {
                    navigate(ROUTE.MAKE);
                }

                return updatedAccount;
            } catch (error) {
                showActionErrorFeedback(error, '계정 상태를 변경하지 못했어요.');
                throw new Error('Failed to change account status.');
            }
        },
        [handleGetAccountMe, navigate],
    );
    const createWard = useCallback(
        async (createWardDTO: TCreateWardDTO, options?: TCreateWardOptions) => {
            setLoading(true);

            try {
                const createdWard = await WardAPI.createWard(createWardDTO);

                initTutorial();

                if (accountMe) {
                    await changeAccountStatus({
                        accountId: accountMe.accountId,
                        status: 'LINKED',
                        options,
                    });
                }

                return createdWard;
            } finally {
                setLoading(false);
            }
        },
        [accountMe, changeAccountStatus, initTutorial, setLoading],
    );
    const enterWard = useCallback(
        async (wardId: number) => {
            setLoading(true);

            try {
                await WardAPI.addMeToWaitingNurses(wardId);

                if (!accountId) return;

                await changeAccountStatus({accountId, status: 'WARD_ENTRY_PENDING'});
                navigate(ROUTE.REGISTER);
            } finally {
                setLoading(false);
            }
        },
        [accountId, changeAccountStatus, navigate, setLoading],
    );
    const cancelWaiting = useCallback(
        async (wardId: number, nurseId: number) => {
            await WardAPI.deleteWaitingNurses(wardId, nurseId);

            if (!accountId) return;

            await changeAccountStatus({accountId, status: 'WARD_SELECT_PENDING'});
            navigate(ROUTE.REGISTER);
        },
        [accountId, changeAccountStatus, navigate],
    );
    const {data: accountWaitingWard} = useQuery({
        ...accountQueryOptions.waiting(),
        enabled: accountMe?.status === 'WARD_ENTRY_PENDING',
    });
    const registerAccountAndNurse = async (
        createNurseDTO: TCreateNurseDTO & {profileImg: {profileImgUrl?: string; defaultProfileImgId?: number}},
    ) => {
        if (!accountId || !accountMe) return;

        setLoading(true);

        try {
            if (accountMe.status === 'NURSE_INFO_PENDING') {
                // 모바일에서 계정 초기 등록을 이미 마친 경우 계정 정보를 수정한다.
                await AccountAPI.editAccount({
                    accountId,
                    name: createNurseDTO.name,
                    ...createNurseDTO.profileImg,
                });
            } else if (accountMe.status === 'INITIAL') {
                await AccountAPI.initAccount({accountId, name: createNurseDTO.name, ...createNurseDTO.profileImg});
            }

            await NurseAPI.createAccountNurse(accountId, createNurseDTO);
            await changeAccountStatus({accountId, status: 'WARD_SELECT_PENDING'});
        } finally {
            setLoading(false);
        }
    };

    return {
        state: {accountMe, accountWaitingWard},
        actions: {
            registerAccountAndNurse,
            createWard,
            enterWard,
            cancelWaiting,
        },
    };
};

export default useRegister;
