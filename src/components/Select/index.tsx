import { ArrowDownIcon } from '@assets/svg';
import { twMerge } from 'tailwind-merge';

interface Props
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  options?: { value: string | number; label: React.ReactNode }[];
}

function Select({ value, onChange, options, className, ...props }: Props) {
  return (
    <div className={twMerge('relative h-[2.1875rem] w-[11.4375rem]', className)}>
      <ArrowDownIcon className="absolute right-[.625rem] top-[50%] h-[1.5625rem] w-[1.5625rem] translate-y-[-50%]" />
      <select
        value={value}
        onChange={onChange}
        className="relative z-10 h-full w-full appearance-none rounded-[.625rem] bg-transparent px-[0.9375rem] text-left font-apple outline outline-[.0625rem] outline-main-1"
        {...props}
      >
        {options?.map((option, _) => (
          <option key={_} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
