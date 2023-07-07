import axiosInstance from '@libs/api/client';
import { HOME } from '@libs/constant/path';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useUserStore } from 'stores/userStore';

const tempUser = {
  id: 0,
  name: '',
  hospitalInfo: {
    hospital: '',
    ward: '',
    code: '',
  },
};

const RedirectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const login = useUserStore((state) => state.loginUser);
  const queryParmas = new URLSearchParams(location.search);
  const accessToken = queryParmas.get('accessToken');

  useEffect(() => {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    // Login API 호출
    login(tempUser);
    navigate(HOME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return <div />;
};

export default RedirectPage;
