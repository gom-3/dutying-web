import { twMerge } from 'tailwind-merge';

interface Props
  extends Omit<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    'type'
  > {
  type?: 'outline' | 'fill';
  className?: string;
}

function Button({ type = 'fill', children, className, ...props }: Props) {
  return (
    <button
      className={twMerge(
        `rounded-[50px] border-2 font-apple text-[2.25rem] font-semibold ${
          type === 'outline' ? 'border-main-1 text-main-1' : 'bg-main-1 text-white'
        } ${className}`
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
