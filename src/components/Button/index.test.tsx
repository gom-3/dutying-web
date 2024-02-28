import { render, screen } from '@libs/util/test-utils';
import Button from '.';
import { describe, it, expect } from 'vitest';

describe('Button 컴포넌트', () => {
  it('정상적으로 렌더링되어야 함', () => {
    render(<Button>테스트 버튼</Button>);
    expect(screen.getByText('테스트 버튼')).toBeInTheDocument();
  });

  it('type prop이 outline일 때 정상적으로 렌더링되어야 함', () => {
    render(<Button type='outline'>테스트 버튼</Button>);
    const button = screen.getByText('테스트 버튼');
    expect(button).toHaveClass('border-main-1 text-main-1 transition-all');
  });
});
