import { CameraIcon, CheckedIcon, RandomIcon, UncheckedIcon } from '@assets/svg';
import TextField from '@components/TextField';
import Button from '@components/Button';
import Select from '@components/Select';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { match } from 'ts-pattern';
import { CreateNurseDTO } from '@libs/api/nurse';
import useRegister from '@hooks/auth/useRegister';
import { profileImages } from '@assets/profileImage';
import { ChangeEvent, useEffect, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import useAuth from '@hooks/auth/useAuth';

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
    profileImage: yup.string().required(),
    employmentDate: yup
      .string()
      .required()
      .matches(/^\d{4}.(0[1-9]|1[012]).(0[1-9]|[12][0-9]|3[01])$/),
  })
  .required();

function RegisterNurse() {
  const {
    formState: { errors, isValid },
    watch,
    setValue,
    register,
    handleSubmit,
  } = useForm<CreateNurseDTO & { profileImage: string }>({
    defaultValues: {
      gender: '여',
      isWorker: true,
      profileImage: '',
    },
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });
  const {
    actions: { registerAccountAndNurse },
  } = useRegister();
  const {
    state: { accountMe },
  } = useAuth();
  const watchIsWorker = watch('isWorker');
  const watchProfileImage = watch('profileImage');

  const handleRandomProfileImage = () => {
    setValue('profileImage', profileImages[Math.floor(Math.random() * 30)]);
  };

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleUploadImgae = () => {
    imageInputRef.current && imageInputRef.current.click();
  };

  const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length < 1) return;
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(e.target.files[0], options);
      const base64Image = await convertBase64(compressedFile);
      setValue('profileImage', base64Image.replace(/data.*;base64,/, ''));
    } catch (error) {
      console.log(error);
    }
  };

  const convertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  useEffect(() => {
    if (watchProfileImage == '') {
      if (accountMe?.profileImgBase64) {
        setValue('profileImage', accountMe.profileImgBase64);
      } else {
        handleRandomProfileImage();
      }
    }
  }, [accountMe]);

  return (
    <form
      onSubmit={handleSubmit(registerAccountAndNurse)}
      className="my-auto flex w-full flex-col items-center justify-center"
    >
      <h1 className="absolute left-0 top-0 font-apple text-[2rem] font-semibold text-text-1">
        회원 정보
      </h1>
      <div className="mt-[3.75rem] flex w-full min-w-[500px] shrink-0 justify-between rounded-[1.25rem] bg-white px-[2.8125rem] pb-[2.625rem] pt-[1.875rem] shadow-banner">
        <div className="flex flex-col items-center gap-[1.875rem]">
          <div className="self-start font-apple text-[1.25rem] text-sub-3">프로필 이미지</div>
          <div className="h-[8.75rem] w-[8.75rem] rounded-full border-[.625rem] border-sub-4">
            <img
              src={'data:image/png;base64,' + watchProfileImage}
              className="h-full w-full rounded-full object-cover object-center"
            />
          </div>
          <div className="flex h-[2.625rem] w-[16.875rem] cursor-pointer">
            <div
              className="flex flex-1 items-center justify-center gap-[.25rem] rounded-l-[.3125rem] border-[.0625rem] border-r-[0px] border-sub-3"
              onClick={handleRandomProfileImage}
            >
              <RandomIcon className="h-[1.25rem] w-[1.25rem]" />
              <p className="font-apple text-[1.25rem] font-medium text-sub-2.5">랜덤 변경</p>
            </div>
            <div
              className="flex flex-1 items-center justify-center gap-[.25rem] rounded-r-[.3125rem] border-[.0625rem] border-sub-3"
              onClick={handleUploadImgae}
            >
              <CameraIcon className="h-[1.25rem]" />
              <p className="font-apple text-[1.25rem] font-medium text-sub-2.5">사진 등록</p>
              <input
                ref={imageInputRef}
                type="file"
                className="hidden"
                onChange={handleChangeImage}
                accept="image/*"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div>
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
          <div className="flex gap-[2.8125rem]">
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
          </div>
        </div>
      </div>

      <div className="mt-[1.25rem] w-full min-w-[500px] shrink-0 rounded-[1.25rem] bg-white px-[2.8125rem] pb-[3.75rem] pt-[1.875rem] shadow-banner">
        <div className="w-[16.875rem]">
          <label
            htmlFor="name"
            className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3"
          >
            입사 년도
          </label>
          <TextField
            id="name"
            placeholder="YYYY.MM.DD"
            className="h-[3.75rem] py-[1.0625rem] font-apple text-[1.5rem] font-medium text-sub-1 placeholder:text-center"
            error={match(errors.employmentDate?.type)
              .with('matches', () => 'YYYY.MM.DD 형식으로 입력해주세요.')
              .otherwise(() => undefined)}
            {...register('employmentDate')}
          />
        </div>
        <div className="mb-[1.25rem] mt-[1.875rem] h-[.0625rem] w-full bg-sub-4" />
        <div className="flex flex-1 items-center gap-[4.375rem]">
          <div>
            <p className="font-apple text-[1.25rem] text-sub-3">교대 근무자</p>
            <p className="font-apple text-[.875rem] text-main-2">* 근무표에 본인이 표시되나요?</p>
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
