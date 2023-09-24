import { useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner';
import qs from 'qs';
import useAuth from '@hooks/useAuth';

const RedirectPage = () => {
  const {
    actions: { handleLogin },
  } = useAuth();

  useEffect(() => {
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    const accessToken = query?.['accessToken'] as string;
    const nextPageUrl = query?.['nextPageUrl'] as string;
    if (accessToken) {
      handleLogin(accessToken);
      location.replace(nextPageUrl);
    }
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      로그인중입니다.
      <TailSpin color="#844AFF" />
    </div>
  );
};

export default RedirectPage;
