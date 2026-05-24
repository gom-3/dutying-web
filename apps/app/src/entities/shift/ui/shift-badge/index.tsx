import React, {type Ref} from 'react';
import {twMerge} from 'tailwind-merge';
import {useUIConfigStore} from '@/entities/ui/useUIConfig/store';
import {type TWardShiftType} from '@/entities/ward';

interface IShiftBadgeProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    shiftType: TWardShiftType | null | undefined;
    forwardRef?: Ref<HTMLDivElement>;
    isOnlyRequest?: boolean;
}

function ShiftBadge({shiftType, className, forwardRef, isOnlyRequest, ...props}: IShiftBadgeProps) {
    const shiftTypeColorStyle = useUIConfigStore((state) => state.shiftTypeColorStyle);

    return (
        <div
            className={twMerge(
                // 캘린더가 컨테이너 폭에 맞춰 줄어들 때 배지도 함께 축소될 수 있어야 합니다.
                // 기본값은 기존과 동일한 시각 크기(28px, 20px) 범위에서 clamp로 반응형 처리합니다.
                'flex size-[clamp(16px,1.45vw,26px)] items-center justify-center rounded-[.375rem] text-center font-poppins text-[clamp(9px,0.82vw,18px)] leading-none text-white',
                isOnlyRequest && 'opacity-60',
                className,
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
