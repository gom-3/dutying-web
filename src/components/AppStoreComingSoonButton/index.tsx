import { AppstoreIcon } from '@assets/svg';
import { ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface AppStoreComingSoonButtonProps {
  children: ReactNode;
  className?: string;
}

const AppStoreComingSoonButton = ({ children, className }: AppStoreComingSoonButtonProps) => {
  const [open, setOpen] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const closeDialog = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    confirmButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog();
        return;
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        confirmButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      triggerButtonRef.current?.focus();
    };
  }, [closeDialog, open]);

  const dialog =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-[1200] flex h-screen w-screen items-center justify-center bg-[#12172673] p-4 backdrop-blur-[2px]"
            onClick={(event) => {
              if (event.target === event.currentTarget) closeDialog();
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="w-full max-w-[380px] rounded-[20px] bg-white px-6 py-7 text-center shadow-[0_20px_64px_rgba(18,23,38,0.18)]"
            >
              <AppstoreIcon className="mx-auto size-10" aria-hidden="true" />
              <h2 id={titleId} className="mt-5 font-apple text-xl font-bold leading-8 text-sub-1">
                iOS 앱은 9월 곧 출시해요!
              </h2>
              <button
                ref={confirmButtonRef}
                type="button"
                className="mt-7 h-11 w-full rounded-[8px] bg-main-1 px-5 font-apple text-base font-bold text-white transition-colors hover:bg-main-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-1"
                onClick={closeDialog}
              >
                확인
              </button>
            </div>
          </div>,
          document.getElementById('modal-root') ?? document.body
        )
      : null;

  return (
    <>
      <button
        ref={triggerButtonRef}
        type="button"
        className={className}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      {dialog}
    </>
  );
};

export default AppStoreComingSoonButton;
