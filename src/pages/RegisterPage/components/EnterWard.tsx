import { BackIcon, CancelIcon } from '@assets/svg';
import { useEffect, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { createPortal } from 'react-dom';
import { Pattern, match } from 'ts-pattern';

function EnterWard() {
  const [codeList, setCodeList] = useState<(number | null)[]>([null, null, null, null, null, null]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const clickAwayRef = useOnclickOutside(() => setFocusedIndex(-1));

  const handleKeyDown = (e: KeyboardEvent) => {
    match(e.key)
      .with('ArrowRight', 'ArrowDown', () => setFocusedIndex(Math.min(5, focusedIndex + 1)))
      .with('ArrowLeft', 'ArrowUp', () => setFocusedIndex(Math.max(0, focusedIndex - 1)))
      .with(Pattern.string.regex(/[0-9]/), () => {
        setCodeList(
          codeList.map((code, index) => (index === focusedIndex ? parseInt(e.key) : code))
        );
        setFocusedIndex(Math.min(5, focusedIndex + 1));
      })
      .with('Backspace', () => {
        setCodeList(codeList.map((code, index) => (index === focusedIndex ? null : code)));
      });
  };

  useEffect(() => {
    if (codeList.every((code) => code !== null)) {
      const code = codeList.join('');
      if (code === '111111') {
        setOpen(true);
        setError(false);
      } else setError(true);
    } else {
      setError(false);
    }
  }, [codeList]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedIndex, codeList]);

  return (
    <div className="my-auto flex w-full flex-col items-center justify-center">
      <h1 className="absolute left-0 top-0 font-apple text-[2rem] font-semibold text-text-1">
        병동 입장
      </h1>
      <BackIcon className="absolute left-[-2.5rem] top-0 h-[3rem] w-[3rem] translate-x-[-100%]" />
      <div className="flex flex-col items-center gap-[1.5rem] bg-white">
        <p className="font-apple text-[1.5rem] font-medium text-main-2">
          해당 병동의 6자리 코드를 입력해주세요.
        </p>
        <div
          ref={clickAwayRef}
          className="flex h-[12.5rem] w-[35rem] justify-center gap-[.75rem] rounded-[.9375rem] py-[3.75rem] shadow-banner"
        >
          {codeList.map((code, index) => (
            <div
              onClick={() => setFocusedIndex(index)}
              key={index}
              className={`flex w-[3.75rem] cursor-text items-center justify-center rounded-[.625rem] bg-main-bg font-poppins text-[2.5rem] font-light ${
                focusedIndex === index
                  ? 'border-[.1875rem] border-main-1'
                  : 'border-[.0625rem] border-main-4'
              } ${code === null ? 'text-sub-4' : 'text-sub-1'}`}
            >
              {code === null ? (focusedIndex === index ? '_' : '0') : code}
            </div>
          ))}
        </div>
      </div>
      {error ? (
        <div className="mt-[1.25rem] w-[35rem] rounded-[.3125rem] bg-main-4 py-[.625rem] text-center font-apple text-[1.25rem] font-medium text-main-1">
          올바른 코드가 아닙니다.
        </div>
      ) : null}
      {open
        ? createPortal(
            <div
              onClick={() => setOpen(false)}
              className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.60)]"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex h-[26.5625rem] w-[44.375rem] flex-col rounded-[1.25rem] bg-white px-[2.6875rem] pb-[3.125rem] pt-[1.875rem]"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-apple text-[1.5rem] font-semibold text-text-1">
                    병원 · 병동 확인
                  </h2>
                  <CancelIcon
                    onClick={() => setOpen(false)}
                    className="h-[1.875rem] w-[1.875rem] cursor-pointer"
                  />
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-[.875rem]">
                  <h3 className="font-apple text-[1.75rem] font-semibold text-main-1 underline">
                    듀팅 병원 듀팅 병동
                  </h3>
                  <p className="font-apple text-[1.25rem] font-medium text-sub-2">
                    맞으시다면 입장해주세요
                  </p>
                </div>
                <div className="flex gap-[1.5rem]">
                  <button
                    onClick={() => {
                      setFocusedIndex(0);
                      setCodeList([null, null, null, null, null, null]);
                      setOpen(false);
                    }}
                    className="h-[4.375rem] flex-1 rounded-[.625rem] bg-sub-4 font-apple text-[1.5rem] font-semibold text-sub-2"
                  >
                    다시 입력
                  </button>
                  <button className="h-[4.375rem] flex-1 rounded-[.625rem] bg-main-1 font-apple text-[1.5rem] font-semibold text-white">
                    입장
                  </button>
                </div>
              </div>
            </div>,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            document.querySelector('#modal-root')!
          )
        : null}
    </div>
  );
}

export default EnterWard;
