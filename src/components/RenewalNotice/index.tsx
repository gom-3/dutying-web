import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RENEWAL_NOTICE_STORAGE_KEY, RENEWAL_NOTICE_URL } from './constants';
import './index.css';

const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const shouldShowNotice = () => {
  if (typeof window === 'undefined') return false;

  try {
    return window.localStorage.getItem(RENEWAL_NOTICE_STORAGE_KEY) !== getLocalDateKey();
  } catch {
    return true;
  }
};

const RenewalNotice = () => {
  const [open, setOpen] = useState(shouldShowNotice);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const closeNotice = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeNotice();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (
        event.shiftKey &&
        (activeElement === firstElement || !dialogRef.current.contains(activeElement))
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === lastElement || !dialogRef.current.contains(activeElement))
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = previousBodyOverflow;

      if (
        previouslyFocusedElementRef.current &&
        previouslyFocusedElementRef.current !== document.body
      ) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [closeNotice, open]);

  const dismissForToday = () => {
    try {
      window.localStorage.setItem(RENEWAL_NOTICE_STORAGE_KEY, getLocalDateKey());
    } catch {
      // Storage can be unavailable in private browsing. The current view still closes.
    }

    closeNotice();
  };

  if (!open || typeof document === 'undefined') return null;

  const portalRoot = document.getElementById('modal-root') ?? document.body;

  return createPortal(
    <div
      className="renewal-notice__backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeNotice();
      }}
    >
      <div
        ref={dialogRef}
        className="renewal-notice__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="renewal-notice-title"
        aria-describedby="renewal-notice-description"
      >
        <h2 id="renewal-notice-title" className="sr-only">
          듀팅 서비스 리뉴얼 및 주소 이전 안내
        </h2>
        <p id="renewal-notice-description" className="sr-only">
          듀팅이 Dutying.ai로 새로워졌습니다. 인공지능 근무표 생성, 병동 게시판, 모바일 연동 기능을
          이용할 수 있습니다. 현재 주소는 10월 31일부터 종료되며 기존 데이터는 이전되지 않으니
          필요한 자료를 미리 옮겨 주세요.
        </p>

        <div className="renewal-notice__artwork">
          <img className="renewal-notice__image" src="/img/service-renewal-notice.png" alt="" />

          <button
            ref={closeButtonRef}
            type="button"
            className="renewal-notice__close"
            aria-label="안내 팝업 닫기"
            onClick={closeNotice}
          >
            <span aria-hidden="true">×</span>
          </button>

          <a
            className="renewal-notice__cta"
            href={RENEWAL_NOTICE_URL}
            aria-label="새 듀팅으로 이동하기"
          >
            <span className="sr-only">새 듀팅으로 이동하기</span>
          </a>
        </div>

        <div className="renewal-notice__actions">
          <button type="button" className="renewal-notice__dismiss-today" onClick={dismissForToday}>
            오늘 하루 보지 않기
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

export default RenewalNotice;
