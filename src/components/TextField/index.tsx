import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  error?: string;
};

const TextField = forwardRef(
  (
    { value, error, onChange, className, ...props }: Props,
    ref: React.LegacyRef<HTMLInputElement>
  ) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          className={twMerge(
            'w-full rounded-[.625rem] px-[1.5625rem] font-apple text-[2.25rem] outline outline-1 outline-sub-4 read-only:outline-sub-5 focus:outline-main-1',
            error && 'outline-red focus:outline-red',
            className
          )}
          {...props}
        />
        <p className="absolute bottom-[-0.5rem] translate-y-[100%] text-red">{error}</p>
      </div>
    );
  }
);

export default TextField;
