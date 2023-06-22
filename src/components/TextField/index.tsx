interface Props
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  options?: { value: string | number; label: React.ReactNode }[];
  className?: string;
}

function TextField({ value, onChange, className, ...props }: Props) {
  return (
    <input
      value={value}
      onChange={onChange}
      className={`rounded-[.625rem] font-apple text-[2.25rem] outline outline-1 outline-sub-4 focus:text-main-1 focus:outline-main-1 ${className}`}
      {...props}
    />
  );
}

export default TextField;
