import { twMerge } from 'tailwind-merge';

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  shift: Shift;
}

function ShiftBadge({ shift, className, ...props }: Props) {
  return (
    <div
      className={twMerge(
        'flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-[.4063rem] text-center font-poppins text-[1.25rem] text-white ',
        className
      )}
      style={{ backgroundColor: shift.color }}
      {...props}
    >
      {shift.shortName}
    </div>
  );
}

export default ShiftBadge;
