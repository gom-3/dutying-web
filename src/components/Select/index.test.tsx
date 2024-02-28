import { render, screen, userEvent } from '@libs/util/test-utils';
import Select from '.';
import { expect, vi } from 'vitest';

describe('Select 컴포넌트', () => {
  it('정상적으로 렌더링되어야 함', () => {
    render(<Select />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('placeholder가 정상적으로 렌더링 되어야 함', () => {
    const placeholderText = '선택해주세요';
    render(<Select placeholder={placeholderText} />);
    expect(screen.getByText(placeholderText)).toBeInTheDocument();
  });

  it('options가 정상적으로 렌더링되어야 함', () => {
    const options = [
      { value: '1', label: '옵션 1' },
      { value: '2', label: '옵션 2' },
    ];
    render(<Select options={options} />);
    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('선택한 옵션에 대한 onChange 이벤트가 정상적으로 작동해야 함', async () => {
    const handleChange = vi.fn();
    const options = [
      { value: '1', label: '옵션 1' },
      { value: '2', label: '옵션 2' },
    ];
    render(<Select options={options} onChange={handleChange} />);

    await userEvent.selectOptions(screen.getByRole('combobox'), ['1']);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('selectClassName이 select의 className에 포함되어야 함', () => {
    const selectedClassName = 'bg-red';
    render(<Select selectClassName={selectedClassName} />);
    expect(screen.getByRole('combobox')).toHaveClass(selectedClassName);
  })
});
