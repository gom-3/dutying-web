import { ArrowDownIcon } from '@assets/svg';

interface Props
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  options?: { value: string | number; label: React.ReactNode }[];
  className?: string;
}

function Select({ value, onChange, options, className, ...props }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`appearance-none rounded-[.9375rem] border-[.0938rem] border-main-2 pl-[.9375rem] font-apple font-medium focus:ring-1 focus:ring-inset focus:ring-main-1 ${className}`}
        {...props}
      >
        {options?.map((option, _) => (
          <option key={_} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ArrowDownIcon className="pointer-events-none absolute right-0 top-[50%] translate-y-[-50%]" />
    </div>
  );
}

export default Select;
