import { Ref } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  shiftType: ShiftType | null | undefined;
  forwardRef?: Ref<HTMLDivElement>;
}

function ShiftBadge({ shiftType, className, forwardRef, ...props }: Props) {
  return (
    <div
      className={twMerge(
        'flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-[.4063rem] text-center font-poppins text-[1.25rem] text-white ',
        className
      )}
      ref={forwardRef}
      style={{ backgroundColor: shiftType ? shiftType.color : '#D6D6DE' }}
      {...props}
    >
      {shiftType ? shiftType.shortName : '-'}
    </div>
  );
}

export default ShiftBadge;
