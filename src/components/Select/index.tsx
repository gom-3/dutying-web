import { forwardRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { ArrowDownIcon } from '@assets/svg';

interface Props extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  placeholder?: string;
  options?: { value: string | number; label: React.ReactNode }[];
  selectClassName?: string;
  register?: UseFormRegisterReturn;
}

const Select = forwardRef(({ placeholder, value, onChange, options, className, selectClassName, ...props }: Props, ref: React.LegacyRef<HTMLSelectElement>) => {
  return (
    <div className={twMerge('relative h-[2.1875rem] w-[11.4375rem]', className)}>
      <ArrowDownIcon className="absolute right-[.625rem] top-1/2 size-[1.5625rem] -translate-y-1/2" />
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        className={twMerge(
          'relative z-10 h-full w-full appearance-none rounded-[.625rem] bg-transparent px-[0.9375rem] text-left font-apple outline outline-[.0625rem] outline-main-2',
          selectClassName
        )}
        {...props}
      >
        {placeholder && (
          <option disabled value="">
            {placeholder}
          </option>
        )}
        {options?.map((option, _) => (
          <option key={_} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default Select;
