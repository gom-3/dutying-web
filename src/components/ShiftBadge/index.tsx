import useUIConfig from '@hooks/ui/useUIConfig';
import { Ref } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  shiftType: WardShiftType | null | undefined;
  forwardRef?: Ref<HTMLDivElement>;
  isOnlyRequest?: boolean;
}

function ShiftBadge({ shiftType, className, forwardRef, isOnlyRequest, ...props }: Props) {
  const {
    state: { shiftTypeColorStyle },
  } = useUIConfig();

  return (
    <div
      className={twMerge(
        'flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-[.4063rem] text-center font-poppins text-[1.25rem] text-white ',
        isOnlyRequest && 'opacity-[60%]',
        className
      )}
      ref={forwardRef}
      style={
        shiftTypeColorStyle === 'background'
          ? {
              backgroundColor: shiftType ? shiftType.color : '#D6D6DE',
            }
          : {
              border: '.0625rem solid #E7E7EF',
              backgroundColor: 'white',
              color: shiftType ? shiftType.color : 'black',
            }
      }
      {...props}
    >
      {shiftType ? shiftType.shortName : '-'}
    </div>
  );
}

export default ShiftBadge;
