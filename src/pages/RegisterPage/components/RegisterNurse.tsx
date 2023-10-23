import { CheckedIcon, UncheckedIcon } from '@assets/svg';
import TextField from '@components/TextField';
import Button from '@components/Button';
import Select from '@components/Select';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { match } from 'ts-pattern';
import { CreateNurseDTO } from '@libs/api/nurse';
import useRegister from '@hooks/auth/useRegister';

const schema = yup
  .object()
  .shape({
    name: yup
      .string()
      .required()
      .matches(/^[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\s]{1,50}$/),
    phoneNum: yup
      .string()
      .required()
      .matches(/^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/),
    gender: yup.string().required(),
    isWorker: yup.boolean().required(),
  })
  .required();

function RegisterNurse() {
  const {
    formState: { errors, isValid },
    watch,
    setValue,
    register,
    handleSubmit,
  } = useForm<CreateNurseDTO>({
    defaultValues: {
      gender: '여',
      isWorker: true,
    },
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });
  const {
    actions: { registerAccountNurse: createAccountNurse },
  } = useRegister();
  const watchIsWorker = watch('isWorker');

  return (
    <form
      onSubmit={handleSubmit(createAccountNurse)}
      className="my-auto flex w-full flex-col items-center justify-center"
    >
      <h1 className="absolute left-0 top-0 font-apple text-[2rem] font-semibold text-text-1">
        회원 정보
      </h1>
      <div className="mt-[3.75rem] w-full shrink-0 rounded-[1.25rem] bg-white px-[2.8125rem] pb-[3.75rem] pt-[1.875rem] shadow-banner">
        <div className="w-[75%]">
          <label
            htmlFor="name"
            className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3"
          >
            이름
          </label>
          <TextField
            id="name"
            className="h-[3.75rem] py-[1.0625rem] font-apple text-[1.5rem] font-medium text-sub-1"
            error={match(errors.name?.type)
              .with(
                'matches',
                () => '이름은 1~50자 한/영문에 숫자나 특수문자를 사용할 수 없습니다.'
              )
              .otherwise(() => undefined)}
            {...register('name')}
          />
        </div>
        <div className="mt-[3.25rem] flex w-[75%] gap-[4.375rem]">
          <div className="flex-[1]">
            <label
              htmlFor="gender"
              className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3"
            >
              성별
            </label>
            <Select
              id="gender"
              className="h-[3.75rem] w-full font-apple text-[1.5rem] font-medium text-sub-1"
              selectClassName="outline-sub-4 focus:outline-main-1"
              {...register('gender')}
              options={[
                { label: '여', value: '여' },
                { label: '남', value: '남' },
              ]}
            />
          </div>
          <div className="flex-[2]">
            <label
              htmlFor="phoneNum"
              className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3"
            >
              전화 번호
            </label>
            <TextField
              id="phoneNum"
              className="h-[3.75rem] py-[1.0625rem] font-apple text-[1.5rem] font-medium text-sub-1"
              error={match(errors.phoneNum?.type)
                .with('matches', () => '전화번호 형식을 지켜주세요.')
                .otherwise(() => undefined)}
              {...register('phoneNum')}
              placeholder="01012341234"
            />
          </div>
          <div className="flex-auto"></div>
        </div>
        <div className="mt-[2.625rem] flex flex-1 items-center gap-[4.375rem]">
          <div>
            <p className="font-apple text-[1.25rem] text-sub-3">근무에 들어가시나요?</p>
            <p className="font-apple text-[.875rem] text-main-2">* 듀티표에 포함되는 근무인가요?</p>
          </div>
          <div
            className="flex cursor-pointer items-center justify-center"
            onClick={() => setValue('isWorker', true)}
          >
            {watchIsWorker ? (
              <CheckedIcon className="h-[1.875rem] w-[1.875rem]" />
            ) : (
              <UncheckedIcon className="h-[1.875rem] w-[1.875rem]" />
            )}
            <div className="ml-[.625rem] flex items-center font-apple text-[1.25rem] font-normal text-sub-3">
              네
            </div>
          </div>
          <div
            className="flex cursor-pointer items-center justify-center"
            onClick={() => setValue('isWorker', false)}
          >
            {!watchIsWorker ? (
              <CheckedIcon className="h-[1.875rem] w-[1.875rem]" />
            ) : (
              <UncheckedIcon className="h-[1.875rem] w-[1.875rem]" />
            )}
            <div className="ml-[.625rem] flex items-center font-apple text-[1.25rem] font-normal text-sub-3">
              아니오
            </div>
          </div>
        </div>
      </div>

      <Button
        disabled={!isValid}
        className="mt-[2.5rem] h-[3.75rem] w-[7.5rem] self-end text-center text-[2rem] font-semibold"
      >
        다음
      </Button>
    </form>
  );
}

export default RegisterNurse;
