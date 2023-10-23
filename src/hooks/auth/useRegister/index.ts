import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateNurseDTO, createAccountNurse } from '@libs/api/nurse';
import useAuth from '../useAuth';
import { CreateWardDTO, addMeToWatingNurses, createWrad, deleteWatingNurses } from '@libs/api/ward';
import { eidtAccountStatus, getAccountMeWaiting } from '@libs/api/account';
import { useNavigate } from 'react-router';
import ROUTE from '@libs/constant/path';

const useRegister = () => {
  const {
    state: { accountMe, accountId },
    actions: { handleGetAccountMe },
  } = useAuth();
  const navigate = useNavigate();

  const { mutate: changeAccountStatusMutate } = useMutation(
    ({ accountId, status }: { accountId: number; status: Account['status'] }) =>
      eidtAccountStatus(accountId, status),
    {
      onSuccess: ({ status }) => {
        handleGetAccountMe();
        if (status === 'LINKED') navigate(ROUTE.MAKE);
      },
    }
  );

  const { mutate: registerAccountNurseMutate } = useMutation(
    ({ accountId, createNurseDTO }: { accountId: number; createNurseDTO: CreateNurseDTO }) =>
      createAccountNurse(accountId, createNurseDTO),
    {
      onSuccess: () => {
        if (!accountId) return;
        changeAccountStatusMutate({ accountId, status: 'WARD_SELECT_PENDING' });
      },
    }
  );

  const { mutate: createWardMutate } = useMutation(
    (createWardDTO: CreateWardDTO) => createWrad(createWardDTO),
    {
      onSuccess: () => {
        accountMe &&
          changeAccountStatusMutate({ accountId: accountMe.accountId, status: 'LINKED' });
      },
    }
  );

  const { mutate: enterWardMutate } = useMutation((wardId: number) => addMeToWatingNurses(wardId), {
    onSuccess: () => {
      if (!accountId) return;
      changeAccountStatusMutate({ accountId, status: 'WARD_ENTRY_PENDING' });
      navigate(ROUTE.REGISTER);
    },
  });

  const { mutate: cancelWaitingMutate } = useMutation(
    ({ wardId, nurseId }: { wardId: number; nurseId: number }) =>
      deleteWatingNurses(wardId, nurseId),
    {
      onSuccess: () => {
        if (!accountId) return;
        changeAccountStatusMutate({ accountId, status: 'WARD_SELECT_PENDING' });
        navigate(ROUTE.REGISTER);
      },
    }
  );

  const { data: accountWaitingWard } = useQuery(['accountWaitingWard'], getAccountMeWaiting, {
    enabled: accountMe?.status === 'WARD_ENTRY_PENDING',
  });

  return {
    state: { accountMe, accountWaitingWard },
    actions: {
      registerAccountNurse: (createNurseDTO: CreateNurseDTO) =>
        accountId && registerAccountNurseMutate({ accountId, createNurseDTO }),
      createWrad: createWardMutate,
      enterWard: enterWardMutate,
      cancelWaiting: (wardId: number, nurseId: number) => cancelWaitingMutate({ wardId, nurseId }),
    },
  };
};

export default useRegister;
