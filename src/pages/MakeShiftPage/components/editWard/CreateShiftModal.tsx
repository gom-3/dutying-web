import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {CancelIcon} from '@/assets/svg';
import Button from '@/components/Button';
import TextField from '@/components/TextField';
import TimeInput from '@/components/TimeInput';
import {type CreateShiftTypeDTO} from '@/libs/api/shiftType';

interface Props {
    open: boolean;
    shiftType: CreateShiftTypeDTO | null;
    close: () => void;
    onSubmit: (shiftType: CreateShiftTypeDTO) => void;
    onDelete: () => void;
}

const initialValue: CreateShiftTypeDTO = {
    name: '',
    startTime: '00:00',
    endTime: '00:00',
    color: '#6c3434',
    isOff: false,
    isDefault: false,
    shortName: '',
    isCounted: true,
    classification: 'OTHER_WORK',
};

function CreateShiftModal({open, shiftType, close, onSubmit, onDelete}: Props) {
    const [writeShift, setWriteShift] = useState(initialValue);
    const modalRoot = document.querySelector('#modal-root');
    const handleSubmit = () => {
        if (writeShift.name === '') {
            alert('근무 이름을 입력해주세요.');

            return;
        }

        if (!writeShift.isOff && (writeShift.startTime === '' || writeShift.endTime === '')) {
            alert('근무 시간을 입력해주세요.');

            return;
        }

        if (writeShift.shortName === '') {
            alert('근무 약자를 입력해주세요.');

            return;
        }

        onSubmit(writeShift);
        close();
    };

    useEffect(() => {
        if (open === false) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setWriteShift(initialValue);
        }
    }, [open]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (shiftType) setWriteShift(shiftType);
    }, [shiftType]);

    return open
        ? createPortal(
              <div className="fixed top-0 left-0 z-1002 h-screen w-screen bg-[#00000066]" onClick={() => close()}>
                  <div
                      className="absolute top-[50%] left-[50%] h-165.5 w-177.5 translate-x-[-50%] translate-y-[-50%] rounded-[1.25rem] bg-white px-10.5 py-8.75"
                      onClick={(e) => e.stopPropagation()}
                  >
                      <div className="flex items-center">
                          <h1 className="flex-1 font-apple text-[1.75rem] font-semibold text-[#150B3C]">
                              {shiftType ? '근무•휴가 수정하기' : '근무•휴가 추가하기'}
                          </h1>
                          <CancelIcon className="h-7.5 w-7.5 cursor-pointer" onClick={() => close()} />
                      </div>
                      <div className="mt-7.5 flex">
                          <div
                              className={`h-10 flex-1 cursor-pointer border-b-[.3125rem] text-center font-apple text-[1.25rem] font-medium ${
                                  !writeShift.isOff ? 'border-main-1 text-main-1' : 'border-sub-4.5 text-sub-3'
                              }`}
                              onClick={() => {
                                  if (writeShift.isDefault) return;

                                  setWriteShift({...writeShift, isOff: false, classification: 'OTHER_WORK'});
                              }}
                          >
                              근무
                          </div>
                          <div
                              className={`h-10 flex-1 cursor-pointer border-b-[.3125rem] text-center font-apple text-[1.25rem] font-medium ${
                                  writeShift.isOff ? 'border-main-1 text-main-1' : 'border-sub-4.5 text-sub-3'
                              }`}
                              onClick={() => {
                                  if (writeShift.isDefault) return;

                                  setWriteShift({...writeShift, isOff: true, classification: 'OTHER_LEAVE'});
                              }}
                          >
                              휴가
                          </div>
                      </div>
                      <div className="w-[50%]">
                          <p className="mt-8.75 mb-[.625rem] font-apple text-base text-sub-3">근무명</p>
                          <TextField
                              className="h-13.5 font-apple text-[1.5rem] font-medium text-sub-1"
                              placeholder={writeShift.isOff ? '휴가 명을 작성하세요.' : '근무 명을 작성하세요.'}
                              value={writeShift.name}
                              onChange={(e) => setWriteShift({...writeShift, name: e.target.value})}
                          />
                      </div>
                      <div className="">
                          <div className="flex items-center gap-4">
                              <p className="mt-7.5 mb-[.625rem] font-apple text-base text-sub-3">약자</p>
                              <p className="mt-7.5 mb-[.625rem] font-apple text-[.75rem] text-main-2">
                                  * 기본 근무 유형인 D, E, N, O의 약자는 수정하실 수 없습니다
                              </p>
                          </div>
                          <TextField
                              className="h-13.5 w-13.5 px-0 text-center font-apple text-[1.5rem] font-medium text-sub-1"
                              value={writeShift.shortName}
                              readOnly={writeShift.isDefault}
                              onChange={(e) => setWriteShift({...writeShift, shortName: e.target.value})}
                          />
                      </div>
                      {!writeShift.isOff && (
                          <div className="w-[40%]">
                              <p className="mt-7.5 mb-[.625rem] font-apple text-base text-sub-3">근무 시간</p>
                              <div className="flex items-center gap-[.9375rem]">
                                  <TimeInput
                                      className="h-13.5 w-35 text-center text-[1.5rem]"
                                      initTime={writeShift.startTime}
                                      onTimeChange={(time) => setWriteShift({...writeShift, startTime: time})}
                                  />
                                  <p className="font-poppins text-[1.5rem] text-sub-3">~</p>
                                  <TimeInput
                                      className="h-13.5 w-35 text-center text-[1.5rem]"
                                      initTime={writeShift.endTime}
                                      onTimeChange={(time) => setWriteShift({...writeShift, endTime: time})}
                                  />
                              </div>
                          </div>
                      )}
                      <div className="flex flex-col items-start">
                          <p className="mt-7.5 mb-[.625rem] font-apple text-base text-sub-3">배경 색</p>
                          <div className="flex flex-1 items-center gap-17.5">
                              <label
                                  htmlFor={`pick_background_color`}
                                  className={`h-13.75 w-13.75 rounded-full border-[.0625rem] border-sub-4.5`}
                                  style={{backgroundColor: writeShift.color}}
                              />
                              <input
                                  id={`pick_background_color`}
                                  className="absolute h-13.75 w-13.75 opacity-0"
                                  type="color"
                                  value={writeShift.color}
                                  onChange={(e) => setWriteShift({...writeShift, color: e.target.value})}
                              />
                          </div>
                      </div>
                      <div className="flex">
                          {!shiftType?.isDefault && (
                              <Button
                                  className="absolute right-31.75 bottom-7.5 h-10 w-18.75 border-sub-2.5 text-[1.25rem] font-semibold text-sub-2.5"
                                  type="outline"
                                  onClick={() => {
                                      onDelete();
                                      close();
                                  }}
                              >
                                  삭제
                              </Button>
                          )}
                          <Button
                              className="absolute right-10.5 bottom-7.5 h-10 w-18.75 text-[1.25rem] font-semibold"
                              type="outline"
                              onClick={handleSubmit}
                          >
                              저장
                          </Button>
                      </div>
                  </div>
              </div>,

              modalRoot!,
          )
        : null;
}

export default CreateShiftModal;
