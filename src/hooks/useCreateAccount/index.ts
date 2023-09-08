import ROUTE from '@libs/constant/path';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useCreateAccountStore from './store';
import { shallow } from 'zustand/shallow';

const useCreateAccount = () => {
  const [account, isFilled, error, setState] = useCreateAccountStore(
    (state) => [state.account, state.isFilled, state.error, state.setState],
    shallow
  );
  const navigate = useNavigate();

  /** 인풋값이 상태에 반영될 수 있는지 체크하며 업데이트 합니다. */
  const handleChangeAccount = (key: keyof CreateAccountRequestDTO, value: string | boolean) => {
    if (key === 'gender' && value !== '여' && value !== '남') return;
    if (key === 'name') {
      if (/![a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|s]/.test(value as string)) return;
      if (typeof value === 'string' && value.length > 10) return;
    }
    if (key === 'phoneNum') {
      if (/![d|-]/.test(value as string)) return;
      if (typeof value === 'string') {
        if (value.length > 13) return;
      }
    }
    // if (key === 'birthday' || key === 'employmentDate') {
    //   if (/![d|.]/.test(value as string)) return;
    //   if (typeof value === 'string') {
    //     if (value.length > 10) return;
    //   }
    // }
    setState('account', { ...account, [key]: value });
  };

  /** 서버에 제출하기 전 검토를 합니다. */
  const validate = () => {
    if (!/^[가-힣|A-Z|a-z]{2,10}$/.test(account.name)) {
      setState('isFilled', false);
      setState('error', {
        key: 'name',
        message: '이름은 2~10자에 숫자나 특수문자를 사용할 수 없습니다.',
      });
      return false;
    }
    // if (
    //   !/^(19[0-9][0-9]|20\d{2}).(0[0-9]|1[0-2]).(0[1-9]|[1-2][0-9]|3[0-1])$/.test(account.birthday)
    // ) {
    //   setState('isFilled', false);
    //   setState('error', { key: 'birthday', message: '연도 형식을 지켜주세요.' });
    //   return false;
    // }
    // if (
    //   !/^(19[0-9][0-9]|20\d{2}).(0[0-9]|1[0-2]).(0[1-9]|[1-2][0-9]|3[0-1])$/.test(
    //     account.employmentDate
    //   )
    // ) {
    //   setState('isFilled', false);
    //   setState('error', { key: 'birthday', message: '연도 형식을 지켜주세요.' });
    //   return false;
    // }
    if (!/(\d{3})-(\d{4})-(\d{4})/.test(account.phoneNum)) {
      setState('isFilled', false);
      setState('error', { key: 'name', message: '전화번호 형식을 지켜주세요.' });
      return false;
    }
    if (account.gender !== '여' && account.gender !== '남') {
      setState('isFilled', false);
      setState('error', { key: 'name', message: '여, 남만 선택 가능합니다.' });
      return false;
    }
    setState('isFilled', true);
    setState('error', null);
    return true;
  };

  useEffect(() => {
    validate();
  }, [account]);

  const handleCreateAccount = async () => {
    navigate(ROUTE.ONBOARDING);
  };

  return {
    state: {
      account,
      isFilled,
      error,
    },
    actions: {
      handleChangeAccount,
      handleCreateAccount,
    },
  };
};

export default useCreateAccount;
