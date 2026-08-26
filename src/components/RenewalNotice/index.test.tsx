import { fireEvent, render, screen } from '@libs/util/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import RenewalNotice from '.';
import { RENEWAL_NOTICE_STORAGE_KEY, RENEWAL_NOTICE_URL } from './constants';

const getTodayKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

describe('RenewalNotice 컴포넌트', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('리뉴얼 안내와 새 서비스 링크를 렌더링해야 함', () => {
    render(<RenewalNotice />);

    expect(
      screen.getByRole('dialog', { name: '듀팅 서비스 리뉴얼 및 주소 이전 안내' })
    ).toBeVisible();
    expect(screen.getByRole('link', { name: '새 듀팅으로 이동하기' })).toHaveAttribute(
      'href',
      RENEWAL_NOTICE_URL
    );
    expect(screen.getByRole('button', { name: '안내 팝업 닫기' })).toHaveFocus();
    expect(document.body).toHaveStyle({ overflow: 'hidden' });
  });

  it('오늘 하루 보지 않기를 선택하면 오늘 날짜를 저장하고 닫아야 함', () => {
    render(<RenewalNotice />);

    fireEvent.click(screen.getByRole('button', { name: '오늘 하루 보지 않기' }));

    expect(window.localStorage.getItem(RENEWAL_NOTICE_STORAGE_KEY)).toBe(getTodayKey());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
  });

  it('같은 날 숨김 기록이 있으면 렌더링하지 않아야 함', () => {
    window.localStorage.setItem(RENEWAL_NOTICE_STORAGE_KEY, getTodayKey());

    render(<RenewalNotice />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('닫기 버튼은 숨김 기록 없이 현재 팝업만 닫아야 함', () => {
    render(<RenewalNotice />);

    fireEvent.click(screen.getByRole('button', { name: '안내 팝업 닫기' }));

    expect(window.localStorage.getItem(RENEWAL_NOTICE_STORAGE_KEY)).toBeNull();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Escape 키로 닫을 수 있어야 함', () => {
    render(<RenewalNotice />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(window.localStorage.getItem(RENEWAL_NOTICE_STORAGE_KEY)).toBeNull();
  });

  it('마지막 컨트롤에서 Tab을 누르면 첫 컨트롤로 포커스가 순환해야 함', () => {
    render(<RenewalNotice />);

    const closeButton = screen.getByRole('button', { name: '안내 팝업 닫기' });
    const dismissButton = screen.getByRole('button', { name: '오늘 하루 보지 않기' });
    dismissButton.focus();

    fireEvent.keyDown(document, { key: 'Tab' });

    expect(closeButton).toHaveFocus();
  });
});
