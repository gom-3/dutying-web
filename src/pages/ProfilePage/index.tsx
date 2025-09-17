import imageCompression from 'browser-image-compression';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { profileImages } from '@/assets/profileImage';
import { CameraIcon, CheckedIcon, RandomIcon, UncheckedIcon } from '@/assets/svg';
import Button from '@/components/Button';
import Select from '@/components/Select';
import TextField from '@/components/TextField';
import useEditAccount from '@/hooks/account/useEditAccount';
import useAuth from '@/hooks/auth/useAuth';
import useEditShiftTeam from '@/hooks/ward/useEditShiftTeam';
import ROUTE from '@/libs/constant/path';
import { type Nurse } from '@/types/nurse';

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
    profileImages[Math.floor(Math.random() * 30)],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (key: keyof Nurse, value: any) => {
    if (!writeNurse) return;

    setWriteNurse({ ...writeNurse, [key]: value });
  };
  const save = () => {
    if (!writeNurse || !profileImage) return;

    handleEditProfile(writeNurse, profileImage);
  };

  useEffect(() => {
    if (shiftTeams && accountMe)
      selectNurse(
        shiftTeams.flatMap((x) => x.nurses).find((x) => x.accountId === accountMe.accountId)
          ?.nurseId ?? null,
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
    <div className="mx-auto flex h-full w-full max-w-306 flex-col items-center justify-center px-8">
      <div className="flex w-full items-center justify-between">
        <h1 className="font-apple text-text-1 text-[2rem] font-semibold">프로필 설정</h1>
        <button
          className="border-sub-3 font-apple text-sub-3 flex h-10 items-center justify-center rounded-[1.875rem] border-[.0625rem] bg-white px-4 text-[1.4375rem] font-medium"
          onClick={() => handleLogout(ROUTE.ROOT)}
        >
          로그아웃
        </button>
      </div>
      <div className="shadow-banner mt-10.5 flex w-full min-w-[500px] shrink-0 rounded-[1.25rem] bg-white px-11.25 pt-7.5 pb-10.5">
        <div className="flex flex-col items-center gap-7.5">
          <div className="font-apple text-sub-3 self-start text-[1.25rem]">프로필 이미지</div>
          <div className="border-sub-4 h-35 w-35 rounded-full border-[.625rem]">
            <img
              src={'data:image/png;base64,' + profileImage}
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
                value={writeNurse?.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
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
            value={writeNurse?.employmentDate}
            onChange={(e) => handleChange('employmentDate', e.target.value)}
            // error={match(errors.employmentDate?.type)
            //   .with('matches', () => 'YYYY.MM.DD 형식으로 입력해주세요.')
            //   .otherwise(() => undefined)}
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
              onClick={() => handleChange('isWorker', true)}
            >
              {writeNurse?.isWorker ? (
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
              onClick={() => handleChange('isWorker', false)}
            >
              {!writeNurse?.isWorker ? (
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
      <div className="mt-10 flex w-full items-start justify-between">
        <div className="flex flex-col gap-4">
          <div
            className="font-apple text-sub-2.5 cursor-pointer text-[1.25rem] font-medium underline underline-offset-2"
            onClick={deleteAccount}
          >
            회원 탈퇴
          </div>
          <div
            className="font-apple text-sub-2.5 cursor-pointer text-[1.25rem] font-medium underline underline-offset-2"
            onClick={quitWard}
          >
            병동 나가기
          </div>
        </div>
        <Button
          onClick={() => save()}
          className="h-15 w-30 text-center text-[2rem] font-semibold"
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
