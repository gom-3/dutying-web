import {cn} from '@dutying/utils/style';
import React, {forwardRef} from 'react';
import {Input} from '@/shared/ui/primitives/input';

type TTextFieldProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    error?: string;
};

const TextField = forwardRef(
    ({value, error, onChange, className, ...props}: TTextFieldProps, ref: React.ForwardedRef<HTMLInputElement>) => {
        return (
            <div className="relative">
                <Input
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    variant="foundation"
                    fieldSize="md"
                    className={cn(
                        'w-full rounded-[.625rem] px-6.25 font-apple text-[2.25rem] outline-1 outline-sub-4 read-only:outline-sub-5 focus:outline-main-1',
                        error && 'outline-red focus:outline-red',
                        className,
                    )}
                    {...props}
                />
                <p className="absolute -bottom-2 translate-y-full text-red">{error}</p>
            </div>
        );
    },
);

export default TextField;
