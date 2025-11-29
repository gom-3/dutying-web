import {type JSX, useCallback, useEffect, useState} from 'react';
import {type Nurse} from '@/types/nurse';

export type Step = {
    name: string;
    contents: JSX.Element;
    description: JSX.Element | null;
};

type CreateAccountRequestDTO = Pick<Nurse, 'name' | 'gender' | 'phoneNum' | 'employmentDate' | 'isWorker'>;

const useCreateAccount = () => {
    // 추후 server state로 변경
    const [account, setAccount] = useState<CreateAccountRequestDTO>({
        name: '',
        gender: '여',
        phoneNum: '',
        employmentDate: '',
        isWorker: true,
    });
    const [isFilled, setIsFilled] = useState<boolean>(false);
    const [error, setError] = useState<{
        key: keyof CreateAccountRequestDTO;
        message: string;
    } | null>(null);
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

        if (key === 'employmentDate') {
            if (/![d|.]/.test(value as string)) return;

            if (typeof value === 'string') {
                if (value.length > 10) return;
            }
        }

        setAccount({...account, [key]: value});
    };
    /** 서버에 제출하기 전 검토를 합니다. */
    const validate = useCallback(() => {
        if (!/^[가-힣|A-Z|a-z]{2,10}$/.test(account.name)) {
            setIsFilled(false);
            setError({
                key: 'name',
                message: '이름은 2~10자 한/영문에 숫자나 특수문자를 사용할 수 없습니다.',
            });

            return false;
        }

        if (!/(\d{3})-(\d{4})-(\d{4})/.test(account.phoneNum)) {
            setIsFilled(false);
            setError({key: 'name', message: '전화번호 형식을 지켜주세요.'});

            return false;
        }

        if (account.gender !== '여' && account.gender !== '남') {
            setIsFilled(false);
            setError({key: 'name', message: '여, 남만 선택 가능합니다.'});

            return false;
        }

        setIsFilled(true);
        setError(null);

        return true;
    }, [account]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        validate();
    }, [account, validate]);

    const handleCreateAccount = async () => {
        //@TODO 상태 변경
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
