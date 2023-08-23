import { twMerge } from 'tailwind-merge';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  forwardRef?: React.LegacyRef<HTMLInputElement> | undefined;
};

function TextField({ value, onChange, className, forwardRef, ...props }: Props) {
  return (
    <input
      ref={forwardRef}
      value={value}
      onChange={onChange}
      className={twMerge(
        'w-full rounded-[.625rem] px-[1.5625rem] font-apple text-[2.25rem] outline outline-1 outline-sub-4 focus:outline-main-1',
        className
      )}
      {...props}
    />
  );
}

export default TextField;
