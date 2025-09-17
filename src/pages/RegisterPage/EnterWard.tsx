import { useEffect, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { Pattern, match } from 'ts-pattern';
import { BackIcon, CancelIcon, FullLogo, LogoSymbolFill } from '@/assets/svg';
import useRegister from '@/hooks/auth/useRegister';
import { getWardByCode } from '@/libs/api/ward';
import ROUTE from '@/libs/constant/path';
import { type Ward } from '@/types/ward';

function EnterWard() {
  const [codeList, setCodeList] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(false);
  const [ward, setWard] = useState<Ward | null>(null);
  const [error, setError] = useState<boolean>(false);
  const {
    state: { accountMe },
    actions: { enterWard },
  } = useRegister();
  const navigate = useNavigate();
  const clickAwayRef = useOnclickOutside(() => setFocusedIndex(-1));
  const handleKeyDown = async (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault();

      const code = (await navigator.clipboard.readText())
        .trim()
        .toUpperCase()
        .replace(/[^0-9a-zA-Z]/g, '')
        .slice(0, 6);

      setCodeList(code.split(''));

      return;
    }

    match(e.key)
      .with('ArrowRight', 'ArrowDown', () => setFocusedIndex(Math.min(5, focusedIndex + 1)))
      .with('ArrowLeft', 'ArrowUp', () => setFocusedIndex(Math.max(0, focusedIndex - 1)))
      .with('Backspace', () => {
        setCodeList(codeList.map((code, index) => (index === focusedIndex ? null : code)));
        setFocusedIndex(Math.max(0, focusedIndex - 1));
      })
      .with(Pattern.string.regex(/[0-9a-zA-Z]/).maxLength(1), () => {
        setCodeList(
          codeList.map((code, index) => (index === focusedIndex ? e.key.toUpperCase() : code)),
        );
        setFocusedIndex(Math.min(5, focusedIndex + 1));
      });
  };
  const handleGetWard = async (code: string) => {
    try {
      const ward = await getWardByCode(code);

      setWard(ward);
      setError(false);
      setOpen(true);
    } catch {
      setError(true);
      setOpen(false);
      setWard(null);
    }
  };

  useEffect(() => {
    if (accountMe?.status !== 'WARD_SELECT_PENDING') navigate(ROUTE.REGISTER);
  }, [accountMe]);

  useEffect(() => {
    if (codeList.every((code) => code !== null)) {
      const code = codeList.join('');

      handleGetWard(code);
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
    <div className="relative mx-auto mt-30.75 flex h-[calc(100%-7.6875rem)] w-[52%] flex-col items-center bg-[#FDFCFE]">
      <div
        className="fixed top-7.5 left-12.5 flex cursor-pointer gap-5"
        onClick={() => navigate(ROUTE.ROOT)}
      >
        <LogoSymbolFill className="h-7.5 w-7.5" />
        <FullLogo className="h-7.5 w-27.5" />
      </div>
      <div className="my-auto flex w-full flex-col items-center justify-center">
        <h1 className="font-apple text-text-1 absolute top-0 left-0 text-[2rem] font-semibold">
          병동 입장
        </h1>
        <BackIcon className="absolute top-0 -left-10 h-12 w-12 -translate-x-full" />
        <div className="flex flex-col items-center gap-6 bg-white">
          <p className="font-apple text-main-2 text-[1.5rem] font-medium">
            해당 병동의 6자리 코드를 입력해주세요.
          </p>
          <div
            ref={clickAwayRef}
            className="shadow-banner flex h-50 w-140 justify-center gap-[.75rem] rounded-[.9375rem] py-15"
          >
            {codeList.map((code, index) => (
              <div
                onClick={() => setFocusedIndex(index)}
                key={index}
                className={`bg-main-bg font-poppins flex w-15 cursor-text items-center justify-center rounded-[.625rem] text-[2.5rem] font-light ${
                  focusedIndex === index
                    ? 'border-main-1 border-[.1875rem]'
                    : 'border-main-4 border-[.0625rem]'
                } ${code === null ? 'text-sub-4' : 'text-sub-1'}`}
              >
                {code ?? (focusedIndex === index ? '_' : '0')}
              </div>
            ))}
          </div>
        </div>
        {error ? (
          <div className="bg-main-4 font-apple text-main-1 mt-5 w-140 rounded-[.3125rem] py-[.625rem] text-center text-[1.25rem] font-medium">
            올바른 코드가 아닙니다.
          </div>
        ) : null}
        {open
          ? createPortal(
              <div
                onClick={() => setOpen(false)}
                className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.60)]"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-106.25 w-177.5 flex-col rounded-[1.25rem] bg-white px-10.75 pt-7.5 pb-12.5"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-apple text-text-1 text-[1.5rem] font-semibold">
                      병원 · 병동 확인
                    </h2>
                    <CancelIcon
                      onClick={() => setOpen(false)}
                      className="h-7.5 w-7.5 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center gap-[.875rem]">
                    <h3 className="font-apple text-main-1 text-[1.75rem] font-semibold underline">
                      {ward?.hospitalName} {ward?.name}
                    </h3>
                    <p className="font-apple text-sub-2 text-[1.25rem] font-medium">
                      맞으시다면 입장해주세요
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <button
                      onClick={() => {
                        setFocusedIndex(0);
                        setCodeList([null, null, null, null, null, null]);
                        setOpen(false);
                      }}
                      className="bg-sub-4 font-apple text-sub-2 h-17.5 flex-1 rounded-[.625rem] text-[1.5rem] font-semibold"
                    >
                      다시 입력
                    </button>
                    <button
                      onClick={() => ward && enterWard(ward.wardId)}
                      className="bg-main-1 font-apple h-17.5 flex-1 rounded-[.625rem] text-[1.5rem] font-semibold text-white"
                    >
                      입장
                    </button>
                  </div>
                </div>
              </div>,

              document.querySelector('#modal-root')!,
            )
          : null}
      </div>
    </div>
  );
}

export default EnterWard;
