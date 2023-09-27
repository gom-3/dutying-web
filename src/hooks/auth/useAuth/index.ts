import { shallow } from 'zustand/shallow';
import useAuthStore from './store';
import axiosInstance from '@libs/api/client';
import { useQuery } from '@tanstack/react-query';
import { getAccountMe } from '@libs/api/auth';

const useAuth = () => {
  const [isAuth, accessToken, nurseId, accountId, wardId, setState, initState] = useAuthStore(
    (state) => [
      state.isAuth,
      state.accessToken,
      state.nurseId,
      state.accountId,
      state.wardId,
      state.setState,
      state.initState,
    ],
    shallow
  );

  const accountMeQuery = ['accountMe', accessToken];

  const { data: accountMe } = useQuery(accountMeQuery, getAccountMe, {
    onSuccess: (account) => {
      setState('isAuth', true);
      setState('wardId', account.wardId);
      setState('accountId', account.accountId);
      setState('nurseId', account.nurseId);
    },
    onError: () => {
      initState();
    },
    enabled: accessToken !== null,
  });

  const handleLogin = (accessToken: string) => {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setState('accessToken', accessToken);
  };

  return {
    queryKey: {
      accountMeQuery,
    },
    state: {
      accountMe: accountMe === undefined ? null : accountMe,
      isAuth,
      accessToken,
      nurseId,
      accountId,
      wardId,
    },
    actions: {
      handleLogin,
    },
  };
};

export default useAuth;
