/* eslint-disable react-hooks/exhaustive-deps */
import { ONBOARDING } from '@libs/constant/path';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export type Step = {
  name: string;
  contents: JSX.Element;
  description: JSX.Element | null;
};

type CreateAccountRequestDTO = Pick<
  Account,
  'name' | 'gender' | 'birthday' | 'phoneNum' | 'employmentDate' | 'isWorker'
>;

const useCreateAccount = () => {
  // 추후 server state로 변경
  const [account, setAccount] = useState<CreateAccountRequestDTO>({
    name: '',
    gender: '여',
    birthday: '',
    phoneNum: '',
    employmentDate: '',
    isWorker: true,
  });
  const [isFilled, setIsFilled] = useState<boolean>(false);
  const [error, setError] = useState<{
    key: keyof CreateAccountRequestDTO;
    message: string;
  } | null>(null);
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
    if (key === 'birthday' || key === 'employmentDate') {
      if (/![d|.]/.test(value as string)) return;
      if (typeof value === 'string') {
        if (value.length > 10) return;
      }
    }
    setAccount({ ...account, [key]: value });
    console.log(validate());
  };

  /** 서버에 제출하기 전 검토를 합니다. */
  const validate = () => {
    if (!/^[가-힣|A-Z|a-z]{2,10}$/.test(account.name)) {
      setIsFilled(false);
      setError({ key: 'name', message: '이름은 2~10자에 숫자나 특수문자를 사용할 수 없습니다.' });
      return false;
    }
    if (
      !/^(19[0-9][0-9]|20\d{2}).(0[0-9]|1[0-2]).(0[1-9]|[1-2][0-9]|3[0-1])$/.test(account.birthday)
    ) {
      setIsFilled(false);
      setError({ key: 'birthday', message: '연도 형식을 지켜주세요.' });
      return false;
    }
    if (
      !/^(19[0-9][0-9]|20\d{2}).(0[0-9]|1[0-2]).(0[1-9]|[1-2][0-9]|3[0-1])$/.test(
        account.employmentDate
      )
    ) {
      setIsFilled(false);
      setError({ key: 'birthday', message: '연도 형식을 지켜주세요.' });
      return false;
    }
    if (!/(\d{3})-(\d{4})-(\d{4})/.test(account.phoneNum)) {
      setIsFilled(false);
      setError({ key: 'name', message: '전화번호 형식을 지켜주세요.' });
      return false;
    }
    if (account.gender !== '여' && account.gender !== '남') {
      setIsFilled(false);
      setError({ key: 'name', message: '여, 남만 선택 가능합니다.' });
      return false;
    }
    setIsFilled(true);
    setError(null);
    return true;
  };

  useEffect(() => {
    validate();
  }, [account]);

  const handleCreateAccount = async () => {
    navigate(ONBOARDING.WARD);
  };

  return {
    account,
    isFilled,
    error,
    handleChangeAccount,
    handleCreateAccount,
  };
};

export default useCreateAccount;
