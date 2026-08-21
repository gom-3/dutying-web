import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const NEW_SITE_URL = 'https://www.dutying.ai';
const DISMISS_STORAGE_KEY = 'dutying.serviceMovedNotice.dismissedUntil';
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000;

const isDismissed = () => {
  try {
    const raw = window.localStorage.getItem(DISMISS_STORAGE_KEY);
    if (!raw) return false;
    const until = Number(raw);
    return Number.isFinite(until) && Date.now() < until;
  } catch {
    // 시크릿 모드 등 localStorage 접근이 막힌 환경에서는 매번 노출한다.
    return false;
  }
};

const rememberDismissal = () => {
  try {
    window.localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now() + DISMISS_DURATION_MS));
  } catch {
    // 저장 실패는 무시한다. 다음 방문에 다시 뜰 뿐이다.
  }
};

/**
 * 구 서비스(dutying.net) 이용자에게 새 주소로 이동하도록 안내한다.
 *
 * 신규 서비스는 별도 계정 체계라 로그인 정보가 넘어가지 않는다.
 * 그 점을 문구에 명시해야 CS가 줄어든다.
 */
function ServiceMovedModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isDismissed()) setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const close = () => {
    rememberDismissal();
    setIsOpen(false);
  };

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-[1.25rem]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-moved-title"
    >
      <div className="w-full max-w-[26.25rem] rounded-[1rem] bg-white p-[1.75rem] font-apple shadow-shadow-2">
        <p className="inline-block rounded-[.5rem] bg-main-4 px-[.75rem] py-[.375rem] text-[.8125rem] font-semibold text-main-1">
          서비스 이전 안내
        </p>

        <h1
          id="service-moved-title"
          className="mt-[1rem] text-[1.375rem] font-semibold leading-[1.4] text-sub-1"
        >
          듀팅이 새 주소로 이사했어요
        </h1>

        <p className="mt-[.75rem] text-[.9375rem] leading-[1.6] text-sub-2">
          더 나은 근무표 작성 경험을 위해 서비스를 새로 만들었어요.
          <br />
          앞으로는 아래 주소에서 이용해 주세요.
        </p>

        <a
          href={NEW_SITE_URL}
          className="mt-[1.25rem] block truncate rounded-[.625rem] bg-sub-5 px-[1rem] py-[.75rem] text-[.9375rem] font-semibold text-main-1"
        >
          www.dutying.ai
        </a>

        <div className="mt-[1.25rem] rounded-[.625rem] bg-sub-5 p-[1rem] text-[.8125rem] leading-[1.6] text-sub-2">
          <p className="font-semibold text-sub-1">이용 전 확인해 주세요</p>
          <ul className="mt-[.5rem] list-disc pl-[1.125rem]">
            <li>새 서비스는 계정이 분리되어 있어 다시 가입해야 해요.</li>
            <li>기존에 작성한 근무표는 옮겨지지 않아요.</li>
            <li>이 사이트는 당분간 그대로 이용할 수 있어요.</li>
          </ul>
        </div>

        <a
          href={NEW_SITE_URL}
          className="mt-[1.5rem] flex h-[3rem] w-full items-center justify-center rounded-[.625rem] bg-main-1 text-[1rem] font-semibold text-white"
        >
          새 주소로 이동하기
        </a>

        <button
          type="button"
          onClick={close}
          className="mt-[.75rem] h-[2.5rem] w-full text-[.875rem] font-medium text-sub-2.5"
        >
          오늘 하루 보지 않기
        </button>
      </div>
    </div>,
    modalRoot
  );
}

export default ServiceMovedModal;
