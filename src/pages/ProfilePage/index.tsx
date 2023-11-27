import { CameraIcon, CheckedIcon, RandomIcon, UncheckedIcon } from '@assets/svg';
import TextField from '@components/TextField';
import Button from '@components/Button';
import Select from '@components/Select';
import { profileImages } from '@assets/profileImage';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import useAuth from '@hooks/auth/useAuth';
import useEditShiftTeam from '@hooks/ward/useEditShiftTeam';
import useEditAccount from '@hooks/account/useEditAccount';

function ProfilePage() {
  const {
    state: { shiftTeams, selectedNurse },
    actions: { selectNurse },
  } = useEditShiftTeam();
  const {
    state: { accountMe },
    actions: { handleLogout },
  } = useAuth();
  const { handleEditProfile, deleteAccount, quitWard } = useEditAccount();

  const [writeNurse, setWriteNurse] = useState<Nurse | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(
    profileImages[Math.floor(Math.random() * 30)]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (key: keyof Nurse, value: any) => {
    if (!writeNurse) return;
    setWriteNurse({ ...writeNurse, [key]: value });
  };

  const save = () => {
    writeNurse && profileImage && handleEditProfile(writeNurse, profileImage);
  };

  useEffect(() => {
    if (shiftTeams && accountMe)
      selectNurse(
        shiftTeams.flatMap((x) => x.nurses).find((x) => x.accountId === accountMe.accountId)
          ?.nurseId || null
      );
  }, [accountMe, shiftTeams]);

  useEffect(() => {
    if (selectedNurse && accountMe && selectedNurse?.accountId === accountMe?.accountId) {
      setWriteNurse(selectedNurse);
      setProfileImage(accountMe.profileImgBase64);
    }
  }, [selectedNurse, accountMe]);

  const handleRandomProfileImage = () => {
    setProfileImage(profileImages[Math.floor(Math.random() * 30)]);
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
      setProfileImage(base64Image.replace(/data.*;base64,/, ''));
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

  return (
    <div className="mx-auto flex h-full w-full max-w-[76.5rem] flex-col items-center justify-center px-8">
      <div className="flex w-full items-center justify-between">
        <h1 className="font-apple text-[2rem] font-semibold text-text-1">프로필 설정</h1>
        <button
          className="flex h-[2.5rem] items-center justify-center rounded-[1.875rem] border-[.0625rem] border-sub-3 bg-white px-[1rem] font-apple text-[1.4375rem] font-medium text-sub-3"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
      <div className="mt-[2.625rem] flex w-full min-w-[500px] shrink-0 rounded-[1.25rem] bg-white px-[2.8125rem] pb-[2.625rem] pt-[1.875rem] shadow-banner">
        <div className="flex flex-col items-center gap-[1.875rem]">
          <div className="self-start font-apple text-[1.25rem] text-sub-3">프로필 이미지</div>
          <div className="h-[8.75rem] w-[8.75rem] rounded-full border-[.625rem] border-sub-4">
            <img
              src={'data:image/png;base64,' + profileImage}
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
        <div className="ml-[5.25rem] flex flex-col justify-between">
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
              value={writeNurse?.name}
              onChange={(e) => handleChange('name', e.target.value)}
              // error={match(errors.name?.type)
              //   .with(
              //     'matches',
              //     () => '이름은 1~50자 한/영문에 숫자나 특수문자를 사용할 수 없습니다.'
              //   )
              //   .otherwise(() => undefined)}
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
                value={writeNurse?.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
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
                value={writeNurse?.phoneNum}
                onChange={(e) => handleChange('phoneNum', e.target.value)}
                // error={match(errors.phoneNum?.type)
                //   .with('matches', () => '전화번호 형식을 지켜주세요.')
                //   .otherwise(() => undefined)}
                placeholder="01012341234"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[1.25rem] w-full min-w-[500px] shrink-0 rounded-[1.25rem] bg-white px-[2.8125rem] pb-[3.75rem] pt-[1.875rem] shadow-banner">
        <div className="w-[16.875rem]">
          <label
            htmlFor="employmentDate"
            className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3"
          >
            입사 년도
          </label>
          <TextField
            id="employmentDate"
            placeholder="YYYY-MM-DD"
            className="h-[3.75rem] py-[1.0625rem] font-apple text-[1.5rem] font-medium text-sub-1 placeholder:text-center"
            value={writeNurse?.employmentDate}
            onChange={(e) => handleChange('employmentDate', e.target.value)}
            // error={match(errors.employmentDate?.type)
            //   .with('matches', () => 'YYYY.MM.DD 형식으로 입력해주세요.')
            //   .otherwise(() => undefined)}
          />
        </div>
        <div className="mb-[1.25rem] mt-[1.875rem] h-[.0625rem] w-full bg-sub-4" />
        <div className="flex flex-1 items-center">
          <div className="w-[16.875rem]">
            <p className="font-apple text-[1.25rem] text-sub-3">교대 근무자</p>
            <p className="font-apple text-[.875rem] text-main-2">* 근무표에 본인이 표시되나요?</p>
          </div>
          <div className="ml-[5.25rem] flex gap-[1.875rem]">
            <div
              className="flex cursor-pointer items-center justify-center"
              onClick={() => handleChange('isWorker', true)}
            >
              {writeNurse?.isWorker ? (
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
              onClick={() => handleChange('isWorker', false)}
            >
              {!writeNurse?.isWorker ? (
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
      </div>
      <div className="mt-[2.5rem] flex w-full items-start justify-between">
        <div className="flex flex-col gap-[1rem]">
          <div
            className="cursor-pointer font-apple text-[1.25rem] font-medium text-sub-2.5 underline underline-offset-2"
            onClick={deleteAccount}
          >
            회원 탈퇴
          </div>
          <div
            className="cursor-pointer font-apple text-[1.25rem] font-medium text-sub-2.5 underline underline-offset-2"
            onClick={quitWard}
          >
            병동 나가기
          </div>
        </div>
        <Button
          onClick={() => save()}
          className="h-[3.75rem] w-[7.5rem] text-center text-[2rem] font-semibold"
          disabled={
            selectedNurse?.name === writeNurse?.name &&
            selectedNurse?.employmentDate === writeNurse?.employmentDate &&
            selectedNurse?.phoneNum === writeNurse?.phoneNum &&
            selectedNurse?.isWorker === writeNurse?.isWorker &&
            selectedNurse?.isDutyManager === writeNurse?.isDutyManager &&
            selectedNurse?.memo === writeNurse?.memo &&
            selectedNurse?.nurseShiftTypes.length === writeNurse?.nurseShiftTypes.length
          }
        >
          저장
        </Button>
      </div>
    </div>
  );
}

export default ProfilePage;
