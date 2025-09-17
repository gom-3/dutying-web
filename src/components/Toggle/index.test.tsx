import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '@/libs/util/test-utils';
import Toggle from '.';

describe('Toggle 컴포넌트', () => {
  it('isOn이 true일 때, bg-main-1 색으로 렌더링되어야 함', () => {
    render(<Toggle isOn={true} setIsOn={() => {}} />);
    expect(screen.getByTestId('toggle')).toHaveClass('bg-main-1');
  });

  it('isOn이 false일 때, bg-sub-4 색으로 렌더링되어야 함', () => {
    render(<Toggle isOn={false} setIsOn={() => {}} />);
    expect(screen.getByTestId('toggle')).toHaveClass('bg-sub-4');
  });

  it('isOn이 true일 때, 클릭 시 setIsOn 함수가 false와 함께 호출되어야 함', async () => {
    const mockSetIsOn = vi.fn();

    render(<Toggle isOn={true} setIsOn={mockSetIsOn} />);

    const toggleElement = screen.getByTestId('toggle');

    await userEvent.click(toggleElement);
    expect(mockSetIsOn).toHaveBeenCalledWith(false);
  });

  it('isOn이 false일 때, 클릭 시 setIsOn 함수가 true와 함께 호출되어야 함', async () => {
    const mockSetIsOn = vi.fn();

    render(<Toggle isOn={false} setIsOn={mockSetIsOn} />);

    const toggleElement = screen.getByTestId('toggle');

    await userEvent.click(toggleElement);
    expect(mockSetIsOn).toHaveBeenCalledWith(true);
  });
});
