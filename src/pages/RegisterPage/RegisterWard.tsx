import {
  BackIcon,
  EnterIcon,
  FullLogo,
  LogoSymbolFill,
  PenIcon,
  PlusIcon,
  XIcon,
} from '@assets/svg';
import TextField from '@components/TextField';
import Button from '@components/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { match } from 'ts-pattern';
import { useEffect, useState } from 'react';
import TimeInput from '@components/TimeInput';
import CreateShiftModal from '@pages/MakeShiftPage/components/editWard/CreateShiftModal';
import { produce } from 'immer';
import { useNavigate } from 'react-router';
import useRegister from '@hooks/auth/useRegister';
import ROUTE from '@libs/constant/path';

const schema = yup.object().shape({
  name: yup
    .string()
    .required()
    .matches(/^[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9|\s]{1,50}$/),
  hospitalName: yup
    .string()
    .required()
    .matches(/^[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9|\s]{1,50}$/),
});

function RegisterWard() {
  const [shiftTeams, setShiftTeams] = useState<string[][]>([[]]);
  const [wardShiftTypes, setWardShiftTypes] = useState([
    {
      name: '오프',
      shortName: 'O',
      startTime: '',
      endTime: '',
      backgroundColor: '#465B7A',
      textColor: '#FFFFFF',
      isDefault: true,
      isOff: true,
    },
    {
      name: '데이',
      shortName: 'D',
      startTime: '07:00',
      endTime: '15:00',
      backgroundColor: '#4DC2AD',
      textColor: '#FFFFFF',
      isDefault: true,
      isOff: false,
    },
    {
      name: '이브닝',
      shortName: 'E',
      startTime: '15:00',
      endTime: '23:00',
      backgroundColor: '#FF8BA5',
      textColor: '#FFFFFF',
      isDefault: true,
      isOff: false,
    },
    {
      name: '나이트',
      shortName: 'N',
      startTime: '23:00',
      endTime: '07:00',
      backgroundColor: '#3580FF',
      textColor: '#FFFFFF',
      isDefault: true,
      isOff: false,
    },
  ]);
  const {
    formState: { errors, isValid },
    register,
    handleSubmit,
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: '',
      hospitalName: '',
    },
    resolver: yupResolver(schema),
  });
  const [openModal, setOpenModal] = useState(false);
  const [tempShiftType, setTempShiftType] = useState<WardShiftType | null>(null);

  const {
    state: { accountMe },
    actions: { createWrad },
  } = useRegister();

  const navigate = useNavigate();

  useEffect(() => {
    if (accountMe?.status !== 'WARD_SELECT_PENDING') navigate(ROUTE.REGISTER);
  }, [accountMe]);

  return (
    <div className="relative mx-auto mt-[7.6875rem] flex h-[calc(100%-7.6875rem)] w-[52%] flex-col items-center bg-[#FDFCFE]">
      <div
        className="fixed left-[3.125rem] top-[1.875rem] flex cursor-pointer gap-[1.25rem]"
        onClick={() => navigate(ROUTE.ROOT)}
      >
        <LogoSymbolFill className="h-[1.875rem] w-[1.875rem]" />
        <FullLogo className="h-[1.875rem] w-[6.875rem]" />
      </div>
      <form
        onSubmit={handleSubmit((d) => {
          createWrad({
            name: d.name,
            hospitalName: d.hospitalName,
            shiftTeams: shiftTeams.map((shiftTeam) => ({ nurseNames: shiftTeam })),
            wardShiftTypes,
          });
        })}
        className="flex w-full flex-col"
      >
        <h1 className="font-apple text-[2rem] font-semibold text-text-1">병동 생성</h1>
        <BackIcon
          className="absolute left-[-2.5rem] top-0 h-[3rem] w-[3rem] translate-x-[-100%] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div className="mt-[1.875rem] flex w-full shrink-0 gap-[3.125rem] rounded-[1.25rem] bg-white px-[2.8125rem] py-[1.875rem] shadow-banner">
          <div className="w-[18.75rem]">
            <label
              htmlFor="name"
              className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3"
            >
              병원
            </label>
            <TextField
              id="name"
              className="h-[3.75rem] py-[1.0625rem] font-apple text-[1.5rem] font-medium text-sub-1"
              error={match(errors.hospitalName?.type)
                .with('matches', () => '이름은 1~50자 한/영문에 특수문자를 사용할 수 없습니다.')
                .otherwise(() => undefined)}
              {...register('hospitalName')}
            />
          </div>
          <div className="w-[14.375rem]">
            <label
              htmlFor="name"
              className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3"
            >
              병동
            </label>
            <TextField
              id="name"
              className="h-[3.75rem] py-[1.0625rem] font-apple text-[1.5rem] font-medium text-sub-1"
              error={match(errors.name?.type)
                .with('matches', () => '이름은 1~50자 한/영문에 특수문자를 사용할 수 없습니다.')
                .otherwise(() => undefined)}
              {...register('name')}
            />
          </div>
        </div>
        <div className="mt-[1.25rem] w-full shrink-0 rounded-[1.25rem] bg-white px-[2.8125rem] py-[1.875rem] shadow-banner">
          <div className="flex items-center justify-between">
            <p className="font-apple text-[1.25rem] font-medium text-sub-3">근무 유형</p>
            <div
              className="flex cursor-pointer gap-[.625rem]"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              <PlusIcon className="h-[1.5rem] w-[1.5rem] stroke-main-2" />
              <p className="font-apple text-[1rem] font-medium text-main-2">근무 •휴가 추가하기</p>
            </div>
          </div>
          <div className="relative mt-[1.25rem] rounded-[.625rem] bg-main-bg">
            <div className="flex items-center gap-[3rem] pt-[1.25rem] text-center font-apple text-[.875rem] font-medium text-sub-2.5">
              <p className="flex-[2]">근무 명</p>
              <p className="flex-1">약자</p>
              <p className="flex-[3]">근무 시간</p>
              <p className="flex-1">배경색</p>
              <p className="flex-1">글자색</p>
              <p className="flex-1">유형</p>
              <p className="flex-1">수정</p>
            </div>
            {wardShiftTypes.map((shiftType, index) => (
              <div
                key={index}
                className={`flex h-[4.625rem] items-center gap-[3rem]  border-b-[.0313rem] border-sub-4.5 last:border-0`}
              >
                <div className="flex flex-[2] items-center justify-center font-apple text-[1.25rem] font-medium text-sub-1 underline">
                  {shiftType.name}
                </div>
                <div className="flex flex-1 items-center justify-center text-[1.25rem]">
                  <TextField
                    className="h-[2rem] w-[2rem] rounded-[.3125rem] bg-white p-0 text-center text-[1.25rem] font-light text-sub-1 outline-[.0313rem] outline-sub-4.5"
                    value={shiftType.shortName}
                    onClick={(e) => {
                      e.currentTarget.select();
                    }}
                    onChange={(e) => {
                      setWardShiftTypes(
                        produce(wardShiftTypes, (draft) => {
                          draft[index].shortName = e.target.value.slice(0, 1).toUpperCase();
                        })
                      );
                    }}
                  />
                </div>
                <div className="flex flex-[3] items-center justify-center gap-[1.125rem]">
                  {shiftType.isOff ? (
                    <p className="font-poppins text-[1.25rem] font-light text-sub-2.5">-</p>
                  ) : (
                    <>
                      <TimeInput
                        className="h-[1.875rem] w-full rounded-[.3125rem] bg-white p-0 text-center text-[1.25rem] font-light text-sub-1 outline-[.0313rem] outline-sub-4.5"
                        initTime={shiftType.startTime}
                        onTimeChange={(value) => {
                          setWardShiftTypes(
                            produce(wardShiftTypes, (draft) => {
                              draft[index].startTime = value;
                            })
                          );
                        }}
                      />
                      <p className="font-poppins text-[1.25rem] font-light text-sub-2.5">~</p>
                      <TimeInput
                        className="h-[1.875rem] w-full rounded-[.3125rem] bg-white p-0 text-center text-[1.25rem] font-light text-sub-1 outline-[.0313rem] outline-sub-4.5"
                        initTime={shiftType.endTime}
                        onTimeChange={(value) => {
                          setWardShiftTypes(
                            produce(wardShiftTypes, (draft) => {
                              draft[index].endTime = value;
                            })
                          );
                        }}
                      />
                    </>
                  )}
                </div>
                <div className="relative flex flex-1  items-center justify-center font-apple text-[2.25rem] font-semibold text-sub-2.5">
                  <label
                    htmlFor={`pick_background_color_${index}`}
                    className={`h-[2rem] w-[2rem] rounded-[.4375rem] border-[.0625rem] border-sub-4`}
                    style={{ backgroundColor: shiftType.backgroundColor }}
                  />
                  <input
                    id={`pick_background_color_${index}`}
                    className="absolute h-[2rem] w-[2rem] cursor-pointer opacity-0"
                    type="color"
                    value={shiftType.backgroundColor}
                    onChange={(e) => {
                      setWardShiftTypes(
                        produce(wardShiftTypes, (draft) => {
                          draft[index].backgroundColor = e.target.value;
                        })
                      );
                    }}
                  />
                </div>
                <div className="relative flex flex-1  items-center justify-center font-apple text-[2.25rem] font-semibold text-sub-2.5">
                  <label
                    htmlFor={`pick_text_color_${index}`}
                    className={`h-[2rem] w-[2rem] rounded-[.4375rem] border-[.0625rem] border-sub-4`}
                    style={{ backgroundColor: shiftType.textColor }}
                  />
                  <input
                    id={`pick_text_color_${index}`}
                    className="absolute h-[2rem] w-[2rem] cursor-pointer opacity-0"
                    type="color"
                    value={shiftType.textColor}
                    onChange={(e) => {
                      setWardShiftTypes(
                        produce(wardShiftTypes, (draft) => {
                          draft[index].textColor = e.target.value;
                        })
                      );
                    }}
                  />
                </div>
                <div className="flex flex-1 justify-center">
                  <div
                    className="cursor-pointer rounded-[1.875rem] border-[.0313rem] border-main-2 px-[.875rem] py-[.3125rem] font-apple text-[.875rem] text-main-2"
                    onClick={() => {
                      setWardShiftTypes(
                        produce(wardShiftTypes, (draft) => {
                          draft[index].isOff = !draft[index].isOff;
                        })
                      );
                    }}
                  >
                    {shiftType.isOff ? '휴가' : '근무'}
                  </div>
                </div>
                <div className="flex flex-1 justify-center">
                  <PenIcon
                    className="h-[2.25rem] w-[2.25rem] cursor-pointer"
                    onClick={() => {
                      setTempShiftType({ ...shiftType, wardShiftTypeId: index });
                      setOpenModal(true);
                    }}
                  />
                </div>
              </div>
            ))}
            <CreateShiftModal
              open={openModal}
              close={() => {
                setTempShiftType(null);
                setOpenModal(false);
              }}
              shiftType={tempShiftType}
              onSubmit={(shiftType) =>
                setWardShiftTypes(
                  produce(wardShiftTypes, (draft) => {
                    draft.push(shiftType);
                  })
                )
              }
              onDelete={() =>
                tempShiftType &&
                setWardShiftTypes(
                  produce(wardShiftTypes, (draft) => {
                    draft.splice(tempShiftType.wardShiftTypeId, 1);
                  })
                )
              }
            />
          </div>
        </div>
        <div className="mt-[1.25rem] w-full shrink-0 rounded-[1.25rem] bg-white px-[2.8125rem] py-[1.875rem] shadow-banner">
          <div className="mb-[1.5625rem] flex items-center">
            <p className="font-apple text-[1.25rem] font-medium text-sub-3">병동내 간호사</p>
            <p className="ml-[1.5rem] font-apple text-[1rem] text-main-2">* 본인은 제외해주세요</p>
            <div
              className="ml-auto flex cursor-pointer gap-[.625rem]"
              onClick={() => {
                setShiftTeams(
                  produce(shiftTeams, (draft) => {
                    draft.push([]);
                  })
                );
              }}
            >
              <PlusIcon className="h-[1.5rem] w-[1.5rem] stroke-main-2" />
              <p className="font-apple text-[1rem] font-medium text-main-2">팀 추가하기</p>
            </div>
          </div>
          {shiftTeams.map((shiftTeam, index) => (
            <div key={index} className="mt-[1.25rem]">
              <div className="flex h-[2.25rem] w-[11.25rem] items-center justify-center gap-[.75rem] rounded-t-[.625rem] bg-sub-2 font-apple text-white">
                <p className="text-[1.25rem] font-medium">간호사 {index + 1}팀</p>
                <p className="text-[.875rem]">{shiftTeam.length}명</p>
              </div>
              <div className="flex w-full flex-wrap gap-[.625rem] rounded-[.625rem] rounded-tl-none border-[.0313rem] border-sub-3 bg-main-bg p-[1.875rem]">
                {shiftTeam.map((name, nameIndex) => (
                  <div
                    key={nameIndex}
                    className="flex h-[1.75rem] items-center gap-[.25rem] rounded-[.3125rem] border-[.0313rem] border-main-2 bg-main-4 px-[.5rem]"
                  >
                    <p className="font-apple text-[1rem] text-sub-1">{name}</p>
                    <XIcon
                      className="h-[1.125rem] w-[1.125rem] cursor-pointer"
                      onClick={() => {
                        setShiftTeams(
                          produce(shiftTeams, (draft) => {
                            draft[index].splice(nameIndex, 1);
                          })
                        );
                      }}
                    />
                  </div>
                ))}
                <p className="flex h-[1.75rem] w-[6.75rem] items-center justify-center rounded-[.3125rem] border-[.0625rem] border-main-1 bg-white font-apple text-[1rem] text-sub-1">
                  <input
                    placeholder="이름 추가"
                    className="w-[70%] focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.nativeEvent.isComposing) return;
                      if (e.currentTarget.value === '') return;
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        setShiftTeams(
                          produce(shiftTeams, (draft) => {
                            draft[index].push(e.currentTarget.value);
                            e.currentTarget.value = '';
                          })
                        );
                        e.currentTarget.value;
                      }
                    }}
                  />
                  <EnterIcon className="h-[1.5rem] w-[1.5rem]" />
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="submit"
          disabled={!isValid}
          className="mt-[2.5rem] h-[3.75rem] w-[7.5rem] self-end text-center text-[2rem] font-semibold"
        >
          저장
        </Button>
      </form>
    </div>
  );
}

export default RegisterWard;
