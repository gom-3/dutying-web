import {cn} from '@dutying/utils/style';
import React, {forwardRef} from 'react';
import {type UseFormRegisterReturn} from 'react-hook-form';
import {ArrowDownIcon} from '@/shared/assets/svg';

interface ISelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    placeholder?: string;
    options?: {value: string | number; label: React.ReactNode}[];
    selectClassName?: string;
    register?: UseFormRegisterReturn;
}

const Select = forwardRef(
    (
        {placeholder, value, onChange, options, className, selectClassName, ...props}: ISelectProps,
        ref: React.ForwardedRef<HTMLSelectElement>,
    ) => {
        return (
            <div className={cn('relative h-8.75 w-45.75', className)}>
                <ArrowDownIcon className="absolute top-[50%] right-[.625rem] h-6.25 w-6.25 translate-y-[-50%]" />
                <select
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    className={cn(
                        'relative z-10 h-full w-full appearance-none rounded-[.625rem] bg-transparent px-3.75 text-left font-apple outline-[.0625rem] outline-main-2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                        selectClassName,
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option disabled value="">
                            {placeholder}
                        </option>
                    )}
                    {options?.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    },
);

export default Select;
