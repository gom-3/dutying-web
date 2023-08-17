import { CheckedIcon, FullLogo, LogoSymbolFill, UncheckedIcon } from '@assets/svg';
import TextField from '@components/TextField';
import Button from '@components/Button';
import Select from '@components/Select';
import useCreateAccount from '@hooks/useCreateAccount';

function SetAccount() {
  const {
    state: { account, isFilled },
    actions: { handleChangeAccount, handleCreateAccount },
  } = useCreateAccount();

  return (
    <div className="mx-auto flex h-full w-[52%] flex-col items-center bg-[#FDFCFE] pt-[7.6875rem]">
      <div className="fixed left-[3.125rem] top-[1.875rem] flex gap-[1.25rem]">
        <LogoSymbolFill className="h-[1.875rem] w-[1.875rem]" />
        <FullLogo className="h-[1.875rem] w-[6.875rem]" />
      </div>
      <h1 className="self-start font-apple text-[2rem] font-semibold text-[#150B3C]">회원 정보</h1>
      <div className="mt-[1.875rem] min-h-[22rem] w-full shrink-0 rounded-[1.25rem] bg-white px-[4.375rem] py-[2.625rem] shadow-[0rem_.25rem_2.125rem_#EDE9F5]">
        <div className="w-[75%]">
          <p className="mb-[.9375rem] font-apple text-[1.25rem] text-sub-3">이름</p>
          <TextField
            className="h-[3.75rem] py-[1.0625rem] font-apple text-[1.5rem] font-medium text-sub-1"
            value={account.name}
            onChange={(e) => handleChangeAccount('name', e.target.value)}
          />
        </div>
        <div className="mt-[2.25rem] flex w-[75%] gap-[4.375rem]">
          <div className="flex-[2]">
            <p className="mb-[.9375rem] font-apple text-[1.25rem] text-sub-3">성별</p>
            <Select
              className="h-[3.75rem] w-full font-apple text-[1.5rem] font-medium text-sub-1"
              selectClassName="outline-sub-4 focus:outline-main-1"
              value={account.gender}
              onChange={(e) => handleChangeAccount('gender', e.target.value)}
              options={[
                { label: '남', value: '남' },
                { label: '여', value: '여' },
              ]}
            />
          </div>
          {/* <div className="flex-[4]">
            <p className="mb-[.9375rem] font-apple text-[1.25rem] text-sub-3">생일</p>
            <TextField
              className="h-[3.75rem] py-[1.0625rem] font-apple text-[1.5rem] font-medium text-sub-1"
              value={account.birthday}
              placeholder="1999.01.01"
              onChange={(e) => handleChangeAccount('birthday', e.target.value)}
            />
          </div> */}
          <div className="flex-[5]">
            <p className="mb-[.9375rem] font-apple text-[1.25rem] text-sub-3">전화 번호</p>
            <TextField
              className="h-[3.75rem] py-[1.0625rem] font-apple text-[1.5rem] font-medium text-sub-1"
              value={account.phoneNum}
              placeholder="010-1234-1234"
              onChange={(e) => handleChangeAccount('phoneNum', e.target.value)}
            />
          </div>
        </div>
        <div className="my-[2.9375rem] h-[.0625rem] w-[calc(100%+8.75rem)] translate-x-[-4.375rem] bg-sub-4.5" />
        {/* <div className="w-[40%]">
          <p className="mb-[.9375rem] font-apple text-[1.25rem] text-sub-3">입사 연도</p>
          <TextField
            className="h-[3.75rem] py-[1.0625rem] text-center font-apple text-[1.5rem] font-medium text-sub-1"
            placeholder="YYYY.MM.DD"
            value={account}
            onChange={(e) => handleChangeAccount('employmentDate', e.target.value)}
          />
        </div> */}
        <div className="mt-[1.8125rem] flex w-full">
          <div className="flex flex-1 items-center gap-[4.375rem]">
            <div>
              <p className="font-apple text-[1.25rem] text-sub-3">근무에 들어가시나요?</p>
              <p className="font-apple text-[.875rem] text-main-2">
                * 듀티표에 포함되는 근무인가요?
              </p>
            </div>
            <div
              className="flex cursor-pointer items-center justify-center"
              onClick={() => handleChangeAccount('isWorker', true)}
            >
              {account.isWorker ? (
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
              onClick={() => handleChangeAccount('isWorker', false)}
            >
              {!account.isWorker ? (
                <CheckedIcon className="h-[1.875rem] w-[1.875rem]" />
              ) : (
                <UncheckedIcon className="h-[1.875rem] w-[1.875rem]" />
              )}
              <div className="ml-[.625rem] flex items-center font-apple text-[1.25rem] font-normal text-sub-3">
                아니오
              </div>
            </div>
          </div>
          <Button
            className="h-[5rem] w-[11.4375rem] text-center text-[2.25rem] font-semibold"
            disabled={!isFilled}
            onClick={() => handleCreateAccount()}
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SetAccount;
