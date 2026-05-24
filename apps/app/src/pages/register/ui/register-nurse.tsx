import {type TCreateNurseDTO} from '@dutying/api/nurse';
import {yupResolver} from '@hookform/resolvers/yup';
import imageCompression from 'browser-image-compression';
import {type ChangeEvent, useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import toast from 'react-hot-toast';
import {match} from 'ts-pattern';
import * as yup from 'yup';
import {ProfileImage} from '@/entities/account/ui/profile-image';
import {useCreateAccount} from '@/features/account/model';
import useProfileImage from '@/features/file';
import useRegister from '@/features/register';
import {CameraIcon, CheckedIcon, RandomIcon, UncheckedIcon} from '@/shared/assets/svg';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import Button from '@/shared/ui/form-controls/Button';
import Select from '@/shared/ui/form-controls/Select';
import TextField from '@/shared/ui/form-controls/TextField';

const NURSE_NAME_MAX_LENGTH = 20;
const NURSE_NAME_ALLOWED_REGEXP = /^[A-Za-zㄱ-ㅎㅏ-ㅣ가-힣ぁ-ゟ゠-ヿ一-龯々\s'’\-·・]+$/u;
const NURSE_NAME_INPUT_SANITIZE_REGEXP = /[^A-Za-zㄱ-ㅎㅏ-ㅣ가-힣ぁ-ゟ゠-ヿ一-龯々\s'’\-·・]/gu;
const sanitizeNurseNameInput = (rawValue: string) => rawValue.replace(NURSE_NAME_INPUT_SANITIZE_REGEXP, '').slice(0, NURSE_NAME_MAX_LENGTH);
const schema = yup
    .object()
    .shape({
        name: yup
            .string()
            .transform((value) => value?.trim() ?? '')
            .required()
            .max(NURSE_NAME_MAX_LENGTH)
            .matches(NURSE_NAME_ALLOWED_REGEXP),
        phoneNum: yup
            .string()
            .required()
            .matches(/^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/),
        gender: yup.string().required(),
        isWorker: yup.boolean().required(),
        profileImg: yup
            .object()
            .shape({
                profileImgUrl: yup.string().optional(),
                defaultProfileImgId: yup.number().optional(),
            })
            .required(),
        employmentDate: yup
            .string()
            .required()
            .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/),
    })
    .required();

function RegisterNurse() {
    const {t} = useTypedTranslation();
    const {
        formState: {errors, isValid},
        watch,
        setValue,
        register,
        handleSubmit,
    } = useForm<TCreateNurseDTO & {profileImg: {profileImgUrl?: string; defaultProfileImgId?: number}}>({
        defaultValues: {
            gender: '여',
            isWorker: true,
        },
        mode: 'onTouched',
        resolver: yupResolver(schema),
    });
    const {
        actions: {registerAccountAndNurse},
    } = useRegister();
    const watchIsWorker = watch('isWorker');
    const {profileImg, setRandomImage, setPhotoImage} = useProfileImage({defaultProfileImgId: 1});
    const {createAccountFeedback, isSubmitting, handleCreateAccount, handleCreateAccountValidationFailure, resetCreateAccountStatus} =
        useCreateAccount({
            submit: registerAccountAndNurse,
        });
    const imageInputRef = useRef<HTMLInputElement>(null);
    const handleUploadImage = () => {
        imageInputRef.current?.click();
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

            setPhotoImage(compressedFile);
        } catch (_error) {
            toast.error('프로필 이미지를 처리하지 못했어요.');
        }
    };

    useEffect(() => {
        if (profileImg) {
            setValue('profileImg', profileImg);
        }
    }, [profileImg, setValue]);

    useEffect(() => {
        const subscription = watch(() => {
            if (!isSubmitting) {
                resetCreateAccountStatus();
            }
        });

        return () => subscription.unsubscribe();
    }, [isSubmitting, resetCreateAccountStatus, watch]);

    return (
        <form
            onSubmit={handleSubmit(handleCreateAccount, handleCreateAccountValidationFailure)}
            className="my-auto flex w-full flex-col items-center justify-center"
        >
            <h1 className="absolute top-0 left-0 font-apple text-[2rem] font-semibold text-text-1">회원 정보</h1>
            <div className="mt-15 flex w-full min-w-[500px] shrink-0 rounded-[1.25rem] bg-white px-11.25 pt-7.5 pb-10.5 shadow-banner">
                <div className="flex flex-col items-center gap-7.5">
                    <div className="self-start font-apple text-[1.25rem] text-sub-3">프로필 이미지</div>
                    <div className="h-35 w-35 rounded-full border-[.625rem] border-sub-4">
                        <ProfileImage profileImg={profileImg!} className="h-full w-full" />
                    </div>
                    <div className="flex h-10.5 w-67.5 cursor-pointer">
                        <div
                            className="flex flex-1 items-center justify-center gap-[.25rem] rounded-l-[.3125rem] border-[.0625rem] border-r-0 border-sub-3"
                            onClick={setRandomImage}
                        >
                            <RandomIcon className="h-5 w-5" />
                            <p className="font-apple text-[1.25rem] font-medium text-sub-2.5">랜덤 변경</p>
                        </div>
                        <div
                            className="flex flex-1 items-center justify-center gap-[.25rem] rounded-r-[.3125rem] border-[.0625rem] border-sub-3"
                            onClick={handleUploadImage}
                        >
                            <CameraIcon className="h-5" />
                            <p className="font-apple text-[1.25rem] font-medium text-sub-2.5">사진 등록</p>
                            <input ref={imageInputRef} type="file" className="hidden" onChange={handleChangeImage} accept="image/*" />
                        </div>
                    </div>
                </div>
                <div className="ml-21 flex flex-col justify-between">
                    <div>
                        <label htmlFor="name" className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3">
                            이름
                        </label>
                        <TextField
                            id="name"
                            className="h-15 py-4.25 font-apple text-[1.5rem] font-medium text-sub-1"
                            error={match(errors.name?.type)
                                .with(
                                    'matches',
                                    'max',
                                    () => "이름은 20자 이하, 한글/영문/일문과 공백(-, ' , ·, ・ 포함)만 입력할 수 있어요.",
                                )
                                .otherwise(() => undefined)}
                            maxLength={NURSE_NAME_MAX_LENGTH}
                            {...register('name', {
                                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                                    const sanitizedValue = sanitizeNurseNameInput(event.target.value);

                                    if (sanitizedValue !== event.target.value) {
                                        event.target.value = sanitizedValue;
                                    }
                                },
                            })}
                        />
                    </div>
                    <div className="flex gap-11.25">
                        <div className="flex-1">
                            <label htmlFor="gender" className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3">
                                성별
                            </label>
                            <Select
                                id="gender"
                                className="h-15 w-full font-apple text-[1.5rem] font-medium text-sub-1"
                                selectClassName="outline-sub-4 focus:outline-main-1"
                                {...register('gender')}
                                options={[
                                    {label: '여', value: '여'},
                                    {label: '남', value: '남'},
                                ]}
                            />
                        </div>
                        <div className="flex-2">
                            <label htmlFor="phoneNum" className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3">
                                전화 번호
                            </label>
                            <TextField
                                id="phoneNum"
                                className="h-15 py-4.25 font-apple text-[1.5rem] font-medium text-sub-1"
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

            <div className="mt-5 w-full min-w-[500px] shrink-0 rounded-[1.25rem] bg-white px-11.25 pt-7.5 pb-15 shadow-banner">
                <div className="w-67.5">
                    <label htmlFor="employmentDate" className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3">
                        입사 년도
                    </label>
                    <TextField
                        id="employmentDate"
                        placeholder="YYYY-MM-DD"
                        className="h-15 py-4.25 font-apple text-[1.5rem] font-medium text-sub-1 placeholder:text-center"
                        error={match(errors.employmentDate?.type)
                            .with('matches', () => 'YYYY-MM-DD 형식으로 입력해 주세요.')
                            .otherwise(() => undefined)}
                        {...register('employmentDate')}
                    />
                </div>
                <div className="mt-7.5 mb-5 h-[.0625rem] w-full bg-sub-4" />
                <div className="flex flex-1 items-center">
                    <div className="w-67.5">
                        <p className="font-apple text-[1.25rem] text-sub-3">교대 근무자</p>
                        <p className="font-apple text-[.875rem] text-main-2">* 근무표에 본인이 표시되나요?</p>
                    </div>
                    <div className="ml-21 flex gap-7.5">
                        <div className="flex cursor-pointer items-center justify-center" onClick={() => setValue('isWorker', true)}>
                            {watchIsWorker ? <CheckedIcon className="h-7.5 w-7.5" /> : <UncheckedIcon className="h-7.5 w-7.5" />}
                            <div className="ml-[.625rem] flex items-center font-apple text-[1.25rem] font-normal text-sub-3">네</div>
                        </div>
                        <div className="flex cursor-pointer items-center justify-center" onClick={() => setValue('isWorker', false)}>
                            {!watchIsWorker ? <CheckedIcon className="h-7.5 w-7.5" /> : <UncheckedIcon className="h-7.5 w-7.5" />}
                            <div className="ml-[.625rem] flex items-center font-apple text-[1.25rem] font-normal text-sub-3">아니오</div>
                        </div>
                    </div>
                </div>
            </div>

            <p
                className={`mt-6 min-h-6 self-end text-right font-apple text-[1rem] ${
                    createAccountFeedback.tone === 'error' ? 'text-red' : 'text-sub-2'
                }`}
            >
                {createAccountFeedback.message}
            </p>

            <Button disabled={!isValid || isSubmitting} className="mt-4 h-15 w-30 self-end text-center text-[2rem] font-semibold">
                {isSubmitting ? t('page.register.nurse.submitting') : t('page.makeShift.navigation.next')}
            </Button>
        </form>
    );
}

export default RegisterNurse;
