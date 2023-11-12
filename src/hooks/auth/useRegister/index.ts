import { useMutation, useQuery } from '@tanstack/react-query';
import useAuth from '../useAuth';
import * as nurseApi from '@libs/api/nurse';
import * as wardApi from '@libs/api/ward';
import * as accountApi from '@libs/api/account';
import { useNavigate } from 'react-router';
import ROUTE from '@libs/constant/path';
import useLoading from '@hooks/ui/useLoading';

const useRegister = () => {
  const {
    state: { accountMe, accountId },
    actions: { handleGetAccountMe },
  } = useAuth();
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const { mutate: changeAccountStatusMutate } = useMutation(
    ({ accountId, status }: { accountId: number; status: Account['status'] }) =>
      accountApi.eidtAccountStatus(accountId, status),
    {
      onSuccess: ({ status }) => {
        handleGetAccountMe();
        if (status === 'LINKED') navigate(ROUTE.MAKE);
      },
    }
  );
  const { mutate: createWardMutate } = useMutation(
    (createWardDTO: wardApi.CreateWardDTO) => wardApi.createWrad(createWardDTO),
    {
      onMutate: () => {
        setLoading(true);
      },
      onSettled: () => {
        setLoading(false);
      },
      onSuccess: () => {
        // @TODO 편집 모드 ON
        accountMe &&
          changeAccountStatusMutate({ accountId: accountMe.accountId, status: 'LINKED' });
      },
    }
  );

  const { mutate: enterWardMutate } = useMutation(
    (wardId: number) => wardApi.addMeToWatingNurses(wardId),
    {
      onMutate: () => {
        setLoading(true);
      },
      onSettled: () => {
        setLoading(false);
      },
      onSuccess: () => {
        if (!accountId) return;
        changeAccountStatusMutate({ accountId, status: 'WARD_ENTRY_PENDING' });
        navigate(ROUTE.REGISTER);
      },
    }
  );

  const { mutate: cancelWaitingMutate } = useMutation(
    ({ wardId, nurseId }: { wardId: number; nurseId: number }) =>
      wardApi.deleteWatingNurses(wardId, nurseId),
    {
      onSuccess: () => {
        if (!accountId) return;
        changeAccountStatusMutate({ accountId, status: 'WARD_SELECT_PENDING' });
        navigate(ROUTE.REGISTER);
      },
    }
  );

  const { data: accountWaitingWard } = useQuery(
    ['accountWaitingWard'],
    accountApi.getAccountMeWaiting,
    {
      enabled: accountMe?.status === 'WARD_ENTRY_PENDING',
    }
  );

  const registerAccountAndNurse = async (
    createNurseDTO: nurseApi.CreateNurseDTO & { profileImage: string }
  ) => {
    if (!accountId || !accountMe) return;
    setLoading(true);
    if (accountMe.status === 'NURSE_INFO_PENDING') {
      // 모바일에서 계정 초기 등록을 이미 마친 경우 계정 정보를 수정한다.
      await accountApi.editAccount(accountId, {
        name: createNurseDTO.name,
        profileImgBase64: createNurseDTO.profileImage,
      });
    } else if (accountMe.status === 'INITIAL') {
      await accountApi.initAccount(accountId, createNurseDTO.name, createNurseDTO.profileImage);
    }
    await nurseApi.createAccountNurse(accountId, createNurseDTO);
    changeAccountStatusMutate({ accountId, status: 'WARD_SELECT_PENDING' });
    setLoading(false);
  };

  return {
    state: { accountMe, accountWaitingWard },
    actions: {
      registerAccountAndNurse,
      createWrad: createWardMutate,
      enterWard: enterWardMutate,
      cancelWaiting: (wardId: number, nurseId: number) => cancelWaitingMutate({ wardId, nurseId }),
    },
  };
};

export default useRegister;
