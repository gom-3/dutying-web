interface Props
  extends Omit<
    React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
    'type'
  > {
  options?: { value: string | number; label: React.ReactNode }[];
  className?: string;
}

function Select({ value, onChange, options, className, ...props }: Props) {
  return (
    <select value={value} onChange={onChange} className={` ${className}`} {...props}>
      {options?.map((option) => (
        <option value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

export default Select;
