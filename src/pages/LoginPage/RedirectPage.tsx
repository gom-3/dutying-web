import { useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { parse } from 'qs';
import useAuth from '@hooks/auth/useAuth';

const RedirectPage = () => {
  const {
    actions: { handleLogin },
  } = useAuth();

  useEffect(() => {
    const query = parse(location.search, { ignoreQueryPrefix: true });
    const accessToken = query?.['accessToken'] as string;
    const nextPageUrl = query?.['nextPageUrl'] as string;
    if (accessToken) {
      handleLogin(accessToken, nextPageUrl);
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
