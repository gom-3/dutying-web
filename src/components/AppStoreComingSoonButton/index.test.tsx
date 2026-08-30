import { fireEvent, render, screen } from '@libs/util/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import AppStoreComingSoonButton from '.';

describe('AppStoreComingSoonButton 컴포넌트', () => {
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('링크 이동 없이 iOS 출시 안내 팝업을 열고 닫아야 함', () => {
    render(<AppStoreComingSoonButton className="test-button">App Store</AppStoreComingSoonButton>);

    const trigger = screen.getByRole('button', { name: 'App Store' });

    expect(trigger).not.toHaveAttribute('href');

    fireEvent.click(trigger);

    expect(screen.getByRole('dialog', { name: 'iOS 앱은 9월 곧 출시해요!' })).toBeVisible();
    expect(screen.getByRole('button', { name: '확인' })).toHaveFocus();
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    fireEvent.click(screen.getByRole('button', { name: '확인' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('Escape 키로 팝업을 닫아야 함', () => {
    render(<AppStoreComingSoonButton>App Store</AppStoreComingSoonButton>);

    fireEvent.click(screen.getByRole('button', { name: 'App Store' }));
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
