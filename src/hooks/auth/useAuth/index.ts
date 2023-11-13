import { shallow } from 'zustand/shallow';
import useAuthStore from './store';
import axiosInstance from '@libs/api/client';
import { demoStart, getAccountMe } from '@libs/api/auth';
import { useNavigate } from 'react-router';
import ROUTE from '@libs/constant/path';
import useInitStore from '@hooks/useInitStore';
import useEditShiftStore from '@hooks/shift/useEditShift/store';
import { useEffect } from 'react';
import { events, sendEvent } from 'analytics';
import useLoading from '@hooks/ui/useLoading';
import useTutorial from '@hooks/ui/useTutorial';

const useAuth = (activeEffect = false) => {
  const [
    accountMe,
    isAuth,
    accessToken,
    nurseId,
    accountId,
    wardId,
    demoStartDate,
    _loaded,
    setState,
  ] = useAuthStore(
    (state) => [
      state.accountMe,
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
  const { setLoading } = useLoading();
  const initStore = useInitStore();
  const { initState: initEditShiftStore } = useEditShiftStore();
  const {
    actions: { initTutorial },
  } = useTutorial();
  const navigate = useNavigate();

  const handleLogout = async () => {
    initStore();
    sendEvent(events.auth.logut);
  };

  const handleLogin = (accessToken: string, nextPageUrl?: string) => {
    setState('isAuth', true);
    setState('accessToken', accessToken);
    initEditShiftStore();
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    location.replace(nextPageUrl || '/make');
    sendEvent(events.auth.login);
  };

  const demoTry = async () => {
    setLoading(true);
    initTutorial();
    const data = await demoStart();
    setState('accessToken', data.accessToken);
    setState('accountId', data.accountResDto.accountId);
    setState('nurseId', data.accountResDto.nurseId);
    setState('wardId', data.accountResDto.wardId);
    setState('isAuth', true);
    setState('demoStartDate', new Date());
    navigate(ROUTE.MAKE);
    setLoading(false);
  };

  const handleGetAccountMe = async () => {
    const account = await getAccountMe();
    setState('accountMe', account);
    setState('wardId', account.wardId);
    setState('accountId', account.accountId);
    setState('nurseId', account.nurseId);
    setState('isAuth', true);
  };

  useEffect(() => {
    if (_loaded && activeEffect) {
      handleGetAccountMe();
    }
  }, [activeEffect, accessToken, _loaded]);

  return {
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
      handleGetAccountMe,
      handleLogin,
      handleLogout,
      demoTry,
    },
  };
};

export default useAuth;
