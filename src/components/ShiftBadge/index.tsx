import { Ref } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  shiftType: WardShiftType | null | undefined;
  forwardRef?: Ref<HTMLDivElement>;
  isOnlyRequest?: boolean;
}

function ShiftBadge({ shiftType, className, forwardRef, isOnlyRequest, ...props }: Props) {
  return (
    <div
      className={twMerge(
        'flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-[.4063rem] text-center font-poppins text-[1.25rem] text-white ',
        isOnlyRequest && 'opacity-[30%]',
        className
      )}
      ref={forwardRef}
      style={{
        backgroundColor: shiftType ? shiftType.backgroundColor : '#D6D6DE',
        color: shiftType?.textColor,
      }}
      {...props}
    >
      {shiftType ? shiftType.shortName : '-'}
    </div>
  );
}

export default ShiftBadge;
