import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateNurseDTO, createAccountNurse } from '@libs/api/nurse';
import useAuth from '../useAuth';
import { CreateWardDTO, createWrad } from '@libs/api/ward';

const useRegister = () => {
  const {
    queryKey: { accountMeQuery },
    state: { accountMe, accountId },
  } = useAuth();

  const queryClient = useQueryClient();

  const { mutate: createAccountNurseMutate } = useMutation(
    async ({ accountId, createNurseDTO }: { accountId: number; createNurseDTO: CreateNurseDTO }) =>
      createAccountNurse(accountId, createNurseDTO),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(accountMeQuery);
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

  return {
    state: { accountMe },
    actions: {
      createAccountNurse: (createNurseDTO: CreateNurseDTO) =>
        accountId && createAccountNurseMutate({ accountId, createNurseDTO }),
      createWrad: (createWardDTO: CreateWardDTO) =>
        accountId && createWardMutate({ accountId, createWardDTO }),
    },
  };
};

export default useRegister;
