import { yupResolver } from '@hookform/resolvers/yup';
import imageCompression from 'browser-image-compression';
import { type ChangeEvent, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { match } from 'ts-pattern';
import * as yup from 'yup';
import { profileImages } from '@/assets/profileImage';
import { CameraIcon, CheckedIcon, RandomIcon, UncheckedIcon } from '@/assets/svg';
import Button from '@/components/Button';
import Select from '@/components/Select';
import TextField from '@/components/TextField';
import useAuth from '@/hooks/auth/useAuth';
import useRegister from '@/hooks/auth/useRegister';
import { type CreateNurseDTO } from '@/libs/api/nurse';

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
      .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/),
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
    imageInputRef.current?.click();
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
      <h1 className="font-apple text-text-1 absolute top-0 left-0 text-[2rem] font-semibold">
        회원 정보
      </h1>
      <div className="shadow-banner mt-15 flex w-full min-w-[500px] shrink-0 rounded-[1.25rem] bg-white px-11.25 pt-7.5 pb-10.5">
        <div className="flex flex-col items-center gap-7.5">
          <div className="font-apple text-sub-3 self-start text-[1.25rem]">프로필 이미지</div>
          <div className="border-sub-4 h-35 w-35 rounded-full border-[.625rem]">
            <img
              src={'data:image/png;base64,' + watchProfileImage}
              className="h-full w-full rounded-full object-cover object-center"
            />
          </div>
          <div className="flex h-10.5 w-67.5 cursor-pointer">
            <div
              className="border-sub-3 flex flex-1 items-center justify-center gap-[.25rem] rounded-l-[.3125rem] border-[.0625rem] border-r-0"
              onClick={handleRandomProfileImage}
            >
              <RandomIcon className="h-5 w-5" />
              <p className="font-apple text-sub-2.5 text-[1.25rem] font-medium">랜덤 변경</p>
            </div>
            <div
              className="border-sub-3 flex flex-1 items-center justify-center gap-[.25rem] rounded-r-[.3125rem] border-[.0625rem]"
              onClick={handleUploadImgae}
            >
              <CameraIcon className="h-5" />
              <p className="font-apple text-sub-2.5 text-[1.25rem] font-medium">사진 등록</p>
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
        <div className="ml-21 flex flex-col justify-between">
          <div>
            <label
              htmlFor="name"
              className="font-apple text-sub-3 mb-[.9375rem] block text-[1.25rem]"
            >
              이름
            </label>
            <TextField
              id="name"
              className="font-apple text-sub-1 h-15 py-4.25 text-[1.5rem] font-medium"
              error={match(errors.name?.type)
                .with(
                  'matches',
                  () => '이름은 1~50자 한/영문에 숫자나 특수문자를 사용할 수 없습니다.',
                )
                .otherwise(() => undefined)}
              {...register('name')}
            />
          </div>
          <div className="flex gap-11.25">
            <div className="flex-1">
              <label
                htmlFor="gender"
                className="font-apple text-sub-3 mb-[.9375rem] block text-[1.25rem]"
              >
                성별
              </label>
              <Select
                id="gender"
                className="font-apple text-sub-1 h-15 w-full text-[1.5rem] font-medium"
                selectClassName="outline-sub-4 focus:outline-main-1"
                {...register('gender')}
                options={[
                  { label: '여', value: '여' },
                  { label: '남', value: '남' },
                ]}
              />
            </div>
            <div className="flex-2">
              <label
                htmlFor="phoneNum"
                className="font-apple text-sub-3 mb-[.9375rem] block text-[1.25rem]"
              >
                전화 번호
              </label>
              <TextField
                id="phoneNum"
                className="font-apple text-sub-1 h-15 py-4.25 text-[1.5rem] font-medium"
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

      <div className="shadow-banner mt-5 w-full min-w-[500px] shrink-0 rounded-[1.25rem] bg-white px-11.25 pt-7.5 pb-15">
        <div className="w-67.5">
          <label
            htmlFor="employmentDate"
            className="font-apple text-sub-3 mb-[.9375rem] block text-[1.25rem]"
          >
            입사 년도
          </label>
          <TextField
            id="employmentDate"
            placeholder="YYYY-MM-DD"
            className="font-apple text-sub-1 h-15 py-4.25 text-[1.5rem] font-medium placeholder:text-center"
            error={match(errors.employmentDate?.type)
              .with('matches', () => 'YYYY-MM-DD 형식으로 입력해주세요.')
              .otherwise(() => undefined)}
            {...register('employmentDate')}
          />
        </div>
        <div className="bg-sub-4 mt-7.5 mb-5 h-[.0625rem] w-full" />
        <div className="flex flex-1 items-center">
          <div className="w-67.5">
            <p className="font-apple text-sub-3 text-[1.25rem]">교대 근무자</p>
            <p className="font-apple text-main-2 text-[.875rem]">* 근무표에 본인이 표시되나요?</p>
          </div>
          <div className="ml-21 flex gap-7.5">
            <div
              className="flex cursor-pointer items-center justify-center"
              onClick={() => setValue('isWorker', true)}
            >
              {watchIsWorker ? (
                <CheckedIcon className="h-7.5 w-7.5" />
              ) : (
                <UncheckedIcon className="h-7.5 w-7.5" />
              )}
              <div className="font-apple text-sub-3 ml-[.625rem] flex items-center text-[1.25rem] font-normal">
                네
              </div>
            </div>
            <div
              className="flex cursor-pointer items-center justify-center"
              onClick={() => setValue('isWorker', false)}
            >
              {!watchIsWorker ? (
                <CheckedIcon className="h-7.5 w-7.5" />
              ) : (
                <UncheckedIcon className="h-7.5 w-7.5" />
              )}
              <div className="font-apple text-sub-3 ml-[.625rem] flex items-center text-[1.25rem] font-normal">
                아니오
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        disabled={!isValid}
        className="mt-10 h-15 w-30 self-end text-center text-[2rem] font-semibold"
      >
        다음
      </Button>
    </form>
  );
}

export default RegisterNurse;
