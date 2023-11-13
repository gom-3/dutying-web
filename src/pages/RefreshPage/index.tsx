import useAuth from '@hooks/auth/useAuth';
import axiosInstance from '@libs/api/client';
import { useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router';

function RefreshPage() {
  const {
    actions: { handleLogout, handleLogin },
  } = useAuth();
  const navigate = useNavigate();

  const refresh = async () => {
    try {
      axiosInstance.defaults.headers.common['Authorization'] = undefined;
      const accessToken = (await axiosInstance.post('/token/refresh')).data.accessToken;
      handleLogin(accessToken);
    } catch (error) {
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
      handleLogout();
      navigate('/login');
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      로그인중입니다.
      <TailSpin color="#844AFF" />
    </div>
  );
}

export default RefreshPage;
