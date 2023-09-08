import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { setAccessToken } from '@libs/api/client';
import { TailSpin } from 'react-loader-spinner';
import qs from 'qs';
import ROUTE from '@libs/constant/path';

const RedirectPage = () => {
  const navigate = useNavigate();
  // const { setAccount } = useAccount();

  const handleLogin = async (nextPageUrl: string) => {
    try {
      // const account = await getAccountMe();
      // setAccount(account);
      location.replace(nextPageUrl);
      // @TODO 도메인 구입 이후 처리
      // switch (account.onboardingStatus) {
      //   case '미입력':
      //     return navigate(ONBOARDING.ACCOUNT);
      //   case '온보딩':
      //     return navigate(ONBOARDING.WARD);
      //   default:
      //     return navigate(HOME);
      // }
    } catch (e) {
      alert('로그인에 실패했습니다.');
      navigate(ROUTE.LOGIN, { replace: true });
    }
  };

  useEffect(() => {
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    const accessToken = query?.['accessToken'] as string;
    const nextPageUrl = query?.['nextPageUrl'] as string;
    if (accessToken) {
      setAccessToken(accessToken);
      handleLogin(nextPageUrl);
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
