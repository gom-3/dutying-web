import { useQuery } from '@tanstack/react-query';
import { mockAccount, mockNurse } from './mock';

const useCreateNurse = () => {
  const accountQueryKey = ['account'];
  const { data: account } = useQuery(accountQueryKey, () => Promise.resolve(mockAccount));

  const nurseQueryKey = ['nurse', account];
  const { data: nurse } = useQuery(nurseQueryKey, () => Promise.resolve(mockNurse), {
    enabled: account?.nurseId !== undefined,
  });

  return {
    state: {
      account: account === undefined ? null : account,
      nurse: nurse === undefined ? null : nurse,
    },
    actions: {},
  };
};

export default useCreateNurse;
