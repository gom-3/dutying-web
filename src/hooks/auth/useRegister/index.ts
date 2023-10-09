import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateNurseDTO, createAccountNurse } from '@libs/api/nurse';
import useAuth from '../useAuth';
import { CreateWardDTO, addMeToWatingNurses, createWrad, deleteWatingNurses } from '@libs/api/ward';
import { eidtAccountStatus } from '@libs/api/account';
import { useNavigate } from 'react-router';
import ROUTE from '@libs/constant/path';

const useRegister = () => {
  const {
    queryKey: { accountMeQuery },
    state: { accountMe, accountId },
  } = useAuth();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: changeAccountStatusMutate } = useMutation(
    async ({ accountId, status }: { accountId: number; status: Account['status'] }) =>
      eidtAccountStatus(accountId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(accountMeQuery);
      },
    }
  );

  const { mutate: registerAccountNurseMutate } = useMutation(
    async ({ accountId, createNurseDTO }: { accountId: number; createNurseDTO: CreateNurseDTO }) =>
      createAccountNurse(accountId, createNurseDTO),
    {
      onSuccess: () => {
        if (!accountId) return;
        changeAccountStatusMutate({ accountId, status: 'WARD_SELECT_PENDING' });
      },
    }
  );

  const { mutate: createWardMutate } = useMutation(
    async ({ accountId, createWardDTO }: { accountId: number; createWardDTO: CreateWardDTO }) =>
      createWrad(accountId, createWardDTO),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(accountMeQuery);
      },
    }
  );

  const { mutate: enterWardMutate } = useMutation(
    async (wardId: number) => addMeToWatingNurses(wardId),
    {
      onSuccess: () => {
        if (!accountId) return;
        changeAccountStatusMutate({ accountId, status: 'WARD_ENTRY_PENDING' });
        navigate(ROUTE.REGISTER);
      },
    }
  );

  const { mutate: cancelWaitingMutate } = useMutation(
    async ({ wardId, nurseId }: { wardId: number; nurseId: number }) =>
      deleteWatingNurses(wardId, nurseId),
    {
      onSuccess: () => {
        if (!accountId) return;
        changeAccountStatusMutate({ accountId, status: 'WARD_SELECT_PENDING' });
        navigate(ROUTE.REGISTER);
      },
    }
  );

  return {
    state: { accountMe },
    actions: {
      registerAccountNurse: (createNurseDTO: CreateNurseDTO) =>
        accountId && registerAccountNurseMutate({ accountId, createNurseDTO }),
      createWrad: (createWardDTO: CreateWardDTO) =>
        accountId && createWardMutate({ accountId, createWardDTO }),
      enterWard: enterWardMutate,
      cancelWaiting: (wardId: number, nurseId: number) => cancelWaitingMutate({ wardId, nurseId }),
    },
  };
};

export default useRegister;
