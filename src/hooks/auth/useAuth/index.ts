import { shallow } from 'zustand/shallow';
import useAuthStore from './store';
import axiosInstance from '@libs/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { demoStart, getAccountMe, logout } from '@libs/api/auth';
import { useNavigate } from 'react-router';
import ROUTE from '@libs/constant/path';
import useInitStore from '@hooks/useInitStore';
import useEditShiftStore from '@hooks/shift/useEditShift/store';

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
  const { initState: initEditShiftStore } = useEditShiftStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const accountMeQueryKey = ['accountMe'];

  const { data: accountMe } = useQuery(accountMeQueryKey, getAccountMe, {
    onSuccess: (account) => {
      setState('isAuth', true);
      setState('wardId', account.wardId);
      setState('accountId', account.accountId);
      setState('nurseId', account.nurseId);
    },
    enabled: !!_loaded,
  });

  const { mutate: handleLogout } = useMutation(() => logout(accessToken), {
    onMutate: () => {
      queryClient.cancelQueries(accountMeQueryKey);
      initStore();
    },
  });

  const handleLogin = (accessToken: string, nextPageUrl?: string) => {
    setState('isAuth', true);
    setState('accessToken', accessToken);
    initEditShiftStore();
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    location.replace(nextPageUrl || '/make');
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
      accountMeQuery: accountMeQueryKey,
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
