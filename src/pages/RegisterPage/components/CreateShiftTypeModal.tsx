import { useEffect, useState } from 'react';
import { CancelIcon } from '@assets/svg';
import Button from '@components/Button';
import TextField from '@components/TextField';
import TimeInput from '@components/TimeInput';
import { createPortal } from 'react-dom';
import { CreateShiftTypeDTO } from '@libs/api/shiftType';

interface Props {
  open: boolean;
  shiftType: CreateShiftTypeDTO | null;
  close: () => void;
  onSubmit: (shiftType: CreateShiftTypeDTO) => void;
  onDelete: () => void;
}

function CreateShiftTypeModal({ open, shiftType, close, onSubmit, onDelete }: Props) {
  const initialValue = {
    name: '',
    startTime: '00:00',
    endTime: '00:00',
    color: '#FFFFFF',
    isOff: false,
    shortName: '',
  };
  const [writeShift, setWriteShift] = useState(initialValue);

  const modalRoot = document.querySelector('#modal-root');

  useEffect(() => {
    if (open === false) setWriteShift(initialValue);
  }, [open]);

  useEffect(() => {
    if (shiftType) setWriteShift(shiftType);
  }, [shiftType]);

  return open
    ? createPortal(
        <div
          className="fixed left-0 top-0 z-[1000] h-screen w-screen bg-[#00000066]"
          onClick={() => close()}
        >
          <div
            className="absolute left-[50%] top-[50%]  h-[41.375rem] w-[44.375rem] translate-x-[-50%] translate-y-[-50%] rounded-[1.25rem] bg-white px-[2.625rem] py-[2.1875rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center">
              <h1 className="flex-1 font-apple text-[1.75rem] font-semibold text-[#150B3C]">
                {shiftType ? '근무•휴가 수정하기' : '근무•휴가 추가하기'}
              </h1>
              <CancelIcon
                className="h-[1.875rem] w-[1.875rem] cursor-pointer"
                onClick={() => close()}
              />
            </div>
            <div className="mt-[1.875rem] flex">
              <div
                className={`h-[2.5rem] flex-1 cursor-pointer border-b-[.3125rem] text-center font-apple text-[1.25rem] font-medium ${
                  !writeShift.isOff ? 'border-main-1 text-main-1' : 'border-sub-4.5 text-sub-3'
                }`}
                onClick={() => setWriteShift({ ...writeShift, isOff: false })}
              >
                근무
              </div>
              <div
                className={`h-[2.5rem] flex-1 cursor-pointer border-b-[.3125rem] text-center font-apple text-[1.25rem] font-medium ${
                  writeShift.isOff ? 'border-main-1 text-main-1' : 'border-sub-4.5 text-sub-3'
                }`}
                onClick={() => setWriteShift({ ...writeShift, isOff: true })}
              >
                휴가
              </div>
            </div>
            <div className="w-[50%]">
              <p className="mb-[.625rem] mt-[2.1875rem] font-apple text-base text-sub-3">근무명</p>
              <TextField
                className="h-[3.375rem] font-apple text-[1.5rem] font-medium text-sub-1"
                placeholder={writeShift.isOff ? '휴가 명을 작성하세요.' : '근무 명을 작성하세요.'}
                value={writeShift.name}
                onChange={(e) => setWriteShift({ ...writeShift, name: e.target.value })}
              />
            </div>
            <div className="w-[10%]">
              <p className="mb-[.625rem] mt-[1.875rem] font-apple text-base text-sub-3">약자</p>
              <TextField
                className="h-[3.375rem] px-0 text-center font-apple text-[1.5rem] font-medium text-sub-1"
                value={writeShift.shortName}
                onChange={(e) => setWriteShift({ ...writeShift, shortName: e.target.value })}
              />
            </div>
            {!writeShift.isOff && (
              <div className="w-[40%]">
                <p className="mb-[.625rem] mt-[1.875rem] font-apple text-base text-sub-3">
                  근무 시간
                </p>
                <div className="flex items-center gap-[.9375rem]">
                  <TimeInput
                    className="h-[3.375rem] w-[8.75rem] text-center text-[1.5rem]"
                    value={writeShift.startTime}
                    onChange={(e) => setWriteShift({ ...writeShift, startTime: e.target.value })}
                  />
                  <p className="font-poppins text-[1.5rem] text-sub-3">~</p>
                  <TimeInput
                    className="h-[3.375rem] w-[8.75rem] text-center text-[1.5rem]"
                    value={writeShift.endTime}
                    onChange={(e) => setWriteShift({ ...writeShift, endTime: e.target.value })}
                  />
                </div>
              </div>
            )}
            <div className="flex w-full">
              <div className="flex-1">
                <p className="mb-[.625rem] mt-[1.875rem] font-apple text-base text-sub-3">색상</p>
                <div className="flex flex-1 items-center gap-[4.375rem]">
                  <label
                    htmlFor={`color_picker_modal`}
                    className={`h-[3.4375rem] w-[3.4375rem] rounded-full border-[.0625rem] border-sub-4.5`}
                    style={{ backgroundColor: writeShift.color }}
                  />
                  <input
                    id={`color_picker_modal`}
                    className="absolute translate-x-[100%] translate-y-[50%] opacity-0"
                    type="color"
                    value={writeShift.color}
                    onChange={(e) => setWriteShift({ ...writeShift, color: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex">
              {shiftType && (
                <Button
                  className="absolute bottom-[1.875rem] right-[7.9375rem] h-[2.5rem] w-[4.6875rem] border-sub-2.5 text-[1.25rem] font-semibold text-sub-2.5"
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
                className="absolute bottom-[1.875rem] right-[2.625rem] h-[2.5rem] w-[4.6875rem] text-[1.25rem] font-semibold"
                type="outline"
                onClick={() => {
                  onSubmit(writeShift);
                  close();
                }}
              >
                저장
              </Button>
            </div>
          </div>
        </div>,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        modalRoot!
      )
    : null;
}

export default CreateShiftTypeModal;
