import { twMerge } from 'tailwind-merge';

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
    <select
      value={value}
      onChange={onChange}
      className={twMerge(
        `appearance-none rounded-[.9375rem] text-center font-apple font-medium outline outline-[.0938rem] outline-sub-4 focus:outline-main-1 ${className}`
      )}
      {...props}
    >
      {options?.map((option, _) => (
        <option key={_} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
