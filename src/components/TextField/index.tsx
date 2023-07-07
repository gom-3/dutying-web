import { twMerge } from 'tailwind-merge';

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function TextField({ value, onChange, className, ...props }: Props) {
  return (
    <input
      value={value}
      onChange={onChange}
      className={twMerge(
        'rounded-[.625rem] px-[1.5625rem] font-apple text-[2.25rem] outline outline-1 outline-sub-4 focus:text-main-1 focus:outline-main-1',
        className
      )}
      {...props}
    />
  );
}

export default TextField;
