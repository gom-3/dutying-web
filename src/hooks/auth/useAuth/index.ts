import { shallow } from 'zustand/shallow';
import useAuthStore from './store';
import axiosInstance from '@libs/api/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { demoStart, getAccountMe } from '@libs/api/auth';
import { useNavigate } from 'react-router';
import ROUTE from '@libs/constant/path';
import useInitStore from '@hooks/useInitStore';

const useAuth = () => {
  const [isAuth, accessToken, nurseId, accountId, wardId, demoStartDate, _loaded, setState] =
    useAuthStore(
      (state) => [
        state.isAuth,
        state.accessToken,
        state.nurseId,
        state.accountId,
        state.wardId,
        state.demoStartDate,
        state._loaded,
        state.setState,
      ],
      shallow
    );
  const initStore = useInitStore();
  const navigate = useNavigate();

  const accountMeQuery = ['accountMe', accessToken];

  const { data: accountMe } = useQuery(accountMeQuery, getAccountMe, {
    onSuccess: (account) => {
      setState('isAuth', true);
      setState('wardId', account.wardId);
      setState('accountId', account.accountId);
      setState('nurseId', account.nurseId);
    },
    enabled: !!_loaded,
  });

  const handleLogout = () => {
    initStore();
  };

  const handleLogin = (accessToken: string) => {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setState('accessToken', accessToken);
  };

  const { mutate: demoTry } = useMutation(demoStart(), {
    onSuccess: (data) => {
      handleLogin(data.accessToken);
      setState('accessToken', data.accessToken);
      setState('accountId', data.accountResDto.accountId);
      setState('nurseId', data.accountResDto.nurseId);
      setState('wardId', data.accountResDto.wardId);
      setState('isAuth', true);
      setState('demoStartDate', new Date());
      navigate(ROUTE.MAKE);
    },
  });

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
      demoStartDate,
      _loaded,
    },
    actions: {
      handleLogin,
      handleLogout,
      demoTry,
    },
  };
};

export default useAuth;
