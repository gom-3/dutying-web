import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockAccount, mockNurse } from './mock';
import { CreateNurseDTO, createAccountNurse } from '@libs/api/nurse';

const useCreateNurse = () => {
  const queryClient = useQueryClient();
  const accountQueryKey = ['account'];
  const { data: account } = useQuery(accountQueryKey, () => Promise.resolve(mockAccount));

  const nurseQueryKey = ['nurse', account];
  const { data: nurse } = useQuery(nurseQueryKey, () => Promise.resolve(mockNurse), {
    enabled: account?.nurseId !== undefined,
  });

  const { mutate: createAccountNurseMutate } = useMutation(
    async ({ accountId, createNurse }: { accountId: number; createNurse: CreateNurseDTO }) =>
      createAccountNurse(accountId, createNurse),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(accountQueryKey);
      },
    }
  );

  return {
    state: {
      account: account === undefined ? null : account,
      nurse: nurse === undefined ? null : nurse,
    },
    actions: {
      createAccountNurse: (accountId: number, createNurse: CreateNurseDTO) =>
        createAccountNurseMutate({ accountId, createNurse }),
    },
  };
};

export default useCreateNurse;
